/* Woodish catalogue data. Edit this file to add products, prices and photos.
 *
 * Product:  { id, cat, name, desc, img, pos?, price?, tags? }
 *   cat    one of the category ids below
 *   img    path under assets/products/
 *   price  number in PKR, or leave out to show "Price on WhatsApp"
 *   pos    optional CSS object-position for the photo crop, e.g. "50% 30%"
 */
window.WOODISH = {
  phone: "923474747751",
  phoneDisplay: "0347 4747751",
  address: "Kuri Road, Amer Pura Mohalla Chowk, Rawalpindi 46000, Pakistan",
  maps: "https://maps.app.goo.gl/go39SuacWcFeY6tn8",
  open: 9, close: 21, tz: "Asia/Karachi",

  /* optional tile photos; otherwise the first product in the category is used */
  catImg: { sofas: "sofa-scene.jpg" },

  categories: [
    { id: "sofas",     name: "Sofas & Sectionals",       icon: "M4 11V8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3M3 11a2 2 0 0 1 2 2v2h14v-2a2 2 0 1 1 2 2v3H3v-3a2 2 0 0 1 0-4zM6 18v2M18 18v2" },
    { id: "beds",      name: "Beds & Bedroom Sets",      icon: "M3 18V6M21 18v-6a3 3 0 0 0-3-3H11v5M3 14h18M3 18h18M7 11.5a1.5 1.5 0 1 0 0-.01" },
    { id: "dressing",  name: "Dressing Tables & Mirrors", icon: "M6 21V12h12v9M4 12h16M12 3a4 4 0 0 1 4 4 4 4 0 0 1-8 0 4 4 0 0 1 4-4zM9 21v-4h6v4" },
    { id: "wardrobes", name: "Wardrobes & Cupboards",    icon: "M4 3h16v18H4zM12 3v18M9 11v2M15 11v2M6 21v1M18 21v1" },
    { id: "dining",    name: "Dining Tables & Chairs",   icon: "M3 9h18M5 9v10M19 9v10M8 9v4h8V9M7 19v-3M17 19v-3" },
    { id: "armchairs", name: "Armchairs & Accent Chairs", icon: "M6 11V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4M4 12a2 2 0 0 1 2 2v2h12v-2a2 2 0 1 1 2 2v1H4v-1a2 2 0 0 1 0-4zM7 18v3M17 18v3" },
    { id: "ottomans",  name: "Ottomans & Poufs",         icon: "M5 10c0-2 3-3 7-3s7 1 7 3v6c0 2-3 3-7 3s-7-1-7-3zM5 10c0 2 3 3 7 3s7-1 7-3" },
    { id: "tables",    name: "Coffee & Side Tables",     icon: "M4 8h16M6 8v11M18 8v11M6 14h12M9 4h6" },
    { id: "tv",        name: "TV Consoles & Units",      icon: "M3 5h18v11H3zM8 20h8M12 16v4M3 11h18" },
    { id: "storage",   name: "Shelves & Shoe Racks",     icon: "M5 3v18M19 3v18M5 8h14M5 13h14M5 18h14" },
    { id: "study",     name: "Study & Office",           icon: "M3 10h18M5 10v10M19 10v10M9 10v5h6v-5M8 6h8l1 4H7z" },
    { id: "kids",      name: "Kids Furniture",           icon: "M12 3l3 5h-6zM6 21v-8h12v8M8 13V9M16 13V9M6 17h12" },
    { id: "mattress",  name: "Mattresses",               icon: "M3 9h18v6H3zM3 15v3M21 15v3M7 12h3M13 12h4" },
    { id: "decor",     name: "Decor & Lighting",         icon: "M9 3h6l1 7a4 4 0 0 1-8 0zM12 14v7M8 21h8" }
  ],

  products: [
    { id: "wingback-chair",   cat: "armchairs", name: "Wingback Accent Chairs",   desc: "Soft-woven wingback seats in mocha with cream cushions and tapered wooden legs.", img: "wingback-chair.jpg", pos: "50% 40%", tags: ["Fabric", "Pair"] },
    { id: "round-ottoman",    cat: "ottomans",  name: "Round Cushion Ottoman",    desc: "A generous round pouf in oatmeal fabric. Seating, footrest or a statement piece.", img: "round-ottoman.jpg", pos: "50% 60%", tags: ["Fabric"] },
    { id: "sage-lounge-chair",cat: "armchairs", name: "Sage Lounge Chair",        desc: "Deep, low lounge chair in textured sage fabric with sculpted solid-wood arms.", img: "sage-lounge-chair.jpg", pos: "50% 55%", tags: ["Fabric", "Solid wood"] },
    { id: "boucle-chairs",    cat: "armchairs", name: "Bouclé Accent Chairs",     desc: "Cloud-soft bouclé seats on a dark walnut frame. Sold as a pair with a side table on request.", img: "boucle-chairs.jpg", tags: ["Bouclé", "Walnut"] },
    { id: "panel-bed",        cat: "beds",      name: "Panel Headboard Bed",      desc: "Dark walnut bed with a tall panelled headboard and a clean, sleigh-style footboard.", img: "panel-bed.jpg", pos: "50% 55%", tags: ["Solid wood", "Double / King"] },
    { id: "carved-bed-set",   cat: "beds",      name: "Carved Royal Bedroom Set", desc: "Hand-carved bed with inlay work, matching dressing table and side tables.", img: "carved-bed-set.jpg", pos: "50% 60%", tags: ["Carved", "Bedroom set"] },
    { id: "inlay-bed",        cat: "beds",      name: "Inlay Wooden Bed",         desc: "Ribbed headboard with a brass-style inlay panel. Statement bed, built for years.", img: "inlay-bed.jpg", pos: "50% 55%", tags: ["Inlay", "Solid wood"] },
    { id: "solid-wood-bed",   cat: "beds",      name: "Solid Wood Premium Bed",   desc: "Classic raised-panel bed in solid wood. Strong, durable and timeless.", img: "solid-wood-bed.jpg", pos: "50% 60%", tags: ["Solid wood", "Double / King"] },
    { id: "upholstered-bed",  cat: "beds",      name: "Upholstered Modern Bed",   desc: "Cream upholstered bed with a sculpted headboard and matching dressing table.", img: "upholstered-bed.jpg", pos: "50% 50%", tags: ["Upholstered", "Modern"] },
    { id: "sheesham-bed",     cat: "beds",      name: "Sheesham & Velvet Bed",    desc: "Premium sheesham wood frame with a padded velvet-finish headboard.", img: "sheesham-bed.jpg", pos: "50% 60%", tags: ["Sheesham", "Velvet"] }
  ]
};
