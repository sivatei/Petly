import { Link } from "react-router-dom";
import { PawPrint, Heart, Mail, ShieldCheck, HelpCircle, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      {/* Main Footer Links */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-leaf-700">
              <PawPrint className="text-leaf-600" /> Petly
            </Link>
            <p className="text-xs leading-relaxed text-gray-500">
              Your community pet platform. Discover brand-new supplies, exchange verified secondhand pet items, and find trusted veterinary clinics in your neighborhood.
            </p>
            <div className="pt-2 text-xs text-gray-400">
              <p className="font-semibold text-gray-700">Animal Welfare Pledge</p>
              <p className="mt-0.5">Supplies only — no live animals are sold or traded on Petly.</p>
            </div>
          </div>

          {/* Col 2: Shop & Marketplace */}
          <div className="space-y-2.5 text-sm">
            <h3 className="font-bold text-gray-900">Shop & Supplies</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link to="/shop" className="hover:text-leaf-700 transition">All Products</Link>
              </li>
              <li>
                <Link to="/shop?condition=new" className="hover:text-leaf-700 transition">Brand New Items</Link>
              </li>
              <li>
                <Link to="/shop?condition=used" className="hover:text-leaf-700 transition">Pre-Loved & Secondhand</Link>
              </li>
              <li>
                <Link to="/sell" className="font-semibold text-leaf-700 hover:text-leaf-800 transition">+ List an Item for Sale</Link>
              </li>
              <li>
                <Link to="/shop?pet_type=dog" className="hover:text-leaf-700 transition">Dogs Supplies</Link>
              </li>
              <li>
                <Link to="/shop?pet_type=cat" className="hover:text-leaf-700 transition">Cats Supplies</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Vet & Healthcare */}
          <div className="space-y-2.5 text-sm">
            <h3 className="font-bold text-gray-900">Pet Healthcare</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link to="/vet" className="hover:text-leaf-700 transition">Find a Vet Clinic</Link>
              </li>
              <li>
                <Link to="/vet" className="hover:text-leaf-700 transition">Verified Clinics</Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-leaf-700 transition">Emergency Clinic Guidelines</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-leaf-700 transition">Our Healthcare Standards</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Help & Community */}
          <div className="space-y-2.5 text-sm">
            <h3 className="font-bold text-gray-900">Help & Support</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link to="/help" className="flex items-center gap-1.5 hover:text-leaf-700 transition">
                  <HelpCircle size={14} /> Help Center & FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-leaf-700 transition">About Petly</Link>
              </li>
              <li>
                <Link to="/help" className="flex items-center gap-1.5 hover:text-leaf-700 transition">
                  <ShieldCheck size={14} /> Safety & Reporting
                </Link>
              </li>
              <li>
                <a href="mailto:support@petly.com" className="flex items-center gap-1.5 text-leaf-700 hover:text-leaf-800 transition">
                  <Mail size={14} /> support@petly.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="mt-10 border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Petly. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-gray-600 transition">About</Link>
            <span>·</span>
            <Link to="/help" className="hover:text-gray-600 transition">Help & FAQs</Link>
            <span>·</span>
            <Link to="/shop" className="hover:text-gray-600 transition">Shop</Link>
            <span>·</span>
            <Link to="/vet" className="hover:text-gray-600 transition">Vet Directory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
