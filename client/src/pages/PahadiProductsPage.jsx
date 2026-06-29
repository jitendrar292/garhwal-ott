import React from 'react';
import PahadiProductsGrid from '../components/PahadiProductsGrid';
import SEO from '../components/SEO';

export default function PahadiProductsPage() {
  return (
    <>
      <SEO
        title="पहाड़ी उत्पाद — Pahadi Products | Namak, Achar, Squash, Jam & Honey"
        description="उत्तराखंड के पारंपरिक पहाड़ी उत्पाद — पिस्यूं नून, बुरांश स्क्वैश, गलगल अचार, हिसालू जैम, आंवला मुरब्बा, भांग चटनी, हिमालयी शहद। Authentic homemade Pahadi food products."
        path="/pahadi-products"
        keywords="pahadi products, pisyun loon, pahadi namak, buransh squash, malta juice, galgal achar, hisalu jam, amla murabba, bhang chutney, himalayan honey, uttarakhand food products"
      />
      <div className="min-h-screen bg-dark-950">
        <PahadiProductsGrid />
      </div>
    </>
  );
}
