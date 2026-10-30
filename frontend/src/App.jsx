import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import Vet from './pages/Vet';
import VetDetail from './pages/VetDetail';
import Login from './pages/Login';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';

export default function App() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop title="Pet Shop" />} />
          <Route path="/marketplace" element={<Shop title="Marketplace" condition="used" />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/vet" element={<Vet />} />
          <Route path="/vet/:id" element={<VetDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </main>
      <footer className="mt-12 border-t bg-white py-8 text-center text-sm text-gray-500">
        © Petly · Pet products & vet directory · Report suspicious listings from any product page.
      </footer>
    </>
  );
}
