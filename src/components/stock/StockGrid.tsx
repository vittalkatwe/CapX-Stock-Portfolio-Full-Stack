import React from 'react';
import { Stock } from '../../types/stock';
import { StockCard } from './StockCard';

interface StockGridProps {
  stocks: Stock[];
  onEdit: (stock: Stock) => void;
  onDelete: (stockId: string) => void;
}

export function StockGrid({ stocks, onEdit, onDelete }: StockGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stocks.map((stock) => (
        <StockCard
          key={stock.id}
          stock={stock}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}