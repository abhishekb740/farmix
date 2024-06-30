"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "react-farcaster-embed/dist/styles.css";
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import { Notification } from "@/components";

export default function Leaderboard() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<{
    digital_twins: string[];
    similarity_score: number[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [modalData, setModalData] = useState<{
    rank: number;
    username: string;
    similarityScore: number;
  } | null>(null);
  const { user, login, logout, ready, authenticated } = usePrivy();

  const showNotificationOnLeaderboard = () => {
    return (
      <Notification
        message="You need to be logged in to view this page"
        show={showNotification}
        onClose={() => setShowNotification(false)}
      />
    );
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!ready) return;
      if (!authenticated) {
        setShowNotification(true);
        setLoading(false);
        return;
      }
      try {
        const username = user?.farcaster?.username;
        const response = await fetch(
          "https://farmix-server-production.up.railway.app/getUserLeaderboard",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }),
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [ready, authenticated, user]);

  if (loading)
    return (
      <div className="flex bg-opacity-50 z-50 justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (showNotification) {
    return showNotificationOnLeaderboard();
  }

  const toggleDropdown = () => {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  const handleMouseEnter = (
    rank: number,
    username: string,
    similarityScore: number
  ) => {
    setModalData({ rank, username, similarityScore });
  };

  const handleMouseLeave = () => {
    setModalData(null);
  };

  const generateShareableLink = () => {
    if (!leaderboardData) return "";

    const size = leaderboardData.digital_twins.length;

    const twinLinks = leaderboardData.digital_twins
      .map(
        (twin, index) =>
          `%F0%9F%94%8A%20@${twin}%20-%20${leaderboardData.similarity_score[
            index
          ].toFixed(2)}%25`
      )
      .join("%0A");

    return `https://warpcast.com/~/compose?text=Hey,%20${
      size === 1 ? "here%20is" : "here's"
    }%20my%20top%20${size === 1 ? "" : size}%20digital%20${
      size === 1 ? "twin" : "twins"
    }%20on%20Farcaster!%0A%0A${twinLinks}%0A%0A%F0%9F%9A%80%20Discover%20your%20own%20digital%20twins%20with%20Farmix%20on%20Warpcast!%0A%0Ahttps%3A%2F%2Ffarmix.online`;
  };

  return (
    <div className="min-h-screen w-full bg-[url('/Home2.png')] bg-cover bg-no-repeat bg-center flex flex-col items-center p-4">
      <div className="w-full">
        <div className="h-[1px] w-full bg-white border-white"></div>
        <div
          className="flex flex-row items-center justify-between py-4"
          style={{ fontFamily: "Satoshi" }}
        >
          <div
            className="text-4xl hover:cursor-pointer pl-8"
            style={{ fontFamily: 'Ares' }}
            onClick={() => router.push("/")}
          >
            Farmix
          </div>
          <div className="text-lg" style={{ letterSpacing: "4px" }}>
            Leaderboard
          </div>
          <div className="relative text-xl">
            <button
              onClick={authenticated ? toggleDropdown : login}
              className="gap-2 rounded-md py-1 px-3 flex flex-row justify-center items-center hover:cursor-pointer"
            >
              {authenticated && (
                <div>
                  <img
                    src={user?.farcaster?.pfp || ""}
                    alt="Profile Picture"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}
              {authenticated ? `${user?.farcaster?.username || ""}` : `Login`}
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="flex flex-row items-center justify-start gap-4 w-full text-left px-4 py-1 rounded-md bg-white text-black hover:bg-gray-200"
                >
                  <img
                    src="/logout.png"
                    height={20}
                    width={20}
                    alt="logout logo"
                  />
                  <div className="text-lg">Logout</div>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-[1px] w-full bg-white border-white"></div>
      </div>
      <div className="p-4 w-full mt-12" style={{ fontFamily: "Satoshi" }}>
        {leaderboardData ? (
          <div className="flex flex-row justify-center gap-12">
            {leaderboardData.digital_twins.map((twin, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-10 p-4 rounded-lg shadow-md backdrop-blur-sm cursor-pointer min-w-[10rem] h-[10rem] flex flex-col justify-center items-center"
                onClick={() =>
                  handleMouseEnter(
                    index + 1,
                    twin,
                    leaderboardData.similarity_score[index]
                  )
                }
              >
                <div className="text-xl font-bold ">#{index + 1}</div>
                <div className="text-lg text-lavender">{twin}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-2xl text-white flex flex-col items-center gap-8">
            <div>No data available</div>
            <div>Please start by searching for a username on the Home Page</div>
          </div>
        )}
      </div>
      <div
        className="flex flex-row text-sm bg-gradient-to-r from-[#FC00FF] to-[#7087D8] text-white rounded-full px-6 py-2 items-center gap-3 justify-center mr-2 mt-4 hover:cursor-pointer transform transition duration-500 hover:scale-105 shadow-lg hover:shadow-xl"
        onClick={() => {
          window.open(generateShareableLink(), "_blank");
        }}
      >
        <div>SHARE</div>
        <div>
          <img src="/share.png" alt="share logo" height={13} width={13} />
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-lg shadow-lg max-w-xl mx-auto text-white mt-3 mb-1">
        <FarcasterEmbed url="https://warpcast.com/vaibhav0806/0x8b0c07d1" />
      </div>

      {modalData && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white p-8 rounded-lg shadow-lg text-black relative min-w-[20%] flex flex-col">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleMouseLeave}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="text-xl font-bold mb-4">Rank {modalData.rank}</div>
            <div className="text-lg font-medium mb-2">{modalData.username}</div>
            <div className="text-4xl font-bold bg-gradient-to-b from-[#FC00FF] via-[#7E6EEE] to-[#00DBDE] text-transparent bg-clip-text">
              {modalData.similarityScore}%
            </div>
            <div
              className="flex flex-row text-sm bg-gradient-to-r from-[#FC00FF] to-[#7087D8] text-white rounded-full px-3 py-2 items-center gap-1 justify-center mr-2 mt-4 hover:cursor-pointer"
              onClick={() => {
                window.open(
                  `https://warpcast.com/~/compose?text=%F0%9F%8C%90%20My%20Digital%20Twin%20on%20Warpcast!%20%F0%9F%9A%80%0A%0ADiscovered%20something%20amazing!%20By%20comparing%20our%20owned%20digital%20assets%20and%20mutual%20connections,%20I%20have%20a%20similarity%20score%20of%20${modalData.similarityScore.toFixed(
                    2
                  )}%25%20with%20@${
                    modalData.username
                  }%20%0A%0AWant%20to%20find%20your%20own%20digital%20twin%20and%20see%20how%20similar%20you%20are%20with%20other%20users?%20Join%20Farmix%20now%20and%20explore%20the%20exciting%20world%20of%20digital%20assets!%0A%0Ahttps%3A%2F%2Ffarmix.online`,
                  "_blank"
                );
              }}
            >
              <div>SHARE</div>
              <div>
                <img src="/share.png" alt="share logo" height={13} width={13} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
