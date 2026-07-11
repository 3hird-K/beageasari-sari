import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Beagea Sari Sari Store',
    short_name: 'Beagea POS',
    description: 'Modern Point of Sale and Inventory Management system for Beagea Sari Sari Store.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B2516',
    theme_color: '#2EBA63',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
