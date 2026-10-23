/**
 * Product Seeder – run with: node utils/seedProducts.js
 * Seeds the database with 30+ rich products across multiple categories.
 */
require("dotenv").config()
const mongoose = require("mongoose")
const Product = require("../models/Product")

const MONGO_URI = process.env.MONGO_URI

const products = [
  // Electronics
  {
    title: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancellation with 30-hour battery life. Crystal-clear call quality with precise voice pickup. Exceptional sound quality with LDAC support.",
    price: 29990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    stock: 25,
    category: "Electronics"
  },
  {
    title: "Apple AirPods Pro (2nd Gen)",
    description: "Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio with dynamic head tracking. MagSafe Charging Case with precision finding.",
    price: 24900,
    image: "https://images.unsplash.com/photo-1588423771073-b8903fead85b?w=600",
    stock: 40,
    category: "Electronics"
  },
  {
    title: "Samsung Galaxy Watch 6 Classic",
    description: "Premium smartwatch with rotating bezel, comprehensive health tracking, 40hr battery, 1.5\" Super AMOLED display. Heart rate, ECG, blood oxygen monitoring.",
    price: 34999,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600",
    stock: 18,
    category: "Electronics"
  },
  {
    title: "Apple iPad Air 11\" M2",
    description: "Supercharged by the M2 chip. Ultra Retina Display with True Tone and P3 wide color. Works with Apple Pencil Pro and Magic Keyboard.",
    price: 74900,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600",
    stock: 12,
    category: "Electronics"
  },
  {
    title: "Logitech MX Master 3S Mouse",
    description: "High-precision 8,000 DPI sensor works on any surface including glass. MagSpeed electromagnetic scrolling. Ultra-quiet clicks. Connect up to 3 devices.",
    price: 9995,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600",
    stock: 50,
    category: "Electronics"
  },
  {
    title: "Anker 65W GaN Fast Charger",
    description: "Ultra-compact GaN charger with 3 ports. Charges MacBook Pro, iPad, and iPhone simultaneously. PowerIQ 4.0 intelligent power management.",
    price: 3499,
    image: "https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=600",
    stock: 75,
    category: "Electronics"
  },
  {
    title: "JBL Charge 5 Portable Speaker",
    description: "Powerful sound with bold bass. IP67 waterproof and dustproof. 20 hours playtime. Built-in power bank. Party Boost to connect multiple JBL speakers.",
    price: 12999,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    stock: 30,
    category: "Electronics"
  },
  // Fashion
  {
    title: "Classic Slim-Fit Oxford Shirt",
    description: "Premium 100% cotton oxford shirt with a refined slim-fit silhouette. Button-down collar. Machine washable. Available in multiple colors.",
    price: 2499,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=600",
    stock: 100,
    category: "Fashion"
  },
  {
    title: "Premium Leather Bifold Wallet",
    description: "Genuine full-grain leather wallet with RFID blocking. 8 card slots, 2 bill compartments. Slim profile, built to last a lifetime.",
    price: 1899,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
    stock: 60,
    category: "Fashion"
  },
  {
    title: "Unisex Oversized Graphic Hoodie",
    description: "Ultra-soft 350gsm fleece hoodie with premium hand feel. Kangaroo pocket, drawstring hood. Pre-shrunk. Great for casual everyday wear.",
    price: 1999,
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600",
    stock: 80,
    category: "Fashion"
  },
  {
    title: "Ray-Ban Wayfarer Classic Sunglasses",
    description: "Iconic style with G-15 lens. UV400 protection. Acetate frame. Adjustable nose pads. Comes with carrying case and cleaning cloth.",
    price: 11990,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600",
    stock: 35,
    category: "Fashion"
  },
  {
    title: "Nike Air Force 1 '07 White",
    description: "The radiance lives on in the Nike Air Force 1 '07. Stitching details and the classic shape look like new. Perforated toe box for breathability.",
    price: 7495,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    stock: 45,
    category: "Fashion"
  },
  {
    title: "Casio G-Shock GA-2100",
    description: "Carbon Core Guard structure for superior impact resistance. 200M water resistance. Thin case with clear coating. World time, stopwatch, and countdown timer.",
    price: 8999,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    stock: 22,
    category: "Fashion"
  },
  // Home & Kitchen
  {
    title: "Philips 3000 Series Air Fryer 4.1L",
    description: "Rapid Air Technology for crispiest results with up to 90% less fat. 4.1L capacity feeds a family of 4. Dishwasher-safe parts. Timer with auto shut-off.",
    price: 8995,
    image: "https://images.unsplash.com/photo-1648170288847-7f8e23c8b4e7?w=600",
    stock: 20,
    category: "Home & Kitchen"
  },
  {
    title: "Morphy Richards Pop-Up Toaster 2-Slice",
    description: "6-level browning control. Cancel, Defrost, Reheat functions. Removable crumb tray. High-lift feature for small breads. Cord storage.",
    price: 1699,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    stock: 55,
    category: "Home & Kitchen"
  },
  {
    title: "Milton Thermosteel Flip Lid Flask 1L",
    description: "Double wall stainless steel insulation. Keeps beverages hot for 24 hours and cold for 48 hours. Food-grade BPA-free. Leak-proof flip lid.",
    price: 999,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
    stock: 120,
    category: "Home & Kitchen"
  },
  {
    title: "Bombay Dyeing Microfiber Bed Sheet Set",
    description: "Ultra-soft 400-thread count microfiber. 1 king fitted sheet, 1 flat sheet, 2 pillow covers. Wrinkle resistant. Easy care – machine washable.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
    stock: 40,
    category: "Home & Kitchen"
  },
  {
    title: "Prestige Nakshatra Plus Pressure Cooker 5L",
    description: "Metallic safety plug with gasket release system. Sturdy stainless steel body with induction base. Suitable for all cooktops. 5 year warranty.",
    price: 2299,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
    stock: 30,
    category: "Home & Kitchen"
  },
  // Beauty & Personal Care
  {
    title: "Minimalist 2% Salicylic Acid Serum 30ml",
    description: "Targets whiteheads, blackheads, and open pores. Oil-free formula with low pH for effective exfoliation. Suitable for oily and combination skin.",
    price: 499,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600",
    stock: 200,
    category: "Beauty"
  },
  {
    title: "Mamaearth Ubtan Face Wash 150ml",
    description: "Natural face wash with Turmeric and Saffron. Fights tan and brightens skin naturally. Free from Sulphate, Paraben and Toxins. Dermatologist tested.",
    price: 299,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600",
    stock: 150,
    category: "Beauty"
  },
  {
    title: "Philips BT3231 Cordless Beard Trimmer",
    description: "40 length settings from 0.5 to 20mm. Self-sharpening stainless steel blades. Run up to 60 minutes on 1 hour charge. Washable. Skin-friendly rounded tips.",
    price: 1995,
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600",
    stock: 65,
    category: "Beauty"
  },
  {
    title: "Forest Essentials Almond & Rose Water Soap",
    description: "Luxury Ayurvedic cold process soap. Rich in botanical extracts, milk, and natural oils. Intensely moisturizing formula. Gentle on sensitive skin.",
    price: 795,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600",
    stock: 90,
    category: "Beauty"
  },
  // Books
  {
    title: "Atomic Habits – James Clear",
    description: "A proven framework for improving every day. Learn how tiny changes in behavior can lead to remarkable results. #1 New York Times bestseller.",
    price: 499,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
    stock: 300,
    category: "Books"
  },
  {
    title: "The Psychology of Money – Morgan Housel",
    description: "19 short stories exploring the strange ways people think about money. Timeless lessons on wealth, greed, and happiness. A must-read for every investor.",
    price: 399,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600",
    stock: 250,
    category: "Books"
  },
  {
    title: "Rich Dad Poor Dad – Robert Kiyosaki",
    description: "The international bestseller about what the rich teach their kids about money. First published in 1997 and sold over 40 million copies worldwide.",
    price: 349,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
    stock: 280,
    category: "Books"
  },
  // Sports & Fitness
  {
    title: "Boldfit Pro Resistance Bands Set",
    description: "Set of 5 exercise bands with varying resistance levels. Made from natural latex. Non-slip design. Includes carrying bag. Suitable for all fitness levels.",
    price: 699,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    stock: 180,
    category: "Sports"
  },
  {
    title: "Strauss Foam Yoga Mat 6mm",
    description: "Non-slip textured surface for better grip. 6mm thickness for superior comfort and support. Sweat-resistant closed cell surface. Carrying strap included.",
    price: 799,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600",
    stock: 100,
    category: "Sports"
  },
  {
    title: "Cosco Hurricane Football Size 5",
    description: "Professional quality football with machine-stitched polyurethane cover. Butyl bladder for maximum air retention. FIFA-approved panels design.",
    price: 999,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600",
    stock: 60,
    category: "Sports"
  },
  {
    title: "Skullcandy Crusher Evo Wireless",
    description: "Patented Skullcandy bass technology with adjustable haptic bass. 40-hour total battery. Personal Sound personalization. Rapid Charge: 10 min = 4 hours.",
    price: 14999,
    image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    stock: 28,
    category: "Electronics"
  },
  {
    title: "Mi Smart Band 8 Pro",
    description: "1.74\" AMOLED display, 150+ workout modes. 14-day battery life. Blood oxygen and continuous heart rate monitoring. Sleep quality tracking.",
    price: 5999,
    image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=600",
    stock: 85,
    category: "Electronics"
  },
  {
    title: "Sennheiser HD 560S Over-Ear Headphones",
    description: "Open-back audiophile headphones with natural sound reproduction. Ultra-linear transducer design. Detachable cable. Foldable earcups for storage.",
    price: 18990,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600",
    stock: 15,
    category: "Electronics"
  },
  {
    title: "Ember Temperature Control Smart Mug 2",
    description: "Control the exact temperature of your coffee or tea from 50°C to 62.5°C. 80-min battery life. Pairs with Ember app. Auto sleep mode.",
    price: 12499,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
    stock: 20,
    category: "Home & Kitchen"
  },
  {
    title: "Peter England Men's Formal Trousers",
    description: "Slim-fit formal trousers with flat front. 65% polyester, 35% viscose blend. Machine washable. Available in classic navy and charcoal grey.",
    price: 1799,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600",
    stock: 70,
    category: "Fashion"
  },
  {
    title: "Cetaphil Moisturizing Cream 250g",
    description: "Dermatologist-recommended for sensitive skin. Provides long-lasting moisturization. Non-comedogenic and fragrance-free. For dry to normal skin.",
    price: 549,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600",
    stock: 160,
    category: "Beauty"
  }
]

async function seed() {
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Connected to MongoDB")

    const existing = await Product.countDocuments()
    if (existing > 0) {
      console.log(`Found ${existing} existing products. Skipping seed to avoid duplicates.`)
      console.log("To re-seed, delete all products first or pass --force flag.")
      if (!process.argv.includes("--force")) {
        process.exit(0)
      }
      await Product.deleteMany({})
      console.log("Deleted all existing products.")
    }

    const inserted = await Product.insertMany(products)
    console.log(`✅ Successfully seeded ${inserted.length} products!`)
  } catch (err) {
    console.error("Seed error:", err)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seed()
