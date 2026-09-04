"use client";

import { LuLoaderCircle } from "react-icons/lu";

type LoaderIconProps = {
  color?: string;
  size?: string;
};

export default function LoaderIcon ({color = "#E85129", size = "text-3xl"}: LoaderIconProps) {
  return (
    <>
      <LuLoaderCircle 
        className={`animate-spin w-full text-${color} text-${size}`}
      />
    </>
  )
}