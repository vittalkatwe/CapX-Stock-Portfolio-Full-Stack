import React from 'react';
import { Stock } from '../../types/stock';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TopPerformersProps {
  stocks: Stock[];
}

export function TopPerformers({ stocks }: TopPerformersProps) {
  const sortedStocks = [...stocks].sort((a, b) => {
    const aReturn = ((a.currentPrice - a.buyPrice) / a.buyPrice) * 100;
    const bReturn = ((b.currentPrice - b.buyPrice) / b.buyPrice) * 100;
    return bReturn - aReturn;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Top Performers</h3>
      <div className="space-y-4">
        {sortedStocks.slice(0, 3).map(stock => {
          const returnPercentage = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;
          const isPositive = returnPercentage >= 0;

          return (
            <div key={stock.id} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{stock.name}</h4>
                <p className="text-sm text-gray-500">{stock.ticker}</p>
              </div>
              <div className={`flex items-center space-x-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-medium">{returnPercentage.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}