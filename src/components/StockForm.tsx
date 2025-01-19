import React, { useEffect, useState, useRef } from 'react';
import { StockFormData } from '../types/stock';

// Defines the response structure for stock data from Finnhub API
interface StockAPIResponse {
  name: string;
  currentPrice: number;
}

interface StockSearchAPIResponse {
  result: Array<{ symbol: string; description: string }>;
}

interface StockFormProps {
  onSubmit: (data: StockFormData) => void;
  initialData?: StockFormData;
  isEditing?: boolean;
  onStockAdded?: () => void;
}

export function StockForm({ onSubmit, initialData, isEditing = false }: StockFormProps) {
  const [formData, setFormData] = useState<StockFormData>({
    name: '',
    ticker: '',
    quantity: 0,
    buyPrice: 0,
    currentPrice: 0,
  });

  const [stockData, setStockData] = useState<StockAPIResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Array<{ symbol: string; description: string }>>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const predefinedTickers = ['AAPL', 'NVDA', 'MSFT', 'GOOG', 'META'];
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch stock data from the Finnhub API based on ticker symbol
  const fetchStockData = async (ticker: string) => {
    setLoading(true);
    try {
      const searchResponse = await fetch(
        `https://finnhub.io/api/v1/search?q=${ticker}&token=ctrn4nhr01qhb16na0kgctrn4nhr01qhb16na0l0`
      );
      const searchData: StockSearchAPIResponse = await searchResponse.json();

      if (searchData.result.length === 0) {
        setError('Invalid ticker symbol');
        setStockData(null);
        setLoading(false);
        return;
      }

      const stockName = searchData.result[0].description;

      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=ctrn4nhr01qhb16na0kgctrn4nhr01qhb16na0l0`
      );
      const data = await response.json();

      if (data.error) {
        setError('Error fetching stock data');
        setStockData(null);
        setLoading(false);
      } else {
        setStockData({
          name: stockName,
          currentPrice: data.c,
        });
        setError('');
        setLoading(false);
      }
    } catch (error) {
      setError('Error fetching stock data');
      setStockData(null);
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query) return;

    try {
      const response = await fetch(
        `https://finnhub.io/api/v1/search?q=${query}&token=ctrn4nhr01qhb16na0kgctrn4nhr01qhb16na0l0`
      );
      const data: StockSearchAPIResponse = await response.json();
      setSuggestions(data.result);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Update form's data when stockData is fetched
  useEffect(() => {
    if (stockData) {
      setFormData((prevData) => ({
        ...prevData,
        name: stockData.name,
        ticker: searchText.toUpperCase(),
        currentPrice: stockData.currentPrice,
      }));
    }
  }, [stockData]);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        name: initialData.name,
        ticker: initialData.ticker,
        quantity: initialData.quantity,
        buyPrice: initialData.buyPrice,
        currentPrice: initialData.currentPrice,
      });
    }
  }, [isEditing, initialData]);



  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setSearchText(value);
    fetchSuggestions(value);
    setFormData({ ...formData, ticker: value });
  };

  const handleSuggestionClick = (symbol: string) => {
    setSearchText(symbol); // Set the clicked symbol in the input
    setSuggestions([]); // Clear suggestions
    setShowDropdown(false); // Close the dropdown
    fetchStockData(symbol); // Fetch stock data for the selected symbol
  };
  


  const handleInputClick = () => {
    setShowDropdown(true); // Show dropdown when the field is clicked
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(false); // Close dropdown when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }
  
    if (formData.buyPrice <= 0) {
      setError('Buy price must be greater than 0');
      return;
    }
  
    setError('');
    console.log('Form Data:', formData);
    onSubmit(formData);
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ticker Symbol</label>
          <input
            type="text"
            value={searchText}
            onClick={handleInputClick}
            onChange={handleSearchChange}
            placeholder="Search or select a ticker..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            disabled={isEditing}
          />
          {showDropdown && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto w-full">
              {predefinedTickers.map((ticker) => (
                <li
                  key={ticker}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSuggestionClick(ticker)}
                >
                  {ticker}
                </li>
              ))}
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.symbol}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSuggestionClick(suggestion.symbol)}
                >
                  {suggestion.symbol} - {suggestion.description}
                </li>
              ))}
            </ul>
          )}
        </div>

        {stockData && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Name</label>
              <input
                type="text"
                value={formData.name}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Price</label>
              <input
                type="number"
                value={formData.currentPrice}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                disabled
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buy Price</label>
          <input
            type="number"
            value={formData.buyPrice}
            onChange={(e) => setFormData({ ...formData, buyPrice: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            min="0"
            required
          />
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-blue-500">Loading...</p>} {}

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
      >
        {isEditing ? 'Update Stock' : 'Add Stock'}
      </button>
    </form>
  );
}
