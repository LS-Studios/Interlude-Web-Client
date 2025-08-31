export interface Provider {
  name: string;
  url: string;
  logoUrl: string;
  iconUrl: string;
}

export type ConvertedLinkType = 'song' | 'artist' | 'album';

export interface ConvertedLink {
  provider: Provider;
  type: ConvertedLinkType;
  displayName: string;
  url: string;
  artwork: string;
}

export interface ConversionResult {
  source_url: string;
  links: ConvertedLink[];
}

export interface HistoryItem extends ConversionResult {
  id: string;
  timestamp: string;
}
