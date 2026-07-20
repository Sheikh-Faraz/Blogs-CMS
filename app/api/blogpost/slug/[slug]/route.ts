import connectDB from "@/lib/db";
import Blog from "@/models/Blog";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB();

  const blog = await Blog.findOne({ slug: params.slug });

  if (!blog) {
    return new Response(JSON.stringify({ error: "Blog not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(blog), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}