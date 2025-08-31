export interface Provider {
  id: string;
  name: string;
  logoUrl: string;
  iconUrl: string;
  url: string;
}

export interface ConvertedLink {
  id: string;
  url: string;
  provider_id: string;
  provider_name: string;
  provider_logo?: string;
}

export interface ConversionResult {
  id: string;
  source_url: string;
  links: ConvertedLink[];
}

export interface HistoryItem extends ConversionResult {
  timestamp: string;
}
