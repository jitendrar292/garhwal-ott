import React from 'react';
import PahadiPehnawaGrid from '../components/PahadiPehnawaGrid';
import SEO from '../components/SEO';

export default function PahadiPehnawaPage() {
  return (
    <>
      <SEO
        title="पहाड़ी पहनावा — Pahadi Pehnawa | Traditional Uttarakhand Attire"
        description="उत्तराखंड की पारंपरिक वेशभूषा — गढ़वाली, कुमाऊँनी, जौनसारी, भोटिया पहनावा। Traditional clothing, jewelry & textiles of Uttarakhand."
        keywords="pahadi pehnawa, garhwali dress, kumaoni attire, uttarakhand traditional clothing, pahadi fashion, ghaghra angra, pichhora"
      />
      <div className="min-h-screen bg-dark-950">
        <PahadiPehnawaGrid />
      </div>
    </>
  );
}
