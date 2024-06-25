"use client";

import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button, Tooltip } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Notification } from "@/components";
import { useSimilarity } from "@/contexts/similarityContext";

export default function Hero() {
  const [username, setUsername] = useState("");
  const { ready, authenticated, user } = usePrivy();
  const { setSimilarityData } = useSimilarity();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const disableSearching = !ready || (ready && authenticated);

  const getFCUserData = async (): Promise<void> => {
    if (!username) {
      setShowNotification(true);
      return;
    }
    const secondaryUsername = username;
    if (user && user.farcaster && user.farcaster.username) {
      setLoading(true);
      const primaryUsername = user.farcaster.username;
      const resp = await fetch("https://farmix-server-production.up.railway.app/calculateSimilarity", {
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
      setSimilarityData({
        similarityScore: data.similarityScore,
        commonNFTs: data.commonNFTs,
        commonTokens: data.commonTokens,
        commonFollowers: data.commonFollowers,
        primaryUsername,
        secondaryUsername
      });

      router.push("/results");
    } else {
      <Notification
        message="You must be logged in to perform this action."
        show={true}
        onClose={() => setShowNotification(false)}
      />
    }
  };

  return (
    <main className="flex flex-col justify-center items-center min-h-screen w-full">
      <Notification
        message="Please enter a username to search."
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
      <div className="w-full flex flex-col justify-center items-center gap-12">
        <div className="text-7xl">
          Enter a <i className="font-thin">Farcaster</i> Username
        </div>
        <div className="w-full flex flex-row justify-center items-center">
          <div className="flex flex-row w-1/2 rounded-full py-1 px-5 items-center justify-center bg-white border shadow-[0_0_30px_#A675D8]">
            <input
              className="flex ml-4 w-full py-3 bg-transparent focus:outline-none text-black"
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
              >
                <IoIosSearch size={25} className="text-neutral-400" />
              </Button>
            </Tooltip>
          </div>
        </div>
        {loading && (
          <div className="flex bg-opacity-50 z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </main>
  );
}
