import React, { useRef } from 'react';
import { TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react';
import { Stock } from '../../types/stock';

interface StockCardProps {
  stock: Stock;
  onEdit: (stock: Stock) => void;
  onDelete: (stockId: string) => void;
}

export function StockCard({ stock, onEdit, onDelete }: StockCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Safely parse values to numbers
  const buyPrice = parseFloat(stock.buyPrice as unknown as string) || 0;
  const currentPrice = parseFloat(stock.currentPrice as unknown as string) || 0;
  const quantity = parseFloat(stock.quantity as unknown as string) || 0;

  // Calculate gains/losses
  const gainLoss = (currentPrice - buyPrice) * quantity;
  const gainLossPercentage = buyPrice > 0 ? ((currentPrice - buyPrice) / buyPrice) * 100 : 0;
  const isPositive = gainLoss >= 0;

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{stock.name}</h3>
          <p className="text-sm font-medium text-blue-600">{stock.ticker}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(stock)}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(stock.id)}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stock Details Section */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Quantity</p>
          <p className="text-xl font-bold gradient-text">{quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Buy Price</p>
          <p className="text-xl font-bold gradient-text">${buyPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Current Price</p>
          <p className="text-xl font-bold gradient-text">${currentPrice.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-xl font-bold gradient-text">
            ${(quantity * currentPrice).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Gains/Losses Section */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span className={`font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            ${Math.abs(gainLoss).toFixed(2)}
          </span>
        </div>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {gainLossPercentage > 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
