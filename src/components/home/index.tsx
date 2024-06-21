"use client"; 
 
import { calculateSimilarity } from "@/app/_actions/queries"; 
import { IoIosSearch } from "react-icons/io"; 
import { useState } from "react"; 
import { usePrivy } from "@privy-io/react-auth"; 
import { Button, Tooltip } from "@nextui-org/react"; 
import { useRouter } from "next/navigation"; 
import { json } from "stream/consumers"; 
 
export default function Hero() { 
  const [username, setUsername] = useState(""); 
  const { ready, authenticated, user } = usePrivy(); 
  const [loading, setLoading] = useState(false); 
  const router = useRouter(); 
  const disableSearching = !ready || (ready && authenticated); 
 
  const getFCUserData = async () => { 
    const secondaryUsername = username; 
    if (user && user.farcaster && user.farcaster.username) { 
      setLoading(true);
      const primaryUsername = user.farcaster.username; 
      const resp = await fetch("https://farmix-apiserver-env.eba-3g3jxf3i.ap-south-1.elasticbeanstalk.com/calculateSimilarity", { 
        method: "POST", 
        body: JSON.stringify({ 
          primaryUsername: primaryUsername, 
          secondaryUsername: secondaryUsername, 
        }), 
        headers: { 
          "Content-Type": "application/json" 
        } 
      }); 
 
      if (!resp.ok) { 
        throw new Error(`Error: ${resp.status} ${resp.statusText}`); 
      } 
      console.log("Similarity data:", resp); 
 
      const data = await resp.json(); 
      console.log(data);
      setLoading(false);
      router.push( 
        `/results?similarityScore=${ 
          data.similarityScore 
        }&commonNFTs=${encodeURIComponent( 
          JSON.stringify(data.commonNFTs) 
        )}&commonTokens=${encodeURIComponent( 
          JSON.stringify(data.commonTokens) 
        )}&commonFollowers=${encodeURIComponent( 
          JSON.stringify(data.commonFollowers) 
        )}&primaryUsername=${primaryUsername}&secondaryUsername=${secondaryUsername}` 
      );
    } else { 
      alert("You must be logged in to perform this action."); 
    } 
  }; 
 
  return ( 
    <main className="flex flex-col justify-center items-center pt-20"> 
      {loading && ( 
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"> 
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div> 
        </div> 
      )} 
      <div className="text-4xl">Welcome to Farmix</div> 
      <div className="w-full flex flex-row justify-center items-center mt-20"> 
        <div className="flex flex-row w-1/2 rounded-3xl py-1 px-5 items-center justify-center bg-white border shadow-[0_0_20px_#3fc9f3]"> 
          <input 
            className="flex ml-4 w-full py-1.5 bg-transparent focus:outline-none text-black" 
            placeholder="Search farcaster username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          /> 
          <Tooltip 
            content="Login first" 
            isDisabled={disableSearching} 
            offset={15} 
            color="secondary" 
          > 
            <Button 
              isIconOnly 
              variant="faded" 
              aria-label="Search username" 
              onPress={getFCUserData} 
              isDisabled={!disableSearching} 
            > 
              <IoIosSearch size={25} className="text-neutral-400" /> 
            </Button> 
          </Tooltip> 
        </div> 
      </div> 
    </main> 
  ); 
}
