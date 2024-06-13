"use client"

import { IoIosSearch } from "react-icons/io";

export default function Hero() {
    return (
        <main className="flex flex-col justify-center items-center pt-20">
            <div className="text-4xl">
                Welcome to Farmix
            </div>
            <div className="w-full flex flex-row justify-center items-center mt-20">
                <div className="flex flex-row w-1/2 rounded-3xl py-1 px-5 items-center justify-center bg-white border shadow-[0_0_20px_#3fc9f3]">
                    <input
                        className="flex ml-4 w-full py-1.5 bg-transparent focus:outline-none text-black"
                        placeholder="Search farcaster username"
                    />
                    <IoIosSearch size={25} className="text-neutral-400" />
                </div>
            </div>
        </main>
    )
}