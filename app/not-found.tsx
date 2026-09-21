import Link from "next/link";
import { RiArrowLeftLine, RiSearchLine } from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl text-center">
        {/* Error Icon */}
        <MdErrorOutline className="mx-auto mb-5 h-20 w-20 sm:mb-6 sm:h-24 sm:w-24 md:h-28 md:w-28" />

        {/* 404 */}
        <div className="mb-4 select-none text-7xl font-black leading-none text-[#E85129] sm:text-8xl md:text-9xl">
          404
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
          Page not found
        </h1>

        {/* Description */}
        <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
          The page you are looking for does not exist or may have been moved.
          Try heading back to the homepage or browsing our articles.
        </p>

        {/* Links */}
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted hover:shadow-sm sm:px-6"
          >
            <RiArrowLeftLine className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
            Login page
          </Link>

          <Link
            href="/blogs"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium transition-all duration-200 hover:bg-muted hover:shadow-sm sm:px-6"
          >
            <RiSearchLine className="h-5 w-5" />
              Browse blogs
          </Link>
        </div>
      </div>
    </div>
  );
}




// import Link from "next/link";
// import { RiArrowLeftLine, RiSearchLine } from "react-icons/ri";
// import { MdErrorOutline } from "react-icons/md";
// // import { Button } from "@/components/ui/button";

// export default function NotFound() {
//   return (
//     <div className="container mx-auto px-4 max-w-2xl py-32 text-center">
//       {/* <div className="text-8xl font-black text-muted/30 mb-6 select-none"> */}
//       <div className="text-8xl font-black text-[#E85129] mb-6 select-none">
//         404
//       </div>
//       <h1 className="text-3xl font-bold tracking-tight mb-4">
//         Page not found
//       </h1>
//       <p className="text-muted-foreground mb-8 leading-relaxed">
//         The page you are looking for does not exist or may have been moved. Try heading back to the homepage or browsing our articles.
//       </p>
//       <div className="flex flex-col sm:flex-row gap-3 justify-center">
//         <Link href="/">
//           {/* <Button className="rounded-full gap-2 px-6"> */}
//             <RiArrowLeftLine className="h-4 w-4" />
//             Go home
//           {/* </Button> */}
//         </Link>
//         <Link href="/blog">
//           {/* <Button variant="outline" className="rounded-full gap-2 px-6"> */}
//             <RiSearchLine className="h-4 w-4" />
//             <p>
//              Browse articles
//             </p>
//           {/* </Button> */}
//         </Link>
//       </div>
//     </div>
//   );
// }
