export interface Provider {
  name: string;
  logoUrl: string;
  iconUrl: string;
  url: string;
}

export interface ConvertedLink {
  provider: Provider;
  url: string;
}

export interface ConversionResult {
  source_url: string;
  links: ConvertedLink[];
}

export interface HistoryItem extends ConversionResult {
  id: string;
  timestamp: string;
}
