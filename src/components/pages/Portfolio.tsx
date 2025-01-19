import React, { useRef, useEffect } from 'react';
import { useStockManagement } from '../../hooks/useStockManagement';
import { StockCard } from '../stock/StockCard';
import { PlusCircle } from 'lucide-react';
import gsap from 'gsap';

export function Portfolio() {
  const {
    stocks,
    fetchStocks,
    setEditingStock,
    setShowForm,
    handleDeleteStock,
    isLoading,
    error,
  } = useStockManagement();

  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStocks(); // Fetch stocks on mount
  }, [fetchStocks]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: -50, duration: 0.8, ease: 'power3.out' });
      if (stocks.length > 0) {
        gsap.from(gridRef.current?.children || [], { y: 50, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
      }
    });
    return () => ctx.revert();
  }, [stocks]);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4">
      <div ref={headerRef} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Your Portfolio</h1>
          <p className="text-gray-600 mt-2">Track and manage your investments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Add Stock</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20">Loading stocks...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : stocks.length === 0 ? (
        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">No stocks in your portfolio yet</h2>
          <p className="text-gray-500 mb-8">Start building your portfolio by adding your first stock</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Add Your First Stock
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onEdit={(stock) => setEditingStock(stock)} // Open edit form
              onDelete={handleDeleteStock} // Delete stock
            />
          ))}
        </div>
      )}
    </div>
  );
}
