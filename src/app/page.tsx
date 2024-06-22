import { Hero, Navbar } from "@/components";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="relative">
      <div
        className="relative bg-cover bg-center min-h-[88vh]"
        style={{
          backgroundImage: "url('/blue-background.png')",
        }}
      >
        <Hero />
      </div>
    </div>
  );
}
