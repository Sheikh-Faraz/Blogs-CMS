// import Image from "next/image";

export default function Home() {
  return (
    <div className="mt-20">

      <div className="bg-black text-white p-10">black</div>
      <div className="bg-blue-500 text-black p-10">blue</div>
      <div className="bg-[red] text-black p-10">arbitrary</div>
      <div className="bg-[#ff0000] text-black p-10">hex</div>
    </div>

  );
}
