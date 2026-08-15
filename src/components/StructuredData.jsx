import React from 'react';

const StructuredData = ({ productName, productDescription, productImage, productPrice, productUrl }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": productName,
    "description": productDescription,
    "image": productImage,
    "offers": {
      "@type": "Offer",
      "price": productPrice,
      "priceCurrency": "SAR",
      "availability": "https://schema.org/InStock",
      "url": productUrl
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};

export default StructuredData;