'use client';
import Menu from "./Menu";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col
     justify-center items-center p-10 overflow-hidden"
     suppressHydrationWarning>
      <Menu/>
    </div>
  );
}
