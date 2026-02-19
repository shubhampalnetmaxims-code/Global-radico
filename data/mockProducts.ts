
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
    { cat: '1', countries: ['India', 'Germany'], name: 'Soft Black Colour', name_de: 'Sanftes Schwarz', desc: 'Natural black shade for elegant hair.', desc_de: 'Natürlicher Schwarzton für elegantes Haar.', how: 'Mix with warm water, apply for 60 mins.', how_de: 'Mit warmem Wasser mischen, 60 Min. einwirken lassen.', inside: 'Indigo, Henna, Amla.', inside_de: 'Indigo, Henna, Amla.', ing: 'Indigofera Tinctoria, Lawsonia Inermis.', ing_de: 'Indigofera Tinctoria, Lawsonia Inermis.', ben: 'Chemical free, shiny hair.', ben_de: 'Chemiefrei, glänzendes Haar.', stock: 50 },
    { cat: '1', countries: ['India', 'Germany'], name: 'Dark Brown Organic', name_de: 'Dunkelbraun Bio', desc: 'Rich deep brown tones.', desc_de: 'Reiche, tiefe Brauntöne.', how: 'Paste application, rinse after 90 mins.', how_de: 'Paste auftragen, nach 90 Min. ausspülen.', inside: 'Walnut, Henna.', inside_de: 'Walnuss, Henna.', ing: 'Juglans Regia, Lawsonia Inermis.', ing_de: 'Juglans Regia, Lawsonia Inermis.', ben: 'Safe for all hair types.', ben_de: 'Sicher für alle Haartypen.', stock: 25 },
    { cat: '1', countries: ['India'], name: 'Kerala Indigo Powder', name_de: 'Kerala Indigo Pulver', desc: 'Traditional blue-black dye.', desc_de: 'Traditioneller blauschwarzer Farbstoff.', how: 'Two-step process with henna.', how_de: 'Zweistufiger Prozess mit Henna.', inside: 'Pure Indigo leaf powder.', inside_de: 'Reines Indigo-Blattpulver.', ing: '100% Indigofera Tinctoria.', ing_de: '100% Indigofera Tinctoria.', ben: 'Deepest black naturally.', ben_de: 'Tiefstes Schwarz auf natürliche Weise.', stock: 0 },
    { cat: '1', countries: ['Germany'], name: 'Alpine Ash Blonde', name_de: 'Alpines Aschblond', desc: 'Cool blonde tones for European textures.', desc_de: 'Kühle Blondtöne für europäische Texturen.', how: '30-45 min application.', how_de: '30-45 Min. Anwendung.', inside: 'Cassia, Rhubarb root.', inside_de: 'Cassia, Rhabarberwurzel.', ing: 'Cassia Obovata, Rheum Palmatum.', ing_de: 'Cassia Obovata, Rheum Palmatum.', ben: 'Brightens naturally blonde hair.', ben_de: 'Hellt natürlich blondes Haar auf.', stock: 12 },
    { cat: '1', countries: ['India', 'Germany'], name: 'Copper Brown Shine', name_de: 'Kupferbraun Glanz', desc: 'Warm earthy copper tones.', desc_de: 'Warme erdige Kupfertöne.', how: 'Apply to damp hair.', how_de: 'Auf das feuchte Haar auftragen.', inside: 'Henna, Hibiscus.', inside_de: 'Henna, Hibiskus.', ing: 'Lawsonia Inermis, Hibiscus Sabdariffa.', ing_de: 'Lawsonia Inermis, Hibiscus Sabdariffa.', ben: 'Vibrant reflections.', ben_de: 'Lebendige Reflexe.', stock: 44 },
    { cat: '1', countries: ['India'], name: 'Neem Infused Black', name_de: 'Neem-Schwarz', desc: 'Anti-bacterial coloring.', desc_de: 'Antibakterielle Färbung.', how: 'Massage paste into scalp and hair.', how_de: 'Paste in Kopfhaut und Haar einmassieren.', inside: 'Neem, Amla, Indigo.', inside_de: 'Neem, Amla, Indigo.', ing: 'Azadirachta Indica, Emblica Officinalis.', ing_de: 'Azadirachta Indica, Emblica Officinalis.', ben: 'Treats dandruff while coloring.', ben_de: 'Behandelt Schuppen während des Färbens.', stock: 100 },
    { cat: '1', countries: ['Germany'], name: 'Munich Berry Red', name_de: 'Münchner Beerenrot', desc: 'Modern fruity red tint.', desc_de: 'Moderne fruchtige Rottönung.', how: 'Mix with warm fruit juice or water.', how_de: 'Mit warmem Fruchtsaft oder Wasser mischen.', inside: 'Berry extracts, Henna.', inside_de: 'Beerenextrakte, Henna.', ing: 'Rubus Idaeus, Lawsonia Inermis.', ing_de: 'Rubus Idaeus, Lawsonia Inermis.', ben: 'Sweet scent and deep red.', ben_de: 'Süßer Duft und tiefes Rot.', stock: 8 },
    { cat: '1', countries: ['India', 'Germany'], name: 'Burgundy Wine Shade', name_de: 'Burgunder Wein-Ton', desc: 'Elegant sophisticated dark red.', desc_de: 'Elegantes, anspruchsvolles Dunkelrot.', how: '60 min soak.', how_de: '60 Min. einweichen.', inside: 'Beetroot powder, Henna.', inside_de: 'Rote-Bete-Pulver, Henna.', ing: 'Beta Vulgaris, Lawsonia Inermis.', ing_de: 'Beta Vulgaris, Lawsonia Inermis.', ben: 'Rich velvet finish.', ben_de: 'Reiches Samt-Finish.', stock: 22 },
    { cat: '1', countries: ['India'], name: 'Rajasthani Premium Henna', name_de: 'Rajasthani Premium Henna', desc: 'Finest triple-sifted henna.', desc_de: 'Feinstes, dreifach gesiebtes Henna.', how: 'Soak overnight, apply 3 hours.', how_de: 'Über Nacht einweichen, 3 Std. auftragen.', inside: '100% Rajasthani Henna.', inside_de: '100% Rajasthani Henna.', ing: 'Lawsonia Inermis.', ing_de: 'Lawsonia Inermis.', ben: 'Extreme conditioning.', ben_de: 'Extreme Pflege.', stock: 150 },
    { cat: '1', countries: ['Germany'], name: 'Nordic Light Blonde', name_de: 'Nordisches Lichtblond', desc: 'Sun-kissed organic effect.', desc_de: 'Sonnengeküsster Bio-Effekt.', how: 'Apply for 20-40 mins.', how_de: '20-40 Min. auftragen.', inside: 'Chamomile, Lemon peel.', inside_de: 'Kamille, Zitronenschale.', ing: 'Matricaria Chamomilla, Citrus Limonum.', ing_de: 'Matricaria Chamomilla, Citrus Limonum.', ben: 'Gentle brightening.', ben_de: 'Sanfte Aufhellung.', stock: 5 },

    // --- Category 2: Hair Treatment (ID: 2) ---
    { cat: '2', countries: ['India', 'Germany'], name: 'Argan Hair Serum', name_de: 'Argan Haar-Serum', desc: 'Pure Moroccon Argan for split ends.', desc_de: 'Reines marokkanisches Arganöl gegen Spliss.', how: 'Apply 2 drops to ends.', how_de: '2 Tropfen in die Spitzen geben.', inside: 'Argan Oil, Vitamin E.', inside_de: 'Arganöl, Vitamin E.', ing: 'Argania Spinosa.', ing_de: 'Argania Spinosa.', ben: 'Smooth and frizz-free.', ben_de: 'Glatt und ohne Frizz.', stock: 65 },
    { cat: '2', countries: ['India'], name: 'Brahmi Roots Mask', name_de: 'Brahmi Wurzelmaske', desc: 'Ayurvedic root strength.', desc_de: 'Ayurvedische Wurzelstärkung.', how: 'Apply weekly for 30 mins.', how_de: 'Wöchentlich 30 Min. auftragen.', inside: 'Brahmi, Ashwagandha.', inside_de: 'Brahmi, Ashwagandha.', ing: 'Bacopa Monnieri.', ing_de: 'Bacopa Monnieri.', ben: 'Prevents hair fall.', ben_de: 'Beugt Haarausfall vor.', stock: 30 },
    { cat: '2', countries: ['Germany'], name: 'Herbal Scalp Detox', name_de: 'Kräuter Kopfhaut-Detox', desc: 'Clarifying treatment.', desc_de: 'Klärungsbehandlung.', how: 'Massage into dry scalp.', how_de: 'In die trockene Kopfhaut einmassieren.', inside: 'Tea Tree, Clay.', inside_de: 'Teebaum, Tonerde.', ing: 'Melaleuca Alternifolia.', ing_de: 'Melaleuca Alternifolia.', ben: 'Removes buildup.', ben_de: 'Entfernt Ablagerungen.', stock: 15 },
    { cat: '2', countries: ['India', 'Germany'], name: 'Coconut Hair Butter', name_de: 'Kokos-Haarbutter', desc: 'Ultra-moisturizing balm.', desc_de: 'Ultra-feuchtigkeitsspendender Balsam.', how: 'Use as overnight mask.', how_de: 'Als Nachtmaske verwenden.', inside: 'Virgin Coconut, Shea.', inside_de: 'Natives Kokos, Shea.', ing: 'Cocos Nucifera.', ing_de: 'Cocos Nucifera.', ben: 'Extreme softness.', ben_de: 'Extreme Weichheit.', stock: 40 },
    { cat: '2', countries: ['India'], name: 'Amla Intensive Conditioner', name_de: 'Amla Intensiv-Spülung', desc: 'Vitamin C boost for hair.', desc_de: 'Vitamin C Schub für das Haar.', how: 'Apply after shampooing.', how_de: 'Nach dem Waschen auftragen.', inside: 'Amla, Shikakai.', inside_de: 'Amla, Shikakai.', ing: 'Emblica Officinalis.', ing_de: 'Emblica Officinalis.', ben: 'Adds volume.', ben_de: 'Verleiht Volumen.', stock: 80 },
    { cat: '2', countries: ['Germany'], name: 'Rosemary Bio-Oil', name_de: 'Rosmarin Bio-Öl', desc: 'Stimulating growth oil.', desc_de: 'Stimulierendes Wachstumsöl.', how: 'Massage before bedtime.', how_de: 'Vor dem Schlafengehen einmassieren.', inside: 'Pure Rosemary, Olive Oil.', inside_de: 'Reiner Rosmarin, Olivenöl.', ing: 'Rosmarinus Officinalis.', ing_de: 'Rosmarinus Officinalis.', ben: 'Healthier scalp.', ben_de: 'Gesündere Kopfhaut.', stock: 20 },
    { cat: '2', countries: ['India', 'Germany'], name: 'Aloe Hydration Gel', name_de: 'Aloe Feuchtigkeitsgel', desc: '99% pure organic aloe.', desc_de: '99% reine Bio-Aloe.', how: 'Leave-in for curls.', how_de: 'Leave-In für Locken.', inside: 'Aloe Vera Leaf Gel.', inside_de: 'Aloe Vera Blattgel.', ing: 'Aloe Barbadensis.', ing_de: 'Aloe Barbadensis.', ben: 'Weightless moisture.', ben_de: 'Schwerelose Feuchtigkeit.', stock: 55 },
    { cat: '2', countries: ['India'], name: 'Shikakai Wash Powder', name_de: 'Shikakai Waschpulver', desc: 'Natural herbal cleanser.', desc_de: 'Natürlicher Kräuterreiniger.', how: 'Mix with water to lather.', how_de: 'Mit Wasser zum Schäumen mischen.', inside: '100% Shikakai pods.', inside_de: '100% Shikakai Schoten.', ing: 'Acacia Concinna.', ing_de: 'Acacia Concinna.', ben: 'Gentle on follicles.', ben_de: 'Schonend für die Follikel.', stock: 120 },
    { cat: '2', countries: ['Germany'], name: 'Chamomile Shine Spray', name_de: 'Kamillen Glanzspray', desc: 'Light mist for blondes.', desc_de: 'Leichter Nebel für Blondinen.', how: 'Spray on finished style.', how_de: 'Auf das fertige Styling sprühen.', inside: 'Chamomile water, Silk.', inside_de: 'Kamillenwasser, Seide.', ing: 'Matricaria Recutita.', ing_de: 'Matricaria Recutita.', ben: 'Brilliant highlights.', ben_de: 'Brillante Highlights.', stock: 28 },
    { cat: '2', countries: ['India', 'Germany'], name: 'Tulsi Purifying Mask', name_de: 'Tulsi Reinigungsmaske', desc: 'Holy basil scalp care.', desc_de: 'Heiliges Basilikum Kopfhautpflege.', how: 'Apply for 10 mins.', how_de: '10 Min. einwirken lassen.', inside: 'Tulsi, Neem, Clay.', inside_de: 'Tulsi, Neem, Tonerde.', ing: 'Ocimum Sanctum.', ing_de: 'Ocimum Sanctum.', ben: 'Soothes inflammation.', ben_de: 'Beruhigt Entzündungen.', stock: 45 },

    // --- Category 3: Sunab Organic Hair Colour (ID: 3) ---
    { cat: '3', countries: ['India', 'Germany'], name: 'Sunab Jet Black', name_de: 'Sunab Tiefschwarz', desc: 'Premium long-lasting black.', desc_de: 'Premium langanhaltendes Schwarz.', how: 'Follow Sunab pro guide.', how_de: 'Sunab Pro-Anleitung folgen.', inside: 'High-grade Indigo blend.', inside_de: 'Hochwertige Indigo-Mischung.', ing: 'Special Sunab Formula.', ing_de: 'Spezielle Sunab Formel.', ben: 'Professional finish.', ben_de: 'Professionelles Finish.', stock: 10 },
    { cat: '3', countries: ['India', 'Germany'], name: 'Sunab Copper Glow', name_de: 'Sunab Kupferglanz', desc: 'Vibrant sun-kissed copper.', desc_de: 'Lebendiges, sonnengeküsstes Kupfer.', how: 'Heat-activated paste.', how_de: 'Wärmeaktivierte Paste.', inside: 'Exclusive Sunab Herbs.', inside_de: 'Exklusive Sunab Kräuter.', ing: 'Sunab Copper Blend.', ing_de: 'Sunab Kupfer-Mischung.', ben: 'Extreme pigment.', ben_de: 'Extremes Pigment.', stock: 18 },
    { cat: '3', countries: ['India'], name: 'Sunab Henna Plus', name_de: 'Sunab Henna Plus', desc: 'Enhanced conditioning henna.', desc_de: 'Verbessertes pflegendes Henna.', how: 'Soak for 2 hours before use.', how_de: '2 Std. vor Gebrauch einweichen.', inside: 'Sunab Selected Henna.', inside_de: 'Sunab ausgewähltes Henna.', ing: 'Pure Lawsonia.', ing_de: 'Reines Lawsonia.', ben: 'Darker stain.', ben_de: 'Dunklere Färbung.', stock: 50 },
    { cat: '3', countries: ['Germany'], name: 'Sunab Arctic Blonde', name_de: 'Sunab Arktisches Blond', desc: 'Coolest blonde shade.', desc_de: 'Kühlster Blondton.', how: '30 min quick application.', how_de: '30 Min. Schnellanwendung.', inside: 'Sunab Blonde Minerals.', inside_de: 'Sunab Blond-Mineralien.', ing: 'Sunab Silver Mix.', ing_de: 'Sunab Silber-Mix.', ben: 'Anti-yellow effect.', ben_de: 'Anti-Gelbstich-Effekt.', stock: 5 },
    { cat: '3', countries: ['India', 'Germany'], name: 'Sunab Deep Burgundy', name_de: 'Sunab Tiefburgund', desc: 'Luxurious wine color.', desc_de: 'Luxuriöse Weinfarbe.', how: 'Apply and cover with cap.', how_de: 'Auftragen und mit Haube abdecken.', inside: 'Sunab Berry Complex.', inside_de: 'Sunab Beeren-Komplex.', ing: 'Sunab Red 04.', ing_de: 'Sunab Rot 04.', ben: 'Rich texture.', ben_de: 'Reiche Textur.', stock: 15 },
    { cat: '3', countries: ['India'], name: 'Sunab Indigo Pure', name_de: 'Sunab Indigo Pur', desc: '100% pure Sunab quality.', desc_de: '100% reine Sunab-Qualität.', how: 'Mix with warm saline water.', how_de: 'Mit warmem Salzwasser mischen.', inside: 'Premium Indigo leaves.', inside_de: 'Premium Indigo Blätter.', ing: 'Sunab Indigo.', ing_de: 'Sunab Indigo.', ben: 'Blue-black depth.', ben_de: 'Blauschwarze Tiefe.', stock: 40 },
    { cat: '3', countries: ['Germany'], name: 'Sunab Rose Gold', name_de: 'Sunab Roségold', desc: 'Trendy pink metallic sheen.', desc_de: 'Trendiger rosa Metallschimmer.', how: 'Best on light blonde hair.', how_de: 'Am besten auf hellblondem Haar.', inside: 'Sunab Pearl Dust.', inside_de: 'Sunab Perlenstaub.', ing: 'Sunab Rose Formula.', ing_de: 'Sunab Rose Formel.', ben: 'Unique fashion shade.', ben_de: 'Einzigartiger Modeton.', stock: 7 },
    { cat: '3', countries: ['India', 'Germany'], name: 'Sunab Walnut Brown', name_de: 'Sunab Walnussbraun', desc: 'Subtle earthy brown.', desc_de: 'Subtiles erdiges Braun.', how: 'Double application method.', how_de: 'Doppelte Auftragsmethode.', inside: 'Sunab Nut Extracts.', inside_de: 'Sunab Nussextrakte.', ing: 'Sunab Earthy Mix.', ing_de: 'Sunab Erd-Mix.', ben: 'Covers stubborn greys.', ben_de: 'Deckt hartnäckiges Grau ab.', stock: 22 },
    { cat: '3', countries: ['India'], name: 'Sunab Herbal Black', name_de: 'Sunab Kräuter-Schwarz', desc: 'Quick 30-min coloring.', desc_de: 'Schnelle 30-Minuten-Färbung.', how: 'Apply on dry clean hair.', how_de: 'Auf trockenes, sauberes Haar auftragen.', inside: 'Sunab Herbal Speed.', inside_de: 'Sunab Kräuter-Speed.', ing: 'Sunab Fast Mix.', ing_de: 'Sunab Schnell-Mix.', ben: 'Time saving.', ben_de: 'Zeitsparend.', stock: 90 },
    { cat: '3', countries: ['Germany'], name: 'Sunab Gold Highlight', name_de: 'Sunab Gold Highlight', desc: 'Adds golden streaks.', desc_de: 'Fügt goldene Strähnen hinzu.', how: 'Paint on specific strands.', how_de: 'Auf bestimmte Strähnen malen.', inside: 'Sunab Gold Dust.', inside_de: 'Sunab Goldstaub.', ing: 'Sunab Highlight Formula.', ing_de: 'Sunab Highlight Formel.', ben: 'Dimension and depth.', ben_de: 'Dimension und Tiefe.', stock: 12 }
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
      stock: p.stock
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
