"use client";

import { useEffect, useState } from "react";

// Tag Type
import { Tag } from "@/app/Types/blog.type";

// Filter and Text component
import FilterandText from "@/app/blocks/blogs-page-blocks/filter-component";
// Stats Card
import StatsCard from "@/app/blocks/blogs-page-blocks/stats-card";
// Blogs Table
import BlogsTable from "@/app/blocks/blogs-page-blocks/blogs-table";


// Header Skeleton
import HeaderSkeleton from "@/app/blocks/blogs-page-blocks/blogs-page-skeleton/Header-skeleton";
// Stats  Skeleton
import StatsSkeleton from "@/app/blocks/blogs-page-blocks/blogs-page-skeleton/Stats-skeleton";


// Context
import { useBlog } from "@/context/Blog.context";


export default function BlogTable() {

  // Context
  const { blogs, loading, getAllBlogs } = useBlog();

  // Loading context 
  // const { setIsLoading } = useGlobalLoading();


   // ================= FILTER STATES =================

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [tagFilter, setTagFilter] = useState("");

  const [authorFilter, setAuthorFilter] = useState("all");


  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // =================================================

// ================= FILTERED BLOGS =================

  const filteredBlogs = blogs
    .filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    )

    .filter((blog) => {
      if (statusFilter === "all") return true;
      return blog.status === statusFilter;
    })

    .filter((blog) => {
      if (categoryFilter === "all") return true;
      return blog.category?.name === categoryFilter;
    })

    // Author Filter
    .filter((blog) => {
      if (authorFilter === "all") return true;
      return blog.author?._id === authorFilter;
    })

    .filter((blog) => {
      if (!startDate && !endDate) return true;

      const blogDate = new Date(blog.createdAt).getTime();

      if (startDate && blogDate < startDate.getTime()) return false;
      if (endDate && blogDate > endDate.getTime()) return false;

      return true;
    })

    .filter((blog) => {
      if (!tagFilter) return true;

      return blog.tags?.some((tag: Tag) =>
        tag.name?.toLowerCase().includes(tagFilter.toLowerCase())
      );
    });

  // =================================================

  
  useEffect(()=>{
    getAllBlogs();
    // setIsLoading(false);
  }, []);
  
 
  return (
    <div className="space-y-6">

      <div>

        {/* FILTER AND HEADER TEXT  */}
        {loading ? 
          <HeaderSkeleton /> 
          : 
          <FilterandText 

            blogsData={filteredBlogs}

            search={search}
            setSearch={setSearch}
            authorFilter={authorFilter}
            setAuthorFilter={setAuthorFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          /> 
        }  

        {/* STATS CARDS */}
        {loading ? <StatsSkeleton /> : <StatsCard blogsData={blogs}/> }

      </div>

      {/* Table  */}
      <BlogsTable blogsData={filteredBlogs} loadingData={loading}/> 


    </div>
  );
}   