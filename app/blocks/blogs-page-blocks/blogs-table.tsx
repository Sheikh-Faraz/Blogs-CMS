"use client";

import { useState } from "react";
import Link from "next/link";

import { motion } from "framer-motion";

// Contexts
import { useBlog } from "@/context/Blog.context";
import { useGlobalLoading } from "@/context/Loading.context";

// Permission to show buttons bases on role
import { useWorkspacePermissions } from "@/hooks/use-workspace-permissions";

// Types
import { Blog } from "@/app/Types/blog.type";

// Images
import UserImagePlaceholder from "@/public/UserImagePlaceholder.png";
import NoImagePic from "@/public/No-img-placeholder.png";

// Skeletons
import BlogTableSkeleton from "@/app/blocks/blogs-page-blocks/blogs-page-skeleton/BlogsTable-skeleton";

// Custom Blocks
import EmptyBlogState from "@/app/blocks/blogs-page-blocks/empty-blogs-state";
import ImageOnHover from "@/app/blocks/Animate-Components/Image-on-hover";
import AuthorHoverCard from "@/app/blocks/Animate-Components/Author-on-hover";

// UI blocks
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";


// Icons
import { FiMoreHorizontal, FiEdit, FiTrash2 } from "react-icons/fi";


interface BlogsTableProps {
  blogsData: Blog[];
  loadingData: boolean;
}


