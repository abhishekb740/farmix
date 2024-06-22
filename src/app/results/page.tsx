"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Following {
  username: string;
  profileImage?: string;
  profileDisplayName?: string;
}

function ResultsComponent() {
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
    <main className="flex flex-col items-center min-h-screen p-4 gap-4 bg-black text-white font-sans">
      <h1 className="text-3xl mb-6 font-extrabold text-center">
        Similarity Analysis: {primaryUsername} 🔍 {secondaryUsername}
      </h1>
      <div className="text-2xl mb-8 font-semibold">Similarity Score: {similarityScore.toFixed(2)}%</div>
      <div className="w-full flex flex-col md:flex-row justify-around space-x-0 md:space-x-6 border border-gray-700 rounded-md p-4 bg-gray-900 bg-opacity-50 shadow-lg">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <h2 className="text-2xl mb-4 font-bold text-center border-b border-gray-700 pb-2">Shared NFTs</h2>
          <div className="h-[21rem] scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg">
            {commonNFTs.length > 0 ? (
              commonNFTs.map((nft, index) => (
                <div key={index} className="mb-4 p-2 border-b border-gray-600">
                  <div className="text-center mb-2">NFT {index + 1}</div>
                  {nft ? (
                    <img src={nft} alt={`NFT ${index + 1}`} className="w-full h-24 object-contain mb-2 rounded-md shadow-md" />
                  ) : (
                    <div className="text-center">Image not available</div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center">No Shared NFTs Found</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <h2 className="text-2xl mb-4 font-bold text-center border-b border-gray-700 pb-2">Shared Tokens</h2>
          <div className="h-[21rem] scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg">
            {commonTokens.length > 0 ? (
              commonTokens.map((token, index) => (
                <div key={index} className="mb-2 flex flex-row gap-2 items-center border p-4 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors shadow-md">
                  <div className="bg-gradient-to-b from-violet-500 to-blue-600 w-8 h-8 rounded-full shadow-lg"></div>
                  <div className="text-lg font-medium">{token}</div>
                </div>
              ))
            ) : (
              <p className="text-center">No Common Tokens Found</p>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3">
          <h2 className="text-2xl mb-4 font-bold text-center border-b border-gray-700 pb-2">Shared Followings</h2>
          <div className="h-[21rem] scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg">
            {commonFollowers.length > 0 ? (
              commonFollowers.map((following: Following, index) => (
                <a
                  key={index}
                  href={`https://warpcast.com/${following.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 flex items-center space-x-2 border border-neutral-300 rounded-md p-4 hover:bg-gray-700 transition-colors shadow-md"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={following.profileImage || '/warpcast.svg'}
                    onError={(e) => e.currentTarget.src = '/warpcast.svg'}
                    alt={following?.profileDisplayName}
                    className="w-8 h-8 rounded-full shadow-md"
                  />
                  <div className="text-lg font-medium">{following.profileDisplayName}</div>
                </a>
              ))
            ) : (
              <p className="text-center">No Shared Followers Found</p>
            )}
          </div>
        </div>
      </div>
      <button className="lg:absolute lg:top-24 lg:right-8 text-xl text-[purple] px-4 py-1 rounded" onClick={() => {
        window.open(
          `https://warpcast.com/~/compose?text=Check%20out%20the%20similarity%20analysis%20between%20@${primaryUsername}%20and%20$@{secondaryUsername}.%20Discover%20shared%20NFTs,%20tokens,%20and%20followers%20and%20see%20the%20similarity%20score%20of%20${similarityScore.toFixed(2)}%25.%20View%20the%20analysis%20here:%20${window.location.href}`,
          "_blank",
        );
      }}>
        Share on Warpcast?
      </button>
    </main>
  );
}

export default function Results() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsComponent />
    </Suspense>
  );
}
