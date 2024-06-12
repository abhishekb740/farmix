"use client"

import Image from 'next/image';
import { usePrivy } from "@privy-io/react-auth";

export default function Navbar() {
    const { user, login, logout, ready, authenticated } = usePrivy();
    const disableLogin = !ready || (ready && authenticated);

    return (
        <div className='flex flex-row h-[5rem] items-center justify-between px-16 border-b-[1px] border-b-[#3fc9f3]'>
            <div className='flex flex-row gap-2'>
                {/* <Image src='/TrustifyLogo.png' width={20} height={20} alt="Trustify Logo" /> */}
                <div className='text-2xl'>Farmix</div>
            </div>
            <div className='flex flex-row gap-4'>
                {/* <button className='border shadow-[0_0_5px_#3fc9f3] rounded-md py-1 px-3'>BSC</button> */}
                <button onClick={login} disabled={disableLogin} className='bg-[#3fc9f3] shadow-[0_0_5px_#B2F1A8] text-black rounded-md py-1 px-3'>{authenticated ? `${user?.farcaster?.username}` : `Login`}</button>
            </div>
        </div>
    )
}