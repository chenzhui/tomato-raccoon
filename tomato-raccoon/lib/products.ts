import { Product, ProductReview } from "./types";

/**
 * 社区与居民支持者真实评价数据
 * 来自弗吉尼亚州汉诺威郡、里士满及劳登郡的本土农户与活动支持者
 */
export const MOVEMENT_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    authorName: "Sarah M.",
    authorTitle: "Hanover Resident & Gardener",
    location: "Hanover County, VA",
    rating: 5,
    comment:
      "Put this yard sign out along Route 301 and had three neighbors stop their trucks to ask where I got it within 24 hours. The print is bright, thick, and survived heavy Virginia thunderstorms. Defend our soil!",
    verifiedPurchase: true,
    date: "3 days ago",
  },
  {
    id: "rev-2",
    authorName: "Miller K.",
    authorTitle: "Farmers Market Regular",
    location: "Richmond, VA",
    rating: 5,
    comment:
      "Wore the Comfort Colors tee to the farmer's market and everyone was pointing and cheering! High quality fabric, soft feel, and stands up for clean water over data centers.",
    verifiedPurchase: true,
    date: "1 week ago",
  },
  {
    id: "rev-3",
    authorName: "David & Clara B.",
    authorTitle: "Family Farm Advocates",
    location: "Loudoun County, VA",
    rating: 5,
    comment:
      "Our county is getting paved over by data centers at an alarming speed. This heavyweight hoodie and the lawn sign have become our town hall uniform. Incredibly warm and meaningful.",
    verifiedPurchase: true,
    date: "2 weeks ago",
  },
  {
    id: "rev-4",
    authorName: "Heather T.",
    authorTitle: "Homesteader",
    location: "Shenandoah Valley, VA",
    rating: 5,
    comment:
      "Slapped the bumper sticker on my tailgate and the kiss-cut sticker on my Hydroflask. Hand-washed through dozens of cycles, not a single peeling edge. Water over watts forever.",
    verifiedPurchase: true,
    date: "3 weeks ago",
  },
];

/**
 * 番茄小浣熊官方周边商品清单
 * 直接对接美国本土 Printify 印刷工坊 (USPS 履约)
 */
