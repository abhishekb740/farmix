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

interface SocialProfile {
  profileDisplayName: string;
  profileImage: string;
}

interface ProfileDetails {
  profileDisplayName: string;
  username: string;
  profileImage: string;
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

// Fetch profile details using username.
const getProfileDetails = async (username: string): Promise<SocialProfile | null> => {
  const query = `query {
    Socials(input: { filter: { dappName: { _eq: farcaster }, profileName: { _eq: "${username}" } }, blockchain: ethereum }) {
      Social {
        profileDisplayName
        profileImage
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

  return data.Socials.Social[0] || null;
};

// Get profile details for all followings of a given address.
const getFollowingsProfileDetails = async (address: string): Promise<ProfileDetails[]> => {
  const followings = await getUserFollowingsForAddress(address);

  const profiles = await Promise.all(
    followings.map(async (following) => {
      const username = following.followingAddress.socials[0]?.profileName;
      if (username) {
        const profileDetails = await getProfileDetails(username);
        return {
          username,
          profileDetails
        };
      }
      return null;
    })
  );

  return profiles.filter(profile => profile !== null).map(profile => ({
    profileDisplayName: profile?.profileDetails?.profileDisplayName,
    username: profile?.username,
    profileImage: profile?.profileDetails?.profileImage
  })) as ProfileDetails[];
};

// Fetch all NFTs for a given address.
const getAllNFTsForAddress = async (address: string, client: CovalentClient): Promise<NFTData[]> => {
  const resp = await client.NftService.getNftsForAddress("base-mainnet", address, { withUncached: true });
  return resp.data?.items || [];
};

// Fetch all tokens for a given address.
const getAllTokensForAddress = async (address: string, client: CovalentClient): Promise<TokenData[]> => {
  const resp = await client.BalanceService.getTokenBalancesForWalletAddress("base-mainnet", address);
  return resp.data?.items || [];
};

// Calculate similarity between two arrays as a percentage and collect common elements.
const calculateArraySimilarity = (array1: any[], array2: any[]): { similarity: number, common: any[] } => {
  if (!array1.length || !array2.length) return { similarity: 0, common: [] }; // Return 0 if either array is empty
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const intersectionArray = Array.from(intersection);
  return {
    similarity: (intersectionArray.length / Math.max(set1.size, set2.size)) * 100,
    common: intersectionArray
  };
};

// Calculate similarity between two arrays of objects as a percentage and collect common elements.
const calculateObjectArraySimilarity = (array1: any[], array2: any[], key: string): { similarity: number, common: any[] } => {
  if (!array1.length || !array2.length) return { similarity: 0, common: [] }; // Return 0 if either array is empty

  const map1 = new Map(array1.map(item => [item[key], item]));
  const map2 = new Map(array2.map(item => [item[key], item]));

  const commonKeys = [...map1.keys()].filter(key => map2.has(key));
  const common = commonKeys.map(key => map1.get(key));

  return {
    similarity: (commonKeys.length / Math.max(array1.length, array2.length)) * 100,
    common: common
  };
};

// Main function to calculate similarity between two users and collect common data.
export const calculateSimilarity = async (primaryUsername: string, secondaryUsername: string): Promise<any> => {
  const primaryAddress = await getUserAddressFromFCUsername(primaryUsername);
  const secondaryAddress = await getUserAddressFromFCUsername(secondaryUsername);
  console.log(primaryAddress, secondaryAddress);
  if (!primaryAddress || !secondaryAddress) {
    console.error('One or both usernames did not resolve to addresses.');
    return 0;
  }

  const client = new CovalentClient(`${process.env.COVALENT_API_KEY}`);
  console.log(client)
  const primaryNftData = await getAllNFTsForAddress(primaryAddress, client);
  const secondaryNftData = await getAllNFTsForAddress(secondaryAddress, client);

  console.log(primaryNftData, secondaryNftData);

  const primaryTokenData = await getAllTokensForAddress(primaryAddress, client);
  const secondaryTokenData = await getAllTokensForAddress(secondaryAddress, client);

  console.log(primaryTokenData, secondaryTokenData);
  
  const primaryFollowingData = await getFollowingsProfileDetails(primaryAddress);
  const secondaryFollowingData = await getFollowingsProfileDetails(secondaryAddress);

  console.log(primaryFollowingData, secondaryFollowingData);
  
  const primaryNfts = primaryNftData.length ? primaryNftData.map(item => item.nft_data?.[0]?.external_data?.image).filter(image => image) : [];
  const secondaryNfts = secondaryNftData.length ? secondaryNftData.map(item => item.nft_data?.[0]?.external_data?.image).filter(image => image) : [];

  console.log(primaryNfts, secondaryNfts);
  

  const primaryTokens = primaryTokenData.length ? primaryTokenData.map(item => item.contract_ticker_symbol) : [];
  const secondaryTokens = secondaryTokenData.length ? secondaryTokenData.map(item => item.contract_ticker_symbol) : [];

  console.log(primaryTokens, secondaryTokens);

  const nftSimilarityResult = calculateArraySimilarity(primaryNfts, secondaryNfts);
  const tokenSimilarityResult = calculateArraySimilarity(primaryTokens, secondaryTokens);
  const followingSimilarityResult = calculateObjectArraySimilarity(primaryFollowingData, secondaryFollowingData, 'username');

  const validSimilarities = [nftSimilarityResult.similarity, tokenSimilarityResult.similarity, followingSimilarityResult.similarity].filter(similarity => similarity > 0);
  const similarityScore = validSimilarities.length ? validSimilarities.reduce((a, b) => a + b) / validSimilarities.length : 0;

  return {
    similarityScore,
    commonNFTs: nftSimilarityResult.common,
    commonTokens: tokenSimilarityResult.common,
    commonFollowers: followingSimilarityResult.common,
  };
};
