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
    <main className="flex flex-col items-center min-h-screen p-2 gap-2 bg-black text-white font-sans">
      <div className="w-full">
        <div className="h-[1px] w-full bg-white border-white"></div>
        <div className="flex flex-row items-center justify-between py-2" style={{ fontFamily: "Satoshi" }}>
          <div className="text-4xl hover:cursor-pointer pl-8" style={{ fontFamily: 'Ares Broken VF Regular' }} onClick={() => router.push("/")}>Farmix</div>
          <div className="text-md" style={{ letterSpacing: '4px' }}>DASHBOARD</div>
          <div className="relative text-xl">
            <button
              onClick={authenticated ? toggleDropdown : login}
              className='gap-2 rounded-md py-1 px-3 flex flex-row justify-center items-center hover:cursor-pointer'
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
      <div className="flex flex-col md:flex-row w-full h-full pt-2 gap-4">
        <div className="w-full justify-between md:w-1/3 mb-4 md:mb-0 flex flex-col rounded-3xl border border-white p-2">
          <div className="overflow-y-auto scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg gap-2">
            {similarityData?.commonFollowers?.length ?? 0 > 0 ? (
              similarityData?.commonFollowers.map((following: Following, index) => (
                <a
                  key={index}
                  href={`https://warpcast.com/${following.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 flex items-center justify-between space-x-2 bg-[#C3C1C1] rounded-full px-4 py-2 hover:bg-gray-700 transition-colors"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={following.profileImage || '/warpcast.svg'}
                    onError={(e) => e.currentTarget.src = '/warpcast.svg'}
                    alt={following?.profileDisplayName}
                    className="w-8 h-8 rounded-full shadow-md"
                  />
                  <div className="text-lg text-black font-normal">{following.profileDisplayName}</div>
                </a>
              ))
            ) : (
              <p className="text-center">No Shared Followers Found</p>
            )}
          </div>
          <h2 className="text-3xl font-bold text-center p-1"> <span className='text-[#C3C1C1] font-normal'> Shared </span> Followings</h2>
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-2 h-full  ">
          <div className="flex flex-col justify-between rounded-3xl border border-white min-h-[15rem] bg-[url('/result-image.png')] bg-no-repeat bg-cover gap-12">
            <div className='flex flex-row justify-end'>
              <div className='flex flex-row text-sm bg-gradient-to-r from-[#FC00FF] to-[#7087D8] text-white rounded-full px-3 py-2 items-center gap-1 justify-center mr-2 mt-2' onClick={() => {
                window.open(
                  `https://warpcast.com/~/compose?text=%F0%9F%8C%90%20My%20Digital%20Twin%20on%20Warpcast!%20%F0%9F%9A%80%0A%0ADiscovered%20something%20amazing!%20By%20comparing%20our%20owned%20tokens%20and%20NFTs,%20I%20have%20a%20similarity%20score%20of%20${similarityData?.similarityScore.toFixed(2)}%25%20with%20@${similarityData?.secondaryUsername}%20%0A%0AWant%20to%20find%20your%20own%20digital%20twin%20and%20see%20how%20similar%20you%20are%20with%20other%20users?%20Join%20Farmix%20now%20and%20explore%20the%20exciting%20world%20of%20digital%20assets!%0A%0Ahttps%3A%2F%2Ffarmix-web3bytes.vercel.app`,
                  "_blank",
                );
              }}>
                <div>
                  SHARE
                </div>
                <div>
                  <img src='/share.png' alt='share logo' height={13} width={13} />
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center gap-8">
              <div className='flex flex-col text-3xl'>
                You
                <div>
                  &
                </div>
                <div>
                  {similarityData?.secondaryUsername}
                </div>
              </div>
              <div className="flex flex-row text-7xl font-semibold text-center bg-gradient-to-b from-[#FC00FF] via-[#7E6EEE] to-[#00DBDE] text-transparent bg-clip-text items-end gap-1">
                {similarityData?.similarityScore.toFixed(2)}
                <div className='flex flex-col'>
                  <div className=''>
                    %
                  </div>
                </div>
                <div className='ml-4 text-2xl text-white'>
                  Similar
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full gap-4 mt-2">
            <div className="w-full md:w-1/2 flex flex-col min-h-[calc(100vh-350px)] max-h-[calc(100vh-350px)] border border-white p-2 rounded-3xl justify-center">
              <div className="h-full overflow-y-auto scroll-smooth scrollbar bg-gray-800 bg-opacity-30 p-4 rounded-lg flex-1">
                {similarityData?.commonTokens.length ?? 0 > 0 ? (
                  similarityData?.commonTokens.map((token, index) => (
                    <div key={index} className="mb-2 flex flex-row gap-2 items-center px-4 py-2 bg-[#C3C1C1] rounded-full hover:bg-gray-600 transition-colors shadow-md">
                      <div className="bg-gradient-to-b from-violet-500 to-blue-600 w-8 h-8 rounded-full shadow-lg"></div>
                      <div className="text-lg font-medium text-black">{token}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-center">No Common Tokens Found</p>
                )}
              </div>
              <h2 className="text-3xl font-bold text-center p-1"> <span className='text-[#C3C1C1] font-normal'> Shared </span> Tokens</h2>
            </div>
            <div className="w-full justify-between md:w-1/2 flex flex-col min-h-[calc(100vh-350px)] max-h-[calc(100vh-350px)] border border-white p-2 rounded-3xl">
              <div className="h-full overflow-y-auto scroll-smooth scrollbar bg-opacity-30 p-4 rounded-lg flex-1">
                {similarityData?.commonNFTs?.length ?? 0 > 0 ? (
                  similarityData?.commonNFTs.map((nft, index) => (
                    <div key={index} className="mb-4 p-2">
                      {nft ? (
                        <img src={nft === "https://data.debox.pro/nft/sbt/1.png" ? '/debox-nft.png' : nft} className="w-full bg-cover mb-2 rounded-md shadow-md" />
                      ) : (
                        <div className="text-center">Image not available</div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center">No Shared NFTs Found</p>
                )}
              </div>
              <h2 className="text-3xl font-bold text-center pb-1"> <span className='font-normal text-[#C3C1C1]'> Shared </span> NFTs</h2>
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
