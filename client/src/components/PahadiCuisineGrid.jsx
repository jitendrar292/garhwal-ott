import React from 'react';
import UTTARAKHAND_SPECIALTIES from '../data/pahadiCuisine';

const UttarakhandSpecialtiesGrid = () => {
  // Group by region
  const groupedByRegion = UTTARAKHAND_SPECIALTIES.reduce((acc, item) => {
    if (!acc[item.region]) {
      acc[item.region] = [];
    }
    acc[item.region].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🏔️ उत्तराखंड – जिलेवार फेमस चीज़ें
          </h1>
          <p className="text-lg text-slate-300">
            District-wise Famous Things & Specialties of Uttarakhand
          </p>
        </div>

        {/* Regions */}
        {Object.entries(groupedByRegion).map(([region, items]) => (
          <div key={region} className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 pb-3 border-b-2 border-amber-500">
              {region}
            </h2>

            {/* Districts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {items
                .sort((a, b) => a.sequence - b.sequence)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`bg-gradient-to-br ${item.bg} rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
                  >
                    {/* Card Header */}
                    <div className="bg-black/30 px-6 py-4 border-b border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {item.district}
                          </h3>
                          <p className="text-sm text-amber-200">
                            {item.districtLocal}
                          </p>
                        </div>
                        <span className="text-4xl">{item.emoji}</span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="px-6 py-5 text-white">
                      {/* Title */}
                      <div className="mb-4">
                        <p className="text-xl font-semibold text-amber-300">
                          {item.title}
                        </p>
                        <p className="text-sm text-amber-100 italic">
                          {item.titleLocal}
                        </p>
                      </div>

                      {/* Description */}
                      <p className="text-sm leading-relaxed mb-5 text-slate-100 border-l-4 border-amber-400 pl-4">
                        {item.description}
                      </p>

                      {/* Items List */}
                      <div className="space-y-2 mb-4">
                        <p className="text-xs font-semibold text-amber-300 mb-3">
                          🎯 Famous Things:
                        </p>
                        {item.items.map((subItem, idx) => (
                          <div
                            key={idx}
                            className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-xl mt-1">{subItem.icon}</span>
                              <div className="flex-1">
                                <p className="font-semibold text-white">
                                  {subItem.name}
                                </p>
                                <p className="text-xs text-amber-200">
                                  {subItem.nameLocal}
                                </p>
                                <p className="text-xs text-slate-300 mt-1">
                                  {subItem.category}
                                </p>
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

        {/* Footer Stats */}
        <div className="mt-16 bg-slate-800/50 rounded-lg p-8 text-center border-t-2 border-amber-500">
          <p className="text-slate-200 text-lg font-semibold">
            📍 {UTTARAKHAND_SPECIALTIES.length} districts in Uttarakhand
          </p>
          <p className="text-slate-400 text-sm mt-2">
            Each district is a treasure of culture, cuisine, and heritage
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="bg-emerald-900/30 rounded p-3">
              <p className="text-2xl font-bold text-emerald-300">
                {
                  UTTARAKHAND_SPECIALTIES.filter(
                    (d) => d.region === 'Garhwal'
                  ).length
                }
              </p>
              <p className="text-xs text-slate-300">Garhwal</p>
            </div>
            <div className="bg-indigo-900/30 rounded p-3">
              <p className="text-2xl font-bold text-indigo-300">
                {
                  UTTARAKHAND_SPECIALTIES.filter(
                    (d) => d.region === 'Kumaon'
                  ).length
                }
              </p>
              <p className="text-xs text-slate-300">Kumaon</p>
            </div>
            <div className="bg-amber-900/30 rounded p-3">
              <p className="text-2xl font-bold text-amber-300">
                {
                  UTTARAKHAND_SPECIALTIES.filter(
                    (d) =>
                      d.region === 'Foothills' ||
                      d.region === 'Jaunsar-Bawar'
                  ).length
                }
              </p>
              <p className="text-xs text-slate-300">Other</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UttarakhandSpecialtiesGrid;
