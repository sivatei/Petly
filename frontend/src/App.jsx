import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Sell from './pages/Sell';
import Product from './pages/Product';
import Vet from './pages/Vet';
import VetDetail from './pages/VetDetail';
import About from './pages/About';
import Help from './pages/Help';
import Login from './pages/Login';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-gray-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop title="Pet Shop & Supplies" />} />
          <Route path="/marketplace" element={<Navigate to="/shop?condition=used" replace />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/vet" element={<Vet />} />
          <Route path="/vet/:id" element={<VetDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
