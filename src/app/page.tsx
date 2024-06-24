"use client"
import { Hero2 } from "@/components";
import { useState, useEffect } from "react";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const userAgent = typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    console.log(userAgent)
    const mobile = /Mobi|Android/i.test(userAgent);
    console.log(mobile);
    
    setIsMobile(mobile);
  }, []);

  return (
    <div>
      {
        isMobile ?
          <div className="flex flex-row justify-center items-center">
            <div className="text-2xl">
              Please open this website on a desktop.
            </div>
          </div> 
          : <Hero2 />
      }
    </div>
  );
}
