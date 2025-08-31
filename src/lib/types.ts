export interface Provider {
  name: string;
  url: string;
  logoUrl: string;
  iconUrl: string;
}

export type ConvertedLinkType = 'song' | 'artist' | 'album' | '';

// This is the structure returned directly by the API for a single link
export interface ApiConvertedLink {
  provider: string; // The API returns the provider name as a string
  type: ConvertedLinkType;
  displayName: string;
  url: string;
  artwork: string;
}

// This is the structure of the full API response
export interface ApiConversionResult {
    results: ApiConvertedLink[];
}


// This is the structure our components use, with a nested Provider object
export interface ConvertedLink {
  provider: Provider;
  type: ConvertedLinkType;
  displayName: string;
  url: string;
  artwork: string;
}

// This is the main result structure used throughout the app
export interface ConversionResult {
  source_url: string;
  links: ConvertedLink[];
}

export interface HistoryItem extends ConversionResult {
  id: string;
  timestamp: string;
}