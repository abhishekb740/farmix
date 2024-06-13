"use server"

export const getUserData = async (username: string) => {
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

    const {data} = (await response.json()) as {
        data: {
            Socials: {
                Social: {
                    connectedAddresses: {
                        address: string;
                        blockchain: string;
                        chainId: string;
                        timestamp: string;
                    }[];
                };
            }[];
        }
    }

    console.log(data);

    return data;
}