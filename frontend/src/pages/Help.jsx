import { useState } from "react";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronDown, Mail, ShieldAlert, Sparkles, AlertTriangle } from "lucide-react";

const FAQS = [
  {
    category: "Buying & Marketplace",
    items: [
      {
        q: "What is the difference between New and Pre-Loved items?",
        a: "Brand New items are untouched retail products with original packaging. Pre-Loved items are gently used or outgrown secondhand supplies sold by fellow pet parents at discounted prices."
      },
      {
        q: "How do I purchase an item from a seller?",
        a: "Click on any product listing to view full details. You can click 'Contact Seller' to start a direct message with the seller to agree on payment method and local pickup or shipping arrangements."
      },
      {
        q: "Are live animals sold on Petly?",
        a: "No, absolutely not. Petly has a strict policy: only pet supplies, accessories, food, and habitats are permitted. Listing live animals is strictly prohibited and results in immediate account termination."
      }
    ]
  },
  {
    category: "Selling Your Items",
    items: [
      {
        q: "How do I list an item for sale?",
        a: "Navigate to the Shop page and click the '+ Sell an Item' button. Fill in the title, condition, pet type, asking price, and upload a clear photo. Your listing will be published immediately to the catalog."
      },
      {
        q: "Are there any listing fees?",
        a: "No! Listing your new or secondhand pet supplies on Petly is 100% free for all community members."
      },
      {
        q: "How should I hand over items to buyers?",
        a: "We recommend arranging local pickups in safe, public, well-lit spaces (such as outside a local pet store, shopping mall, or daytime public area)."
      }
    ]
  },
  {
    category: "Vet Clinics & Appointments",
    items: [
      {
        q: "How do I find a veterinary clinic near me?",
        a: "Visit the Vet Centre tab where you can search by clinic name or filter by city. Each clinic listing shows services, opening hours, verified badges, and reviews."
      },
      {
        q: "Can I use the chat feature for medical emergencies?",
        a: "No. Chat on Petly is intended solely for general enquiries, opening hours, and appointment bookings. In an acute medical emergency, please take your pet directly to an emergency 24/7 veterinary hospital."
      }
    ]
  }
];

export default function Help() {
  const [openItems, setOpenItems] = useState({});

  const toggle = (idx) => {
    setOpenItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="mx-auto max-w-4xl py-6 space-y-10">
      {/* Header Banner */}
      <section className="rounded-3xl bg-leaf-100 p-8 md:p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-leaf-700 shadow-xs mb-3">
          <HelpCircle size={30} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 md:text-4xl">Help Center & FAQ</h1>
        <p className="mt-2 text-sm text-gray-600 max-w-lg mx-auto">
          Got questions about buying, selling, or finding trusted veterinary care? We're here to support you and your pets every step of the way.
        </p>
      </section>

      {/* Emergency Disclaimer Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertTriangle size={20} className="shrink-0 text-amber-600 mt-0.5" />
        <div>
          <p className="font-bold">Medical Emergency Notice</p>
          <p className="text-xs text-amber-800 mt-0.5">
            Petly does not provide emergency medical advice. If your pet has ingested poison, suffered trauma, or is in critical distress, contact an emergency 24/7 animal clinic immediately.
          </p>
        </div>
      </div>

      {/* FAQs Sections */}
      <div className="space-y-8">
        {FAQS.map((section, sIdx) => (
          <div key={section.category} className="card p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.category}</h2>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, iIdx) => {
                const key = `${sIdx}-${iIdx}`;
                const isOpen = !!openItems[key];
                return (
                  <div key={item.q} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      onClick={() => toggle(key)}
                      className="flex w-full items-center justify-between text-left font-semibold text-gray-800 hover:text-leaf-800 transition"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base">{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform ${isOpen ? "rotate-180 text-leaf-600" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 animate-in fade-in duration-200">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Safety & Contact Card */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-leaf-700 font-bold mb-2">
              <ShieldAlert size={20} />
              <span>Trust & Safety</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Report an Issue</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              Encountered a suspicious listing, scam attempt, or rule violation? You can report any listing directly using the "Report listing" button on its product page.
            </p>
          </div>
          <div className="mt-4">
            <Link to="/shop" className="text-xs font-semibold text-leaf-700 hover:text-leaf-800 underline">
              Browse listings &rarr;
            </Link>
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-between bg-leaf-50/50">
          <div>
            <div className="flex items-center gap-2 text-leaf-700 font-bold mb-2">
              <Mail size={20} />
              <span>Need More Help?</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Contact Support</h3>
            <p className="mt-1 text-xs text-gray-600 leading-relaxed">
              Have an account question or platform feedback? Reach out to our dedicated support team at <span className="font-semibold text-gray-900">support@petly.com</span>. We typically respond within 24 hours.
            </p>
          </div>
          <div className="mt-4">
            <a
              href="mailto:support@petly.com"
              className="btn text-xs inline-flex items-center gap-1.5"
            >
              <Mail size={14} /> Send an Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
