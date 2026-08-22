import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// import mongoose from "mongoose";

import { getCurrentUser } from "@/lib/getCurrentUser";

import Workspace from "@/models/Workspace";
import Membership from "@/models/Membership";

import cloudinary from "@/lib/cloudinary";



export async function PUT(req: NextRequest) {
  try {

    /* =======================================================
       1. GET ACTIVE WORKSPACE ID FROM COOKIE
       =======================================================

       Since the activeWorkspaceId cookie is HTTP-only, JavaScript running in the browser cannot access it.

       Server-side code can access HTTP-only cookies using next/headers.
       ======================================================= */

    const cookieStore = await cookies();

    const activeWorkspaceId = cookieStore.get("activeWorkspaceId")?.value;

    // No active workspace means there is nothing to update.
    if (!activeWorkspaceId) {
      return NextResponse.json(
        {
          error: "No active workspace",
        },
        {
          status: 404,
        }
      );
    }


    /* =======================================================
       2. VALIDATE MONGODB OBJECT ID
       =======================================================

       Before querying MongoDB, make sure the cookie contains a valid MongoDB ObjectId.

       This prevents CastError exceptions from malformed cookie values.
       ======================================================= */

    // if (!mongoose.Types.ObjectId.isValid(activeWorkspaceId)) {
    //   return NextResponse.json(
    //     {
    //       error: "Invalid active workspace",
    //     },
    //     {
    //       status: 400,
    //     }
    //   );
    // }


    /* =======================================================
       3. GET AUTHENTICATED USER
       =======================================================
     */

    const currentUser = await getCurrentUser(req);

    if (!currentUser?._id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const userId = currentUser._id;


    /* =======================================================
       4. CHECK WORKSPACE MEMBERSHIP
       =======================================================

       We verify that the authenticated user actually belongs to the workspace stored in the cookie.

       This prevents a user from manipulating the cookie and updating a workspace they don't belong to.
       ======================================================= */

    const membership = await Membership.findOne({
      user: userId,
      workspace: activeWorkspaceId,
    });


    if (!membership) {
      return NextResponse.json(
        {
          error: "Not a member of this workspace",
        },
        {
          status: 403,
        }
      );
    }


    /* =======================================================
       5. CHECK USER'S ROLE
       =======================================================

       OWNER and ADMIN:
       - Can update workspace settings

       EDITOR:
       - Can work with content but should not change the
         workspace's main settings.

       VIEWER:
       - Read-only.

       If you eventually want EDITORs to be able to update workspace settings, you can add "EDITOR" here.
       ======================================================= */

    if (
      membership.role !== "OWNER" 
    //   &&
    //   membership.role !== "ADMIN"
    ) {
      return NextResponse.json(
        {
          error: "You do not have permission to update this workspace",
        },
        {
          status: 403,
        }
      );
    }


    /* =======================================================
       6. GET THE WORKSPACE
       ======================================================= */

    const workspace = await Workspace.findById(activeWorkspaceId);

    if (!workspace) {
      return NextResponse.json(
        {
          error: "Workspace not found",
        },
        {
          status: 404,
        }
      );
    }


    /* =======================================================
       7. READ FORMDATA/FIELDS FROM FRONTEND
       =======================================================
     */

    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim() ?? "";
    const location = formData.get("location")?.toString().trim() ?? "";
    const about = formData.get("about")?.toString().trim() ?? "";


    /* =======================================================
       9. VALIDATE NAME
       =======================================================

       The Workspace model requires name, so don't allow an empty name to overwrite the existing value.
       ======================================================= */

    if (!name) {
      return NextResponse.json(
        {
          error: "Workspace name is required",
        },
        {
          status: 400,
        }
      );
    }


    /* =======================================================
       10. HANDLE FOUNDED DATE
       =======================================================

       Frontend sends:

       founded.toISOString()

       or:

       ""

       When the value is empty, we store null.

       When a value exists, we validate that it is actually a valid date before saving it.
       ======================================================= */

    const foundedValue = formData.get("founded")?.toString().trim() ?? "";

    let founded: Date | null = null;

    if (foundedValue) {
      const parsedFounded = new Date(foundedValue);

      if (Number.isNaN(parsedFounded.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid founded date",
          },
          {
            status: 400,
          }
        );
      }

      founded = parsedFounded;
    }


    /* =======================================================
       11. HANDLE SOCIALS
       =======================================================

       Frontend sends socials like this:

       formData.append(
         "socials",
         JSON.stringify(socialsData)
       );

       Therefore FormData contains a STRING.

       We need to parse that string back into an object.
       ======================================================= */

       const socialsValue = formData.get("socials")?.toString() ?? "";
       
    //    const socialThingy = formData.get("socials");
    // console.log("This is the SOCIALS ROUTE: ", socialThingy);

    let socials = workspace.socials;

    if (socialsValue) {
      try {
        socials = JSON.parse(socialsValue);
      } catch {
        return NextResponse.json(
          {
            error: "Invalid socials data",
          },
          {
            status: 400,
          }
        );
      }
    }


    /* =======================================================
       12. GET IMAGE DATA
       =======================================================

       FormData.get() can return:

       - string
       - File
       - null

       We only accept actual files for logo/banner.
       ======================================================= */

    const logoFile = formData.get("logo");
    const bannerFile = formData.get("banner");

    const logo =
      logoFile instanceof File && logoFile.size > 0
        ? logoFile
        : null;


    const banner =
      bannerFile instanceof File && bannerFile.size > 0
        ? bannerFile
        : null;


    /* =======================================================
       13. GET REMOVE FLAGS
       =======================================================

       Frontend sends:

       formData.append("removeLogo", String(removeLogo));

       Therefore the value arrives as:

       "true"

       or:

       "false"
       ======================================================= */

    const removeLogo = formData.get("removeLogo") === "true";

    const removeBanner = formData.get("removeBanner") === "true";


    /* =======================================================
       14. STORE OLD CLOUDINARY PUBLIC IDS
       =======================================================

       We need these later if the user replaces/removes an image.

       Example:

       Existing logo:
       workspace.logoPublicId = "workspaces/abc123"

       User uploads a new logo.

       We upload the new logo first and then delete the old Cloudinary asset.
       ======================================================= */

    const oldLogoPublicId = workspace.logoPublicId || "";
    const oldBannerPublicId = workspace.bannerPublicId || "";


    /* =======================================================
       15. VARIABLES FOR NEW CLOUDINARY DATA
       =======================================================

       These will only be changed when the user uploads or removes an image.

       If the user doesn't touch the image, the existing workspace values remain unchanged.
       ======================================================= */

    let logoUrl = workspace.logo || "";
    let logoPublicId = workspace.logoPublicId || "";

    let bannerUrl = workspace.banner || "";
    let bannerPublicId = workspace.bannerPublicId || "";


    /* =======================================================
       16. UPLOAD NEW LOGO
       ======================================================= */

    if (logo) {

      // Convert the browser File into a Buffer because
      // Cloudinary's upload_stream expects binary data.
      const bytes = await logo.arrayBuffer();

      const buffer = Buffer.from(bytes);


      // Upload the image to Cloudinary.
      const result: any = await new Promise(
        (resolve, reject) => {

          cloudinary.uploader
            .upload_stream(
              {
                folder: "workspace-logos",
              },
              (error, result) => {

                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }

              }
            )
            .end(buffer);
        }
      );


      // Store the new Cloudinary URL.
      logoUrl = result.secure_url;

      // Store the public ID so that we can delete the image
      // from Cloudinary later if it is replaced/removed.
      logoPublicId = result.public_id;
    }


    /* =======================================================
       17. UPLOAD NEW BANNER
       ======================================================= */

    if (banner) {

      const bytes = await banner.arrayBuffer();

      const buffer = Buffer.from(bytes);


      const result: any = await new Promise(
        (resolve, reject) => {

          cloudinary.uploader
            .upload_stream(
              {
                folder: "workspace-banners",
              },
              (error, result) => {

                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }

              }
            )
            .end(buffer);
        }
      );


      bannerUrl = result.secure_url;

      bannerPublicId = result.public_id;
    }


    /* =======================================================
       18. HANDLE LOGO REMOVAL
       =======================================================

       Important:

       If a NEW logo was uploaded, we don't remove it even if removeLogo is true.

       A newly uploaded image takes priority.

       Otherwise, if removeLogo is true, clear the existing logo information.
       ======================================================= */

    if (!logo && removeLogo) {
      logoUrl = "";
      logoPublicId = "";
    }


    /* =======================================================
       19. HANDLE BANNER REMOVAL
       ======================================================= */

    if (!banner && removeBanner) {
      bannerUrl = "";
      bannerPublicId = "";
    }


    /* =======================================================
       20. UPDATE WORKSPACE
       =======================================================

       We deliberately DO NOT update:

       - _id
       - slug
       - createdAt

       because those are not part of this form.

       This route only updates the workspace settings that your frontend submitted.
       ======================================================= */

    workspace.name = name;

    workspace.location = location;

    workspace.about = about;

    workspace.founded = founded;

    workspace.socials = socials;

    workspace.logo = logoUrl;

    workspace.logoPublicId = logoPublicId;

    workspace.banner = bannerUrl;

    workspace.bannerPublicId = bannerPublicId;


    /* =======================================================
       21. SAVE WORKSPACE
       ======================================================= */

    const updatedWorkspace = await workspace.save();


    /* =======================================================
       22. DELETE OLD CLOUDINARY LOGO
       =======================================================

       We delete the old image ONLY after MongoDB has successfully saved the new workspace data.

       This is safer than deleting the old image first.

       If the database update fails, the old image still exists.
       ======================================================= */

    if (
      logo &&
      oldLogoPublicId &&
      oldLogoPublicId !== logoPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldLogoPublicId
        );
      } catch (cloudinaryError) {
        // Don't fail the entire workspace update if the old
        // Cloudinary image couldn't be deleted.
        console.error(
          "Failed to delete old workspace logo:",
          cloudinaryError
        );
      }
    }


    /* =======================================================
       23. DELETE OLD LOGO WHEN USER REMOVES IT
       ======================================================= */

    if (
      !logo &&
      removeLogo &&
      oldLogoPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldLogoPublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete workspace logo from Cloudinary:",
          cloudinaryError
        );
      }
    }


    /* =======================================================
       24. DELETE OLD CLOUDINARY BANNER
       ======================================================= */

    if (
      banner &&
      oldBannerPublicId &&
      oldBannerPublicId !== bannerPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldBannerPublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete old workspace banner:",
          cloudinaryError
        );
      }
    }


    /* =======================================================
       25. DELETE OLD BANNER WHEN USER REMOVES IT
       ======================================================= */

    if (
      !banner &&
      removeBanner &&
      oldBannerPublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldBannerPublicId
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete workspace banner from Cloudinary:",
          cloudinaryError
        );
      }
    }


    /* =======================================================
       26. RETURN UPDATED WORKSPACE
       =======================================================

       Your frontend expects:

       const data = await res.json();

       setWorkspace(data.workspace);

       Therefore the response MUST contain:

       {
         workspace: updatedWorkspace
       }
       ======================================================= */

    return NextResponse.json(
      {
        message: "Workspace updated successfully",
        workspace: updatedWorkspace,
      },
      {
        status: 200,
      }
    );


  } catch (error) {

        console.error("Update workspace error:", error);

    return NextResponse.json(
      {error: "Failed to update workspace",}, 
      {status: 500,}
    );
  }
}