export default function BlogsTable({ blogsData, loadingData }: BlogsTableProps) {

  // Contexts
  const { deleteBlog } = useBlog();
  const { startTransition } = useGlobalLoading();

  // Permission according to role
  const { can } = useWorkspacePermissions();

  // Get the filtered blogs
  const filteredBlogs = blogsData;

  // For Pagination 
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const totalBlogs = filteredBlogs.length;
  const totalPages = Math.ceil(totalBlogs / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  // For opening delete dialog blog
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);


  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };


  return (

    //   Table 
        <div className="border overflow-x-auto m-4 bg-card px-2">
        {loadingData ? 
        ( <BlogTableSkeleton /> )
          :
        (
        // <table className="w-full text-sm">
        <table className="w-full text-xs lg:text-sm">

          <thead className="bg-muted/40">
            <tr className="text-left">
              {/* <th className="p-4 uppercase"> */}
              <th className="p-2 uppercase lg:p-4">
                Post Details
              </th>
              {/* <th className="p-4 uppercase"> */}
              <th className="p-2 uppercase lg:p-4">
                Status
              </th>
              {/* <th className="p-4 uppercase"> */}
              <th className="p-2 uppercase lg:p-4">
                Author
              </th>
              {/* <th className="p-4 uppercase"> */}
              <th className="p-2 uppercase lg:p-4">
                Created
              </th>
              {/* <th className="p-4 text-right uppercase"> */}
              <th className="p-2 text-right uppercase lg:p-4">
                Actions
              </th>
            </tr>
          </thead>


          <tbody>  
            { filteredBlogs.length === 0 ? 
             (
                <EmptyBlogState />
             )
             : 
             ( 
              <>
              {paginatedBlogs.map((blog, index) => (

              <motion.tr
                  key={`${currentPage}-${blog._id}`}
                  initial={{
                    opacity: 0,
                    y: 20,
                    filter: "blur(6px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                  }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="border-t hover:bg-muted/30 transition"
                >
                {/* 🔥 POST (IMAGE + TITLE) */}
                {/* <td className="p-4"> */}
                <td className="p-2 lg:p-4">
                  <div className="flex items-center gap-3">

                    {/* Image */}
                    {/* <div className="w-12 h-12 rounded-none overflow-hidden bg-muted"> */}
                    <div className="size-10 shrink-0 rounded-none overflow-hidden bg-muted lg:size-12">
                      {blog.heroImage ? (
                        <ImageOnHover
                          src={blog.heroImage}
                        />                      
                      ) : (
                        <ImageOnHover
                          src={NoImagePic.src}
                        />
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <div className="max-w-45 truncate font-medium lg:max-w-70 xl:max-w-90">
                        {blog.title}
                      </div>
                      <div className="max-w-40 truncate text-xs text-muted-foreground lg:max-w-60 xl:max-w-80">
                        {blog.slug}
                      </div>

                      {/* <div className="font-medium truncate max-w-90">{blog.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-80">{blog.slug}</div> */}
                    </div>
                  </div>
                </td>


                {/* 🔥 STATUS */}
                {/* <td className="p-4"> */}
                <td className="p-2 lg:p-4">
                  <Badge
                    className={`capitalize text-[11px] lg:text-xs ${
                      blog.status === "published"
                        ? "bg-[#022C22] text-[#2BB885]"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {blog.status}
                  </Badge>
                  {/* <Badge
                    className={`capitalize ${blog.status === "published" ? "bg-[#022C22] text-[#2BB885]" : "bg-muted text-muted-foreground" }`}
                  >
                    {blog.status}
                  </Badge> */}
                </td>


                {/* AUTHOR */}
                {/* <td > */}
                <td className="px-2 lg:px-4">
                  <AuthorHoverCard
                    author={{
                      fullName: blog.author?.fullName,
                      banner: blog.author?.banner || NoImagePic.src,
                      profilePic: blog.author?.profilePic || UserImagePlaceholder.src,

                      role: blog.authorRole,
                      email: blog.author?.email,
                    }}
                  />
                </td>

                {/* 🔥 CREATED */}
                {/* <td className="p-4 text-muted-foreground"> */}
                <td className="p-2 whitespace-nowrap text-muted-foreground lg:p-4">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </td>

                {/* ACTIONS */}
                {/* <td className="p-4"> */}
                <td className="p-2 lg:p-4">
                  <div className="flex justify-end">

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        {/* <button className="p-2 rounded-md hover:bg-muted/50 transition cursor-pointer "> */}
                        <button className="cursor-pointer rounded-md p-1.5 transition hover:bg-muted/50 lg:p-2">
                          <FiMoreHorizontal size={18} />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-44">

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              
                              {/* EDIT */}
                              <DropdownMenuItem 
                                asChild
                                disabled={!can("UPDATE_BLOG")}
                              >
                                <Link
                                  href={`/edit-blog/${blog._id}`}
                                  onClick={(e) => {                              
                                    e.preventDefault();
                                    startTransition(`/edit-blog/${blog._id}`);
                                  }}
                                  className="flex items-center gap-2 cursor-pointer my-2"
                                >
                                  <FiEdit size={14} />
                                    Edit Blog
                                </Link>
                              </DropdownMenuItem>
                            </span>
                          </TooltipTrigger>

                            {!can("UPDATE_BLOG") && (
                              <TooltipContent>
                                You don&apos;t have permission to edit blogs.
                              </TooltipContent>
                            )}
                        </Tooltip>



                        {/* DELETE (opens modal) */}
                        {/* <AlertDialog> */}
                          {/* <AlertDialogTrigger asChild> */}

                          {/* DELETE */}
<Tooltip>
  <TooltipTrigger asChild>
    <span>
      <DropdownMenuItem
        disabled={!can("DELETE_BLOG")}
        onSelect={(e) => {
          e.preventDefault();
          setDeleteBlogId(blog._id);
        }}
        className="flex items-center gap-2 text-red-500 cursor-pointer"
      >
        <FiTrash2 size={14} />
        Delete Blog
      </DropdownMenuItem>
    </span>
  </TooltipTrigger>

  {!can("DELETE_BLOG") && (
    <TooltipContent>
      You don&apos;t have permission to delete blogs.
    </TooltipContent>
  )}
</Tooltip>
                          

                      </DropdownMenuContent>
                    </DropdownMenu>


                    <AlertDialog
  open={deleteBlogId === blog._id}
  onOpenChange={(open) => {
    if (!open) {
      setDeleteBlogId(null);
    }
  }}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Delete this blog?
      </AlertDialogTitle>

      <AlertDialogDescription>
        This action cannot be undone. The blog will be permanently removed.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={() => {
          deleteBlog(blog._id);
          setDeleteBlogId(null);
        }}
        className="bg-red-600 hover:bg-red-700 text-white"
        disabled={loadingData || !can("DELETE_BLOG")}
      >
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                  </div>
                </td>


              </motion.tr>
            ))}
                      </>
            )
          }
          </tbody>


            <tfoot className="border-t bg-muted/30">
              <tr>
                <td colSpan={5} className="p-4">
                  {/* <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"> */}
                  <div className="flex items-center justify-between w-full">
                    
                    {/* Left Side */}
                    {/* <p className="text-sm text-muted-foreground"> */}
                    <p className="text-xs text-muted-foreground lg:text-sm">
                      Showing{" "}
                      <span className="font-medium">{startIndex + 1}</span> to{" "}
                      <span className="font-medium">
                        {Math.min(endIndex, totalBlogs)}
                      </span>{" "}
                      of <span className="font-medium">{totalBlogs}</span> blogs
                    </p>

                    {/* Right Side */}
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={goPrev}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>

                       {/* Page indicator */}
                        <div className="text-sm px-2">
                          {currentPage} / {totalPages}
                        </div>

                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={goNext}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>

                  </div>
                </td>
              </tr>
            </tfoot>

        </table>
        )
        }

      </div>
  );
}   