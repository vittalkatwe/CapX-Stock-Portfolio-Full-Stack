import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { Stock } from '../../types/stock';

interface RecentActivityProps {
  // No longer need to pass stocks prop since we're fetching them
}

export function RecentActivity() {
  const [stocks, setStocks] = useState<Stock[]>([]);

  useEffect(() => {
    // Fetch stock data from the API
    const fetchStocks = async () => {
      try {
        const response = await fetch('http://localhost:8080/stocks');
        const data = await response.json();
        setStocks(data); // Set the fetched stocks into the state
      } catch (error) {
        console.error("Error fetching stocks:", error);
      }
    };

    fetchStocks();
  }, []); // Empty dependency array to run only once when component mounts

  // Function to format the last_updated field
  const formatLastUpdated = (lastUpdated: string): string => {
    const date = new Date(lastUpdated);
    // Check if the date is invalid
    if (isNaN(date.getTime())) {
      return ''; // Fallback if the date format is invalid
    }
    return date.toLocaleString(); // Return formatted date and time
  };

  // Map through the stocks to calculate gain/loss and format the time
  const activities = stocks.map(stock => {
    const gainLoss = ((stock.currentPrice - stock.buyPrice) / stock.buyPrice) * 100;

    // Format the last_updated field from the stock data
    const lastUpdatedFormatted = formatLastUpdated(stock.last_updated);

    return {
      stock,
      gainLoss,
      isPositive: gainLoss >= 0,
      lastUpdated: lastUpdatedFormatted // Store the formatted date and time
    };
  }).sort((a, b) => Math.abs(b.gainLoss) - Math.abs(a.gainLoss));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">Today</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.slice(0, 5).map(({ stock, gainLoss, isPositive, lastUpdated }) => (
          <div key={stock.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
                {isPositive ? (
                  <TrendingUp className={`h-4 w-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                ) : (
                  <TrendingDown className={`h-4 w-4 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                )}
              </div>
              <div>
                <p className="font-medium">{stock.name}</p>
                <p className="text-sm text-gray-500">{stock.ticker}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{gainLoss.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-500">{lastUpdated}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
