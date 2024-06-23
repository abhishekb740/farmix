"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from "@privy-io/react-auth";

interface Following {
  username: string;
  profileImage?: string;
  profileDisplayName?: string;
}

function ResultsComponent() {
  const router = useRouter();
  const { user, login, logout, ready, authenticated } = usePrivy();
  const searchParams = useSearchParams();
  const [similarityScore, setSimilarityScore] = useState(0);
  const [commonNFTs, setCommonNFTs] = useState([]);
  const [commonTokens, setCommonTokens] = useState([]);
  const [commonFollowers, setCommonFollowers] = useState([]);
  const [primaryUsername, setPrimaryUsername] = useState("");
  const [secondaryUsername, setSecondaryUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

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

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const handlelogout = () => {
    setShowDropdown(false);
    logout();
  }

  const dummyImage = 'https://via.placeholder.com/32';

  return (
    <main className="flex flex-col items-center min-h-screen p-4 gap-4 bg-black text-white font-sans">
      <div className="w-full">
        <div className="h-[1px] w-full bg-white border-white"></div>
        <div className="flex flex-row items-center justify-between py-6" style={{ fontFamily: "Satoshi" }}>
          <div className="text-md" style={{ letterSpacing: '8px' }}>ABOUT</div>
          <div className="text-6xl" style={{ fontFamily: 'Ares Broken VF Regular' }}>Farmix</div>
          <div className="relative text-2xl">
            <button
              onClick={authenticated ? toggleDropdown : login}
              className=' gap-2 rounded-md py-1 px-3 flex flex-row justify-center items-center hover:cursor-pointer'
            >
              {authenticated && (
                <div>
                  <img src={user?.farcaster?.pfp || ''} alt="Profile Picture" className='w-8 h-8 rounded-full' />
                </div>
              )}
              {authenticated ? `${user?.farcaster?.username || ''}` : `Login`}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={handlelogout}
                  className="flex flex-row items-center justify-start gap-4 w-full text-left px-4 py-1 rounded-md bg-white text-black hover:bg-gray-200"
                >
                  <img src="/logout.png" height={20} width={20} alt="logout logo" />
                  <div className="text-lg">
                    Logout
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-[1px] w-full bg-white border-white"></div>
      </div>
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
