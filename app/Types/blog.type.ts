import { User } from "@/app/Types/user.type";

export interface Blog {
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

export interface Category {
  _id: string;
  name: string;
}

export interface Tag {
  _id: string;
  name: string;
}