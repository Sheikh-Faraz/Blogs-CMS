import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import User from "@/models/User";

import cloudinary from "@/lib/cloudinary";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const currentUser = await getCurrentUser(req);

    const formData = await req.formData();

    // User Info
    const fullName  = formData.get("fullName") as string;
    const about     = formData.get("about") as string;
    const gender    = formData.get("gender") as string;
    const location  = formData.get("location") as string;
    const socials = {
      linkedin:   JSON.parse(formData.get("linkedin") as string),
      github:     JSON.parse(formData.get("github") as string),
      x:          JSON.parse(formData.get("x") as string),
      facebook:   JSON.parse(formData.get("facebook") as string),
      instagram:  JSON.parse(formData.get("instagram") as string),
      youtube:    JSON.parse(formData.get("youtube") as string),
      discord:    JSON.parse(formData.get("discord") as string),
    };



    // BANNER IMAGE
    const bannerFile = formData.get("banner") as File | null;
    const removeBanner =  formData.get("removeBanner") === "true";
    let bannerPath: string | undefined;
    let bannerPublicId: string | undefined;


    // PROFILE IMAGE 
    const file = formData.get("profilePic") as File | null;
    const removeProfilePic = formData.get("removeProfilePic") === "true";
    let profilePicPath: string | undefined;
    let profilePicPublicId: string | undefined;


    // Upload PROFILE IMAGE to Cloudinary
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profile-pictures",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      profilePicPath = result.secure_url;

      profilePicPublicId = result.public_id;
    }


    // Upload BANNER IMAGE to Cloudinary
    if (bannerFile && bannerFile.size > 0) {
      const bytes = await bannerFile.arrayBuffer();

      const buffer = Buffer.from(bytes);

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profile-banners",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      bannerPath = result.secure_url;

      bannerPublicId = result.public_id;
    }


    // PROFILE IMAGE REMOVE
    if (
      removeProfilePic &&
      currentUser.profilePicPublicId
    ) {
      await cloudinary.uploader.destroy(
        currentUser.profilePicPublicId
      );

      profilePicPath = "";

      profilePicPublicId = "";
    }


    // BANNER IMAGE REMOVE
    if (
      removeBanner &&
      currentUser.bannerPublicId
    ) {
      await cloudinary.uploader.destroy(
        currentUser.bannerPublicId
      );

      bannerPath = "";

      bannerPublicId = "";
    }


    // Update fields
    const updatedData: {
      fullName?: string;
      about?: string;
      gender?: string;
      location?: string;
      socials?: {
        linkedin: string;
        github: string;
        x: string;
        facebook: string;
        instagram: string;
        youtube: string;
        discord: string;
      };

      profilePic?: string;
      profilePicPublicId?: string;

      banner?: string;
      bannerPublicId?: string;

    } = {
      fullName,
      about,
      gender,
      location,
      socials,
    };


    // PROFILE IMAGE
    if (profilePicPath !== undefined) {
      updatedData.profilePic = profilePicPath;
    }
    if (profilePicPublicId !== undefined) {
      updatedData.profilePicPublicId = profilePicPublicId;
    }

    // BANNER IMAGE
    if (bannerPath !== undefined) {
      updatedData.banner = bannerPath;
    }
    if (bannerPublicId !== undefined) {
      updatedData.bannerPublicId =
        bannerPublicId;
    }


    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      updatedData,
      { new: true }
    ).select("-passwordHash");

    return NextResponse.json(updatedUser, {
      status: 200,
    });

  } catch (error) {
    console.error("Update profile error:", error);

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}