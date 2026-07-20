"use client";

import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

// APIs
import { 
  getBlogById as getBlogByIdService,
  getBlogs, 

  createCategory as createCategoryService,

  createBlog as createBlogService,
  updateBlog as updateBlogService,
  deleteBlog as deleteBlogService, 
  getCategories,
  deleteCategoryService,
  getTags
} from "@/services/blog.services";

// Utility
import { getErrorMessage } from "@/lib/error";

// User Type
import { User } from "@/app/Types/user.type";

// Types
interface Blog {
  _id: string;
  title: string;
  content: any[];
  slug: string;
  status: string; // ✅ NEW
  heroImage?: string; // ✅ NEW
  createdAt: string; // ✅ NEW
  updatedAt: string; // ✅ NEW

  // NEW FIELDS
  category?: Category;
  tags?: Tag[];

  author: User;
  authorRole: string;
}

interface Category {
  _id: string;
  name: string;
}

interface Tag {
  _id: string;
  name: string;
}



interface BlogContextType {
  blogs: Blog[];
  singleBlog: Blog | null;
  setSingleBlog: (data: Blog) => void;
  loading: boolean;
  createBlogLoading: boolean;
  
  updateBlogLoading: boolean;

  deletingCategoryId: string | null;

  createCategoryLoading: boolean;

  newCategory: string;
  setNewCategory: (category: string) => void;
  categories: Category[];

  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;

  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  tags: Tag[];
  selectedTags: string[];
  // setSelectedTags: (tags: string[]) => void;
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagInput: string;
  setTagInput: (input: string) => void;
  
  getAllBlogs: () => Promise<void>;
  getBlogById: (id: string) => Promise<void>;

  createCategory: (newCategory: string) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;


  fetchData: () => Promise<void>;

  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;

  createBlog: (formData: FormData) => Promise<void>;

  updateBlog: ( id: string, formData: FormData ) => Promise<void>;

  deleteBlog: (id: string) => Promise<void>;

}

// Context
const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider = ({ children }: { children: React.ReactNode }) => {

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [singleBlog, setSingleBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  const [createBlogLoading, setCreateBlogLoading] = useState(false);

  const [updateBlogLoading, setUpdateBlogLoading] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [createCategoryLoading, setCreateCategoryLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");


  // 🔥 Fetch all blogs
  const getAllBlogs = async () => {
    try {
      setLoading(true);

      const res = await getBlogs();
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
      
      const data = await res.json();
      setBlogs(data);

      // console.log("THIS THE BLOGS I AM GETTING ", res);
      
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch blogs"));
    } finally {
      setLoading(false);
    }
  };


  // Fetch categories and tags
  const fetchData = async () => {
    const catRes = await getCategories();
    const tagRes = await getTags();

    const catData: Category[] = await catRes.json();
    const tagData: Tag[] = await tagRes.json();
    
    setCategories(catData);
    // console.log("THSE ARE ALL THE CATEGORIES", catData);
    setTags(tagData);

  };



  // Fetch categories 
  const fetchCategories = async () => {
    const catRes = await getCategories();

    const catData: Category[] = await catRes.json();
    
    setCategories(catData);
  };


  // Fetch Tags
  const fetchTags = async () => {
    const tagRes = await getTags();

    const tagData: Tag[] = await tagRes.json();
    
    setTags(tagData);
  };



  // To create category
  const createCategory = async (newCategory: string) => {
    try {
      setCreateCategoryLoading(true);

      const res = await createCategoryService(newCategory);

      setCategories((prev) => [...prev, res]); // Add new category to state

      toast.success("Category created 🚀");
      
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch blogs"));
    } finally {
      setCreateCategoryLoading(false);
    }
  };



  // To delete category
  const deleteCategory = async (categoryId: string) => {
    try {
      setDeletingCategoryId(categoryId);

      await deleteCategoryService(categoryId);

      // Remove deleted category from local state
      setCategories((prev) =>
        prev.filter(
          (category) =>
            category._id !== categoryId
        )
      );

      // Clear selection if the deleted category
      // was currently selected
      const deletedCategory = categories.find(
        (category) =>
          category._id === categoryId
      );

      if (
        deletedCategory &&
        selectedCategory === deletedCategory.name
      ) {
        setSelectedCategory("");
      }

      toast.success(
        "Category deleted successfully"
      );
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "Failed to delete category"
        )
      );

      throw err;
    } finally {
      setDeletingCategoryId(null);
    }
  };


  // Get blog by Id for editing
  const getBlogById = async (id: string) => {
    try {
      setLoading(true);

      const res = await getBlogByIdService(id);

      const data = await res.json();

      setSingleBlog(data);

    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to fetch blog"));
    } finally {
      setLoading(false);
    }
  }


  // New: createBlog function
  const createBlog = async (formData: FormData) => {
    try {
      setCreateBlogLoading(true);

      const blog = await createBlogService(formData);

      setBlogs((prev) => [blog, ...prev]);

      toast.success("Blog created 🚀");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create blog"));
    } finally {
      setCreateBlogLoading(false);
    }
  };


  // ✅ UPDATE BLOG
  const updateBlog = async (
    id: string,
    formData: FormData
  ) => {
    try {
      setUpdateBlogLoading(true);

      const updated = await updateBlogService(
        id,
        formData
      );

      setBlogs((prev) =>
        prev.map((blog) =>
          blog._id === id ? updated : blog
        )
      );

      setSingleBlog(updated);

      toast.success("Blog updated ✏️");
    } catch (err) {
      toast.error(
        getErrorMessage(
          err,
          "Failed to update blog"
        )
      );

      // Important: keeps router.push() from running
      throw err;
    } finally {
      setUpdateBlogLoading(false);
    }
  };


// ✅ DELETE BLOG
const deleteBlog = async (id: string) => {
  try {
    // setLoading(true);

    await deleteBlogService(id);

    setBlogs((prev) => prev.filter((blog) => blog._id !== id));

    toast.success("Blog deleted 🗑️");
  } catch (err) {
    toast.error(getErrorMessage(err, "Failed to delete blog"));
  } 
  // finally {
  //   setLoading(false);
  // }
};



  // 🔥 Fetch once on load
  // useEffect(() => {
  //   // getAllBlogs();
  //   fetchData();
  //   if (blogs.length === 0) {
  //     getAllBlogs();
  //   }

  // }, []);

  return (
    <BlogContext.Provider
      value={{
        blogs,
        singleBlog,
        setSingleBlog,
        loading,

        createBlogLoading,
        updateBlogLoading,
        createCategoryLoading,
        
        createCategory,
        deletingCategoryId,
        deleteCategory,

        categories,
        setCategories,

        newCategory,
        setNewCategory,
        selectedCategory,
        setSelectedCategory,
        tags,
        selectedTags,
        setSelectedTags,
        tagInput,
        setTagInput,

        getAllBlogs,
        getBlogById,

        fetchData,
        fetchCategories,
        fetchTags,

        createBlog,
        updateBlog,
        deleteBlog,
 
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

// Hook
export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);

  if (!context) {
    throw new Error("useBlog must be used within BlogProvider");
  }

  return context;
};