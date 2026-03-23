export interface Prize {
  id: string;
  name: string;
  weight: number;
  color: string;
  textColor: string;
}

export interface HistoryItem {
  id: string;
  prizeName: string;
  timestamp: number;
}
