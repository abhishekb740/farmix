"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter  } from "next/navigation";

export default function Results() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [similarityScore, setSimilarityScore] = useState(0);
  const [commonNFTs, setCommonNFTs] = useState([]);
  const [commonTokens, setCommonTokens] = useState([]);
  const [commonFollowers, setCommonFollowers] = useState([]);
  const [primaryUsername, setPrimaryUsername] = useState("");
  const [secondaryUsername, setSecondaryUsername] = useState("");

  useEffect(() => {
    const similarityScore = searchParams.get("similarityScore");
    const commonNFTs = searchParams.get("commonNFTs");
    const commonTokens = searchParams.get("commonTokens");
    const commonFollowers = searchParams.get("commonFollowers");
    const primaryUsername = searchParams.get("primaryUsername");
    const secondaryUsername = searchParams.get("secondaryUsername");

    if (similarityScore) {
      setSimilarityScore(Number(similarityScore));
      setCommonNFTs(JSON.parse(decodeURIComponent(commonNFTs || "[]")));
      setCommonTokens(JSON.parse(decodeURIComponent(commonTokens || "[]")));
      setCommonFollowers(JSON.parse(decodeURIComponent(commonFollowers || "[]")));
      setPrimaryUsername(primaryUsername || "");
      setSecondaryUsername(secondaryUsername || "");
    }
  }, [searchParams]);

  const dummyImage = 'https://via.placeholder.com/32';

  return (
    <main className="flex flex-col items-center min-h-screen p-4 gap-6">
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 bg-[#3fc9f3] text-black px-4 py-2 rounded"
      >
        Home
      </button>
      <h1 className="text-3xl mb-4">
        Similarity Results Between {primaryUsername} and {secondaryUsername}
      </h1>
      <div className="text-2xl mb-6">Similarity Score: {similarityScore.toFixed(2)}%</div>
      <div className="w-full flex flex-row justify-around space-x-4">
        <div className="w-1/3">
          <h2 className="text-2xl mb-2">Common NFTs</h2>
          <div className="h-96 overflow-y-auto bg-white bg-opacity-10 p-4 rounded-lg">
            {commonNFTs.length > 0 ? (
              commonNFTs.map((nft, index) => (
                <div key={index} className="mb-4 p-2 border-b border-gray-500">
                  <div className="text-center mb-2">NFT {index + 1}</div>
                  {nft ? (
                    <img src={nft} alt={`NFT ${index}`} className="w-full h-24 object-contain mb-2" />
                  ) : (
                    <div>Image not available</div>
                  )}
                </div>
              ))
            ) : (
              <p>No Common NFTs Found</p>
            )}
          </div>
        </div>
        <div className="w-1/3">
          <h2 className="text-2xl mb-2">Common Tokens</h2>
          <div className="h-96 overflow-y-auto bg-white bg-opacity-10 p-4 rounded-lg">
            {commonTokens.length > 0 ? (
              commonTokens.map((token, index) => (
                <div key={index} className="mb-2 flex items-center space-x-2">
                  <img
                    src={`https://api.iconify.design/cryptocurrency/${token.toLowerCase()}.svg`}
                    onError={(e) => e.currentTarget.src = dummyImage}
                    alt={token}
                    className="w-8 h-8"
                  />
                  <div>{token}</div>
                </div>
              ))
            ) : (
              <p>No Common Tokens Found</p>
            )}
          </div>
        </div>
        <div className="w-1/3">
          <h2 className="text-2xl mb-2">Common Following</h2>
          <div className="h-96 overflow-y-auto bg-white bg-opacity-10 p-4 rounded-lg">
            {commonFollowers.length > 0 ? (
              commonFollowers.map((follower, index) => (
                <a
                  key={index}
                  href={`https://warpcast.com/${follower}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-2 flex items-center space-x-2 border border-neutral-300 rounded-md p-4 hover:bg-gray-700"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img src="/warpcast.svg" height={25} width={25} alt="Warpcast" />
                  <div>{follower}</div>
                </a>
              ))
            ) : (
              <p>No Common Followers Found</p>
            )}
          </div>
        </div>
      </div>
      <div>
        Share it on Warpcast?
      </div>
    </main>
  );
}
