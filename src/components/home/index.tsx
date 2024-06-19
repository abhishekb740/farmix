"use client";

import { calculateSimilarity } from "@/app/_actions/queries";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [username, setUsername] = useState("");
  const { ready, authenticated, user } = usePrivy();
  const router = useRouter();
  const disableSearching = !ready || (ready && authenticated);

  const getFCUserData = async () => {
    const secondaryUsername = username;
    if (user && user.farcaster && user.farcaster.username) {
      const primaryUsername = user.farcaster.username;
      const resp = await calculateSimilarity(primaryUsername, secondaryUsername);
      console.log("Similarity data:", resp);

      // Navigate to the results page with the data
      // router.push(
      //   `/results?similarityScore=${resp.similarityScore}&commonNFTs=${encodeURIComponent(
      //     JSON.stringify(resp.commonNFTs)
      //   )}&commonTokens=${encodeURIComponent(
      //     JSON.stringify(resp.commonTokens)
      //   )}&commonFollowers=${encodeURIComponent(
      //     JSON.stringify(resp.commonFollowers)
      //   )}&primaryUsername=${primaryUsername}&secondaryUsername=${secondaryUsername}`
      // );
    } else {
      console.error("User or user.farcaster is undefined");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center pt-20">
      <div className="text-4xl">Welcome to Farmix</div>
      <div className="w-full flex flex-row justify-center items-center mt-20">
        <div className="flex flex-row w-1/2 rounded-3xl py-1 px-5 items-center justify-center bg-white border shadow-[0_0_20px_#3fc9f3]">
          <input
            className="flex ml-4 w-full py-1.5 bg-transparent focus:outline-none text-black"
            placeholder="Search farcaster username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Tooltip content="Login first" isDisabled={disableSearching} offset={15} color="secondary">
            <Button
              isIconOnly
              variant="faded"
              aria-label="Take a photo"
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
