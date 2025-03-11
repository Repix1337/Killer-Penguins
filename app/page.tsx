'use client';
import Menu from "./Menu";

export default function Home() {
  return (
    <div className="dark h-screen w-screen overflow-hidden flex flex-col
     justify-center items-center p-14 bg-black text-white"
     suppressHydrationWarning>
      <Menu/>
    </div>
  );
}