import connectDB from "@/lib/db";
import Tag from "@/models/Tags";

export async function GET() {
  await connectDB();
  const tags = await Tag.find();
  return Response.json(tags);
}