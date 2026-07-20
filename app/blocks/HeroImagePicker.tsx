// "use client";

// import { useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import UnsplashModal from "./UnsplashModal";

// import { Camera } from 'lucide-react';
// import { MdDevices as DeviceIcon } from "react-icons/md";
// import { FaUnsplash as UnsplashIcon } from "react-icons/fa";
// import { CiCircleRemove as RemoveIcon } from "react-icons/ci";



// export default function HeroImagePicker({
//   image,
//   setImage,
// }: {
//   image: string;
//   setImage: (url: string) => void;
// }) {
//   // const [enabled, setEnabled] = useState(false);
//   const [openUnsplash, setOpenUnsplash] = useState(false);

//   const fileRef = useRef<HTMLInputElement | null>(null);

//   const handleUploadClick = () => {
//     fileRef.current?.click();
//   };

//   const handleUpload = (e: any) => {
//     const file = e.target.files[0];
//     if (!file) return;


//   const url = URL.createObjectURL(file);
//     setImage(url);
//   };

//   return (
//     <div className="space-y-4">

//       {/* TOGGLE */}
  

//       <div className="flex gap-3 border p-4">

//             {/* FIXED UPLOAD */}
//             <Button
//               type="button"
//               className="flex-1 rounded-none"
//               variant="secondary"
//               onClick={handleUploadClick}
//             >

//               {/* Upload from device */}
//               <DeviceIcon className="text-[#E85129] size-4" />
//               <p>
//                 {image ? "Change Image" : "Upload from device"}
//               </p>
//             </Button>

//             <input
//               ref={fileRef}
//               type="file"
//               onChange={handleUpload}
//               className="hidden"
//             />

//             {/* UNSPLASH */}
//             <Button
//               type="button"
//               className="flex-1 rounded-none"
//               variant="outline"
//               onClick={() => setOpenUnsplash(true)}
//             >
//               {/* Browse Unsplash */}
//               <UnsplashIcon className="text-[#E85129] size-4"/>
//               <p>
//                 {image ? "Replace with Unsplash" : "Browse Unsplash"}
//               </p>
//             </Button>


//         {/* ✅ REMOVE BUTTON (ONLY WHEN IMAGE EXISTS) */}
//         {image && (
//           <Button
//             type="button"
//             className="flex-1 rounded-none"
//             variant="destructive"
//             onClick={() => {
//               setImage("");
//               if (fileRef.current) fileRef.current.value = "";
//             }}
//           >
//             <RemoveIcon className="size-4"/>
//             <p>
//               Remove Image
//             </p>
//           </Button>
//         )}
      
//       </div>

//       {/* {enabled && ( */}
//         <>
//           {/* PREVIEW */}
//           {/* <div className="w-full h-56 border rounded-xl overflow-hidden bg-muted flex items-center justify-center"> */}
//           <div className="w-full h-full border rounded-xl overflow-hidden bg-muted flex items-center justify-center">
//             {image ? (
//               <img
//                 src={image}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <span className="text-sm h-80 justify-center items-center text-center text-muted-foreground flex flex-col gap-3">
//                 <span className="bg-card p-4 rounded-full">
//                   <Camera className="text-[#E85129]"/>
//                 </span>  
//                 No image selected
//               </span>
//             )}
//           </div>
//         </>

//       {/* MODAL */}
//       <UnsplashModal
//         open={openUnsplash}
//         onClose={() => setOpenUnsplash(false)}
//         onSelect={(url) => setImage(url)}
//       />
//     </div>
//   );
// }



"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import UnsplashModal from "./UnsplashModal";

import { Camera } from "lucide-react";
import { MdDevices as DeviceIcon } from "react-icons/md";
import { FaUnsplash as UnsplashIcon } from "react-icons/fa";
import { CiCircleRemove as RemoveIcon } from "react-icons/ci";

export default function HeroImagePicker({
  image,
  setImage,
}: {
  image: string;
  setImage: (
    data: {
      file: File | null;
      preview: string;
    }
  ) => void;
}) {
  const [openUnsplash, setOpenUnsplash] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileRef.current?.click();
  };

  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setImage({
      file,
      preview,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 border p-4">

        {/* Upload from device */}
        <Button
          type="button"
          className="flex-1 rounded-none"
          variant="secondary"
          onClick={handleUploadClick}
        >
          <DeviceIcon className="text-[#E85129] size-4" />

          <p>
            {image
              ? "Change Image"
              : "Upload from device"}
          </p>
        </Button>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

        {/* Unsplash */}
        <Button
          type="button"
          className="flex-1 rounded-none"
          variant="outline"
          onClick={() => setOpenUnsplash(true)}
        >
          <UnsplashIcon className="text-[#E85129] size-4" />

          <p>
            {image
              ? "Replace with Unsplash"
              : "Browse Unsplash"}
          </p>
        </Button>

        {/* Remove */}
        {image && (
          <Button
            type="button"
            className="flex-1 rounded-none"
            variant="destructive"
            onClick={() => {
              setImage({
                file: null,
                preview: "",
              });

              if (fileRef.current)
                fileRef.current.value = "";
            }}
          >
            <RemoveIcon className="size-4" />

            <p>Remove Image</p>
          </Button>
        )}
      </div>

      {/* Preview */}

      <>
           <div className="w-full h-full border rounded-xl overflow-hidden bg-muted flex items-center justify-center">
             {image ? (
               <img
                 src={image}
                 className="w-full h-full object-cover"
               />
             ) : (
               <span className="text-sm h-80 justify-center items-center text-center text-muted-foreground flex flex-col gap-3">
                 <span className="bg-card p-4 rounded-full">
                   <Camera className="text-[#E85129]"/>
                 </span>  
                 No image selected
               </span>
             )}
           </div>
         </>


      {/* <div className="w-full h-full border rounded-xl overflow-hidden bg-muted flex items-center justify-center">
        {image ? (
          <img
            src={image}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-sm h-56 text-muted-foreground flex flex-col items-center gap-3">
            <span className="bg-card p-4 rounded-full">
              <Camera className="text-[#E85129" />
            </span>

            No image selected
          </span>
        )}
      </div> */}

      {/* Unsplash Modal */}
      <UnsplashModal
        open={openUnsplash}
        onClose={() => setOpenUnsplash(false)}
        onSelect={(url) => {
          setImage({
            file: null,
            preview: url,
          });
        }}
      />
    </div>
  );
}