"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  Users,
  MousePointerClick,
  CornerDownLeft,
  Clock3,
  TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

// import CountriesAnalytics from "@/app/blocks/Analytics/CountriesAnalytics";

// Loading context
import { useGlobalLoading } from "@/context/Loading.context";

type CountryData = {
  x: string;
  y: number;
};

type AnalyticsData = {  
  stats: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
    comparison?: {
      pageviews?: number;
      visitors?: number;
      visits?: number;
      bounces?: number;
      totaltime?: number;
    };
  };

  pageviews: {
    pageviews: {
      x: string;
      y: number;
    }[];

    sessions: {
      x: string;
      y: number;
    }[];
  };

  countries: CountryData[];
};

function formatDuration(seconds: number) {
  if (!seconds) return "0s";

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (mins === 0) return `${secs}s`;

  return `${mins}m ${secs}s`;
}

function useCountUp(end: number, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;

    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
}

function TrendBadge({
  value,
}: {
  value?: number;
}) {
  const isPositive = (value ?? 0) >= 0;

  return (
    <div
      className={`
        inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-medium
        ${
          isPositive
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
            : "border-red-500/20 bg-red-500/10 text-red-500"
        }
      `}
    >
      <TrendingUp className="h-3 w-3" />

      {isPositive ? "+" : ""}
      {value ?? 0}%
    </div>
  );
}

