"use client"

// import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import { useUser } from "@/context/User.context"

import {
  Card,
  CardContent,
  CardFooter,
//   CardDescription,
//   CardHeader,
//   CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A mixed bar chart"

const chartConfig = {
  authors: {
    label: "Authors",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function HorizontalBarChart() {
  const { analytics } = useUser()

  const chartData = (analytics?.authorsByLocation ?? []).map(({ name, value }) => ({
    country: name || "Not specified",
    authors: value,
    fill: "var(--color-authors)",
  }))

  return (
    <Card className="bg-[#E85129] text-white">
      
      
      {/* <CardHeader>
        <CardTitle>Authors by location</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader> */}
      
      
      <CardContent className="text-white">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 5,
            }}
            >
            <YAxis
              className="border border-white text-white"
              dataKey="country"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#FFFFFF" }}
              tickFormatter={(value) => value}
            />
            <XAxis dataKey="authors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="authors" radius={5} fill="var(--color-authors)" />
          </BarChart>
        </ChartContainer>
      </CardContent>


      <CardFooter className="flex-col items-center gap-2 text-sm">
        {/* <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div> */}
        <div className="leading-none text-white">
          Authors by location
        </div>
      </CardFooter>

    </Card>
  )
}
