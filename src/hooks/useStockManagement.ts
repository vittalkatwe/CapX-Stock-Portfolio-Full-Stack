import { create } from 'zustand';
import { Stock, StockFormData } from '../types/stock';
import { stockApi } from '../services/api';

interface StockState {
  stocks: Stock[];
  editingStock: Stock | null;
  showForm: boolean;
  isLoading: boolean;
  error: string | null;
  fetchStocks: () => Promise<void>;
  setEditingStock: (stock: Stock | null) => void;
  setShowForm: (show: boolean) => void;
  handleAddStock: (formData: StockFormData) => Promise<void>;
  handleEditStock: (formData: StockFormData) => Promise<void>;
  handleDeleteStock: (stockId: string) => Promise<void>;
  handleCloseForm: () => void;
}

export const useStockManagement = create<StockState>((set, get) => ({
  stocks: [],
  editingStock: null,
  showForm: false,
  isLoading: false,
  error: null,
  
  fetchStocks: async () => {
    try {
      set({ isLoading: true, error: null });
      const stocks = await stockApi.getAllStocks();
      set({ stocks, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch stocks', isLoading: false });
    }
  },
  
  setEditingStock: (stock) => set({ editingStock: stock, showForm: true }),
  setShowForm: (show) => set({ showForm: show }),
  
  handleAddStock: async (formData) => {
    try {
      set({ isLoading: true, error: null });
      await stockApi.createStock(formData);
      await get().fetchStocks();
      set({ showForm: false, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to add stock', isLoading: false });
    }
  },
  
  handleEditStock: async (formData) => {
    try {
      const { editingStock } = get();
      if (!editingStock) return;
      
      set({ isLoading: true, error: null });
      await stockApi.updateStock(editingStock.id, formData);
      await get().fetchStocks();
      set({ editingStock: null, showForm: false, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to update stock', isLoading: false });
    }
  },
  
  handleDeleteStock: async (stockId) => {
    try {
      set({ isLoading: true, error: null });
      await stockApi.deleteStock(stockId);
      await get().fetchStocks();
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to delete stock', isLoading: false });
    }
  },
  
  handleCloseForm: () => {
    set({
      showForm: false,
      editingStock: null,
    });
  },
}));