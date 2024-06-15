"use server";

import { CovalentClient } from "@covalenthq/client-sdk";

// Define TypeScript interfaces for the expected data structures.
interface Social {
  connectedAddresses: {
    address: string;
    blockchain: string;
    chainId: string;
    timestamp: string;
  }[];
}

interface FollowingAddress {
  socials: {
    profileName: string;
    dappName: string;
  }[];
}

interface Following {
  followingAddress: FollowingAddress;
}

interface NFTData {
  nft_data?: {
    external_data?: {
      image?: string;
    };
  }[];
}

interface TokenData {
  contract_ticker_symbol: string;
}

// Fetch user address from username using Farcaster.
const getUserAddressFromFCUsername = async (username: string): Promise<string | null> => {
  const query = `query {
    Socials(input: { filter: { dappName: { _eq: farcaster }, profileName: { _eq: "${username}" } }, blockchain: ethereum }) {
      Social {
        connectedAddresses {
          address
          blockchain
          chainId
          timestamp
        }
      }
    }
  }`;

  const response = await fetch("https://api.airstack.xyz/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AIRSTACK_API_KEY!,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  if (data.Socials && data.Socials.Social.length > 0 && data.Socials.Social[0].connectedAddresses.length > 0) {
    return data.Socials.Social[0].connectedAddresses[0].address;
  }
  return null;
};

// Fetch the list of followings for a given user address.
const getUserFollowingsForAddress = async (address: string): Promise<Following[]> => {
  const query = `query {
    Farcaster: SocialFollowings(input: { filter: { identity: { _in: ["${address}"] }, dappName: { _eq: farcaster } }, blockchain: ALL }) {
      Following {
        followingAddress {
          socials(input: { filter: { dappName: { _eq: farcaster } } }) {
            profileName
            dappName
          }
        }
      }
    }
  }`;

  const response = await fetch("https://api.airstack.xyz/gql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.AIRSTACK_API_KEY!,
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();
  return data.Farcaster.Following || [];
};

// Fetch all NFTs for a given address.
const getAllNFTsForAddress = async (address: string, client: CovalentClient): Promise<NFTData[]> => {
  const resp = await client.NftService.getNftsForAddress("base-mainnet", address, { withUncached: true });
  console.log(`Fetching NFT data for user`);
  return resp.data?.items || [];
};

// Fetch all tokens for a given address.
const getAllTokensForAddress = async (address: string, client: CovalentClient): Promise<TokenData[]> => {
  const resp = await client.BalanceService.getTokenBalancesForWalletAddress("base-mainnet", address);
  console.log(`Fetching token data for user`);
  return resp.data?.items || [];
};

// Calculate similarity between two arrays as a percentage.
const calculateArraySimilarity = (array1: any[], array2: any[]): number => {
  if (!array1.length || !array2.length) return 0; // Return 0 if either array is empty
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  return (intersection.size / Math.max(set1.size, set2.size)) * 100;
};

// Main function to calculate similarity between two users.
export const calculateSimilarity = async (primaryUsername: string, secondaryUsername: string): Promise<number> => {
  const primaryAddress = await getUserAddressFromFCUsername(primaryUsername);
  const secondaryAddress = await getUserAddressFromFCUsername(secondaryUsername);

  if (!primaryAddress || !secondaryAddress) {
    console.error('One or both usernames did not resolve to addresses.');
    return 0;
  }

  const client = new CovalentClient(`${process.env.COVALENT_API_KEY}`);

  const primaryNftData = await getAllNFTsForAddress(primaryAddress, client);
  const secondaryNftData = await getAllNFTsForAddress(secondaryAddress, client);

  const primaryTokenData = await getAllTokensForAddress(primaryAddress, client);
  const secondaryTokenData = await getAllTokensForAddress(secondaryAddress, client);

  const primaryFollowingData = await getUserFollowingsForAddress(primaryAddress);
  const secondaryFollowingData = await getUserFollowingsForAddress(secondaryAddress);

  const primaryNfts = primaryNftData.length ? primaryNftData.map(item => item.nft_data?.[0]?.external_data?.image).filter(image => image) : [];
  const secondaryNfts = secondaryNftData.length ? secondaryNftData.map(item => item.nft_data?.[0]?.external_data?.image).filter(image => image) : [];

  const primaryTokens = primaryTokenData.length ? primaryTokenData.map(item => item.contract_ticker_symbol) : [];
  const secondaryTokens = secondaryTokenData.length ? secondaryTokenData.map(item => item.contract_ticker_symbol) : [];

  const primaryFollowings = primaryFollowingData.length ? primaryFollowingData.map(following => following.followingAddress.socials[0]?.profileName) : [];
  const secondaryFollowings = secondaryFollowingData.length ? secondaryFollowingData.map(following => following.followingAddress.socials[0]?.profileName) : [];

  const nftSimilarity = calculateArraySimilarity(primaryNfts, secondaryNfts);
  console.log(`NFT similarity: ${nftSimilarity}`);

  const tokenSimilarity = calculateArraySimilarity(primaryTokens, secondaryTokens);
  console.log(`Token similarity: ${tokenSimilarity}`);

  const followingSimilarity = calculateArraySimilarity(primaryFollowings, secondaryFollowings);
  console.log(`Following similarity: ${followingSimilarity}`);

  const validSimilarities = [nftSimilarity, tokenSimilarity, followingSimilarity].filter(similarity => similarity > 0);
  const similarityScore = validSimilarities.length ? validSimilarities.reduce((a, b) => a + b) / validSimilarities.length : 0;

  console.log(`Similarity score: ${similarityScore}`);
  return similarityScore;
};
