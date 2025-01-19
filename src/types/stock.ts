export interface Stock {
  id: string;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number; // Added currentPrice
}

export interface StockFormData {
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number; // Added currentPrice
}
