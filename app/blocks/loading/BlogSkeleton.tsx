"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function BlogSkeleton() {
  return (
    <div className="w-full animate-pulse">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="space-y-3">
          <Skeleton className="h-8 w-56 rounded-none" />
          <Skeleton className="h-4 w-40 rounded-none" />
        </div>

        <Skeleton className="h-10 w-28 rounded-none" />
      </div>

      {/* INFO BAR */}
      <div className="flex flex-wrap gap-8 px-6 py-3 border-b">
        <Skeleton className="h-4 w-28 rounded-none" />
        <Skeleton className="h-4 w-40 rounded-none" />
        <Skeleton className="h-4 w-44 rounded-none" />
      </div>

      {/* 🔥 MAIN GRID */}
      <div className="grid grid-cols-3">

        {/* LEFT SIDE */}
        <div className="col-span-2 border">

          {/* TITLE */}
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-none" />
              <Skeleton className="h-12 w-full rounded-none" />
            </div>
          </div>

          {/* TABS */}
          <div className="w-full my-5">

            <div className="flex gap-6 px-6 border-b pb-4">
              <Skeleton className="h-5 w-14 rounded-none" />
              <Skeleton className="h-5 w-20 rounded-none" />
              <Skeleton className="h-5 w-12 rounded-none" />
              <Skeleton className="h-5 w-32 rounded-none" />
            </div>

            {/* CONTENT AREA */}
            <div className="m-4 border rounded-none">
              <div className="p-6 space-y-6">

                <Skeleton className="h-10 w-full rounded-none" />

                <div className="flex gap-3">
                  <Skeleton className="h-10 flex-1 rounded-none" />
                  <Skeleton className="h-10 flex-1 rounded-none" />
                </div>

                <Skeleton className="h-100 w-full rounded-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 RIGHT SIDEBAR */}
        <div className="bg-[#0A0A0A] overflow-hidden h-full border">
          
          <div className="m-4">
            <Skeleton className="h-7 w-52 rounded-none" />
          </div>

          <Card className="border-y h-full rounded-none m-4">
            <CardContent className="p-4 space-y-8">

              {/* SLUG */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-28 rounded-none" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>

              {/* STATUS */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-20 rounded-none" />
                <Skeleton className="h-12 w-full rounded-none" />
              </div>

              {/* CATEGORY */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-24 rounded-none" />

                <div className="flex gap-2">
                  <Skeleton className="h-12 flex-1 rounded-none" />
                  <Skeleton className="h-12 w-12 rounded-none" />
                </div>

                <Skeleton className="h-12 w-full rounded-none" />
              </div>

              {/* TAGS */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-14 rounded-none" />

                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-none" />
                  <Skeleton className="h-8 w-24 rounded-none" />
                </div>

                <Skeleton className="h-12 w-full rounded-none" />
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}