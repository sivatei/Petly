import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Tag, Upload, ArrowLeft, CheckCircle2, Image as ImageIcon, Sparkles } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";

const PET_TYPES = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Bird", value: "bird" },
  { label: "Fish", value: "fish" },
  { label: "Small Pets", value: "small_pets" }
];

const SAMPLE_IMAGES = [
  { label: "Cat Tree Tower", url: "/images/products/cat_tree.jpg" },
  { label: "Chew Toy", url: "/images/products/kong_toy.jpg" },
  { label: "Pet Bed", url: "/images/products/pet_bed.jpg" },
  { label: "Pet Carrier", url: "/images/products/pet_carrier.jpg" },
  { label: "Water Fountain", url: "/images/products/water_fountain.jpg" },
  { label: "Aquarium Tank", url: "/images/products/aquarium.jpg" }
];

export default function Sell() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [condition, setCondition] = useState("used"); // default to used for community sellers
  const [petType, setPetType] = useState("dog");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    api("/categories")
      .then(cats => {
        setCategories(cats || []);
        if (cats && cats.length > 0) {
          setCategoryId(String(cats[0].id));
        }
      })
      .catch(() => {});
  }, []);

  // Handle local image file upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setUploadingImage(true);
    setError("");

    try {
      const ext = file.name.split(".").pop();
      const fileName = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
      const filePath = `listings/${fileName}`;

      // Try uploading to Supabase Storage
      const { error: uploadErr } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadErr) {
        console.warn("Storage upload warning, fallback to local data URL:", uploadErr.message);
        // Fallback to data URL so listing still succeeds even if storage bucket isn't public
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrl(reader.result);
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
      } else {
        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        setImageUrl(data.publicUrl);
        setUploadingImage(false);
      }
    } catch (err) {
      console.error(err);
      setUploadingImage(false);
    }
  };

  const handleSelectSample = (sampleUrl) => {
    setImageUrl(sampleUrl);
    setImagePreview(sampleUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please log in to publish a listing.");
      return;
    }

    if (!title.trim() || title.trim().length < 3) {
      setError("Please enter a title (at least 3 characters).");
      return;
    }

    if (isNaN(price) || Number(price) < 0 || price === "") {
      setError("Please enter a valid price (e.g. 15.00 or 0 for free).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || `${condition === "used" ? "Pre-loved" : "Brand new"} pet item in good condition.`,
        price: Number(price),
        currency: "USD",
        condition,
        pet_type: petType,
        category_id: categoryId ? parseInt(categoryId, 10) : undefined,
        brand: brand.trim() || undefined,
        location: location.trim() || "Local Pickup",
        image_url: imageUrl || imagePreview || "/images/products/pet_bed.jpg"
      };

      const res = await api("/products", {
        method: "POST",
        body: payload
      });

      if (res && res.id) {
        nav(`/product/${res.id}`);
      } else {
        nav("/shop");
      }
    } catch (err) {
      setError(err.message || "Failed to create listing. Please try again.");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-12 text-center">
        <div className="card p-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 mb-4">
            <Tag size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Want to sell pet items?</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to list new or secondhand pet supplies for free. Find buyers in your local community!
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link to="/login" className="btn w-full justify-center">
              Sign In to Start Selling
            </Link>
            <Link to="/shop" className="text-xs font-semibold text-leaf-700 hover:text-leaf-800 underline mt-2">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-6">
      {/* Back button */}
      <div className="mb-6">
        <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-leaf-800 transition">
          <ArrowLeft size={16} /> Back to Shop
        </Link>
      </div>

      <div className="card p-6 md:p-8">
        <div className="mb-6 border-b border-gray-100 pb-5">
          <div className="flex items-center gap-2 text-leaf-700">
            <Tag size={22} />
            <span className="text-xs font-bold uppercase tracking-wider">Seller Listing Form</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-gray-900">List an Item for Sale</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sell your new or secondhand pet supplies directly to other pet lovers. (Pet supplies only — no live animals).
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="input w-full"
              placeholder="e.g. 54-inch Cat Tree Tower with Sisal Scratching Posts"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          {/* Condition Selector */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Item Condition <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCondition("used")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                  condition === "used"
                    ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-400"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">🤝 Pre-Loved / Used</span>
                  {condition === "used" && <CheckCircle2 size={16} className="text-amber-600" />}
                </div>
                <span className="mt-1 text-xs text-gray-500">
                  Gently used, outgrown cage, secondhand supplies in good working condition.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCondition("new")}
                className={`flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                  condition === "new"
                    ? "border-leaf-600 bg-leaf-50 ring-2 ring-leaf-400"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">✨ Brand New</span>
                  {condition === "new" && <CheckCircle2 size={16} className="text-leaf-600" />}
                </div>
                <span className="mt-1 text-xs text-gray-500">
                  Unopened, brand new, with original packaging or tags.
                </span>
              </button>
            </div>
          </div>

          {/* Category & Pet Type */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Pet Type <span className="text-red-500">*</span>
              </label>
              <select
                className="input w-full"
                value={petType}
                onChange={e => setPetType(e.target.value)}
              >
                {PET_TYPES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="input w-full"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Currency */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Price (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="25.00"
                  className="input w-full pl-8"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Brand <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                className="input w-full"
                placeholder="e.g. KONG, Feandrea, Generic"
                value={brand}
                onChange={e => setBrand(e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Location / City <span className="text-xs text-gray-400 font-normal">(For pickup or local buyers)</span>
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="e.g. Brooklyn, NY or Seattle, WA"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              className="input w-full resize-y"
              placeholder="Describe condition, size/dimensions, reasons for selling, and pickup instructions..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload / Photo */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Product Photo
            </label>

            {/* Upload or Preview Box */}
            <div className="mt-1 flex flex-col gap-3 rounded-2xl border-2 border-dashed border-gray-300 p-5 text-center hover:border-leaf-400 transition bg-gray-50/50">
              {imagePreview ? (
                <div className="relative mx-auto max-w-xs">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-44 w-full rounded-xl object-cover shadow-sm border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(""); setImageUrl(""); }}
                    className="absolute -top-2 -right-2 rounded-full bg-red-600 p-1 text-white shadow-md hover:bg-red-700"
                    title="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-700 mb-2">
                    <Upload size={22} />
                  </div>
                  <label className="cursor-pointer text-sm font-bold text-leaf-700 hover:text-leaf-800 underline">
                    <span>Upload a photo from your computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}

              {uploadingImage && (
                <p className="text-xs text-leaf-700 font-semibold animate-pulse">Uploading photo...</p>
              )}

              {/* Or paste an Image URL */}
              <div className="border-t border-gray-200 pt-3 text-left">
                <span className="block text-xs font-semibold text-gray-600 mb-1">Or paste an Image URL:</span>
                <input
                  type="url"
                  placeholder="https://example.com/item-photo.jpg"
                  className="input w-full text-xs"
                  value={imageUrl}
                  onChange={e => {
                    setImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                />
              </div>

              {/* Quick sample pickers */}
              <div className="border-t border-gray-200 pt-3 text-left">
                <span className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  Quick sample photo (for instant testing):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SAMPLE_IMAGES.map(s => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => handleSelectSample(s.url)}
                      className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 border border-gray-200 hover:bg-leaf-50 hover:border-leaf-300 transition"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t border-gray-100 pt-5">
            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="btn w-full justify-center py-3 text-base font-bold shadow-md disabled:opacity-50"
            >
              {loading ? "Publishing listing..." : "Publish Listing & Start Selling"}
            </button>
            <p className="mt-2 text-center text-xs text-gray-400">
              By publishing, you confirm this listing complies with Petly's animal welfare rules (supplies only, no live animals).
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
