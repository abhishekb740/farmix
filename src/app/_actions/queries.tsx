"use server"

import { CovalentClient } from "@covalenthq/client-sdk";

export const getUserAddressFromFCUsername = async (username: string) => {
    const query = `query MyQuery {
    Socials(
        input: {
        filter: { dappName: { _eq: farcaster }, profileName: { _eq: "${username}" } }
        blockchain: ethereum
        }
    ) {
        Social {
        connectedAddresses {
            address
            blockchain
            chainId
            timestamp
        }
        }
    }}`
    const response = await fetch("https://api.airstack.xyz/gql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: process.env.AIRSTACK_API_KEY!,
        },
        body: JSON.stringify({ query }),
    });
    const {data} = (await response.json());

    return data.Socials.Social[0].connectedAddresses[0].address;
}

export const getAllNFTsForAddress = async (address: string, client: CovalentClient) => {
    const resp = await client.NftService.getNftsForAddress("base-mainnet",`${address}`, {"withUncached": true});
    console.log(`Fetching NFT data for user`);
    return resp.data;
}

export const getAllTokensForAddress = async (address: string, client: CovalentClient) => {
    const resp = await client.BalanceService.getTokenBalancesForWalletAddress("base-mainnet",`${address}`);
    console.log(`Fetching token data for user`);
    return resp.data;
}

export const calculateSimilarity = async (primaryUsername: string, secondaryUsername: string) => {
    const primaryAddress = await getUserAddressFromFCUsername(primaryUsername);
    const secondaryAddress = await getUserAddressFromFCUsername(secondaryUsername);

    const client = new CovalentClient(`${process.env.COVALENT_API_KEY}`);

    const primaryNftData = await getAllNFTsForAddress(primaryAddress, client);
    const secondaryNftData = await getAllNFTsForAddress(secondaryAddress, client);

    const primaryTokenData = await getAllTokensForAddress(primaryAddress, client);
    const secondaryTokenData = await getAllTokensForAddress(secondaryAddress, client);

    // if(primaryNftData.items.length > 0) {
    //     console.log(primaryNftData.items[0].nft_data);
    // }

    console.log(primaryTokenData);
}
