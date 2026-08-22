"use client"


// Context 
import { useUser } from "@/context/User.context";

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  // CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  // type ChartConfig,
} from "@/components/ui/chart"




export const description = "A pie chart with a label"


const genderColors: Record<string, string> = {
  male: "#3B82F6",
  female: "#EC4899",
  other: "#A855F7",
};

export function DonutChart() {

      // User Context
      const {  analytics, } = useUser();

      const chartData = (analytics?.authorsByGender ?? []).map(
        ({ name, value }) => ({
          gender: name,
          authors: value,
          fill: genderColors[name] ?? "#6B7280",
        })
      );

      console.log("This is the chartData map Donut: ", chartData);


  return (
    <Card className="flex flex-col bg-[#E85129]">

      <CardHeader className="items-center pb-0 ">
        <CardTitle className="text-white">Authors by gender</CardTitle>
          {/* <CardDescription className="text-white">
            Total Authors {chartData.reduce((total, item) => total + item.authors, 0)}
          </CardDescription> */}
      </CardHeader>



       <CardContent className="flex-1 pb-0">
        <ChartContainer config={{}} className="mx-auto aspect-square max-h-62.5 [&_.recharts-pie-label-text]:fill-white">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="authors"
              nameKey="gender"
              innerRadius={55}
              outerRadius={90}
              // label={({ name, value }) => `${name}: ${value}`}
              label={({ value }) => value}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>


      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-white">
          Total Authors {chartData.reduce((total, item) => total + item.authors, 0)}
        </div>
      </CardFooter>


    </Card>
  )
}
