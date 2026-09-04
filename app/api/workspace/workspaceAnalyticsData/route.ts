import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { getActiveWorkspace } from "@/lib/workspace";
import { hasPermission } from "@/lib/permissions";
import Blog from "@/models/Blog";
import Membership from "@/models/Membership";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspace = await getActiveWorkspace(user._id.toString());
    const membership = await Membership.findOne({
      user: user._id,
      workspace: workspace._id,
    }).lean();

    if (!membership) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });
    }

    if (!hasPermission(membership.role, "VIEW_ANALYTICS")) {
      return NextResponse.json(
        { error: "You do not have permission to view analytics" },
        { status: 403 }
      );
    }

    const workspaceId = workspace._id;

    const [totalBlogs, publishedBlogs, draftBlogs, totalMembers] = await Promise.all([
      Blog.countDocuments({ workspace: workspaceId }),
      Blog.countDocuments({ workspace: workspaceId, status: "published" }),
      Blog.countDocuments({ workspace: workspaceId, status: "draft" }),
      Membership.countDocuments({ workspace: workspaceId }),
    ]);

    const [authors, blogActivity, authorAnalytics, authorsByGender, authorsByLocation, membersByRole] =
      await Promise.all([
        Blog.aggregate([
          { $match: { workspace: workspaceId } },
          { $group: { _id: "$author" } },
          { $count: "total" },
        ]),
        Blog.aggregate([
          { $match: { workspace: workspaceId } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              total: { $sum: 1 },
              published: { $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] } },
              drafts: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { _id: 0, date: "$_id", total: 1, published: 1, drafts: 1 } },
        ]),
        Blog.aggregate([
          { $match: { workspace: workspaceId } },
          {
            $group: {
              _id: "$author",
              totalBlogs: { $sum: 1 },
              published: { $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] } },
              drafts: { $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] } },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $lookup: {
              from: "memberships",
              let: { authorId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$user", "$$authorId"] },
                        { $eq: ["$workspace", workspaceId] },
                      ],
                    },
                  },
                },
                { $project: { _id: 0, role: 1 } },
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
              role: { $arrayElemAt: ["$membership.role", 0] },
              totalBlogs: 1,
              published: 1,
              drafts: 1,
            },
          },
          { $sort: { totalBlogs: -1 } },
        ]),
        Blog.aggregate([
          { $match: { workspace: workspaceId } },
          { $group: { _id: "$author" } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          { $group: { _id: "$user.gender", value: { $sum: 1 } } },
          { $project: { _id: 0, name: "$_id", value: 1 } },
          { $sort: { value: -1 } },
        ]),
        Blog.aggregate([
          { $match: { workspace: workspaceId } },
          { $group: { _id: "$author" } },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          { $group: { _id: "$user.location", value: { $sum: 1 } } },
          { $project: { _id: 0, name: "$_id", value: 1 } },
          { $sort: { value: -1 } },
        ]),
        Membership.aggregate([
          { $match: { workspace: workspaceId } },
          { $group: { _id: "$role", value: { $sum: 1 } } },
          { $project: { _id: 0, name: "$_id", value: 1 } },
          { $sort: { value: -1 } },
        ]),
      ]);

    return NextResponse.json({
      overview: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalAuthors: authors[0]?.total || 0,
        totalMembers,
      },
      blogActivity,
      authors: authorAnalytics,
      authorsByGender,
      authorsByLocation,
      membersByRole,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
