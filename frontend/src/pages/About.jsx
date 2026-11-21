import { Link } from "react-router-dom";
import { PawPrint, Heart, ShieldCheck, Recycle, Stethoscope, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl py-6 space-y-12">
      {/* Hero Section */}
      <section className="rounded-3xl bg-leaf-100 p-8 md:p-14 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-leaf-700 shadow-xs mb-3">
          <PawPrint size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 md:text-5xl">
          Everything Your Pet Needs, Built with Love.
        </h1>
        <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Petly is your all-in-one community hub dedicated to happier, healthier pets. We bring together retail supplies, verified secondhand exchanges, and certified veterinary clinics in one unified platform.
        </p>
      </section>

      {/* Our 3 Pillars */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="card p-6 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Recycle size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Sustainable Pet Parenting</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Pets outgrow crates, carriers, and toys quickly. Our community marketplace gives quality supplies a second life, saving owners money and reducing landfill waste.
          </p>
        </div>

        <div className="card p-6 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
            <Stethoscope size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Trusted Vet Directory</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Finding certified veterinary care shouldn't be stressful. We connect pet parents to verified local clinics with transparent reviews, specializations, and direct enquiry options.
          </p>
        </div>

        <div className="card p-6 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
            <Heart size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Strict Animal Welfare</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            We strictly forbid the sale or trading of live animals on Petly. We champion ethical pet ownership, shelter adoptions, and cruelty-free pet care.
          </p>
        </div>
      </section>

      {/* Safety Pledge */}
      <section className="card p-8 bg-white border border-gray-100">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-700">
            <ShieldCheck size={36} />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900">Our Community Promise</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Every listing is monitored for safety and quality. When you shop or connect on Petly, you are supporting a community of compassionate animal lovers who believe pets are family.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="rounded-2xl bg-leaf-700 p-8 text-center text-white space-y-4">
        <h2 className="text-2xl font-extrabold">Ready to explore?</h2>
        <p className="text-sm text-leaf-100 max-w-md mx-auto">
          Discover quality pet supplies or find a verified vet near you today.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link to="/shop" className="rounded-full bg-white px-6 py-2.5 text-sm font-extrabold text-leaf-800 shadow-md hover:bg-leaf-50 hover:text-leaf-900 transition">
            Explore Shop
          </Link>
          <Link to="/vet" className="rounded-full border border-white/40 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition">
            Find a Vet Clinic
          </Link>
        </div>
      </section>
    </div>
  );
}
