import Link from "next/link";
// import { RiArrowLeftLine, RiSearchLine } from "react-icons/ri";
// import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 max-w-2xl py-32 text-center">
      <div className="text-8xl font-black text-muted/30 mb-6 select-none">
        404
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Page not found
      </h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        The page you are looking for does not exist or may have been moved. Try heading back to the homepage or browsing our articles.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          {/* <Button className="rounded-full gap-2 px-6"> */}
            {/* <RiArrowLeftLine className="h-4 w-4" /> */}
            Go home
          {/* </Button> */}
        </Link>
        <Link href="/blog">
          {/* <Button variant="outline" className="rounded-full gap-2 px-6"> */}
            {/* <RiSearchLine className="h-4 w-4" /> */}
            <p>
             Browse articles
            </p>
          {/* </Button> */}
        </Link>
      </div>
    </div>
  );
}
