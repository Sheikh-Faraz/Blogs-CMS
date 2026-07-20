"use client";

import Link from "next/link";
import { useEffect ,useState } from "react";

// Type
import { Tag } from "@/app/Types/blog.type";

import { FiEdit, FiTrash2 } from "react-icons/fi";
import { IoMdRefresh } from "react-icons/io";
import { Search, ListFilter, ChevronDown, CalendarIcon } from 'lucide-react';

// Context
import { useBlog } from "@/context/Blog.context";

// Loading context
import { useGlobalLoading } from "@/context/Loading.context";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Calendar } from "@/components/ui/calendar";
import { Field, 
  // FieldLabel
 } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";

import LoaderIcon from "./loading/Loader";


function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function BlogTable() {

  // Context
  const { blogs, deleteBlog, loading, categories, getAllBlogs } = useBlog();

  // Loading context 
  const { setIsLoading } = useGlobalLoading();

  useEffect(()=>{
    getAllBlogs();
    setIsLoading(false);
  }, [])
  
  // ----------------------------- FILTERING STATES -----------------------------

  // 🔍 Search
  const [search, setSearch] = useState("");

  // 📌 Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  // const [tagFilter, setTagFilter] = useState("");
  // const [tempTag, setTempTag] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  
  // 🗓 Calendar popovers (IMPORTANT: separate)
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  
  // 📅 Date filters 
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");

  const [startMonth, setStartMonth] = useState<Date | undefined>();
  const [endMonth, setEndMonth] = useState<Date | undefined>(); 
  

  // Get the filtered blogs
  const filteredBlogs = blogs
  // 🔍 Search
  .filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  )

  // 📌 Status
  .filter((blog) => {
    if (statusFilter === "all") return true;
    return blog.status === statusFilter;
  })

  // 📂 Category
  .filter((blog) => {
    if (categoryFilter === "all") return true;
    return blog?.category?.name === categoryFilter;
  })

  // 📅 Date range
  .filter((blog) => {
    if (!startDate && !endDate) return true;

    const blogDate = new Date(blog.createdAt).getTime();

    if (startDate && blogDate < startDate.getTime()) return false;
    if (endDate && blogDate > endDate.getTime()) return false;

    return true;
  })

  // 🏷 Tags
  .filter((blog) => {
    if (!tagFilter) return true;

    // return blog.tags?.some((tag: string) =>
    return blog.tags?.some((tag: Tag) =>
      tag.name?.toLowerCase().includes(tagFilter.toLowerCase())
    );
  });

  // console.log("Filtered blogs:", filteredBlogs); // ✅ LOG FILTERED BLOGS

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center p-4">

        {/* Text */}
        <div>
          <h1 className="text-3xl font-semibold">Posts / Blogs Management</h1>
          <p className="text-sm text-muted-foreground my-2">
            Manage your blog content and publications.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">

          {/* Search box */}
          <ButtonGroup>
            <Input 
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              
            />
            <Button variant="outline" aria-label="Search">
              <Search />
            </Button>
          </ButtonGroup>


          {/* ----------------------------------------------------------------------------------------------------------- */}
                                                       {/* Filter Dialog */}
          {/* ----------------------------------------------------------------------------------------------------------- */}


