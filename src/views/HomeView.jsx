import React from 'react';
import { useApp } from '../context/AppContext';
import VehicleCard from '../components/VehicleCard';
import {
  Car, ShieldCheck, Zap, CreditCard, Wrench, Headphones,
  ArrowRight, CheckCircle2, Star, Sparkles, ChevronRight,
  TrendingUp, Award, Calendar, Key, Shield
} from 'lucide-react';

export default function HomeView() {
  const { db, setCurrentView, setActiveBookingVehicle, setIsDbmsModalOpen } = useApp();

  const featuredVehicles = db.vehicles.slice(0, 4);

  const categories = [
    {
      id: 'CAT-101',
      name: 'Economy',
      badge: 'City Agility',
      rate: '$45/day',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      desc: 'High-efficiency hatchbacks tailored for swift urban navigation, easy parking, and sensible budgeting.'
    },
    {
      id: 'CAT-102',
      name: 'Sedan',
      badge: 'Executive Comfort',
      rate: '$75/day',
      image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
      desc: 'Elegant aerodynamics, silent cabins, and executive refinement for business trips and highway cruises.'
    },
    {
      id: 'CAT-103',
      name: 'SUV',
      badge: 'All-Terrain 4x4',
      rate: '$110/day',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
      desc: 'Elevated stance, generous cargo capacity, and robust all-wheel drive for family holidays and scenic routes.'
    },
    {
      id: 'CAT-104',
      name: 'Luxury',
      badge: 'Pure Prestige',
      rate: '$195/day',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
      desc: 'Flagship engineering with handcrafted interiors, high-octane performance, and unforgettable presence.'
    }
  ];

  const whyChooseUs = [
    {
      icon: <Car className="w-6 h-6 text-blue-400" />,
      title: 'Wide Range of Vehicles',
      desc: 'From nimble economy hatchbacks to high-performance supercars and electric cruisers, our diverse fleet caters to every journey.'
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-400" />,
      title: 'Easy Online Booking',
      desc: 'Effortless 5-step digital reservation wizard with real-time fleet availability checks and instant booking vouchers.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-400" />,
      title: 'Transparent Pricing',
      desc: 'Zero hidden fees or surge pricing. Itemized tax and damage waiver breakdown clearly listed before confirmation.'
    },
    {
      icon: <CreditCard className="w-6 h-6 text-amber-400" />,
      title: 'Secure Payments',
      desc: 'PCI-DSS certified gateway supporting multi-channel payments including Credit Cards, instant UPI QR, and Net Banking.'
    },
    {
      icon: <Wrench className="w-6 h-6 text-rose-400" />,
      title: 'Well-Maintained Vehicles',
      desc: 'Every vehicle undergoes multi-point safety inspections, computerized telemetry diagnostics, and certified technician servicing.'
    },
    {
      icon: <Headphones className="w-6 h-6 text-sky-400" />,
      title: 'Professional Support',
      desc: '24/7 toll-free dispatch and nationwide roadside assistance team ready to assist you anywhere along your voyage.'
    }
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Choose Your Vehicle',
      desc: 'Explore our catalog filtered by category, price, and specs to find the ideal match for your trip.',
      icon: <Car className="w-5 h-5 text-blue-400" />
    },
    {
      num: '02',
      title: 'Make a Booking',
      desc: 'Select pickup dates, preferred hub, and confirm driver credentials with transparent cost breakdowns.',
      icon: <Calendar className="w-5 h-5 text-indigo-400" />
    },
    {
      num: '03',
      title: 'Pick Up Your Vehicle',
      desc: 'Arrive at the mobility terminal for rapid digital check-in, key handover, and odometer inspection.',
      icon: <Key className="w-5 h-5 text-amber-400" />
    },
    {
      num: '04',
      title: 'Enjoy Your Journey',
      desc: 'Drive with total peace of mind backed by comprehensive zero-deductible coverage and 24/7 rescue.',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      num: '05',
      title: 'Return & Complete Payment',
      desc: 'Effortless return check-in, instant odometer logging, and computerized digital ledger receipt settlement.',
      icon: <CreditCard className="w-5 h-5 text-purple-400" />
    }
  ];

  const testimonials = [
    {
      quote: "DriveEase provided an impeccably smooth rental experience for my corporate retreat. The BMW M3 was spotless, dispatched instantly, and drove like a dream.",
      name: "Marcus Vance",
      role: "Venture Partner, NYC",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      car: "BMW M3 Competition"
    },
    {
      quote: "The seamless 5-step booking and transparent pricing won me over. No surprises at pickup, and the Tesla Model Y had 100% battery ready to go!",
      name: "Alex Sterling",
      role: "Software Architect, Seattle",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      car: "Tesla Model Y"
    },
    {
      quote: "As someone who travels every week for medical conferences, DriveEase is my top choice. Professional staff, reliable cars, and effortless invoicing.",
      name: "Dr. Sarah Chen",
      role: "Cardiologist, Palo Alto",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      car: "Toyota Camry Hybrid"
    }
  ];

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Automotive Mobility Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-['Outfit']">
                Drive Your Journey.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
                  We’ll Handle the Rest.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Premium vehicles, seamless booking, transparent pricing and effortless rentals — all in one place. Powered by an enterprise 8-table relational DBMS.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('vehicles')}
                  className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all duration-300 shadow-xl shadow-blue-900/40 flex items-center gap-2 group"
                >
                  <span>Browse Vehicles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    const firstAvailable = db.vehicles.find(v => v.status === 'AVAILABLE');
                    if (firstAvailable) setActiveBookingVehicle(firstAvailable);
                    else setCurrentView('vehicles');
                  }}
                  className="px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm transition-all border border-slate-700/80 backdrop-blur-md flex items-center gap-2"
                >
                  <span>Book a Vehicle</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setIsDbmsModalOpen(true)}
                  className="px-4 py-3.5 rounded-xl text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>DBMS Architecture</span>
                </button>
              </div>

              {/* Trust Metric Badges */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <div className="text-2xl font-black text-white font-mono">100%</div>
                  <div className="text-xs text-slate-400">Insured Fleet</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-blue-400 font-mono">99.8%</div>
                  <div className="text-xs text-slate-400">On-Time Dispatch</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">24/7</div>
                  <div className="text-xs text-slate-400">Roadside Assist</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden glass-card p-3 border border-slate-700/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80"
                  alt="DriveEase Luxury Fleet"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Floating Badge 1: Top Right */}
                <div className="absolute top-6 right-6 p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl flex items-center gap-2.5 animate-bounce-subtle">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                  <div>
                    <div className="text-[11px] font-bold text-white">Live Availability</div>
                    <div className="text-[10px] text-emerald-400 font-mono">Ready for Instant Pickup</div>
                  </div>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-700/80 shadow-2xl max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400">
                      Featured
                    </span>
                    <span className="text-xs font-bold text-white">BMW M3 Competition</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">From $220/day</span>
                    <span className="text-emerald-400 font-semibold text-[11px]">Free Cancellation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CHOOSE DRIVEEASE? */}
      <section id="why-choose-us" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
            Uncompromising Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            Why Choose DriveEase?
          </h2>
          <p className="text-sm text-slate-400">
            We bridge the gap between world-class automotive luxury and seamless cloud-powered digital management.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 glass-card-hover flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-xl bg-slate-800/80 w-fit mb-4 border border-slate-700/60">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VEHICLE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
              Fleet Classification
            </span>
            <h2 className="text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Vehicle Categories
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Explore our structured database category classifications designed for every itinerary.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('vehicles')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Fleet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setCurrentView('vehicles')}
              className="group relative rounded-2xl overflow-hidden glass-card border border-slate-800 cursor-pointer glass-card-hover flex flex-col h-80"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-blue-300 border border-slate-700/60">
                  {cat.badge}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-emerald-400">{cat.rate}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
            Streamlined Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
            How It Works
          </h2>
          <p className="text-sm text-slate-400">
            From online vehicle discovery to seamless key handover and digital return — in 5 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {workflowSteps.map(step => (
            <div
              key={step.num}
              className="glass-card p-5 rounded-2xl border border-slate-800 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-700 font-mono">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED VEHICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
              Hand-Picked Fleet
            </span>
            <h2 className="text-3xl font-extrabold text-white font-['Outfit'] mt-1">
              Featured Vehicles
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Popular models available for immediate reservation across our hub network.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('vehicles')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 self-start sm:self-auto"
          >
            Explore Complete Fleet ({db.vehicles.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map(v => (
            <VehicleCard key={v.vehicle_id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
            Verified Experiences
          </span>
          <h2 className="text-3xl font-extrabold text-white font-['Outfit']">
            Customer Testimonials
          </h2>
          <p className="text-sm text-slate-400">
            Hear from corporate executives, weekend explorers, and recurring DriveEase drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <div className="text-xs font-bold text-white">{t.name}</div>
                    <div className="text-[10px] text-slate-400">{t.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  {t.car}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. PREMIUM CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden glass-card p-8 sm:p-12 border border-blue-500/30 text-center space-y-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-purple-900/20"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              Fast & Contactless
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Ready for your next journey?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Book within minutes, enjoy zero deposit requirements, and drive the highest-grade fleet available with 24/7 dispatch support.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setCurrentView('vehicles')}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-900/50 transition-all flex items-center gap-2"
              >
                <span>Explore Vehicles</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsDbmsModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all"
              >
                View Academic DBMS Schema
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
