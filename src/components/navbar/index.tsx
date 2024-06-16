"use client"

import { Button } from "@nextui-org/react";
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
                <Button onClick={login} disabled={disableLogin} className='bg-[#3fc9f3] shadow-[0_0_5px_#B2F1A8] text-black rounded-md py-1 px-3 flex flex-row justify-center items-center'>
                    {authenticated &&
                        <div>
                            <img src={user?.farcaster?.pfp} alt="Profile Picture" className='w-8 h-8 rounded-full' />
                        </div>
                    }
                    {authenticated ? `${user?.farcaster?.username}` : `Login`}
                </Button>
            </div>
        </div>
    )
}