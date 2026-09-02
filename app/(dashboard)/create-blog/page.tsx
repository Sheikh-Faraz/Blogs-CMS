"use client";

import { useState, useEffect } from "react";

// Context 
import { useBlog } from "@/context/Blog.context";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { RiDraftLine as Draft } from "react-icons/ri";
import { ChevronDown, X, Send, CircleCheck } from 'lucide-react';
import { MdDoneOutline as UploadIcon } from "react-icons/md";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/app/blocks/editor/Editor"), {
  ssr: false,
});


import HeroImagePicker from "@/app/blocks/HeroImagePicker";
import LinkedInPostUI from "@/app/blocks/LinkedIn-Post-UI";

import toast from "react-hot-toast";
import LoaderIcon from "@/app/blocks/loading/Loader";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sparkles,
  PenLine,
  FileText,
  WandSparkles,
  BookOpen,
  Loader2,
  Trash2,
  InfoIcon, 
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


export default function CreateBlogPage() {

  const aiActions = [
    {
      label: "Continue",
      tooltip: `Continue writing the article`,
      tooltipDescription: "Appends new content to the end without changing the existing article.",
      action: "continue",
      mode: "append",
      icon: PenLine,
    },
    {
      label: "Conclusion",
      tooltip: "Generate a conclusion",
      tooltipDescription: "Adds a conclusion or updates the existing one while keeping the rest unchanged.",
      action: "conclusion",
      mode: "replace",
      icon: FileText,
    },
    {
      label: "Improve",
      tooltip: "Improve readability",
      tooltipDescription: "Rewrites the entire article with better grammar, clarity, and flow.",
      action: "improve",
      mode: "replace",
      icon: WandSparkles,
    },
    {
      label: "Simplify",
      tooltip: "Make easier to read",
      tooltipDescription: "Rewrites the entire article using simpler, easier-to-understand language.",
      action: "simplify",
      mode: "replace",
      icon: BookOpen,
    },
    {
      label: "Professional",
      tooltip: "Professional tone",
      tooltipDescription: "Rewrites the entire article in a polished, professional writing style.",
      action: "professional",
      mode: "replace",
      icon: Sparkles,
    },
  ] as const;
  

  // CONTEXT
  const { 
        createBlog, 
        createBlogLoading,
        createCategoryLoading,

        deletingCategoryId,
        deleteCategory,

        fetchCategories,

        newCategory,
        setNewCategory,
        categories,
        selectedCategory,
        setSelectedCategory,
        // tags,
        selectedTags,
        setSelectedTags,
        tagInput,
        setTagInput,

        createCategory
       } = useBlog();


  const [activeTab, setActiveTab] = useState("hero");
       
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const [content, setContent] = useState<any[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [heroImage, setHeroImage] = useState({
    file: null as File | null,
    preview: "",
  });

  const [createdAt, setCreatedAt] = useState<Date | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  // FOR AI BOLG CREATION AND AI LINKEDIN POST CREATION
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const [linkedinPost, setLinkedinPost] = useState("");
  const [linkedinLoading, setLinkedinLoading] = useState(false);  

  const [editorInstance, setEditorInstance] = useState<any>(null);

  useEffect(() => {
    if (
      !createdAt &&
      (title.trim() || content.length > 0)
    ) {
      setCreatedAt(new Date());
    }
  }, [title, content, createdAt]);


  // To get categories etc
  useEffect(()=>{
    fetchCategories();
  }, []);


  // For AI blogs change buttons 
  const handleAIAction = async (
    action: string,
    mode: "replace" | "append" = "replace"
  ) => {

    if (!editorInstance) return;


    setLoadingAction(action);

    try {

      const html = await editorInstance.blocksToFullHTML(
        editorInstance.document
      );
      // const html = await editorInstance.blocksToHTMLLossy(
      //   editorInstance.document
      // );


      const res = await fetch("/api/ai/static-toolbar-actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          title,
          content: html,
        }),
      });

      const data = await res.json();

      if (!res.ok) {

        toast.error(data.error || "AI action failed.");
        return;
        // throw new Error(data.error || "AI action failed");
        
      }

        if (mode === "append") {
          const blocks = await editorInstance.tryParseHTMLToBlocks(
            data.content
          );

          const lastBlock =
            editorInstance.document[
              editorInstance.document.length - 1
            ];

          editorInstance.insertBlocks(
            blocks,
            lastBlock,
            "after"
          );

          markModified();

        } else {

        const blocks = await editorInstance.tryParseHTMLToBlocks(
          data.content
        );

        editorInstance.replaceBlocks(
          editorInstance.document,
          blocks
        );

        markModified();
      }

      markModified();

    } catch (error) {

      toast.error(`AI action failed: ${error}`);
      // toast.error(error, "AI action failed.");
      // console.error(error);

    } finally {
      setLoadingAction(null);
    }
  };


  // To update when any change made 
  const markModified = () => {
    if (createdAt) {
      setUpdatedAt(new Date());
    }
  };

  // FORMAT DATE
  const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // GENERATE SLUG FROM TITLE
  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/\s+/g, "-");

  // HANDLE TITLE CHANGE
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));

    markModified();
  };

  // Add tag
  const addTag = () => {
  const trimmed = tagInput.trim().toLowerCase();
  if (!trimmed) return;

  if (!selectedTags.includes(trimmed)) {
    setSelectedTags((prev) => [...prev, trimmed]); 
  }

  setTagInput("");
  };




  const hasEditorContent = (editor: any) => {
    if (!editor) return false;

    return editor.document.some((block: any) => {
      if (
        Array.isArray(block.content) &&
        block.content.some(
          (item: any) =>
            item.type === "text" &&
            item.text.trim().length > 0
        )
      ) {
        return true;
      }

      if (block.props?.url || block.props?.src) {
        return true;
      }

      if (block.children?.length) {
        return true;
      }

      return false;
    });
  };


