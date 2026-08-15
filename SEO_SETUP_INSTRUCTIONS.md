# SEO Setup Instructions

## IMPORTANT: Update Your URLs

After deploying to Vercel, you need to replace the placeholder URLs in `index.html` with your actual Vercel URL:

1. Find all instances of: `https://your-actual-vercel-url.vercel.app/`
2. Replace with your actual Vercel URL (e.g., `https://al-qusor.vercel.app/`)

## Open Graph Image

Create an attractive Open Graph image (1200x630px) for social media sharing:
- Name it: `og-image.jpg`
- Place it in: `public/og-image.jpg`
- Include your logo and a beautiful furniture image

## Google Analytics

Replace the Google Analytics measurement ID in `.env`:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Get your measurement ID from: https://analytics.google.com/

## Business Information

Update the business contact information in `src/components/Footer.jsx`:
- Phone number
- Email address
- Physical address
- Business hours
- Social media links