import { Hero, Navbar } from "@/components";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
    </div>
  );
}
