"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import EmptyStatImage from "@/public/blog-empty-state-img.png";

// Loading context
import { useGlobalLoading } from "@/context/Loading.context";

export default function EmptyBlogsState() {

    // Loading context 
    const { setIsLoading } = useGlobalLoading();

  return (
    <tr>
      <td colSpan={5} className="p-16 text-center">
        <div className="flex flex-col items-center justify-center">

          {/* Floating icon */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative"
          >


            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            //   className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-xl border border-red-600"
              className="w-25 h-25 rounded-full bg-muted flex items-center justify-center text-xl"
            >
              {/* 📝 */}
              {/* <Image src={EmptyStatImage} alt="No blogs" width={48} height={48} /> */}
              <Image src={EmptyStatImage} alt="No blogs" width={120} height={120} />
            </motion.div>



            {/* soft glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

          </motion.div>




          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg font-semibold"
          >
            No blog posts yet
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground max-w-sm mt-1"
          >
            Start writing your first article — your posts, drafts and ideas will show up here.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <Link href="/create-blog" onClick={()=>{setIsLoading(true)}}>
              <Button className="bg-[#E85129] text-white hover:text-[#E85129] p-4 hover:bg-muted">
                Create your first post
              </Button>
            </Link>
          </motion.div>

        </div>
      </td>
    </tr>
  );
}