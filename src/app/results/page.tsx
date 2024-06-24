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
    <main className="flex flex-col items-center max-h-screen p-2 gap-2 bg-black text-white font-sans">
      <div className="w-full">
        <div className="h-[1px] w-full bg-white border-white"></div>
        <div className="flex flex-row items-center justify-between py-2" style={{ fontFamily: "Satoshi" }}>
          <div className="text-md" style={{ letterSpacing: '8px' }}>ABOUT</div>
          <div className="text-6xl hover:cursor-pointer" style={{ fontFamily: 'Ares Broken VF Regular' }} onClick={() => router.push("/")}>Farmix</div>
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
      <div className="flex flex-col md:flex-row w-full h-full pt-4 gap-2">
        <div className="w-full md:w-1/3 mb-4 md:mb-0 flex flex-col rounded-md border border-white p-2">
          <h2 className="text-2xl mb-4 font-bold text-center pb-2">Shared Followings</h2>
          <div className="h-full overflow-y-auto scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg">
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
        <div className="w-full md:w-2/3 flex flex-col gap-2 h-full">
          <div className='flex flex-col items-center justify-center gap-4 border border-white rounded-md min-h-[15rem]'>
            <div className="text-2xl font-semibold text-center">
              Similarity Score: {similarityScore.toFixed(2)}%
            </div>
            <button className="text-xl text-[purple] px-4 py-1 rounded w-1/2" onClick={() => {
              window.open(
                `https://warpcast.com/~/compose?text=Check%20out%20the%20similarity%20analysis%20between%20@${primaryUsername}%20and%20$@{secondaryUsername}.%20Discover%20shared%20NFTs,%20tokens,%20and%20followers%20and%20see%20the%20similarity%20score%20of%20${similarityScore.toFixed(2)}%25.%20View%20the%20analysis%20here:%20${window.location.href}`,
                "_blank",
              );
            }}>
              Share on Warpcast?
            </button>
          </div>
          <div className="flex flex-col md:flex-row w-full space-y-6 md:space-y-0 md:space-x-6">
            <div className="w-full md:w-1/2 flex flex-col max-h-[calc(100vh-370px)] border border-white p-2 rounded-md">
              <h2 className="text-2xl mb-4 font-bold text-center pb-2">Shared Tokens</h2>
              <div className="h-full overflow-y-auto scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg flex-1">
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
            <div className="w-full md:w-1/2 flex flex-col max-h-[calc(100vh-370px)] border border-white p-2 rounded-md">
              <h2 className="text-2xl mb-4 font-bold text-center pb-2">Shared NFTs</h2>
              <div className="h-full overflow-y-auto scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg flex-1">
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
