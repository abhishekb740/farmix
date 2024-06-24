"use client";

import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from "@privy-io/react-auth";
import { useSimilarity } from "@/contexts/similarityContext";

interface Following {
  username: string;
  profileImage?: string;
  profileDisplayName?: string;
}

function ResultsComponent() {
  const router = useRouter();
  const { user, login, logout, ready, authenticated } = usePrivy();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { similarityData } = useSimilarity();

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  }

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
                  onClick={handleLogout}
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
          <div className="overflow-y-auto scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg">
            {similarityData?.commonFollowers?.length ?? 0 > 0 ? (
              similarityData?.commonFollowers.map((following: Following, index) => (
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
            <div className='flex text-3xl'>
              {`${similarityData?.primaryUsername} 🔎 ${similarityData?.secondaryUsername}`}
            </div>
            <div className="text-2xl font-semibold text-center">
              Similarity Score: {similarityData?.similarityScore.toFixed(2)}%
            </div>
            <button className="text-xl text-[purple] px-4 py-1 rounded w-1/2" onClick={() => {
              window.open(
                `https://warpcast.com/~/compose?text=%F0%9F%8C%90%20My%20Digital%20Twin%20on%20Warpcast!%20%F0%9F%9A%80%0A%0ADiscovered%20something%20amazing!%20By%20comparing%20our%20owned%20tokens%20and%20NFTs,%20I%20have%20a%20similarity%20score%20of%20${similarityData?.similarityScore.toFixed(2)}%25%20with%20@${similarityData?.secondaryUsername}%20%0A%0AWant%20to%20find%20your%20own%20digital%20twin%20and%20see%20how%20similar%20you%20are%20with%20other%20users?%20Join%20Farmix%20now%20and%20explore%20the%20exciting%20world%20of%20digital%20assets!%0A%0Ahttps%3A%2F%2Ffarmix-web3bytes.vercel.app`,
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
                {similarityData?.commonTokens.length ?? 0 > 0 ? (
                  similarityData?.commonTokens.map((token, index) => (
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
                {similarityData?.commonNFTs?.length ?? 0 > 0 ? (
                  similarityData?.commonNFTs.map((nft, index) => (
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
