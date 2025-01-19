import React from 'react';
import { TrendingUp, DollarSign, BarChart3, PieChart } from 'lucide-react';
import { useStockManagement } from '../../hooks/useStockManagement';
import { MetricCard } from './MetricCard';
import { calculatePortfolioMetrics } from '../../utils/portfolioCalculations';
import { useGSAPAnimations } from '../../hooks/useGSAPAnimations';

export function Dashboard() {
  const { stocks } = useStockManagement();
  const { totalInvestment, currentValue, totalGain, percentageGain } = calculatePortfolioMetrics(stocks);
  const { metricsRef } = useGSAPAnimations();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div ref={metricsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Investment"
          value={`$${totalInvestment.toFixed(2)}`}
          icon={<DollarSign className="h-8 w-8 text-blue-600" />}
        />
        <MetricCard
          title="Current Value"
          value={`$${currentValue.toFixed(2)}`}
          icon={<BarChart3 className="h-8 w-8 text-blue-600" />}
        />
        <MetricCard
          title="Total Gain/Loss"
          value={`$${Math.abs(totalGain).toFixed(2)}`}
          icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
          trend={{
            value: `${totalGain >= 0 ? '+' : '-'}${Math.abs(percentageGain).toFixed(2)}%`,
            isPositive: totalGain >= 0
          }}
        />
        <MetricCard
          title="Portfolio Distribution"
          value={`${stocks.length} Stocks`}
          icon={<PieChart className="h-8 w-8 text-blue-600" />}
        />
      </div>
    </div>
  );
}