'use client';
import Menu from "./Menu";

export default function Home() {
  return (
    <div className="dark h-screen w-screen flex flex-col
     justify-center items-center p-14 overflow-hidden bg-black text-white"
     suppressHydrationWarning>
      <Menu/>
    </div>
  );
}