// --------------------------------------
// DONE (). TESTED (/), REMAINING (0), TOTAL ()
// --------------------------------------

import { apiFetch } from "@/lib/api-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Fetch all blogs
export const getBlogs = async () => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost`, {
    cache: "no-store",
    method: "GET",
    credentials: "include",
  });

  return res;
};

// Get Blog by id
export const getBlogById = async (id: string) => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  return res;
};

// Fetch all categories
export const getCategories = async () => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost/category`, {
    cache: "no-store",
    credentials: "include",
  });
  return res;
};

// Create a new category
export const createCategory = async (newCategory: string) => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost/createCategory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      categoryName: newCategory,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create category");
  }

  return data;
};

// Delete category
export const deleteCategoryService = async (id: string) => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost/deleteCategory/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to delete category");
  }

  return data;
};

// Fetch all tags
export const getTags = async () => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost/tag`, {
    cache: "no-store",
    credentials: "include",
  });
  return res;
};

// Create a new blog
export const createBlog = async (formData: FormData) => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create blog");
  }

  return res.json();
};

// UPDATE BLOG
export const updateBlog = async (id: string, formData: FormData) => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to update blog");
  }

  return res.json();
};

// DELETE BLOG
export const deleteBlog = async (id: string) => {
  const res = await apiFetch(`${BASE_URL}/api/blogpost/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to delete blog");
  }

  return res.json();
};
