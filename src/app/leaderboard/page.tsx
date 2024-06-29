"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Notification } from "@/components";

export default function Leaderboard() {
    const router = useRouter();
    const [showNotification, setShowNotification] = useState(false);
    const [leaderboardData, setLeaderboardData] = useState<{ digital_twins: string[], similarity_score: number[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [modalData, setModalData] = useState<{ rank: number, username: string, similarityScore: number } | null>(null);
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
                const response = await fetch("http://localhost:8081/getUserLeaderboard", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username }),
                });

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

    if (loading) {
        return <div>Loading...</div>;
    }

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

    const handleMouseEnter = (rank: number, username: string, similarityScore: number) => {
        setModalData({ rank, username, similarityScore });
    };

    const handleMouseLeave = () => {
        setModalData(null);
    };

    return (
        <div className="min-h-screen w-full bg-[url('/Home2.png')] bg-cover bg-no-repeat bg-center flex flex-col items-center p-4">
            <div className="w-full">
                <div className="h-[1px] w-full bg-white border-white"></div>
                <div className="flex flex-row items-center justify-between py-4" style={{ fontFamily: "Satoshi" }}>
                    <div className="text-4xl hover:cursor-pointer pl-8" style={{ fontFamily: 'Ares Broken VF Regular' }} onClick={() => router.push("/")}>Farmix</div>
                    <div className="text-lg" style={{ letterSpacing: '4px' }}>Leaderboard</div>
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
            <div className="p-4 w-full mt-12">
                {leaderboardData ? (
                    <div className="flex flex-row justify-center gap-12">
                        {leaderboardData.digital_twins.slice(0, 5).map((twin, index) => (
                            <div
                                key={index}
                                className="bg-white bg-opacity-10 p-4 rounded-lg shadow-md backdrop-blur-sm cursor-pointer min-w-[10rem]"
                                onClick={() => handleMouseEnter(index + 1, twin, leaderboardData.similarity_score[index])}
                            >
                                <div className="text-xl font-bold">Rank {index + 1}</div>
                                <div className="text-lg">{twin}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-white">No data available</div>
                )}
            </div>
            {modalData && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-black relative">
                        <div className="absolute top-0 right-0 p-2 cursor-pointer" onClick={handleMouseLeave}>X</div>
                        <div className="text-xl font-bold mb-2">Rank {modalData.rank}</div>
                        <div className="text-lg">Username: {modalData.username}</div>
                        <div className="text-lg">Similarity Score: {modalData.similarityScore}</div>
                    </div>
                </div>
            )}
        </div>
    );
}
