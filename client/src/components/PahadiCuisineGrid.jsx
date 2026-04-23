import React, { useState } from 'react';
import UTTARAKHAND_SPECIALTIES from '../data/pahadiCuisine';

const UttarakhandSpecialtiesGrid = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);

  // Group by region
  const groupedByRegion = UTTARAKHAND_SPECIALTIES.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = [];
    }
    acc[item.region].push(item);
    return acc;
  }, {});

  const allRegions = Object.keys(groupedByRegion);
  const displayRegions = selectedRegion
    ? [selectedRegion]
    : allRegions;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.3); }
          50% { box-shadow: 0 0 40px rgba(217, 119, 6, 0.6); }
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-12px);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16 animate-slideInUp">
          <div className="inline-block mb-6">
            <div className="text-6xl md:text-7xl mb-4 drop-shadow-lg">🏔️</div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-2 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-300 bg-clip-text text-transparent">
            उत्तराखंड की खोज
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-100 mb-4">
            जिलेवार प्रसिद्ध चीज़ें
          </h2>
          <p className="text-base md:text-lg text-slate-300 mb-2">
            District-wise Specialties & Attractions
          </p>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Discover the unique heritage, legendary food, and cultural treasures of all 13 districts
          </p>
        </div>

        {/* Region Filter Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-2 md:gap-3 animate-fadeIn">
          <button
            onClick={() => setSelectedRegion(null)}
            className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
              selectedRegion === null
                ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50'
                : 'bg-slate-700/50 text-amber-100 hover:bg-slate-600/50'
            }`}
          >
            ✨ सभी जिले (All)
          </button>
          {allRegions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                selectedRegion === region
                  ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/50'
                  : 'bg-slate-700/50 text-amber-100 hover:bg-slate-600/50'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Regions */}
        {displayRegions.map((region, regionIdx) => (
          <div
            key={region}
            className="mb-20 animate-slideInUp"
            style={{ animationDelay: `${regionIdx * 0.1}s` }}
          >
            {/* Region Header */}
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 h-1 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
                <h2 className="text-3xl md:text-4xl font-black text-amber-300 px-4 whitespace-nowrap">
                  {region}
                </h2>
                <div className="flex-1 h-1 bg-gradient-to-l from-amber-500 to-transparent rounded-full"></div>
              </div>
              <p className="text-center text-sm text-slate-400">
                ({groupedByRegion[region].length} districts)
              </p>
            </div>

            {/* Districts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
              {groupedByRegion[region]
                .sort((a, b) => a.sequence - b.sequence)
                .map((item, idx) => (
                  <div
                    key={item.id}
                    className={`bg-gradient-to-br ${item.bg} rounded-2xl overflow-hidden shadow-xl card-hover group`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {/* Card Header with Gradient Overlay */}
                    <div className="relative bg-black/40 px-6 py-6 border-b-2 border-white/10 group-hover:bg-black/50 transition-colors">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors"></div>
                      <div className="relative flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-3xl font-black text-white group-hover:text-amber-100 transition-colors">
                            {item.district}
                          </h3>
                          <p className="text-sm text-amber-200 font-semibold mt-1">
                            {item.districtLocal}
                          </p>
                        </div>
                        <div className="text-5xl transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 drop-shadow-lg">
                          {item.emoji}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-6 py-6 text-white">
                      {/* Title with Highlight */}
                      <div className="mb-5 p-3 bg-white/5 rounded-lg border-l-4 border-amber-400">
                        <p className="text-lg font-bold text-amber-100 leading-tight">
                          {item.title}
                        </p>
                        <p className="text-xs text-amber-200 italic mt-1">
                          {item.titleLocal}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-sm leading-relaxed mb-6 text-slate-100 text-justify">
                        {item.description}
                      </p>

                      {/* Items List */}
                      <div className="space-y-3">
                        <p className="text-xs font-black text-amber-300 uppercase tracking-wider">
                          ⭐ Featured Attractions & Foods
                        </p>
                        {item.items.map((subItem, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl p-3 hover:from-white/20 hover:to-white/10 transition-all duration-300 border border-white/10 hover:border-white/20 cursor-pointer group/item"
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-2xl group-hover/item:scale-125 transition-transform duration-300">
                                {subItem.icon}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white group-hover/item:text-amber-100 transition-colors">
                                  {subItem.name}
                                </p>
                                <p className="text-xs text-amber-200 font-semibold">
                                  {subItem.nameLocal}
                                </p>
                                <div className="mt-2 inline-block">
                                  <span className="inline-block bg-amber-500/30 text-amber-100 text-xs px-2 py-1 rounded-full border border-amber-400/50 font-medium">
                                    {subItem.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Enhanced Footer Stats */}
        <div className="mt-20 bg-gradient-to-r from-slate-800/50 via-amber-900/20 to-slate-800/50 rounded-3xl p-8 md:p-12 text-center border-2 border-amber-500/30 pulse-glow">
          <h3 className="text-3xl font-black text-amber-100 mb-2">
            🎯 उत्तराखंड का खजाना
          </h3>
          <p className="text-slate-200 text-lg font-bold mb-2">
            {UTTARAKHAND_SPECIALTIES.length} जिलों का अद्भुत विविधता
          </p>
          <p className="text-slate-400 text-sm mb-8 max-w-2xl mx-auto">
            Each district is a unique celebration of culture, heritage, and culinary excellence
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-900/40 rounded-2xl p-4 border border-emerald-400/30 hover:border-emerald-400/60 hover:bg-emerald-900/50 transition-all">
              <p className="text-3xl font-black text-emerald-300">
                {
                  UTTARAKHAND_SPECIALTIES.filter(
                    (d) => d.region === 'Garhwal'
                  ).length
                }
              </p>
              <p className="text-xs text-slate-300 font-semibold mt-2">Garhwal</p>
            </div>
            <div className="bg-indigo-900/40 rounded-2xl p-4 border border-indigo-400/30 hover:border-indigo-400/60 hover:bg-indigo-900/50 transition-all">
              <p className="text-3xl font-black text-indigo-300">
                {
                  UTTARAKHAND_SPECIALTIES.filter(
                    (d) => d.region === 'Kumaon'
                  ).length
                }
              </p>
              <p className="text-xs text-slate-300 font-semibold mt-2">Kumaon</p>
            </div>
            <div className="bg-amber-900/40 rounded-2xl p-4 border border-amber-400/30 hover:border-amber-400/60 hover:bg-amber-900/50 transition-all">
              <p className="text-3xl font-black text-amber-300">
                {
                  UTTARAKHAND_SPECIALTIES.filter(
                    (d) => d.region === 'Foothills'
                  ).length
                }
              </p>
              <p className="text-xs text-slate-300 font-semibold mt-2">Foothills</p>
            </div>
            <div className="bg-rose-900/40 rounded-2xl p-4 border border-rose-400/30 hover:border-rose-400/60 hover:bg-rose-900/50 transition-all">
              <p className="text-3xl font-black text-rose-300">
                {
                  UTTARAKHAND_SPECIALTIES.filter(
                    (d) => d.region === 'Jaunsar-Bawar'
                  ).length
                }
              </p>
              <p className="text-xs text-slate-300 font-semibold mt-2">Jaunsar-Bawar</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center pb-8">
          <p className="text-slate-400 text-sm">
            🌄 Explore the magnificent heritage and authentic flavors of Uttarakhand
          </p>
        </div>
      </div>
    </div>
  );
};

export default UttarakhandSpecialtiesGrid;
