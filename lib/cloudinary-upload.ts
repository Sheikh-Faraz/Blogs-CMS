import cloudinary from "@/lib/cloudinary";

export const uploadToCloudinary = async (
  file: File,
  folder: string = "uploads"
): Promise<{
  url: string;
  public_id: string;
}> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    public_id: result.public_id,
  };
};