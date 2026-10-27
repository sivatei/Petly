import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";
import { Heart, Trash2 } from "lucide-react";

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return setLoading(false);
    setLoading(true);
    const { data } = await supabase
      .from("wishlists")
      .select("id, product_id, product:product_id(*, product_images(*), profiles:seller_id(full_name))")
      .eq("user_id", user.id);
    
    setItems((data || []).map(w => ({ wishlist_id: w.id, ...w.product })).filter(p => p.id));
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const removeItem = async (wishlistId) => {
    await supabase.from("wishlists").delete().eq("id", wishlistId);
    setItems(items.filter(i => i.wishlist_id !== wishlistId));
  };

  if (!user) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <Heart className="mx-auto mb-3 text-red-400" size={36} />
        <h1 className="text-2xl font-bold">Your Wishlist</h1>
        <p className="mt-2 text-sm text-gray-600">Please sign in to view and save your favorite pet products.</p>
        <Link to="/login" className="btn mt-6 inline-block w-full">Sign In / Register</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Wishlist</h1>
          <p className="text-xs text-gray-500">Products you've saved for later</p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-leaf-700 underline">Continue Shopping</Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading your wishlist…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-500">
          <Heart className="mx-auto mb-3 text-gray-300" size={42} />
          <p className="text-base font-semibold text-gray-700">Your wishlist is empty</p>
          <p className="mt-1 text-xs text-gray-500">Tap the heart icon on any product in the shop to save it here.</p>
          <Link to="/shop" className="btn mt-4 inline-block">Explore Pet Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map(p => (
            <div key={p.wishlist_id} className="relative group">
              <ProductCard p={p} />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  removeItem(p.wishlist_id);
                }}
                title="Remove from wishlist"
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow transition hover:bg-red-50 hover:scale-110"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
