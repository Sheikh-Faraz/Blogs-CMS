"use client";

import { useState ,useEffect } from "react";

// import { motion } from "framer-motion";

// Context 
import { useUser } from "@/context/User.context";


import { Card, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


// STATS  ------------------------------------------------------------
// import { FaUser as User } from "react-icons/fa";
// import { RiBookShelfLine as Blogs } from "react-icons/ri";
// import { TiTickOutline as Published } from "react-icons/ti";
// import { CiRead as Read } from "react-icons/ci";


// const stats = [
//   {
//     label: "Team Members",
//     value: 10,
//     icon: User,
//     color: "from-blue-500/20 via-blue-400/10 to-transparent",
//     glow: "hover:shadow-blue-500/20",
//   },
//   {
//     label: "All Blogs",
//     value: 10,
//     icon: Blogs,
//     color: "from-zinc-500/20 via-zinc-400/10 to-transparent",
//     glow: "hover:shadow-zinc-500/20",
//   },
//   {
//     label: "Published Blogs",
//     value: 10,
//     icon: Published,
//     color: "from-black/20 via-zinc-700/10 to-transparent",
//     glow: "hover:shadow-black/20",
//   },
//   {
//     label: "Users Read",
//     value: 10,
//     icon: Read,
//     color: "from-sky-500/20 via-blue-400/10 to-transparent",
//     glow: "hover:shadow-sky-500/20",
//   },
// ];

type ChartPeriod = "12 months" | "30 days" | "7 days";

const chartData = [
  { month: "Jan", value: 5 },
  { month: "Feb", value: 7 },
  { month: "Mar", value: 6 },
  { month: "Apr", value: 8 },
  { month: "May", value: 7 },
  { month: "Jun", value: 9 },
  { month: "Jul", value: 18 },
  { month: "Aug", value: 10 },
  { month: "Sep", value: 13 },
  { month: "Oct", value: 8 },
  { month: "Nov", value: 7 },
  { month: "Dec", value: 6 },
];


// ─── Custom chart tooltip ─────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold">{label}</p>
      <p>{payload[0].value} reviews</p>
    </div>
  );
}


export default function Stats() {

    // User Context
    const { fetchUser, 
      // authUser, 
      // members 
    } = useUser();

    const [activePeriod, setActivePeriod] = useState<ChartPeriod>("12 months");
    

    useEffect(() => {
        fetchUser();
    }, [])

  return (

      <div className="flex-1 min-w-0 space-y-4">


        {/* STATS SECTION — 2 cols on small, 4 cols when there's enough room */}
        {/* <div className="flex gap-3 my-6">

            {stats.map(({ icon: Icon, label, value, color, glow }) => (
  <motion.div
    key={label}
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 260, damping: 18 }}
    className="relative w-full"
  >
    Glow background layer
    <div
      className={[
        "absolute inset-0 rounded-xl opacity-0 blur-xl transition-all duration-300",
        "group-hover:opacity-100",
        glow,
      ].join(" ")}
    />

    <Card
      className={[
        "relative overflow-hidden rounded-xl w-full",
        "bg-background/60 backdrop-blur-md",
        "transition-all duration-300",
        "hover:shadow-lg",
        "group",
      ].join(" ")}
    >
      animated gradient overlay
      <div
        className={[
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          `bg-linear-to-br ${color}`,
        ].join(" ")}
      />

      <CardContent className="relative p-4">
        <motion.div
          whileHover={{ rotate: 6, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="mb-2 text-muted-foreground group-hover:text-foreground"
        >
          <Icon size={18} />
        </motion.div>

        <p className="text-xs text-muted-foreground mb-1 group-hover:text-muted-foreground/80">
          {label}
        </p>

        <p className="text-xl font-bold tracking-tight group-hover:scale-105 transition-transform">
          {value}
        </p>
      </CardContent>
    </Card>
  </motion.div>
))}
        </div> */}




                {/* Profile value chart */}
                <Card className="rounded-xl border shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h2 className="text-sm font-semibold">Profile value</h2>
                      <div className="flex items-center gap-1 bg-muted rounded-full p-0.5">
                        {(["12 months", "30 days", "7 days"] as ChartPeriod[]).map((period) => (
                          <button
                            key={period}
                            onClick={() => setActivePeriod(period)}
                            className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all ${
                              activePeriod === period
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        {/* <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}> */}
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor="#D4A849" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#D4A849" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                          {/* <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} /> */}
                          <XAxis dataKey="month" tick={{ fontSize: 10, fill: "white" }} axisLine={false} tickLine={false} />
                          {/* <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} /> */}
                          <YAxis tick={{ fontSize: 10, fill: "white" }} axisLine={false} tickLine={false} domain={[0, 25]} ticks={[0, 5, 10, 15, 20, 25]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="value" stroke="#D4A849" strokeWidth={2.5} fill="url(#profileGradient)" dot={false} activeDot={{ r: 5, fill: "#D4A849", stroke: "hsl(var(--background))", strokeWidth: 2 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

    </div>

  );
}
