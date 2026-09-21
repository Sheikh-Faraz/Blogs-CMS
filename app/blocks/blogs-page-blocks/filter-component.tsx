"use client";

import { useState } from "react";

import { IoMdRefresh } from "react-icons/io";
import { Search, ListFilter, ChevronDown, CalendarIcon } from 'lucide-react';

// Context
import { useBlog } from "@/context/Blog.context";

// Loading context
// import { useGlobalLoading } from "@/context/Loading.context";

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
import { Field } from "@/components/ui/field";
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

import { Blog } from "@/app/Types/blog.type";


interface FilterandTextProps {
  blogsData: Blog[],

  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  authorFilter: string;
  setAuthorFilter: React.Dispatch<React.SetStateAction<string>>;

  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;

  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;

  tagFilter: string;
  setTagFilter: React.Dispatch<React.SetStateAction<string>>;

  startDate: Date | undefined;
  setStartDate: React.Dispatch<
    React.SetStateAction<Date | undefined>
  >;

  endDate: Date | undefined;
  setEndDate: React.Dispatch<
    React.SetStateAction<Date | undefined>
  >;
}


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

export default function FilterComponent({
  blogsData,

  search,
  setSearch,

  authorFilter,
  setAuthorFilter,

  statusFilter,
  setStatusFilter,

  categoryFilter,
  setCategoryFilter,

  tagFilter,
  setTagFilter,

  startDate,
  setStartDate,

  endDate,
  setEndDate,
}: FilterandTextProps) {

  // Context
  // const { blogs, categories } = useBlog();
  const { categories } = useBlog();

  
  // ----------------------------- FILTERING STATES -----------------------------
  
  // 🗓 Calendar popovers (IMPORTANT: separate)
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");

  const [startMonth, setStartMonth] = useState<Date | undefined>();
  const [endMonth, setEndMonth] = useState<Date | undefined>(); 

  const authors = [
    ...new Map(
      blogsData
        .filter((blog) => blog.author)
        .map((blog) => [blog.author._id, blog.author])
    ).values(),
  ];

  const selectedAuthor = authors.find(
    (author) => author._id === authorFilter
  );
  

  return (

    //   {/* Header */}   {/* Title and Filters */}
      <div className="flex flex-col justify-between items-start gap-4 p-4 lg:flex-row lg:items-center lg:gap-0">

        {/* Text */}
        <div>
          <h1 className="text-xl font-semibold md:text-3xl ">
            Posts / Blogs Management
          </h1>
          <p className="text-xs text-muted-foreground my-2 md:text-sm">
            Manage your blog content and publications.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full lg:w-fit lg:flex-row md:gap-2">

          {/* Search box */}
          <ButtonGroup
            className="w-full lg:w-fit"
          >
            <Input 
              className="bg-card"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              
            />
            <Button variant="outline" aria-label="Search" className="bg-card">
              <Search className="text-[#E85129]"/>
            </Button>
          </ButtonGroup>


          {/* ----------------------------------------------------------------------------------------------------------- */}
                                                       {/* Filter Dialog */}
          {/* ----------------------------------------------------------------------------------------------------------- */}


<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" className="rounded-md bg-card w-full lg:w-fit">
      <ListFilter className="text-[#E85129]"/>
      <span>Filter</span>
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <div className="flex justify-between items-center">
        <DialogTitle>Filter & Sort</DialogTitle>

        {/* Clear all */}
        <Button
          // variant="ghost"
          variant="outline"
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
            setAuthorFilter("all");
          }}
          // className="text-sm text-white mr-6 "
          className="text-sm mr-6 items-center text-center justify-center flex"
        >
          <IoMdRefresh className="text-[#E85129]" />
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
                              <span className="truncate max-w-50">
                                {categoryFilter === "all" ? "Any category" : categoryFilter}
                              </span>
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
                                      <span className="truncate max-w-50">
                                        {cat.name}
                                      </span>
                                    </DropdownMenuRadioItem>
                                  ))}
          
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
                        />
                      </PopoverContent>
                    </Popover>
                  </InputGroupAddon>
                </InputGroup>
              </Field>

                        

                          {/* END DATE */}  
              <Field className="mx-auto w-full rounded-none">
                <InputGroup>

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




        {/* Author DROPDOWN*/}
        <div>

                        <Label className="mb-2">Author</Label>
                          <DropdownMenu>
                          <DropdownMenuTrigger className="w-full">

                            <Button
                              variant="outline"
                              className="w-full flex justify-between rounded-none"
                            >
                              {authorFilter === "all"
                                ? "Any author"
                                : selectedAuthor?.fullName}
                              <ChevronDown />
                            </Button>

                          </DropdownMenuTrigger>
          
                          <DropdownMenuContent>                
                            <DropdownMenuGroup>

                              <DropdownMenuRadioGroup
                                value={authorFilter}
                                onValueChange={setAuthorFilter}
                              >
                                <DropdownMenuRadioItem value="all">
                                  Any
                                </DropdownMenuRadioItem>

                                {authors.map((author) => (
                                  <DropdownMenuRadioItem
                                    key={author._id}
                                    value={author._id}
                                  >
                                    {author.fullName}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>

                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>

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


  );
}   