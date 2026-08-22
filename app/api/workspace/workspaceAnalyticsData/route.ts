// import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";

import Blog from "@/models/Blog";
import Membership from "@/models/Membership";

// import User from "@/models/User";
import "@/models/User";
// import Workspace from "@/models/Workspace";
import "@/models/Workspace";

// Your existing helper that gets the active workspace.
// Adjust the import path to wherever you have this helper.
import { getActiveWorkspace } from "@/lib/workspace";

// Your existing authentication helper.
// Adjust this according to however you currently get the logged-in user.
import { getCurrentUser } from "@/lib/getCurrentUser";
// import { getCurrentUser } from "@/lib/getCurrentUser";


// export default async function handler(req: NextApiRequest, res: NextApiResponse, request: NextRequest) {
export async function GET(req: NextRequest) {

  // ------------------------------------------------------------
  // Only allow GET requests
  // ------------------------------------------------------------

  if (req.method !== "GET") {
    return NextResponse.json(
      {error: "Method not allowed",}, 
      {status: 405,}
    );
  }


  try {

    // ------------------------------------------------------------
    // Connect to MongoDB
    // ------------------------------------------------------------

    await dbConnect();


    // ------------------------------------------------------------
    // Get the currently authenticated user
    // ------------------------------------------------------------
    const user = await getCurrentUser(req);

    if (!user) {
      return NextResponse.json(
            {error: "Unauthorized",}, 
            {status: 401,}
          );
    }

    const userId = user._id;


    // ------------------------------------------------------------
    // Get the currently active workspace
    // ------------------------------------------------------------

    // const workspaceId = await getActiveWorkspace(userId);
    const activeWorkspace = await getActiveWorkspace(userId);
    const workspaceId = activeWorkspace._id;

    if (!workspaceId) {
      return NextResponse.json(
            {error: "No active workspace found",}, 
            {status: 400,}
          );
    }


    // ============================================================
    // 1. OVERVIEW
    // ============================================================
    //
    // Basic numbers used by the cards at the top of the analytics
    // component.
    //
    // Example:
    //
    // Total Blogs: 42
    // Published:   31
    // Drafts:      11
    // Authors:      8
    // Members:     12
    //

    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalMembers,
    ] = await Promise.all([

      // Total blogs belonging to this workspace
      Blog.countDocuments({
        workspace: workspaceId,
      }),

      // Published blogs
      Blog.countDocuments({
        workspace: workspaceId,
        status: "published",
      }),

      // Draft blogs
      Blog.countDocuments({
        workspace: workspaceId,
        status: "draft",
      }),

      // Total workspace members
      Membership.countDocuments({
        workspace: workspaceId,
      }),
    ]);


    // ------------------------------------------------------------
    // Count unique authors
    // ------------------------------------------------------------
    //
    // A member doesn't necessarily have to be an author.
    //
    // So instead of using totalMembers, we find users who actually
    // have blogs in this workspace.
    //

    const authors = await Blog.aggregate([
      {
        $match: {
          workspace: workspaceId,
        },
      },

      {
        $group: {
          _id: "$author",
        },
      },

      {
        $count: "total",
      },
    ]);

    const totalAuthors = authors[0]?.total || 0;


    // ============================================================
    // 2. BLOG ACTIVITY
    // ============================================================
    //
    // This gives us data for the AreaChart/LineChart.
    //
    // Example result:
    //
    // [
    //   {
    //     date: "2026-08-10",
    //     total: 5,
    //     published: 3,
    //     drafts: 2
    //   }
    // ]
    //
    // We group blogs by their createdAt date.
    //

    const blogActivity = await Blog.aggregate([

      {
        $match: {
          workspace: workspaceId,
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          // Number of blogs created on this date
          total: {
            $sum: 1,
          },

          // Number of published blogs created on this date
          published: {
            $sum: {
              $cond: [
                { $eq: ["$status", "published"] },
                1,
                0,
              ],
            },
          },

          // Number of drafts created on this date
          drafts: {
            $sum: {
              $cond: [
                { $eq: ["$status", "draft"] },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },

      {
        $project: {
          _id: 0,

          // Rename MongoDB's _id to date
          date: "$_id",

          total: 1,
          published: 1,
          drafts: 1,
        },
      },
    ]);


    // ============================================================
    // 3. AUTHOR ANALYTICS
    // ============================================================
    //
    // This gives us one object per author.
    //
    // Example:
    //
    // {
    //   id: "...",
    //   name: "Faraz",
    //   profilePic: "...",
    //   role: "OWNER",
    //   totalBlogs: 15,
    //   published: 12,
    //   drafts: 3
    // }
    //

    const authorAnalytics = await Blog.aggregate([

      // Only blogs belonging to the active workspace
      {
        $match: {
          workspace: workspaceId,
        },
      },

      // Group blogs by author
      {
        $group: {
          _id: "$author",

          totalBlogs: {
            $sum: 1,
          },

          published: {
            $sum: {
              $cond: [
                { $eq: ["$status", "published"] },
                1,
                0,
              ],
            },
          },

          drafts: {
            $sum: {
              $cond: [
                { $eq: ["$status", "draft"] },
                1,
                0,
              ],
            },
          },
        },
      },

      // Get the actual User document
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // Get this author's membership so we can return their role
      {
        $lookup: {
          from: "memberships",
          let: {
            authorId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$user", "$$authorId"],
                    },
                    {
                      $eq: ["$workspace", workspaceId],
                    },
                  ],
                },
              },
            },

            {
              $project: {
                _id: 0,
                role: 1,
              },
            },
          ],

          as: "membership",
        },
      },

      {
        $project: {
          _id: 0,

          id: "$_id",

          name: "$user.fullName",

          profilePic: "$user.profilePic",

          gender: "$user.gender",

          location: "$user.location",

          role: {
            $arrayElemAt: [
              "$membership.role",
              0,
            ],
          },

          totalBlogs: 1,
          published: 1,
          drafts: 1,
        },
      },

      // Most active author first
      {
        $sort: {
          totalBlogs: -1,
        },
      },
    ]);


    // ============================================================
    // 4. AUTHORS BY GENDER
    // ============================================================
    //
    // IMPORTANT:
    //
    // We use authors, NOT all workspace members.
    //
    // So someone who is a VIEWER but has never written a blog
    // doesn't appear in this chart.
    //
    // Result:
    //
    // [
    //   { name: "male", value: 12 },
    //   { name: "female", value: 8 },
    //   { name: "other", value: 2 }
    // ]
    //

    const authorsByGender = await Blog.aggregate([

      {
        $match: {
          workspace: workspaceId,
        },
      },

      // Make every author unique
      {
        $group: {
          _id: "$author",
        },
      },

      // Get user
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // Group authors by gender
      {
        $group: {
          _id: "$user.gender",

          value: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1,
        },
      },

      {
        $sort: {
          value: -1,
        },
      },
    ]);


    // ============================================================
    // 5. AUTHORS BY LOCATION
    // ============================================================
    //
    // Same idea as gender.
    //
    // Because location is selected from your predefined dropdown,
    // we can safely group the values.
    //
    // Example:
    //
    // [
    //   { name: "Pakistan", value: 15 },
    //   { name: "India", value: 8 },
    //   { name: "United States", value: 5 }
    // ]
    //

    const authorsByLocation = await Blog.aggregate([

      {
        $match: {
          workspace: workspaceId,
        },
      },

      // Make each author unique
      {
        $group: {
          _id: "$author",
        },
      },

      // Get user information
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      // Group authors by location
      {
        $group: {
          _id: "$user.location",

          value: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,

          name: "$_id",

          value: 1,
        },
      },

      {
        $sort: {
          value: -1,
        },
      },
    ]);


    // ============================================================
    // 6. MEMBERS BY ROLE
    // ============================================================
    //
    // This is different from author analytics.
    //
    // Here we count ALL workspace members:
    //
    // OWNER
    // ADMIN
    // EDITOR
    // VIEWER
    //
    // This could be displayed as another donut/bar chart later.
    //

    const membersByRole = await Membership.aggregate([

      {
        $match: {
          workspace: workspaceId,
        },
      },

      {
        $group: {
          _id: "$role",

          value: {
            $sum: 1,
          },
        },
      },

      {
        $project: {
          _id: 0,

          name: "$_id",

          value: 1,
        },
      },

      {
        $sort: {
          value: -1,
        },
      },
    ]);


    // ============================================================
    // FINAL RESPONSE
    // ============================================================
    //
    // Everything is returned from ONE API request.
    //
    // Frontend:
    //
    // const res = await fetch("/api/analytics");
    // const data = await res.json();
    //
    // Then:
    //
    // data.overview
    // data.blogActivity
    // data.authors
    // data.authorsByGender
    // data.authorsByLocation
    // data.membersByRole
    //

    // return res.status(200).json({

    //   overview: {
    //     totalBlogs,
    //     publishedBlogs,
    //     draftBlogs,
    //     totalAuthors,
    //     totalMembers,
    //   },

    //   blogActivity,

    //   authors: authorAnalytics,

    //   authorsByGender,

    //   authorsByLocation,

    //   membersByRole,
    // });


        return NextResponse.json({

      overview: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalAuthors,
        totalMembers,
      },

      blogActivity,

      authors: authorAnalytics,

      authorsByGender,

      authorsByLocation,

      membersByRole,
    },
          {
            status: 200,
          }
        );

  } catch (error) {

    console.error("Analytics API error:", error);

    return NextResponse.json(
          {error: "Failed to fetch analytics",}, 
          {status: 500,}
        );
  };
};