import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, BarChart3, PieChart, Activity } from 'lucide-react';
import { MetricCard } from './dashboard/MetricCard';
import { PerformanceChart } from './dashboard/PerformanceChart';
import { TopPerformers } from './dashboard/TopPerformers';
import { RecentActivity } from './dashboard/RecentActivity';
import { calculatePortfolioMetrics } from '../utils/portfolioCalculations';
import { motion } from 'framer-motion';

interface Stock {
  id: string;
  name: string;
  ticker: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  last_updated: string; // Added to match API response
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function Dashboard() {
  const [fetchedStocks, setFetchedStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>(''); // State for last updated time
  const [currentTime, setCurrentTime] = useState<string>('');
  console.log('Dashboard Rendering');

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://capx-stock-portfolio-backend.onrender.com/stocks');
        if (!response.ok) {
          throw new Error('Failed to fetch stocks');
        }
        const data = await response.json();
        setFetchedStocks(data);

        // Extract the latest 'last_updated' time from stocks
        if (data.length > 0) {
          const latestUpdate = data
            .map((stock: Stock) => new Date(stock.last_updated))
            .reduce((latest, current) => (current > latest ? current : latest), new Date(0));
          setLastUpdated(latestUpdate.toLocaleString());
        }

        setLoading(false);
      } catch (err) {
        setError('Error fetching stocks');
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Calculate portfolio metrics
  const { totalInvestment, currentValue, totalGain, percentageGain } =
    calculatePortfolioMetrics(fetchedStocks);

  // Group stocks by ticker and calculate total quantity
  const groupedStocks = fetchedStocks.reduce((acc, stock) => {
    if (!acc[stock.ticker]) {
      acc[stock.ticker] = { ...stock, totalQuantity: stock.quantity };
    } else {
      acc[stock.ticker].totalQuantity += stock.quantity;
    }
    return acc;
  }, {} as { [ticker: string]: Stock & { totalQuantity: number } });

  // Find the best performer
  const bestPerformer = Object.values(groupedStocks).reduce((best, stock) => {
    const currentProfit = (stock.currentPrice - stock.buyPrice) * stock.totalQuantity;
    if (!best || currentProfit > (best.currentPrice - best.buyPrice) * best.totalQuantity) {
      return stock;
    }
    return best;
  }, null as (Stock & { totalQuantity: number }) | null);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="max-w-[1400px] mx-auto px-4 py-6 space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Portfolio Overview</h1>
          <p className="text-gray-600">Track and analyze your investments</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">
              Last updated: {currentTime || 'Loading...'}
            </span>
          </div>
        </div>
      </div>

      {/* Loading or error states */}
      {loading ? (
        <div className="text-center py-20">Loading stocks...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Investment"
              value={`$${totalInvestment.toFixed(2)}`}
              icon={<DollarSign className="h-6 w-6 text-blue-600" />}
              subtitle="Capital invested"
            />
            <MetricCard
              title="Current Value"
              value={`$${currentValue.toFixed(2)}`}
              icon={<BarChart3 className="h-6 w-6 text-emerald-600" />}
              color="emerald"
              subtitle="Market value"
            />
            <MetricCard
              title="Total Gain/Loss"
              value={`$${Math.abs(totalGain).toFixed(2)}`}
              icon={<TrendingUp className="h-6 w-6 text-violet-600" />}
              color="violet"
              trend={{
                value: `${totalGain >= 0 ? '+' : '-'}${Math.abs(percentageGain).toFixed(2)}%`,
                isPositive: totalGain >= 0,
              }}
              subtitle="Overall return"
            />
            <MetricCard
              title="Portfolio Size"
              value={`${fetchedStocks.length} Stocks`}
              icon={<PieChart className="h-6 w-6 text-indigo-600" />}
              color="indigo"
              subtitle="Total holdings"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PerformanceChart stocks={fetchedStocks} />
              <RecentActivity stocks={fetchedStocks} />
            </div>
            <div className="space-y-6">
              <TopPerformers stocks={fetchedStocks} />
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Best Performer</span>
                    <span className="font-semibold">
                      {bestPerformer ? bestPerformer.ticker : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Return</span>
                    <span className="font-semibold">
                      {bestPerformer
                        ? (
                            ((bestPerformer.currentPrice - bestPerformer.buyPrice) /
                              bestPerformer.buyPrice) *
                            100
                          ).toFixed(2)
                        : 'N/A'}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Holdings</span>
                    <span className="font-semibold">
                      {bestPerformer?.totalQuantity || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Stocks</span>
                    <span className="font-semibold">{fetchedStocks.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
