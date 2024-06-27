"use client"
import { createContext, useContext, useState, ReactNode } from 'react';

interface ChannelImage {
  imageUrl: string;
}

interface Channel {
  id: string;
  channelName: string;
  channel?: ChannelImage;
}

interface SimilarityData {
  similarityScore: number;
  commonNFTs: string[];
  commonTokens: string[];
  commonFollowers: Following[];
  primaryUsername: string;
  secondaryUsername: string;
  commonChannels: Channel[];
}

interface Following {
  username: string;
  profileImage?: string;
  profileDisplayName?: string;
}

interface SimilarityContextType {
  similarityData: SimilarityData | null;
  setSimilarityData: (data: SimilarityData | null) => void;
}

const SimilarityContext = createContext<SimilarityContextType | undefined>(undefined);

export const SimilarityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [similarityData, setSimilarityData] = useState<SimilarityData | null>(null);

  return (
    <SimilarityContext.Provider value={{ similarityData, setSimilarityData }}>
      {children}
    </SimilarityContext.Provider>
  );
};

export const useSimilarity = () => {
  const context = useContext(SimilarityContext);
  if (!context) {
    throw new Error('useSimilarity must be used within a SimilarityProvider');
  }
  return context;
};