function AnalyticsStatCard({
  title,
  value,
  icon: Icon,
  trend,
  formatter,
  delay,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  trend?: number;
  formatter?: (value: number) => string;
  delay?: number;
}) {
  const animatedValue = useCountUp(value);

  const displayValue = useMemo(() => {
    if (formatter) {
      return formatter(animatedValue);
    }

    return animatedValue.toLocaleString();
  }, [animatedValue, formatter]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
        delay,
      }}
      whileHover={{
        y: -4,
      }}
      className="group"
    >
      <Card
        className="
          relative overflow-hidden rounded-2xl border-border/50
          bg-background/70 backdrop-blur-xl
          transition-all duration-300
          hover:border-primary/30
          hover:shadow-[0_0_30px_rgba(255,255,255,0.06)]
        "
      >
        <div
          className="
            absolute inset-0 opacity-0 transition-opacity duration-500
            group-hover:opacity-100
          "
        >
          <div
            className="
              absolute -top-20 right-0 h-40 w-40 rounded-full
              bg-primary/10 blur-3xl
            "
          />
        </div>

        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {title}
                </p>

                <h3 className="mt-2 text-3xl font-bold tracking-tight">
                  {displayValue}
                </h3>
              </div>

              <TrendBadge value={trend} />
            </div>

            <div
              className="
                flex h-12 w-12 items-center justify-center
                rounded-2xl border border-border/50
                bg-muted/40
                transition-transform duration-300
                group-hover:scale-110
              "
            >
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: any) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="
        rounded-2xl border border-border/50
        bg-background/95 p-4 shadow-2xl
        backdrop-blur-xl
      "
    >
      <p className="mb-3 text-xs text-muted-foreground">
        {label}
      </p>

      <div className="space-y-2">
        {payload.map((entry: any) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-6"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full bg-primary"
              />

              <span className="text-sm capitalize">
                {entry.dataKey}
              </span>
            </div>

            <span className="text-sm font-semibold">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] =
    useState<AnalyticsData | null>(null);

  const [mode, setMode] = useState<"both" | "pageviews" | "sessions">("both");

  // Loading context 
  // const { setIsLoading } = useGlobalLoading();

  useEffect(() => {
    // setIsLoading(false);
    
    async function fetchAnalytics() {
      try {
        const res = await fetch(
          "http://localhost:3001/api/analytics",
          {
            cache: "no-store",
          }
        );

        const json = await res.json();

        setData(json);

        console.log(json);
      } catch (error) {
        console.error(
          "Failed to fetch analytics:",
          error
        );
      }
    }

    fetchAnalytics();

  }, []);

  const stats = data?.stats;

  const chartData = useMemo(() => {
    if (!data?.pageviews) return [];

    return data.pageviews.pageviews.map(
      (item, index) => {
        const session =
          data.pageviews.sessions[index];

        return {
          time: new Date(item.x).toLocaleTimeString(
            [],
            {
              hour: "numeric",
              minute: "2-digit",
            }
          ),
          pageviews: item.y,
          sessions: session?.y || 0,
        };
      }
    );
  }, [data]);

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Analytics
        </h1>

        <p className="text-muted-foreground">
          Monitor traffic, engagement, and user
          activity across your platform.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div
          className="grid grid-cols-3 gap-4"

          // className="
          //   grid grid-cols-1 gap-4
          //   sm:grid-cols-2
          //   xl:grid-cols-5
          // "
        >
          <AnalyticsStatCard
            title="Pageviews"
            value={stats.pageviews}
            trend={
              stats.comparison?.pageviews
            }
            icon={Activity}
            delay={0}
          />

          <AnalyticsStatCard
            title="Visitors"
            value={stats.visitors}
            trend={
              stats.comparison?.visitors
            }
            icon={Users}
            delay={0.05}
          />

          <AnalyticsStatCard
            title="Visits"
            value={stats.visits}
            trend={stats.comparison?.visits}
            icon={MousePointerClick}
            delay={0.1}
          />

          <AnalyticsStatCard
            title="Bounces"
            value={stats.bounces}
            trend={
              stats.comparison?.bounces
            }
            icon={CornerDownLeft}
            delay={0.15}
          />

          <AnalyticsStatCard
            title="Avg. Time"
            value={stats.totaltime}
            trend={
              stats.comparison?.totaltime
            }
            icon={Clock3}
            formatter={formatDuration}
            delay={0.2}
          />
        </div>
      )}

      {/* Traffic Overview */}
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
      >
        <Card
          className="
            overflow-hidden rounded-3xl border-border/50
            bg-background/70 backdrop-blur-xl
          "
        >
          <CardHeader
            className="
              flex flex-col gap-4
              border-b border-border/50
              sm:flex-row sm:items-center sm:justify-between
            "
          >
            <div className="space-y-3">
              <div>
                <CardTitle className="text-2xl">
                  Traffic Overview
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  Pageviews and session activity
                  over time.
                </p>
              </div>

              {/* Live Pills */}
              <div className="flex flex-wrap gap-2">
                <div
                  className="
                    inline-flex items-center gap-2 rounded-full
                    border border-border/50
                    bg-muted/40 px-3 py-1 text-sm
                  "
                >
                  {/* <div className="h-2 w-2 rounded-full bg-primary" /> */}
                  <div className="h-2 w-2 rounded-full bg-purple-500" />

                  <span>
                    {stats?.pageviews ?? 0} Pageviews
                  </span>
                </div>

                <div
                  className="
                    inline-flex items-center gap-2 rounded-full
                    border border-border/50
                    bg-muted/40 px-3 py-1 text-sm
                  "
                >
                  {/* <div className="h-2 w-2 rounded-full bg-primary/60" /> */}
                  <div className="h-2 w-2 rounded-full bg-blue-500" />

                  <span>
                    {stats?.visits ?? 0} Sessions
                  </span>
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div className="flex gap-2">
              <Button
                variant={
                  mode === "both"
                    ? "default"
                    : "outline"
                }
                onClick={() => setMode("both")}
                className="rounded-xl"
              >
                Both
              </Button>

              <Button
                variant={
                  mode === "pageviews"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setMode("pageviews")
                }
                className="rounded-xl"
              >
                Pageviews
              </Button>

              <Button
                variant={
                  mode === "sessions"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  setMode("sessions")
                }
                className="rounded-xl"
              >
                Sessions
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="min-h-95 w-full">
              <ResponsiveContainer
                width="100%"
                // height="100%"
                height={300}
              >
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="pageviewsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        // stopColor="hsl(var(--primary))"
                        stopColor="#3B82F6"
                        // stopOpacity={0.35}
                        stopOpacity={0.45}
                      />

                      <stop
                        offset="95%"
                        // stopColor="hsl(var(--primary))"
                        stopColor="#3B82F6"
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient
                      id="sessionsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        // stopColor="hsl(var(--muted-foreground))"
                        stopColor="#A855F7"
                        // stopOpacity={0.25}
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        // stopColor="hsl(var(--muted-foreground))"
                        stopColor="#A855F7"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />

                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                    }}
                    allowDecimals={false}
                  />

                  <Tooltip
                    content={<ChartTooltip />}
                  />

                  {(mode === "both" ||
                    mode === "pageviews") && (
                    <Area
                      type="monotone"
                      dataKey="pageviews"
                      // stroke="hsl(var(--primary))"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fill="url(#pageviewsGradient)"
                      animationDuration={1200}
                    />
                  )}

                  {(mode === "both" ||
                    mode === "sessions") && (
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      // stroke="hsl(var(--muted-foreground))"
                      stroke="#A855F7"
                      strokeWidth={3}
                      fill="url(#sessionsGradient)"
                      animationDuration={1200}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>


      {/* {data?.countries && (
        <CountriesAnalytics data={data.countries} />
      )} */}
    </div>
  );
}