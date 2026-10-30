// Central branding + content config. Edit here, then run `npm run build`.
module.exports = {
  siteUrl: "https://nationalcementcompany.co.ke",
  name: "National Cement Company",
  phone: "+254100669861",
  phoneDisplay: "+254 100 669 861",
  phoneDisplayCompact: "+254100669861",
  whatsapp: "254100669861",
  email: "info@nationalcement.co.ke",
  location: "Nairobi, Kenya",
  gtmId: process.env.GTM_ID === undefined ? "GTM-PF32JHZP" : process.env.GTM_ID, // set GTM_ID="" to disable
  colors: { brand: "#0f2a44", accent: "#1e88e5" },
  footerTagline: "Driving sustainable construction and infrastructure development across Kenya.",
  copyright: "© 2026 National Cement Company. All Rights Reserved.",
  sameAs: [
    "https://www.facebook.com/nationalcementcompany",
    "https://www.linkedin.com/company/nationalcementcompany",
  ],
  openingHours: "Mo-Sa 08:00-18:00",

  // Asset paths (served from /public)
  assets: {
    logo: "/logos/logo.png",
    favicon: "/icons/favicon.ico",
    heroHome: "/banners/company.jpg",
    heroAbout: "/banners/company2.jpg",
  },

  // Original-site quirks reproduced for visual fidelity (set false to "fix")
  quirks: {
    // The live home page never defines the Tailwind brand/accent colours, so the
    // header title is default grey-800 and the footer has NO navy background.
    homeMissingBrandColors: true,
  },

  // Nav as shown on most pages
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Contact", href: "/contact" },
  ],

  home: {
    title: "National Cement Company Kenya | Cement Prices, Steel & Building Materials",
    description: "Buy quality cement, steel bars and construction materials in Kenya. National Cement Company offers competitive prices, reliable supply and instant call & WhatsApp ordering.",
    ogTitle: "National Cement Company Kenya | Cement & Building Materials",
    ogDescription: "Trusted supplier of cement and building materials in Kenya. Call now for best prices.",
    heroTitle: "Cement, Steel & Building Materials in Kenya",
    heroText: "Quality cement and construction materials supplied nationwide.",
    trust: ["✔ In Stock", "✔ Best Prices", "✔ Fast Calls", "✔ Kenya Wide"],
    offer: { title: "Portland Cement Offer", desc: "Limited time price on high-quality Portland Cement. Order today while stock lasts!", price: "KSh 520", oldPrice: "550" },
    testimonials: [
      { quote: "National Cement Company always delivers on time. Their cement quality is unmatched.", name: "John Mwangi", role: "Builder, Nairobi", img: "/images/client1.jpg", alt: "Client 1" },
      { quote: "I always get the best prices here. Fast response via WhatsApp makes ordering easy.", name: "Mary Wanjiru", role: "Contractor, Thika", img: "/images/client2.jpg", alt: "Client 2" },
      { quote: "Excellent service and high-quality steel bars. Truly Kenya-wide delivery works perfectly.", name: "Peter Otieno", role: "Engineer, Mombasa", img: "/images/client3.jpg", alt: "Client 3" },
    ],
    mapTitle: "Our Location",
    mapText: "Visit our office in Nairobi, Kenya. We are always ready to serve you!",
    // Same embed URL as the original (its place ID is a placeholder; replace with a real embed)
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.123456789!2d36.8219!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f107f1234567%3A0xabcdef123456!2sNational%20Cement%20Company!5e0!3m2!1sen!2ske!4v1672938472938!5m2!1sen!2ske",
  },

  about: {
    title: "About National Cement Company | Trusted Cement Manufacturer in Kenya",
    description: "Learn about National Cement Company, a trusted cement manufacturer in Kenya delivering high-quality cement for residential, commercial and infrastructure projects.",
    ogTitle: "About National Cement Company | Cement Manufacturer in Kenya",
    ogDescription: "Trusted cement manufacturer supplying quality cement across Kenya for construction and infrastructure projects.",
    heroTitle: "About National Cement Company",
    heroText: "A trusted cement manufacturer supporting Kenya’s construction and infrastructure growth.",
    who: "National Cement Company is a leading cement manufacturer in Kenya, supplying high-performance cement products for residential, commercial, and infrastructure development across the country.",
    mission: "To deliver durable, affordable, and sustainable cement solutions that support Kenya’s growing construction sector while maintaining the highest quality standards.",
    why: ["Consistent quality assurance", "Nationwide distribution network", "Environmentally responsible production", "Trusted by engineers, contractors, and developers"],
    trust: [["✔ In Stock", "Reliable supply"], ["✔ Nationwide", "Kenya-wide delivery"], ["✔ Trusted", "By professionals"], ["✔ Support", "Call & WhatsApp orders"]],
  },

  products: {
    title: "Building Materials & Cement Prices in Kenya | National Cement Company",
    description: "Buy cement, steel bars, nails and construction materials in Kenya. WhatsApp & Call orders available.",
    ogTitle: "Building Materials & Cement Prices in Kenya",
    ogDescription: "Cement, steel bars & construction materials. All products in stock. WhatsApp & Call orders available.",
    items: [
      { name: "Simba Cement 32.5R", price: 550, unit: "50kg bag", img: "/images/products/portland_pollozana.jpg" },
      { name: "Rhino Cement 32.5R", price: 600, unit: "50kg bag", img: "/images/products/rhino.jpg" },
      { name: "Simba Cement Power 42.5N", price: 680, unit: "50kg bag", img: "/images/products/powerplus.jpg" },
      { name: "Blue Triangle Cement 32.5R", price: 600, unit: "50kg bag", img: "/images/products/blue_triangle.jpg" },
      { name: "D8 Steel Bar", price: 420, unit: "6m", img: "/images/products/d8.jpg" },
      { name: "D10 Steel Bar", price: 580, unit: "6m", img: "/images/products/d10.jpg" },
      { name: "D12 Steel Bar", price: 750, unit: "6m", img: "/images/products/d12.jpg" },
      { name: "D16 Steel Bar", price: 1200, unit: "6m", img: "/images/products/d16.jpg" },
      { name: "D20 Steel Bar", price: 1600, unit: "6m", img: "/images/products/d20.jpg" },
      { name: "Binding Wire", price: 320, unit: "10kg roll", img: "/images/products/binding.jpg" },
      { name: "Construction Nails", price: 150, unit: "1kg pack", img: "/images/products/ordinary.jpg" },
    ],
  },

  sustainability: {
    title: "National Cement Company Sustainability | Responsible Cement Production",
    description: "Simba Cement is committed to sustainable cement production through energy efficiency, waste reduction and environmental responsibility.",
    ogDescription: "Simba Cement is committed to sustainable and environmentally responsible cement production in Kenya.",
    heroTitle: "Sustainability & Responsibility",
    cards: [
      ["Energy Efficiency", "Advanced production systems reduce energy consumption and emissions."],
      ["Environmental Protection", "Strict compliance with environmental standards and regulations."],
      ["Community Impact", "Supporting communities through infrastructure and employment."],
    ],
    deals: [
      { title: "Portland Cement Offer", desc: "High-quality cement at a special price!", price: "KSh 520", oldPrice: "550" },
      { title: "Rhino Cement Deal", desc: "Limited time offer for Rhino Cement 50kg bag.", price: "KSh 540", oldPrice: "570" },
      { title: "Steel Bar Discount", desc: "Get D12 Steel Bars at discounted rate.", price: "KSh 700", oldPrice: "750" },
    ],
  },

  careers: {
    title: "Careers at National Cement Company | Join Our Team",
    description: "Explore career opportunities at Simba Cement. Join a leading cement manufacturer in Kenya.",
    keywords: "Simba Cement careers, cement jobs Kenya",
    heroTitle: "Careers at National Cement Company",
    jobs: [
      { title: "Sales & Brand Ambassador", desc: "Promote the brand, engage clients, and drive sales growth across Kenya." },
      { title: "Engineer", desc: "Support operations, quality control, and construction projects execution." },
    ],
  },

  contact: {
    title: "Contact National Cement Company | Cement Supplier Kenya",
    description: "Contact National Cement Company for cement orders, pricing, and customer support across Kenya.",
    heroTitle: "Contact Us",
    heroText: "We’re here to support your construction needs",
  },
};
