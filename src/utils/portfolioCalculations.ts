import { Stock } from '../types/stock';

interface PortfolioMetrics {
  totalInvestment: number;
  currentValue: number;
  totalGain: number;
  percentageGain: number;
}

export function calculatePortfolioMetrics(stocks: Stock[]): PortfolioMetrics {
  const totalInvestment = stocks.reduce((sum, stock) => sum + (stock.quantity * stock.buyPrice), 0);
  const currentValue = stocks.reduce((sum, stock) => sum + (stock.quantity * stock.currentPrice), 0);
  const totalGain = currentValue - totalInvestment;
  const percentageGain = totalInvestment > 0 ? ((currentValue - totalInvestment) / totalInvestment) * 100 : 0;

  return {
    totalInvestment,
    currentValue,
    totalGain,
    percentageGain
  };
}