// HANDLE SUBMIT & CREATE BLOG
const handleSubmit = async () => {
  
  // if (content.length === 0) {
  //   toast.error("Content cannot be empty");
  //   return;
  // };

  
  
    if (!hasEditorContent(editorInstance)) {
      toast.error("Content cannot be empty");
      return;
    }

    const formData = new FormData();

    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("status", status);


    if (!editorInstance) return;
    formData.append(
      "content",
      JSON.stringify(editorInstance.document)
    );

    if (selectedCategory) {
      formData.append("category", selectedCategory);
    }

    formData.append("tags", JSON.stringify(selectedTags));

    // ✅ CASE 1: FILE upload (device)
    if (heroImage.file) {
      formData.append("heroImage", heroImage.file);
    }

    // ❗ CASE 2: Unsplash URL
    else if (heroImage.preview) {
      formData.append("heroImageUrl", heroImage.preview);
    }

    await createBlog(formData);

    setTitle("");
    setSlug("");
    setContent([]);
    setHeroImage({ file: null, preview: "" });
  };


  const handleCategorySubmit = async () => {
    const trimmed = newCategory.trim().toLowerCase();
    if (!trimmed) return;

    await createCategory(newCategory);
    setNewCategory("");
  };


  return (
    <div className="w-full">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-semibold truncate max-w-190">
            {title || "Untitled"}
          </h1>


        </div>

        {/* <Button  */}
        <button 
          onClick={handleSubmit} 
          disabled={createBlogLoading} 
          // className="rounded-none bg-card text-card-foreground">
          className="border py-2 px-3 bg-card text-card-foreground rounded-md flex gap-2 items-center hover:bg-muted">

          {createBlogLoading ? 
          (
            <div className="flex gap-2">
              Saving
              <LoaderIcon />
            </div>
          )
            : 
            <p className="flex gap-2 items-center">
                Create
              <UploadIcon className="text-[#E85129] size-4"/>
            </p>
          }
        </button>
        {/* </Button> */}
      </div>

          <div className="flex flex-wrap gap-8 px-6 py-3 border-b text-sm text-muted-foreground">

            <span>
              <strong>Status:</strong> {status || "draft"}
            </span>

            <span>
              <strong>Created:</strong> {createdAt ? formatDate(createdAt) : "Not created yet"}
            </span>

            <span>
              <strong>Last Modified:</strong> {updatedAt ? formatDate(updatedAt) : "Not modified yet"}
            </span>

          </div>

      {/* 🔥 MAIN GRID */}
      <div>

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* TITLE */}
          <div className="p-6 space-y-4">
            <div>
              <Label>
                Title 
                <span className="text-red-400">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Enter title..."
                className="bg-card border rounded-none p-4 mt-2"
              />
            </div>


          </div>


          {/* 🔥 TABS */}
          <Tabs 
            // defaultValue="hero" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full my-5 flex flex-col "
          >
            <TabsList variant="line" className="px-6">
              <TabsTrigger value="hero" className="text-[15px] text-card-foreground">Hero</TabsTrigger>
              <TabsTrigger value="content" className="text-[15px] text-card-foreground">Content</TabsTrigger>
              {/* <TabsTrigger value="seo" className="text-[15px]">SEO</TabsTrigger> */}
              {/* <TabsTrigger value="linkedinPost" className="text-[15px] text-card-foreground">Convert to POST</TabsTrigger> */}
            </TabsList>


            {/* FOR BORDER BOTTOM */}
            <div className="border-b" />


            {/* HERO TAB */}
            <TabsContent value="hero" className=" flex gap-3">
              {/* <Card className="border mt-4"> */}

              <Card className="border m-4 rounded-none flex-1">
                <CardContent className="p-4 space-y-4">
                  <h1 className="font-bold text-3xl w-full border p-2 text-center">Hero Section Image</h1>

                    <HeroImagePicker
                      image={heroImage.preview}
                      setImage={setHeroImage}
                    />

                </CardContent>
              </Card>


            <div className="overflow-hidden h-full border ">
          <h1 className="text-xl font-bold m-4 uppercase">Publishing Details</h1>
          <Card className="border-y h-full rounded-none m-4">
            <CardContent className="p-4 space-y-4">

              <div className="space-y-4">

                  <div>
                    <Label>Post URL Slug</Label>
                    <div className="border p-3 my-2 max-w-63 overflow-x-auto whitespace-nowrap">
                      {slug}
                    </div>
                  </div>


                
                {/* DROPDOWN TO SELECT VALUE */}
                <div className="mt-6">
                <Label className="mb-2">Status</Label>
                <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <Button variant="outline" className="w-full flex justify-between bg-transparent rounded-none">
                    {/* Open */}
                      {status === "draft" ? 
                      (
                        <div className="flex gap-2 items-center">
                          <Draft className="text-[#E85129] size-4"/>
                          <span>Draft</span>
                        </div>
                      ) 
                      : 
                      (
                        <div className="flex gap-2 items-center">
                          <CircleCheck className="text-green-400" />
                          <span>Published</span>
                        </div>
                      )}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>                
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup
                      value={status}
                      onValueChange={(value) =>
                        setStatus(value as "draft" | "published")
                      }
                    >
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


                {/* DROPDOWN TO SELECT CATEGORY */}
                <div className="mt-6">
                <Label className="mb-2">Category</Label>
                

                {/* <ButtonGroup className="w-full flex items-center"> */}
                <div className="w-full flex items-center">
                <Input
                  className="rounded-none my-2"
                  placeholder="Create new category..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCategorySubmit();
                  }
                  }}
                />

                  <Button 
                    variant="outline"   
                    onClick={handleCategorySubmit}
                    className="rounded-none"
                  >
                    {createCategoryLoading ? 
                      <LoaderIcon />
                    :  
                      <Send className="text-[#E85129] size-4"/>
                    }
                  </Button>
                </div>

                <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <Button variant="outline" className="w-full flex justify-between bg-transparent rounded-none">
                        <p className="truncate max-w-55">
                          {selectedCategory ? selectedCategory : "Select category"}
                        </p>
                      <ChevronDown />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent 
                  align="start"
                  className="
                    rounded-none
                    p-1
                    shadow-lg
                    border
                  "
                >                
                  <DropdownMenuGroup>
                    <DropdownMenuRadioGroup
                      value={selectedCategory}
                      onValueChange={(value) => setSelectedCategory(value)}
                    >
                      {categories.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">
                          No categories found. Create categories first.
                        </div>
                      ) : (
                        <>


                        {categories.map((cat) => (
                          <div
                            key={cat._id}
                            className="
                              group
                              flex
                              items-center
                              rounded-sm
                              transition-colors
                              duration-200
                              hover:bg-accent
                            "
                          >
                            <DropdownMenuRadioItem
                              value={cat.name}
                              className="
                                flex-1
                                cursor-pointer
                                transition-colors
                              "
                            >
                              <span className="truncate max-w-44">
                                {cat.name}
                              </span>
                            </DropdownMenuRadioItem>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  disabled={deletingCategoryId === cat._id}
                                  className="
                                    mr-1
                                    size-7
                                    rounded-none
                                    opacity-0
                                    group-hover:opacity-100
                                    transition-all
                                    duration-200
                                    hover:bg-red-500/10
                                    hover:text-red-500
                                  "
                                  // onClick={(e) => {
                                  //   // e.preventDefault();
                                  //   // e.stopPropagation();
                                  // }}
                                >
                                  {deletingCategoryId === cat._id ? (
                                    <>
                                      <LoaderIcon />
                                    </>
                                  ) : (
                                    <Trash2 className="size-4 hover:cursor-pointer" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>

                              <AlertDialogContent className="rounded-none">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {/* Delete "{cat.name}"? */}
                                    Delete ?
                                  </AlertDialogTitle>

                                  <AlertDialogDescription>
                                    This will permanently delete this category.
                                    Any blogs using it will keep working, but their
                                    category will be removed.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                  <AlertDialogCancel
                                    className="rounded-none"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Cancel
                                  </AlertDialogCancel>

                                  <AlertDialogAction
                                    className="rounded-none bg-red-600 hover:bg-red-700"
                                    onClick={async (e) => {
                                      // e.preventDefault();
                                      // e.stopPropagation();

                                      await deleteCategory(cat._id);
                                    }}
                                  >
                                    {deletingCategoryId === cat._id ? (
                                      <>
                                        <LoaderIcon />
                                      </>
                                    ) : (
                                      "Delete"
                                    )}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}
                        </>
                      )  
                      }

                    </DropdownMenuRadioGroup>

              
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

                </div>


                {/* INPUT TO SELECT TAG  */}
                <div className="mt-6">
                <Field>
                  <FieldLabel htmlFor="input-badge">
                    Tags
                  </FieldLabel>

                  <div className="flex overflow-x-auto whitespace-nowrap gap-2 scrollbar-hide">
                    {selectedTags.map((tag) => (
                      <div key={tag} className="rounded-none p-1 ml-1 flex border text-sm items-center">
                        <p className="truncate max-w-30">
                          {tag}
                        </p>
                        <X 
                          data-icon="inline-end" 
                          className="ml-2 cursor-pointer hover:bg-red-500 rounded-full border border-white size-3"
                          onClick={() => setSelectedTags((prev) => prev.filter((t) => t !== tag))}
                        />
                      </div>
                    ))}

                  </div>

                  <Input
                    id="input-badge"
                    className="rounded-none"
                    placeholder="Add tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                </Field>
                </div>

              </div>

            </CardContent>
          </Card>
        </div>

            </TabsContent>


            {/* CONTENT TAB */}
            {/* <TabsContent value="content"> */}
            <div
              className={
                activeTab === "content"
                  ? "block"
                  : "hidden"
              }
            >

              <Card className="border m-4 rounded-none">
                <CardContent className="p-4">
                <h2 className="font-semibold w-full p-4 border text-3xl text-center mx-auto truncate max-w-150">
                  {title ? title : "Title Here"}
                </h2>


            {/* ✨ AI BUTTONS */}
            <div className="mb-4 gap-3 border p-4 w-full justify-center">
            
            {/* GENERATE BLOG FROM TITLE BUTTON */}
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{
                    y: -2,
                    scale: 1.01,
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                >
                  <Button
                    variant="default"
                    disabled={loadingAction === "generate-blog"}
                    onClick={async () => {
                      if (!title) return toast.error(`Enter title first`);

                      setLoadingAction("generate-blog");

                      try {
                        const res = await fetch("/api/ai/generate-blog", {
                          method: "POST",
                          body: JSON.stringify({ title }),
                        });

                        const data = await res.json();

                        if (!res.ok) {
                          toast.error(data.error || "Failed to generate blog.");
                          return;
                        }

                        if (!data.content) {
                          toast.error("AI returned an empty response.");
                          return;
                        }

                        const blocks = await editorInstance.tryParseHTMLToBlocks(
                          data.content
                        );

                        // editorInstance.replaceBlocks(
                        //   editorInstance.document,
                        //   blocks
                        // );

                        editorInstance.transact(() => {
                          editorInstance.replaceBlocks(
                            editorInstance.document,
                            blocks
                          );
                        });

                        markModified();
                        
                      } finally {
                        setLoadingAction(null);
                      }
                    }}
                    className="
                      rounded-none
                      w-full
                      my-4
                      gap-2
                      relative
                      overflow-hidden
                      transition-all
                      duration-300
                      shadow-sm
                      hover:shadow-md
                    "
                  >
                    {loadingAction === "generate-blog" && (
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.5,
                          ease: "linear",
                        }}
                        className="
                          absolute
                          inset-0
                          bg-linear-to-r
                          from-transparent
                          via-white/20
                          to-transparent
                          pointer-events-none
                        "
                      />
                    )}

                    {loadingAction === "generate-blog" ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Generating Blog...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-4 text-[#E85129]" />
                        <span>Generate Blog</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </TooltipTrigger>

              <TooltipContent>
                <p>Generate a complete blog article from the title</p>
              </TooltipContent>
            </Tooltip>


            {/* STATIONARY TOOLTIP */}
                <Card className="rounded-none border">
              <CardContent className="p-3">

                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="size-4 text-[#E85129]" />
                  <span className="font-medium">
                    AI Tools
                  </span>
                </div>

                  <Separator className="border mt-2 mb-4" />

                  <div className="flex flex-wrap gap-2">
                    {aiActions.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Tooltip key={item.action}>
                          <TooltipTrigger asChild>

                            <motion.div
                              whileHover={{y: -2, scale: 1.03,}}
                              whileTap={{scale: 0.97,}}
                            >
                              <Button
                                variant="outline"
                                disabled={loadingAction === item.action}
                                className="
                                  gap-2
                                  rounded-none
                                  transition-all
                                "
                                onClick={() =>
                                  handleAIAction(
                                    item.action,
                                    item.mode
                                  )
                                }
                              >

                                {loadingAction === item.action ? (
                                  <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Icon className="size-4 text-[#E85129]" />
                                    {item.label}
                                  </>
                                )}

                              </Button>
                            </motion.div>

                          </TooltipTrigger>


                          <TooltipContent className='max-w-64 py-3 text-pretty'>
                            <div className='space-y-1'>
                              <div className='flex items-center gap-2'>
                                <p className='text-sm font-medium'>{item.tooltip}</p>
                              </div>
                              <div className='flex gap-2'>
                                <InfoIcon className='size-8' />
                                <p className='text-background/80'>{item.tooltipDescription}</p>
                              </div>
                            </div>
                          </TooltipContent>

                        </Tooltip>
                      );
                    })}


                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="
                              rounded-none
                              transition-all
                              hover:text-destructive
                            "
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>

                      <TooltipContent>
                        Clear editor content
                      </TooltipContent>
                    </Tooltip>

                    <AlertDialogContent className="rounded-none">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Clear Editor Content?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This will permanently remove all content currently in the editor.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-none">
                          Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                          variant="destructive"
                          className="rounded-none"
                          onClick={() => {
                            // setContent([]);
                            // markModified();
                            editorInstance.replaceBlocks(editorInstance.document, []);
                            markModified();
                          }}
                        >
                          Clear Content
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  </div>

                </CardContent>
              </Card>

              </div>


                <div className="relative">
                  {/* <Editor
                    value={content}
                    onChange={(val) => {
                      setContent(val);
                      markModified();
                    }}
                    setEditor={setEditorInstance}
                  /> */}

                  <Editor
                    value={content}
                    setEditor={setEditorInstance}
                    markModified={markModified}

                    // loadingAction={loadingAction}
                    // setLoadingAction={setLoadingAction}
                  />

                  {loadingAction && (
                    <div
                      className="
                        absolute inset-0 z-50
                        bg-background/50
                        backdrop-blur-sm
                        flex items-center justify-center
                      "
                    >
                      {/* Loading UI Here */}

                      <AnimatePresence>
                        {loadingAction && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="
                              absolute inset-0 z-50
                              bg-background/50
                              backdrop-blur-sm
                              flex items-center justify-center
                            "
                          >
                            <motion.div
                              initial={{ scale: 0.95, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.95, opacity: 0 }}
                              className="
                                border
                                bg-card
                                px-8 py-6
                                shadow-lg
                                text-center
                                space-y-4
                                min-w-70
                              "
                            >
                              <div className="flex justify-center">
                                <div className="relative">
                                  <Loader2 className="size-8 animate-spin text-[#E85129]" />

                                  <motion.div
                                    animate={{
                                      scale: [1, 1.4, 1],
                                      opacity: [0.3, 1, 0.3],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                    className="absolute -top-1 -right-1"
                                  >
                                    <Sparkles className="size-4 text-[#E85129]" />
                                  </motion.div>
                                </div>
                              </div>

                              <div>
                                <h3 className="font-medium">
                                  AI Assistant Working
                                </h3>

                                <p className="text-sm text-muted-foreground mt-1">
                                  {loadingAction === "generate-blog" &&
                                    "Generating your article..."}

                                  {loadingAction === "continue" &&
                                    "Continuing your article..."}

                                  {loadingAction === "conclusion" &&
                                    "Writing a conclusion..."}

                                  {loadingAction === "improve" &&
                                    "Improving readability..."}

                                  {loadingAction === "simplify" &&
                                    "Simplifying content..."}

                                  {loadingAction === "professional" &&
                                    "Applying professional tone..."}
                                </p>
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>


                </CardContent>
              </Card>
            {/* </TabsContent> */}
            </div>


            {/* SEO TAB */}
            <TabsContent value="seo">
              <Card className="border m-4 rounded-none">
                <CardContent className="p-4 space-y-4">
                  <h2 className="font-semibold">SEO Settings</h2>

                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Meta Description</Label>
                    <Input placeholder="Coming soon..." />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>




           {/* LINKEDIN-POST TAB */}
            <TabsContent value="linkedinPost">
              {/* <Card className="border mt-4"> */}
              <Card className="border m-4 rounded-none">
                {/* <CardContent className="space-y-4"> */}
                <CardContent>

                      <h1 className="font-semibold text-3xl w-full border p-2 text-center">PREVIEW POST</h1>

                      {/* 💼 LINKEDIN BUTTON */}
                    <div className="mt-4 flex gap-3 border p-2 w-full">    
                      <Button
                        variant="secondary"
                        className="flex-1 rounded-none py-4"
                        disabled={linkedinLoading || !content}
                        onClick={async () => {
                          setLinkedinLoading(true);

                          const res = await fetch("/api/ai/generate-linkedin", {
                            method: "POST",
                            body: JSON.stringify({ content }),
                          });

                          const data = await res.json();
                          setLinkedinPost(data.post);

                          setLinkedinLoading(false);
                        }}
                      >
                        {linkedinLoading ? 
                        (
                          <div className="flex gap-2">
                            Generating
                            <LoaderIcon />
                          </div>
                        )
                        : 
                        "Generate LinkedIn Post"
                        }
                      </Button>

                      {linkedinPost && (
                        <Button
                          variant="outline"
                          className="flex-1 rounded-none py-4"
                          onClick={() => {
                            navigator.clipboard.writeText(linkedinPost)
                            toast.success("Copied to clipboard")
                        }}
                        >
                          Copy
                        </Button>
                      )}
                    </div>

                    {/* 💼 OUTPUT */}

                    {/* <h1 className="font-semibold text-3xl w-full border p-2 text-center">PREVIEW POST</h1> */}
                    <LinkedInPostUI linkedInPost={linkedinPost} />

                </CardContent>
              </Card>
            </TabsContent>




          </Tabs>
        </div>

        {/* 🔥 RIGHT SIDEBAR */}
        
      </div>
    </div>
    
  );
}