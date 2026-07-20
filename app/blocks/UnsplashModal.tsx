"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UnsplashModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchImages = async (newPage = 1) => {
    setLoading(true);

    const endpoint = query
      ? `https://api.unsplash.com/search/photos?query=${query}&page=${newPage}&per_page=24&client_id=NKWTkj8rVIdI9CunHiq-eui8RJ9K-qynx5M8tOeNIyM`
      : `https://api.unsplash.com/photos?page=${newPage}&per_page=24&client_id=NKWTkj8rVIdI9CunHiq-eui8RJ9K-qynx5M8tOeNIyM`;

    const res = await fetch(endpoint);
    const data = await res.json();

    setImages(query ? data.results : data);
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      setPage(1);
      fetchImages(1);
    }
  }, [open]);

  const handleSearch = () => {
    setPage(1);
    fetchImages(1);
  };

  const nextPage = () => {
    const next = page + 1;
    setPage(next);
    fetchImages(next);
  };

  const prevPage = () => {
    if (page === 1) return;
    const prev = page - 1;
    setPage(prev);
    fetchImages(prev);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* <DialogContent className="w-screen! max-w-none! h-screen px-5 rounded-none m-0"> */}
      <DialogContent className="w-[calc(100%-2rem)] max-w-none! h-[calc(100%-3rem)] px-5 rounded-none m-0">
      {/* <DialogContent className="w-screen! max-w-none! h-screen p-0 m-0 rounded-none mx-5"> */}

        {/* HEADER */}


        <form
        onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            handleSearch();
        }}
        className="p-6 border-b flex gap-3 items-center"
        >
        <Input
            placeholder="Search images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11"
        />

        <Button type="submit" className="h-11">
            Search
        </Button>
        </form>

        {/* <div className="p-6 border-b flex gap-3 items-center">
          <Input
            placeholder="Search images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11"
          />
          <Button onClick={handleSearch} className="h-11">
            Search
          </Button>
        </div> */}

        {/* GRID */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">

            {loading
              ? Array.from({ length: 18 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-48 bg-muted animate-pulse rounded-xl"
                  />
                ))
              : images.map((img: any) => (
                  <img
                    key={img.id}
                    src={img.urls.small}
                    // className="w-full h-48 object-cover rounded-xl cursor-pointer hover:scale-[1.05] transition border border-red-600"
                    className="w-full h-full object-cover rounded-xl cursor-pointer hover:scale-[1.05] transition"
                    onClick={() => {
                      onSelect(img.urls.full);
                      onClose();
                    }}
                  />
                ))}
          </div>

        </div>

        {/* FOOTER */}
        <div className="p-6 border-t flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevPage}
            disabled={page === 1 || loading}
          >
            ← Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {page}
          </span>

          <Button onClick={nextPage} disabled={loading}>
            Next →
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}