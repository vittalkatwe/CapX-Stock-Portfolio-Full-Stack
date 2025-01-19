// src/App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Modal } from './components/common/Modal';
import { StockForm } from './components/StockForm';
import { Toaster } from 'react-hot-toast';
import { useStockManagement } from './hooks/useStockManagement';
import '@fontsource/outfit';
import { AuthProvider } from './components/contexts/AuthContext'; // Ensure AuthContext is working
import { Home } from './components/pages/Home';
import { Login } from './components/pages/Login';
import Register from './components/pages/Register';
import { VerifyEmail } from './components/pages/VerifyEmail';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component

export default function App() {
  const {
    stocks,
    editingStock,
    showForm,
    handleAddStock,
    handleEditStock,
    handleCloseForm,
    setShowForm
  } = useStockManagement();

  const [activeSection, setActiveSection] = React.useState('dashboard');

  return (
    <AuthProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Protected route for /dashboard */}
          <Route element={<PrivateRoute />}>
            <Route
              path="/dashboard"
              element={
                <>
                  <Layout
                    showForm={showForm}
                    onToggleForm={() => setShowForm(true)}
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                  />
                  <Modal
                    isOpen={showForm}
                    onClose={handleCloseForm}
                    title={editingStock ? 'Edit Stock' : 'Add New Stock'}
                  >
                    <StockForm
                      onSubmit={editingStock ? handleEditStock : handleAddStock}
                      initialData={editingStock || undefined}
                      isEditing={!!editingStock}
                    />
                  </Modal>
                </>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