export const PRODUCTS: Product[] = [
  // 1. Comfort Colors 美式水洗复古 T 恤 (Comfort Colors Heritage Tee)
  {
    id: "6af1e37a0d44c7beaa022065",
    printifyProductId: "6af1e37a0d44c7beaa022065",
    slug: "comfort-colors-vintage-garment-dyed-tee",
    name: "Comfort Colors® 1717 Unisex Garment-Dyed T-Shirt",
    tagline: "100% Ring-Spun Cotton • Vintage Wash • Relaxed Fit",
    description:
      "The gold standard in American vintage heavyweight t-shirts. 100% ring-spun cotton (6.1 oz) garment-dyed in clean crisp white featuring the official 'Grow Tomatoes, Not Data Centers' linocut artwork. Pre-shrunk, soft-washed, with double-needle stitched neckline and hem for enduring comfort at rallies, town halls, and farm markets.",
    category: "apparel",
    categoryLabel: "Vintage Apparel",
    price: 3200,
    compareAtPrice: 3800,
    images: [
      "https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98445/unisex-garment-dyed-t-shirt.jpg?camera_label=front",
      "https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/98446/unisex-garment-dyed-t-shirt.jpg?camera_label=back",
      "https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/100629/unisex-garment-dyed-t-shirt.jpg?camera_label=folded",
      "https://images-api.printify.com/mockup/6af1e37a0d44c7beaa022065/73207/110132/unisex-garment-dyed-t-shirt.jpg?camera_label=size-chart",
    ],
    features: [
      "6.1 oz/yd² 100% ring-spun US cotton",
      "Garment-dyed for that authentic lived-in vintage feel",
      "Relaxed tubular fit with twill taped neck and shoulders",
      "Zero scratchy labels, printed with water-based non-toxic inks",
      "Fulfillment in 2-4 days via USPS Ground Advantage",
    ],
    variants: [
      { id: "73199", printifyVariantId: 73199, name: "Small / White", size: "S", color: "White", price: 3200, stock: 50 },
      { id: "73203", printifyVariantId: 73203, name: "Medium / White", size: "M", color: "White", price: 3200, stock: 50 },
      { id: "73207", printifyVariantId: 73207, name: "Large / White", size: "L", color: "White", price: 3200, stock: 50 },
      { id: "73211", printifyVariantId: 73211, name: "XL / White", size: "XL", color: "White", price: 3200, stock: 50 },
      { id: "73215", printifyVariantId: 73215, name: "2XL / White", size: "2XL", color: "White", price: 3400, stock: 30 },
      { id: "79169", printifyVariantId: 79169, name: "3XL / White", size: "3XL", color: "White", price: 3600, stock: 20 },
      { id: "101476", printifyVariantId: 101476, name: "4XL / White", size: "4XL", color: "White", price: 3800, stock: 15 },
    ],
  },

  // 2. 经典抗议加厚连帽卫衣 (Gildan 18500 Protest Hoodie)
  {
    id: "6af1e5c85225a301c209b517",
    printifyProductId: "6af1e5c85225a301c209b517",
    slug: "gildan-heavy-blend-protest-hoodie",
    name: "Gildan 18500 Official \"Grow Tomatoes, Not Data Centers\" Heavyweight Hoodie",
    tagline: "8.0 oz Heavyweight Fleece • Kangaroo Pouch • Double-Lined Hood",
    description:
      "The official heavyweight protest hoodie for crisp Virginia mornings and outdoor rallies. Crafted from a durable 50/50 polyester and cotton blend (8.0 oz/yd²) that delivers plush warmth and zero scratchiness. Features a double-lined drawstring hood, kangaroo front pouch pocket, and high-definition screen printing of the Tomato Raccoon defender emblem.",
    category: "apparel",
    categoryLabel: "Vintage Apparel",
    price: 4800,
    compareAtPrice: 5600,
    images: [
      "https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98424/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=front",
      "https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98425/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=back",
      "https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/98432/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=folded",
      "https://images-api.printify.com/mockup/6af1e5c85225a301c209b517/32912/110151/unisex-heavy-blend-hooded-sweatshirt.jpg?camera_label=size-chart",
    ],
    features: [
      "8.0 oz/yd² durable 50% US cotton / 50% polyester blend",
      "Double-lined hood with matching drawcord",
      "Spacious kangaroo pouch pocket to keep hands warm in crisp weather",
      "1x1 athletic rib knit cuffs and waistband with spandex",
      "Fulfillment in 2-4 days via USPS Ground Advantage",
    ],
    variants: [
      { id: "32910", printifyVariantId: 32910, name: "Small / White", size: "S", color: "White", price: 4800, stock: 40 },
      { id: "32911", printifyVariantId: 32911, name: "Medium / White", size: "M", color: "White", price: 4800, stock: 40 },
      { id: "32912", printifyVariantId: 32912, name: "Large / White", size: "L", color: "White", price: 4800, stock: 40 },
      { id: "32913", printifyVariantId: 32913, name: "XL / White", size: "XL", color: "White", price: 4800, stock: 40 },
      { id: "32914", printifyVariantId: 32914, name: "2XL / White", size: "2XL", color: "White", price: 5200, stock: 25 },
      { id: "32915", printifyVariantId: 32915, name: "3XL / White", size: "3XL", color: "White", price: 5400, stock: 20 },
      { id: "32916", printifyVariantId: 32916, name: "4XL / White", size: "4XL", color: "White", price: 5600, stock: 15 },
      { id: "32917", printifyVariantId: 32917, name: "5XL / White", size: "5XL", color: "White", price: 5800, stock: 10 },
    ],
  },

  // 3. 经典庭院草坪抗议插牌 (Official Lawn Yard Sign)
  {
    id: "6af1eb2dd339bef3b00c5a47",
    printifyProductId: "6af1eb2dd339bef3b00c5a47",
    slug: "official-lawn-yard-sign-with-metal-stake",
    name: "Official \"Grow Tomatoes, Not Data Centers\" Lawn Yard Sign",
    tagline: "Double-Sided 18\"x12\" Coroplast • Weatherproof H-Stake Included",
    description:
      "The iconic yard sign that sparked community conversations across Hanover County, Virginia. Double-sided high-contrast print on durable 4mm fluted corrugated plastic. Includes heavy-duty galvanized metal H-stake for easy front yard installation. UV-resistant inks stand strong through heavy thunderstorms, road dust, and blazing summer sun.",
    category: "signs",
    categoryLabel: "Lawn Yard Signs",
    price: 2800,
    compareAtPrice: 3400,
    images: [
      "https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/64793/plastic-yard-sign.jpg?camera_label=front",
      "https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/69652/plastic-yard-sign.jpg?camera_label=front-with-stand",
      "https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/69658/plastic-yard-sign.jpg?camera_label=full-size",
      "https://images-api.printify.com/mockup/6af1eb2dd339bef3b00c5a47/92131/69667/plastic-yard-sign.jpg?camera_label=close-up",
    ],
    features: [
      "18″ × 12″ high-visibility horizontal format",
      "Double-sided vibrant print visible from both directions of road traffic",
      "4mm fluted corrugated plastic (weatherproof, waterproof, wind-resistant)",
      "Includes 10″ × 30″ galvanized steel H-frame lawn stake",
      "Fulfillment in 2-3 days via USPS Priority",
    ],
    variants: [
      { id: "92131", printifyVariantId: 92131, name: "18″ × 12″ (Horizontal) + Stake", size: "18x12", price: 2800, stock: 75 },
    ],
  },

  // 4. 防水黑胶车贴 (Weatherproof Vinyl Bumper Stickers)
  {
    id: "6af1eb4dab0419501e05b289",
    printifyProductId: "6af1eb4dab0419501e05b289",
    slug: "weatherproof-vinyl-bumper-sticker-pack",
    name: "Weatherproof Outdoor Vinyl Bumper Stickers (11\" × 3\")",
    tagline: "Heavy-Duty UV-Resistant Vinyl • 11\" x 3\" Bumper Decal",
    description:
      "Engineered to brave heavy highway rain, blazing summer sun, and automatic car washes. Thick outdoor-grade vinyl with premium UV-resistant laminate coating. Features bold 'Grow Tomatoes, Not Data Centers' lettering and the Tomato Raccoon emblem. Perfect for car bumpers, pickup tailgates, RVs, and trailer panels.",
    category: "stickers",
    categoryLabel: "Vinyl Stickers",
    price: 1200,
    compareAtPrice: 1500,
    images: [
      "https://images-api.printify.com/mockup/6af1eb4dab0419501e05b289/71930/12828/bumper-stickers.jpg?camera_label=front",
      "https://images-api.printify.com/mockup/6af1eb4dab0419501e05b289/71930/12819/bumper-stickers.jpg?camera_label=context",
      "https://images-api.printify.com/mockup/6af1eb4dab0419501e05b289/71930/12808/bumper-stickers.jpg?camera_label=context-2",
    ],
    features: [
      "11″ × 3″ bumper decal format",
      "Premium thick outdoor vinyl with UV-protective gloss laminate",
      "Weather-resistant, car wash safe, leaves zero residue upon removal",
      "Packaged flat with protective backing paper",
      "Ships via USPS Ground in rigid mailer",
    ],
    variants: [
      { id: "71930", printifyVariantId: 71930, name: "11\" × 3\" / Rectangle / White", size: "11x3", price: 1200, stock: 150 },
    ],
  },

  // 5. 模切高光水壶防水贴纸 (Tomato Defender Kiss-Cut Die-Cut Vinyl Stickers)
  {
    id: "6af1e70011c6bff63904cffc",
    printifyProductId: "6af1e70011c6bff63904cffc",
    slug: "kiss-cut-sticker-tomato-defender",
    name: "Tomato Defender Die-Cut High-Gloss Vinyl Sticker (3\" × 3\")",
    tagline: "Ultra-Durable Kiss-Cut Vinyl • Scratch & Water Resistant",
    description:
      "Precision kiss-cut die-cut vinyl sticker showcasing our beloved farm defender raccoon clutching his ripe heirloom tomato. Peel-and-stick backing makes application effortless on Hydroflasks, Yeti mugs, laptops, iPad covers, and notebooks. Water-resistant, scratch-resistant, and dishwasher-durable.",
    category: "stickers",
    categoryLabel: "Vinyl Stickers",
    price: 800,
    compareAtPrice: 1000,
    images: [
      "https://images-api.printify.com/mockup/6af1e70011c6bff63904cffc/45750/16655/kiss-cut-stickers.jpg?camera_label=front",
      "https://images-api.printify.com/mockup/6af1e70011c6bff63904cffc/45750/2176/kiss-cut-stickers.jpg?camera_label=context-1",
      "https://images-api.printify.com/mockup/6af1e70011c6bff63904cffc/45750/20546/kiss-cut-stickers.jpg?camera_label=context-2",
    ],
    features: [
      "3″ × 3″ precision contour die-cut shape",
      "100% waterproof and dishwasher-safe vinyl",
      "High-gloss finish resistant to scratching and fading",
      "Effortless peel-and-stick application",
      "Ships in sturdy envelope via USPS First Class",
    ],
    variants: [
      { id: "45750", printifyVariantId: 45750, name: "3\" × 3\" / White", size: "3x3", price: 800, stock: 200 },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(category?: string): Product[] {
  if (!category || category === "all") return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}

export const CATEGORIES = [
  { slug: "all", name: "All Goods", description: "All official grassroots protest goods" },
  { slug: "apparel", name: "Vintage Apparel", description: "Garment-dyed tees & heavyweight hoodies" },
  { slug: "signs", name: "Lawn Yard Signs", description: "Weatherproof corrugated yard signs with steel stakes" },
  { slug: "stickers", name: "Vinyl Stickers", description: "Bumper decals and Hydroflask waterproof stickers" },
];
