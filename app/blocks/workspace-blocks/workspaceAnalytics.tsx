"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import { FileText, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Author = {
  _id: string;
  fullName: string;
  profilePic?: string;
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;

  location: string;
};

type WorkspaceAnalyticsProps = {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  authors: Author[];
};

export default function WorkspaceAnalytics({
  totalBlogs,
  publishedBlogs,
  draftBlogs,
  authors,
}: WorkspaceAnalyticsProps) {
  const publishedPercentage =
    totalBlogs > 0 ? (publishedBlogs / totalBlogs) * 100 : 0;

  const draftPercentage =
    totalBlogs > 0 ? (draftBlogs / totalBlogs) * 100 : 0;

  /*
   * This is intentionally structured so later we can replace this
   * with real time-based analytics without changing the component.
   */
  const chartData = useMemo(
    () => [
      {
        name: "Published",
        blogs: publishedBlogs,
      },
      {
        name: "Drafts",
        blogs: draftBlogs,
      },
    ],
    [publishedBlogs, draftBlogs]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="overflow-hidden border-border/60 bg-card shadow-sm">
        {/* ================================================================ */}
        {/* HEADER                                                           */}
        {/* ================================================================ */}

        <div className="border-b border-border/60 px-6 py-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Workspace content
              </p>

              <div className="mt-1 flex items-baseline gap-3">
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl font-semibold tracking-tight"
                >
                  {totalBlogs}
                </motion.h2>

                <span className="text-sm text-muted-foreground">
                  total blogs
                </span>
              </div>
            </div>

            {/* Small summary on right */}
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Published
                  </p>

                  <p className="text-sm font-semibold">
                    {publishedBlogs}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Drafts
                  </p>

                  <p className="text-sm font-semibold">
                    {draftBlogs}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />

                <div>
                  <p className="text-xs text-muted-foreground">
                    Authors
                  </p>

                  <p className="text-sm font-semibold">
                    {authors.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* CHART                                                            */}
        {/* ================================================================ */}

        <div className="px-6 pt-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">
                Content overview
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Distribution of your workspace blogs
              </p>
            </div>

            <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Published
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Drafts
              </div>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 10,
                  left: -20,
                  bottom: 10,
                }}
                barCategoryGap="35%"
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-border/60"
                />

                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tickMargin={12}
                  className="text-xs"
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  className="text-xs"
                />

                <Tooltip
                  offset={20}
                  cursor={{
                    // fill: "hsl(var(--muted) / 0.35)",
                    fill: "#615f5f",
                  }}
                  contentStyle={{
                    backgroundColor: "#000000",
                    // backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "10px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                  }}
                  labelStyle={{
                    // color: "hsl(var(--foreground))",
                    color: "#ffffff",
                    fontWeight: 600,
                  }}
                  itemStyle={{
                    color: "#ffffff",             // number/value color
                  }}
                />

                <Bar
                  dataKey="blogs"
                  radius={[7, 7, 0, 0]}
                  // fill="hsl(24 95% 53%)"
                  maxBarSize={100}
                  animationDuration={900}
                  animationBegin={150}
                >
                   {chartData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.name === "Published" ? "#169b4b" : "#E85129"}
                  />
                ))}
              </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SUMMARY                                                           */}
        {/* ================================================================ */}

        <div className="grid grid-cols-1 border-y border-border/60 sm:grid-cols-3">
          <div className="px-6 py-5">
            <p className="text-xs font-medium text-muted-foreground">
              Total blogs
            </p>

            <p className="mt-1 text-xl font-semibold">
              {totalBlogs}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Workspace content
            </p>
          </div>

          <div className="border-t border-border/60 px-6 py-5 sm:border-l sm:border-t-0">
            <p className="text-xs font-medium text-muted-foreground">
              Published
            </p>

            <p className="mt-1 text-xl font-semibold">
              {publishedPercentage.toFixed(1)}%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {publishedBlogs} published blogs
            </p>
          </div>

          <div className="border-t border-border/60 px-6 py-5 sm:border-l sm:border-t-0">
            <p className="text-xs font-medium text-muted-foreground">
              Drafts
            </p>

            <p className="mt-1 text-xl font-semibold">
              {draftPercentage.toFixed(1)}%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {draftBlogs} blogs still in draft
            </p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* AUTHORS TABLE                                                     */}
        {/* ================================================================ */}

        <div>
          <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
            <div>
              <h3 className="text-sm font-semibold">
                Author performance
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                Content contribution by workspace author
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="h-3.5 w-3.5" />

              {authors.length}{" "}
              {authors.length === 1 ? "author" : "authors"}
            </div>
          </div>

          {/* Table header */}
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-border/60 px-6 py-3 text-xs font-medium text-muted-foreground md:grid">
            <span>Author</span>
            <span className="text-right">Blogs</span>
            <span className="text-right">Published</span>
            <span className="text-right">Drafts</span>
            <span className="text-right">Share</span>
          </div>

          {/* Table rows */}
          <div className="divide-y divide-border/60">
            {authors.length > 0 ? (
              authors.map((author, index) => {
                const contribution =
                  totalBlogs > 0
                    ? (author.totalBlogs / totalBlogs) * 100
                    : 0;

                return (
                  <motion.div
                    key={author._id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.15 + index * 0.06,
                      duration: 0.35,
                    }}
                    className="px-6 py-4"
                  >
                    {/* Desktop */}
                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 md:grid">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={author.profilePic || ""}
                            alt={author.fullName}
                          />

                          <AvatarFallback>
                            {author.fullName
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="text-sm font-medium">
                            {author.fullName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            Author
                          </p>
                        </div>
                      </div>

                      <p className="text-right text-sm font-medium">
                        {author.totalBlogs}
                      </p>

                      <p className="text-right text-sm">
                        {author.publishedBlogs}
                      </p>

                      <p className="text-right text-sm">
                        {author.draftBlogs}
                      </p>

                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${contribution}%`,
                            }}
                            transition={{
                              duration: 0.7,
                              delay:
                                0.3 + index * 0.06,
                            }}
                            className="h-full rounded-full bg-orange-500"
                          />
                        </div>

                        <span className="w-10 text-right text-xs font-medium">
                          {contribution.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center justify-between md:hidden">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={author.profilePic || ""}
                            alt={author.fullName}
                          />

                          <AvatarFallback>
                            {author.fullName
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="text-sm font-medium">
                            {author.fullName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {author.totalBlogs} blogs
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {author.publishedBlogs} published
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {author.draftBlogs} drafts
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="px-6 py-10 text-center">
                <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />

                <p className="mt-3 text-sm font-medium">
                  No authors yet
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Authors will appear here once they create content.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}