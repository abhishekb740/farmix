"use client";

import { calculateSimilarity } from "@/app/_actions/queries";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button, Tooltip } from "@nextui-org/react";

export default function Hero() {
  const [username, setUsername] = useState("");
  const { ready, authenticated, user } = usePrivy();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableSearching = !ready || (ready && authenticated);

  const getFCUserData = async () => {
    const secondaryUsername = username;
    if (user && user.farcaster && user.farcaster.username) {
      const primaryUsername = user.farcaster.username;
      await calculateSimilarity(primaryUsername, secondaryUsername);
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