<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" className="rounded-none bg-muted">
      <ListFilter />
      <span>Filter</span>
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <div className="flex justify-between items-center">
        <DialogTitle>Filter & Sort</DialogTitle>

        {/* Clear all */}
        <Button
          variant="ghost"
          onClick={() => {
            setStatusFilter("all");
            setCategoryFilter("all");
            setStartDate(undefined);
            setEndDate(undefined);
            setStartMonth(undefined);
            setEndMonth(undefined);
            setStartValue("");
            setEndValue("");
            setTagFilter("");
            setSearch(""); // optional
          }}
          className="text-sm text-muted-foreground mr-6"
        >
          <IoMdRefresh className="ml-2" />
          Clear All
        </Button>
      </div>

      <DialogDescription>
        Filters are applied instantly and automatically.
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-6 py-4">

      {/* STATUS + CATEGORY */}
      <div className="grid grid-cols-2 gap-4">

        {/* Status DROPDOWN*/}
        <div>

                  <Label className="mb-2">Status</Label>
                          <DropdownMenu>
                          <DropdownMenuTrigger className="w-full">
                            <Button variant="outline" className="w-full flex justify-between rounded-none">
                                {statusFilter === "all" ? "Any status" : statusFilter}
                              <ChevronDown />
                            </Button>
                          </DropdownMenuTrigger>
          
                          <DropdownMenuContent>                
                            <DropdownMenuGroup>
                              <DropdownMenuRadioGroup
                                 value={statusFilter}
                                 onValueChange={(value) => setStatusFilter(value)}
                              >
                                  <DropdownMenuRadioItem value="all">
                                      Any
                                    </DropdownMenuRadioItem>

                                  <DropdownMenuRadioItem value="draft">
                                      Draft
                                    </DropdownMenuRadioItem>
          
                                    <DropdownMenuRadioItem value="published">
                                      Published
                                    </DropdownMenuRadioItem>
          
                              </DropdownMenuRadioGroup>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>

        </div>



        {/* Category DROPDOWN*/}
        <div>

                        <Label className="mb-2">Category</Label>
                          <DropdownMenu>
                          <DropdownMenuTrigger className="w-full">
                            <Button variant="outline" className="w-full flex justify-between rounded-none">
                                {categoryFilter === "all" ? "Any category" : categoryFilter}
                              <ChevronDown />
                            </Button>
                          </DropdownMenuTrigger>
          
                          <DropdownMenuContent>                
                            <DropdownMenuGroup>
                              <DropdownMenuRadioGroup
                                value={categoryFilter}
                                onValueChange={(value) => setCategoryFilter(value)}
                              >
                                  <DropdownMenuRadioItem value="all">
                                    Any
                                  </DropdownMenuRadioItem>

                                  {/* 🔥 DYNAMIC CATEGORIES */}
                                  {categories.map((cat) => (
                                    <DropdownMenuRadioItem key={cat._id} value={cat.name}>
                                      {cat.name}
                                    </DropdownMenuRadioItem>
                                  ))}

                                  {/* <DropdownMenuRadioItem value="tech">
                                    Tech
                                  </DropdownMenuRadioItem>

                                  <DropdownMenuRadioItem value="programming">
                                    Programming
                                  </DropdownMenuRadioItem>

                                  <DropdownMenuRadioItem value="finance">
                                    Finance
                                  </DropdownMenuRadioItem> */}
          
                              </DropdownMenuRadioGroup>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>

        </div>

          </div>

          {/* DATE RANGE */}
          <div>
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">

              {/* Starting Date*/}
               <Field className="mx-auto w-full">
                <InputGroup>
                  {/* <InputGroupInput
                    id="date-required"
                    value={value}
                    placeholder="mm/dd/yyyy"
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setValue(e.target.value)
                      if (isValidDate(date)) {
                        setDate(date)
                        setMonth(date)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setStartOpen(true)
                      }
                    }}
                  /> */}

                  <InputGroupInput
                    value={startValue}
                    placeholder="Start date"
                    readOnly
                  />

                  <InputGroupAddon align="inline-end">
                    <Popover open={startOpen} onOpenChange={setStartOpen}>
                      <PopoverTrigger asChild>
                        <InputGroupButton
                          id="date-picker"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Select date"
                        >
                          <CalendarIcon />
                          <span className="sr-only">Select date</span>
                        </InputGroupButton>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={startDate}
                          // selected={date}
                          month={startMonth}
                          // month={month}
                          onMonthChange={setStartMonth}
                          // onMonthChange={setMonth}
                          onSelect={(date) => {
                            setStartDate(date);
                            setStartValue(formatDate(date));
                            setStartOpen(false);
                          }}
                          // onSelect={(date) => {
                          //   setDate(date)
                          //   setValue(formatDate(date))
                          //   setStartOpen(false)
                          // }}
                        />
                      </PopoverContent>
                    </Popover>
                  </InputGroupAddon>
                </InputGroup>
              </Field>

                        

                          {/* END DATE */}  
              <Field className="mx-auto w-full rounded-none">
                <InputGroup>
                  {/* <InputGroupInput
                    id="date-required"
                    value={value}
                    placeholder="mm/dd/yyyy"
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setValue(e.target.value)
                      if (isValidDate(date)) {
                        setDate(date)
                        setMonth(date)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault()
                        setEndOpen(true)
                      }
                    }}
                  /> */}

                  <InputGroupInput
                    value={endValue}
                    placeholder="End date"
                    readOnly
                  />
                  
                  <InputGroupAddon align="inline-end">
                    <Popover open={endOpen} onOpenChange={setEndOpen}>
                      <PopoverTrigger asChild>
                        <InputGroupButton
                          id="date-picker"
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Select date"
                        >
                          <CalendarIcon />
                          <span className="sr-only">Select date</span>
                        </InputGroupButton>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={endDate}
                          // selected={date}
                          month={endMonth}
                          // month={month}
                          onMonthChange={setEndMonth}
                          // onMonthChange={setMonth}
                          onSelect={(date) => {
                            setEndDate(date);
                            setEndValue(formatDate(date));
                            setEndOpen(false);
                          }}
                          // onSelect={(date) => {
                          //   setDate(date)
                          //   setValue(formatDate(date))
                          //   setEndOpen(false)
                          // }}
                        />
                      </PopoverContent>
                    </Popover>
                  </InputGroupAddon>
                </InputGroup>
              </Field>



            </div>
          </div>

          {/* 🔥 OPTIONAL (VERY USEFUL FOR YOUR CMS) */}
          {/* Tags filter */}
          <div>
            <Label>Tags</Label>
            <Input
              placeholder="Enter tag..."
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="mt-2"
            />
          </div>

        </div>

        {/* FOOTER */}
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

                {/* <DialogClose asChild>
                  <Button>Apply Filters</Button>
                </DialogClose> */}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* ----------------------------------------------------------------------------------------------------------- */}

        </div>

      </div>

      {/* Table */}
      {/* <div className="border rounded-xl overflow-hidden"> */}
      <div className="border overflow-hidden m-4">
        <table className="w-full text-sm">

          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-4 uppercase">Post Details</th>
              <th className="p-4 uppercase">Category</th>
              <th className="p-4 uppercase">Status</th>
              <th className="p-4 uppercase">Created</th>
              <th className="p-4 text-right uppercase">Actions</th>
            </tr>
          </thead>

          <tbody>
        
            {loading ? 
            ( 
              <tr >
                <td colSpan={5} className="p-8 text-muted-foreground">
                  <LoaderIcon /> 
                </td>
              </tr>

            )
            // : blogs.length === 0 ? 
            : filteredBlogs.length === 0 ? 
            (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No posts found. Create your first blog post!
                </td>
              </tr>
             ) 
             : 
             ( 
              
               <>
               
              {filteredBlogs.map((blog) => (
             

              <tr
                key={blog._id}
                className="border-t hover:bg-muted/30 transition"
              >
                {/* 🔥 POST (IMAGE + TITLE) */}
                <td className="p-4">
                  <div className="flex items-center gap-3">

                    {/* Image */}
                    <div className="w-12 h-12 rounded-none overflow-hidden bg-muted">
                      {blog.heroImage ? (
                        <img
                          src={blog.heroImage}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                          No Img
                        </div>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <div className="font-medium truncate max-w-90">{blog.title}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-80">
                        {blog.slug}
                      </div>
                    </div>
                  </div>
                </td>

                {/* CATEGORY */}
                <td className="p-4">
                  <Badge className="bg-muted text-muted-foreground">
                    <p className="truncate max-w-20">
                      {blog.category ? blog.category.name : "No category"}
                    </p>  
                  </Badge>
                </td>

                {/* 🔥 STATUS */}
                <td className="p-4">
                  <Badge
                    className={`capitalize ${blog.status === "published" ? "bg-[#022C22] text-[#2BB885]" : "bg-muted text-muted-foreground" }`}
                  >
                    {blog.status}
                  </Badge>
                </td>

                {/* 🔥 CREATED */}
                <td className="p-4 text-muted-foreground">
                  {new Date(blog.createdAt).toLocaleDateString()}
                  {/* Not working MOCK 12:00 */}
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                  <div className="flex justify-end gap-2">

                    <Link href={`/dashboard/edit/${blog._id}`} onClick={()=>{setIsLoading(true)}}>
                      <Button variant="ghost" size="icon">
                        <FiEdit size={16} />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => deleteBlog(blog._id)}
                      disabled={loading}
                    >
                      <FiTrash2 size={16} />
                    </Button>

                  </div>
                </td>
              </tr>
            ))}

                      </>
                      
            )
          }


          </tbody>

        </table>
      </div>
    </div>
  );
}   