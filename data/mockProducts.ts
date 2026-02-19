
import { Product } from '../types/product';

const STORAGE_KEY = 'radico_products';

const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  
  const images = [
    'https://images.unsplash.com/photo-1620331311520-246422fd82f9?w=800&q=80',
    'https://images.unsplash.com/photo-1522337360788-8b13df772ec2?w=800&q=80',
    'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800&q=80',
    'https://images.unsplash.com/photo-1516914915975-93fee9075881?w=800&q=80',
    'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800&q=80',
    'https://images.unsplash.com/photo-1526045431048-f857369aba09?w=800&q=80',
    'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&q=80'
  ];

  const rawData = [
    // --- Category 1: Organic Hair Colour (ID: 1) ---
    {
      cat: '1', countries: ['India', 'Germany'],
      name: 'Soft Black Colour', name_de: 'Sanftes Schwarz',
      desc: 'Natural black shade for elegant hair.', desc_de: 'Natürlicher Schwarzton für elegantes Haar.',
      how: 'Mix with warm water, apply for 60 mins.', how_de: 'Mit warmem Wasser mischen, 60 Min. einwirken lassen.',
      inside: 'Indigo, Henna, Amla.', inside_de: 'Indigo, Henna, Amla.',
      ing: 'Indigofera Tinctoria, Lawsonia Inermis.', ing_de: 'Indigofera Tinctoria, Lawsonia Inermis.',
      ben: 'Chemical free, shiny hair.', ben_de: 'Chemiefrei, glänzendes Haar.',
      stock: 50
    },
    {
      cat: '1', countries: ['India', 'Germany'],
      name: 'Dark Brown Organic', name_de: 'Dunkelbraun Bio',
      desc: 'Rich deep brown tones.', desc_de: 'Reiche, tiefe Brauntöne.',
      how: 'Paste application, rinse after 90 mins.', how_de: 'Paste auftragen, nach 90 Min. ausspülen.',
      inside: 'Walnut, Henna.', inside_de: 'Walnuss, Henna.',
      ing: 'Juglans Regia, Lawsonia Inermis.', ing_de: 'Juglans Regia, Lawsonia Inermis.',
      ben: 'Safe for all hair types.', ben_de: 'Sicher für alle Haartypen.',
      stock: 25
    },
    {
      cat: '1', countries: ['India'],
      name: 'Kerala Indigo Powder', name_de: 'Kerala Indigo Pulver',
      desc: 'Traditional blue-black dye.', desc_de: 'Traditioneller blauschwarzer Farbstoff.',
      how: 'Two-step process with henna.', how_de: 'Zweistufiger Prozess mit Henna.',
      inside: 'Pure Indigo leaf powder.', inside_de: 'Reines Indigo-Blattpulver.',
      ing: '100% Indigofera Tinctoria.', ing_de: '100% Indigofera Tinctoria.',
      ben: 'Deepest black naturally.', ben_de: 'Tiefstes Schwarz auf natürliche Weise.',
      stock: 0
    },
    {
      cat: '1', countries: ['Germany'],
      name: 'Alpine Ash Blonde', name_de: 'Alpines Aschblond',
      desc: 'Cool blonde tones for European textures.', desc_de: 'Kühle Blondtöne für europäische Texturen.',
      how: '30-45 min application.', how_de: '30-45 Min. Anwendung.',
      inside: 'Cassia, Rhubarb root.', inside_de: 'Cassia, Rhabarberwurzel.',
      ing: 'Cassia Obovata, Rheum Palmatum.', ing_de: 'Cassia Obovata, Rheum Palmatum.',
      ben: 'Brightens naturally blonde hair.', ben_de: 'Hellt natürlich blondes Haar auf.',
      stock: 12
    },
    {
      cat: '1', countries: ['India', 'Germany'],
      name: 'Copper Brown Shine', name_de: 'Kupferbraun Glanz',
      desc: 'Warm earthy copper tones.', desc_de: 'Warme erdige Kupfertöne.',
      how: 'Apply to damp hair.', how_de: 'Auf das feuchte Haar auftragen.',
      inside: 'Henna, Hibiscus.', inside_de: 'Henna, Hibiskus.',
      ing: 'Lawsonia Inermis, Hibiscus Sabdariffa.', ing_de: 'Lawsonia Inermis, Hibiscus Sabdariffa.',
      ben: 'Vibrant reflections.', ben_de: 'Lebendige Reflexe.',
      stock: 44
    },
    {
      cat: '1', countries: ['India'],
      name: 'Neem Infused Black', name_de: 'Neem-Schwarz',
      desc: 'Anti-bacterial coloring.', desc_de: 'Antibakterielle Färbung.',
      how: 'Massage paste into scalp and hair.', how_de: 'Paste in Kopfhaut und Haar einmassieren.',
      inside: 'Neem, Amla, Indigo.', inside_de: 'Neem, Amla, Indigo.',
      ing: 'Azadirachta Indica, Emblica Officinalis.', ing_de: 'Azadirachta Indica, Emblica Officinalis.',
      ben: 'Treats dandruff while coloring.', ben_de: 'Behandelt Schuppen während des Färbens.',
      stock: 100
    },
    {
      cat: '1', countries: ['Germany'],
      name: 'Munich Berry Red', name_de: 'Münchner Beerenrot',
      desc: 'Modern fruity red tint.', desc_de: 'Moderne fruchtige Rottönung.',
      how: 'Mix with warm fruit juice or water.', how_de: 'Mit warmem Fruchtsaft oder Wasser mischen.',
      inside: 'Berry extracts, Henna.', inside_de: 'Beerenextrakte, Henna.',
      ing: 'Rubus Idaeus, Lawsonia Inermis.', ing_de: 'Rubus Idaeus, Lawsonia Inermis.',
      ben: 'Sweet scent and deep red.', ben_de: 'Süßer Duft und tiefes Rot.',
      stock: 8
    },
    {
      cat: '1', countries: ['India', 'Germany'],
      name: 'Burgundy Wine Shade', name_de: 'Burgunder Wein-Ton',
      desc: 'Elegant sophisticated dark red.', desc_de: 'Elegantes, anspruchsvolles Dunkelrot.',
      how: '60 min soak.', how_de: '60 Min. einweichen.',
      inside: 'Beetroot powder, Henna.', inside_de: 'Rote-Bete-Pulver, Henna.',
      ing: 'Beta Vulgaris, Lawsonia Inermis.', ing_de: 'Beta Vulgaris, Lawsonia Inermis.',
      ben: 'Rich velvet finish.', ben_de: 'Reiches Samt-Finish.',
      stock: 22
    },
    {
      cat: '1', countries: ['India'],
      name: 'Rajasthani Premium Henna', name_de: 'Rajasthani Premium Henna',
      desc: 'Finest triple-sifted henna.', desc_de: 'Feinstes, dreifach gesiebtes Henna.',
      how: 'Soak overnight, apply 3 hours.', how_de: 'Über Nacht einweichen, 3 Std. auftragen.',
      inside: '100% Rajasthani Henna.', inside_de: '100% Rajasthani Henna.',
      ing: 'Lawsonia Inermis.', ing_de: 'Lawsonia Inermis.',
      ben: 'Extreme conditioning.', ben_de: 'Extreme Pflege.',
      stock: 150
    },
    {
      cat: '1', countries: ['Germany'],
      name: 'Nordic Light Blonde', name_de: 'Nordisches Lichtblond',
      desc: 'Sun-kissed organic effect.', desc_de: 'Sonnengeküsster Bio-Effekt.',
      how: 'Apply for 20-40 mins.', how_de: '20-40 Min. auftragen.',
      inside: 'Chamomile, Lemon peel.', inside_de: 'Kamille, Zitronenschale.',
      ing: 'Matricaria Chamomilla, Citrus Limonum.', ing_de: 'Matricaria Chamomilla, Citrus Limonum.',
      ben: 'Gentle brightening.', ben_de: 'Sanfte Aufhellung.',
      stock: 5
    }
    // (Additional dummy data would follow same pattern)
  ];

  rawData.forEach((p, i) => {
    const prices: any[] = [];
    if (p.countries.includes('India')) {
      prices.push({ country: 'India', amount: 350 + (i * 15), currency: 'INR' });
    }
    if (p.countries.includes('Germany')) {
      prices.push({ country: 'Germany', amount: 14 + (i % 5), currency: 'EUR' });
    }

    products.push({
      id: `prod_${p.cat}_${i}`,
      name: p.name,
      name_de: p.name_de,
      description: p.desc,
      description_de: p.desc_de,
      categoryId: p.cat,
      images: [images[i % images.length]],
      status: 'Active',
      countries: p.countries as any,
      createdAt: '2023-11-20',
      prices: prices,
      howToUse: p.how,
      howToUse_de: p.how_de,
      whatsInside: p.inside,
      whatsInside_de: p.inside_de,
      ingredients: p.ing,
      ingredients_de: p.ing_de,
      benefits: p.ben,
      benefits_de: p.ben_de,
      stock: (p as any).stock ?? Math.floor(Math.random() * 100)
    });
  });

  return products;
};

export const initialProducts: Product[] = generateMockProducts();

export const getProducts = (): Product[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return initialProducts;
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};
