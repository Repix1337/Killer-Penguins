import Image from "next/image";
import GameMap from "./GameMap";
import Menu from "./Menu";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <GameMap/>
      <Menu/>
    </div>
  );
}
