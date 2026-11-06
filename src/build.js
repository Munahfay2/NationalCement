#!/usr/bin/env node
// Zero-dependency static site generator: renders src/site.config.js into dist/.
const fs = require("fs");
const path = require("path");
const C = require("./site.config");

const ROOT = path.join(__dirname, "..");
const DIST = path.join(ROOT, "dist");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tel = `tel:${C.phone}`;
const wa = (text) => `https://wa.me/${C.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : "");

// ---------- shared partials ----------
function head({ title, description, ogTitle, ogDescription, keywords, canonicalPath, brandColors = true, heroImg, schema }) {
  const gtm = C.gtmId ? `
<!-- Google Tag Manager -->
<script>
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${C.gtmId}');
</script>` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<link rel="icon" href="${C.assets.favicon}" type="image/x-icon">
<link rel="shortcut icon" href="${C.assets.favicon}" type="image/x-icon">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ""}
<link rel="canonical" href="${C.siteUrl}${canonicalPath}">
<meta name="robots" content="index, follow">
<meta name="author" content="${esc(C.name)} Kenya">
${ogTitle || ogDescription ? `<meta property="og:title" content="${esc(ogTitle || title)}">
<meta property="og:description" content="${esc(ogDescription || description)}">
<meta property="og:image" content="${C.siteUrl}${C.assets.heroHome}">
<meta property="og:url" content="${C.siteUrl}${canonicalPath}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">` : ""}
${gtm}
${schema ? `<script type="application/ld+json">${JSON.stringify(schema)}</script>` : ""}
<script src="https://cdn.tailwindcss.com"></script>
${brandColors ? `<script>tailwind.config={theme:{extend:{colors:{brand:'${C.colors.brand}',accent:'${C.colors.accent}'}}}}</script>` : ""}
${heroImg ? `<style>.hero-bg{background-image:url('${heroImg}');background-size:cover;background-position:center;}</style>` : ""}
</head>`;
}

const gtmNoscript = () => C.gtmId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${C.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : "";

function header({ nav = C.nav, desktopActive = {}, mobileActive = null }) {
  const d = nav.map((n) => `<a class='${desktopActive[n.label] || "hover:text-accent"}' href='${n.href}'>${n.label}</a>`).join("\n      ");
  const m = C.nav.map((n) => `<a class='block py-3 mobile-link${n.label === mobileActive ? " text-accent font-semibold" : ""}' href='${n.href}'>${n.label}</a>`).join("\n    ");
  return `
<header class="bg-white shadow sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
    <a href="/" class="flex items-center space-x-3">
      <img src="${C.assets.logo}" alt="${esc(C.name)} Logo" class="h-10 w-auto">
      <h1 class="text-2xl font-bold text-brand">${esc(C.name)}</h1>
    </a>
    <nav class="hidden md:flex space-x-8 font-medium">
      ${d}
    </nav>
    <button id="menu-btn" aria-label="Toggle menu" aria-controls="mobile-menu" aria-expanded="false" class="md:hidden text-3xl focus:outline-none">☰</button>
  </div>
  <nav id="mobile-menu" class="md:hidden overflow-hidden max-h-0 transition-all duration-300 ease-in-out bg-white border-t px-4 font-medium">
    ${m}
    <div class="mt-4 mb-4 flex gap-3">
      <a href="${tel}" class="flex-1 text-center bg-brand text-white py-3 rounded-lg">📞 Call</a>
      <a href="${wa()}" class="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg">💬 WhatsApp</a>
    </div>
  </nav>
</header>`;
}

function footer({ cols = 3, links = [["About Us", "/about"], ["Products", "/products"]], phone = C.phoneDisplay }) {
  return `
<footer class="bg-brand text-gray-300 pt-16">
  <div class="max-w-7xl mx-auto px-4 grid md:grid-cols-${cols} gap-10 pb-10">
    <div>
      <h5 class="text-white text-xl font-semibold mb-4">${esc(C.name)}</h5>
      <p>${esc(C.footerTagline)}</p>
    </div>
    <div>
      <h6 class="text-white font-semibold mb-4">Quick Links</h6>
      <ul class="space-y-2">
        ${links.map(([l, h]) => `<li><a href='${h}'>${l}</a></li>`).join("\n        ")}
      </ul>
    </div>
    <div>
      <h6 class="text-white font-semibold mb-4">Contact</h6>
      <p>${esc(C.location)}</p>
      <p><a href="${tel}">${phone}</a></p>
    </div>
  </div>
  <div class="border-t border-white/20 py-6 text-center text-sm">${esc(C.copyright)}</div>
</footer>`;
}

function floatingCta({ callClass = "bg-accent", wrap = "z-50", shadow = "shadow", extra = "" }) {
  return `
<div class="fixed bottom-6 right-6 flex flex-col gap-4 ${wrap}">
  <a href="${wa()}" class="bg-green-600 text-white p-4 rounded-full ${shadow}">WhatsApp</a>
  <a href="${tel}" class="${callClass} text-white p-4 rounded-full ${shadow}">Call</a>${extra}
</div>`;
}

const popup = (id, badgeClass, badge, o, btnHref, btnText, closeFn) => `
<div id="${id}" class="fixed inset-0 bg-black/70 hidden items-center justify-center z-50 px-4" role="dialog" aria-modal="true">
  <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative text-center">
    <button onclick="${closeFn}()" aria-label="Close" class="absolute top-3 right-3 text-gray-500 text-xl">✕</button>
    <span class="inline-block ${badgeClass} text-white text-sm px-4 py-1 rounded-full mb-4">${badge}</span>
    <h3 id="${id}Title" class="text-2xl font-bold mb-3">${esc(o.title)}</h3>
    <p id="${id}Desc" class="text-gray-600 mb-4">${esc(o.desc)}</p>
    ${o.price ? `<p id="${id}Price" class="text-3xl font-bold text-green-600 mb-6">${o.price} <span class="text-sm text-gray-500 line-through">${o.oldPrice}</span></p>` : ""}
    <a id="${id}Btn" href="${btnHref}" class="block bg-green-600 text-white py-4 rounded-xl font-semibold text-lg">${btnText}</a>
  </div>
</div>`;

const scripts = (extra = "") => `
<script src="/js/menu.js"></script>
${extra}
</body>
</html>`;

// rotating popup: shows after 1.5s; re-opens every `ms` while cycling items (original behaviour)
const rotatingPopupJs = (id, items, ms, closeFn, withPrice, btnFn) => `<script>
(function(){
  var items=${JSON.stringify(items)},i=0,p=document.getElementById('${id}');
  function show(k){var it=items[k];
    document.getElementById('${id}Title').textContent=it.title;
    document.getElementById('${id}Desc').textContent=it.desc;
    ${withPrice ? `document.getElementById('${id}Price').innerHTML=it.price+' <span class="text-sm text-gray-500 line-through">'+it.oldPrice+'</span>';` : ""}
    ${btnFn ? `document.getElementById('${id}Btn').href=it.href;` : ""}
    p.style.display='flex';}
  window.${closeFn}=function(){p.style.display='none';};
  p.addEventListener('click',function(e){if(e.target===p)window.${closeFn}();});
  setTimeout(function(){show(i);${items.length > 1 ? `setInterval(function(){i=(i+1)%items.length;show(i);},${ms});` : ""}},1500);
})();
</script>`;

// ---------- pages ----------
const pages = {};
const H = C.home;

pages["index.html"] = head({
  title: H.title, description: H.description, ogTitle: H.ogTitle, ogDescription: H.ogDescription, canonicalPath: "",
  brandColors: !C.quirks.homeMissingBrandColors, heroImg: C.assets.heroHome,
  schema: { "@context": "https://schema.org", "@type": "LocalBusiness", name: C.name, url: C.siteUrl, logo: C.siteUrl + C.assets.logo, telephone: C.phone, address: { "@type": "PostalAddress", addressCountry: "KE" }, openingHours: C.openingHours, sameAs: C.sameAs },
}) + `
<body class="text-gray-800">
${header({ desktopActive: { Contact: "text-accent font-semibold" }, mobileActive: "Contact" })}
${gtmNoscript()}
<!-- OFFER POPUP (house promo — the site's only "ad" placement) -->
${popup("offerPopup", "bg-red-600", "🔥 GREAT DEAL", H.offer, tel, "📞 Get Deal Now", "closeOffer")}

<section class="hero-bg text-white">
<div class="bg-black/60">
<div class="max-w-7xl mx-auto px-4 py-28 text-center">
<h2 class="text-4xl md:text-5xl font-bold mb-6">${esc(H.heroTitle)}</h2>
<p class="text-lg max-w-3xl mx-auto mb-8">${esc(H.heroText)}</p>
<div class="flex justify-center gap-4 flex-wrap">
<a class='bg-blue-600 px-8 py-4 rounded font-semibold' href='/products'>View Products</a>
<a href="${tel}" class="bg-white text-black px-8 py-4 rounded font-semibold">Call Now</a>
</div>
</div>
</div>
</section>

<section class="py-12 bg-gray-100">
<div class="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-6 text-center">
${H.trust.map((t, i) => `<div><strong${i === 0 ? ' class="text-green-600"' : ""}>${t}</strong></div>`).join("\n")}
</div>
</section>

<section class="py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 text-center">
    <h3 class="text-3xl font-bold mb-12">What Our Clients Say</h3>
    <div class="grid md:grid-cols-3 gap-10">
${H.testimonials.map((t) => `      <div class="bg-white rounded-xl shadow p-6 space-y-4">
        <p class="text-gray-600">"${esc(t.quote)}"</p>
        <div class="flex items-center justify-center space-x-3 mt-4">
          <img src="${t.img}" alt="${esc(t.alt)}" class="h-10 w-10 rounded-full object-cover">
          <div class="text-left"><p class="font-semibold">${esc(t.name)}</p><p class="text-sm text-gray-500">${esc(t.role)}</p></div>
        </div>
      </div>`).join("\n")}
    </div>
  </div>
</section>

<section class="py-20 bg-white">
<div class="max-w-7xl mx-auto px-4 text-center mb-8">
<h3 class="text-3xl font-bold mb-4">${esc(H.mapTitle)}</h3>
<p class="text-gray-600">${esc(H.mapText)}</p>
</div>
<div class="w-full h-96 px-4">
<iframe title="Map" src="${H.mapEmbed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" class="rounded-xl shadow"></iframe>
</div>
</section>
${floatingCta({ callClass: "bg-blue-600", wrap: "z-50" })}
${footer({})}
${scripts(rotatingPopupJs("offerPopup", [H.offer], 0, "closeOffer", true))}`;

const A = C.about;
pages["about.html"] = head({ title: A.title, description: A.description, ogTitle: A.ogTitle, ogDescription: A.ogDescription, canonicalPath: "/about", heroImg: C.assets.heroAbout,
  schema: { "@context": "https://schema.org", "@type": "LocalBusiness", name: C.name, url: C.siteUrl, logo: C.siteUrl + C.assets.logo, telephone: C.phone, address: { "@type": "PostalAddress", addressCountry: "KE" } } }) + `
<body class="text-gray-800">
${gtmNoscript()}
${header({ nav: C.nav.filter((n) => n.label !== "Sustainability") })}
<section class="hero-bg text-white">
<div class="bg-black/60 py-24 text-center px-4">
<h2 class="text-4xl font-bold mb-4">${esc(A.heroTitle)}</h2>
<p class="max-w-3xl mx-auto">${esc(A.heroText)}</p>
</div>
</section>
<section class="py-20 max-w-6xl mx-auto px-4">
<h3 class="text-3xl font-bold mb-6">Who We Are</h3>
<p class="mb-6">${esc(A.who)}</p>
<h3 class="text-2xl font-bold mb-4">Our Mission</h3>
<p class="mb-6">${esc(A.mission)}</p>
<h3 class="text-2xl font-bold mb-4">Why Choose ${esc(C.name)}</h3>
<ul class="list-disc list-inside space-y-2 mb-10">
${A.why.map((w) => `<li>${esc(w)}</li>`).join("\n")}
</ul>
<div class="grid md:grid-cols-4 gap-6 text-center bg-gray-100 p-8 rounded-xl">
${A.trust.map(([a, b]) => `<div><strong>${a}</strong><br>${esc(b)}</div>`).join("\n")}
</div>
</section>
${floatingCta({ wrap: "", shadow: "" })}
${footer({ cols: 4, links: [["About", "/about"], ["Products", "/products"], ["Contact", "/contact"]], phone: C.phoneDisplayCompact })}
${scripts()}`;

const P = C.products;
pages["products.html"] = head({ title: P.title, description: P.description, ogTitle: P.ogTitle, ogDescription: P.ogDescription, canonicalPath: "/products" }) + `
<body class="text-gray-800">
${header({ desktopActive: { Products: "hover:text-accent font-semibold" } })}
${gtmNoscript()}
<section class="bg-brand text-white py-20 text-center">
<h1 class="text-4xl font-bold mb-4">Building Materials &amp; Prices</h1>
<p class="max-w-4xl mx-auto text-lg">Cement, steel bars, nails &amp; construction materials.
<span class="text-green-400 font-semibold">All products are in stock</span> and available for WhatsApp or call orders.</p>
</section>
<section class="py-20">
<div id="productGrid" class="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-3 gap-10">
${P.items.map((p, i) => `  <div class="bg-white rounded-xl shadow p-6 relative">
    <span class="absolute top-4 right-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">In Stock</span>
    <img src="${p.img}" alt="${esc(p.name)}" class="rounded mb-4 w-full h-56 object-contain">
    <h3 class="text-xl font-semibold">${esc(p.name)}</h3>
    <p class="text-sm text-gray-500">${esc(p.unit)}</p>
    <p class="text-2xl font-bold text-accent mt-2">KSh ${p.price.toLocaleString("en-US")}</p>
    <button data-product="${i}" class="view-product mt-4 w-full bg-accent text-white py-3 rounded">View Product</button>
  </div>`).join("\n")}
</div>
</section>

<div id="productModal" class="fixed inset-0 bg-black/60 hidden items-center justify-center z-50 px-4" role="dialog" aria-modal="true">
<div class="bg-white rounded-xl p-6 max-w-md w-full relative">
<button onclick="closeModal()" aria-label="Close" class="absolute top-3 right-4 text-xl">✕</button>
<img id="modalImg" alt="" class="rounded mb-4 w-full h-56 object-contain">
<h3 id="modalName" class="text-2xl font-bold mb-2"></h3>
<p id="modalPrice" class="text-xl text-accent font-semibold"></p>
<p id="modalUnit" class="text-sm text-gray-500 mb-4"></p>
<input id="modalQty" type="number" min="1" value="1" aria-label="Quantity" class="w-full border rounded px-3 py-2 mb-4">
<button onclick="addToCart()" class="w-full bg-green-600 text-white py-3 rounded font-semibold">Add to Cart</button>
</div>
</div>

<div id="floatingCart" class="fixed bottom-6 left-6 bg-white shadow-xl rounded-xl p-4 w-80 max-h-96 overflow-y-auto hidden z-50">
<h3 class="text-xl font-bold mb-3">Your Cart</h3>
<div id="cartItems" class="space-y-3 mb-4"></div>
<p class="font-semibold text-lg">Total: KSh <span id="cartTotal">0</span></p>
<button onclick="checkoutWhatsApp()" class="mt-3 w-full bg-green-600 text-white py-3 rounded font-semibold">Checkout via WhatsApp</button>
<button onclick="toggleCart()" class="mt-2 w-full text-gray-500">Close Cart</button>
</div>
${floatingCta({ shadow: "shadow-lg", extra: `\n  <button onclick="toggleCart()" class="bg-brand text-white p-4 rounded-full shadow-lg">🛒 Cart<span id="cartCount" class="hidden"></span></button>` })}
${footer({})}
${scripts(`<script>window.PRODUCTS=${JSON.stringify(P.items)};window.WA_NUMBER="${C.whatsapp}";</script>
<script src="/js/cart.js"></script>`)}`;

const S = C.sustainability;
pages["sustainability.html"] = head({ title: S.title, description: S.description, ogTitle: S.title, ogDescription: S.ogDescription, canonicalPath: "/sustainability" }) + `
<body class="text-gray-800">
${popup("offerPopup", "bg-red-600", "🔥 GREAT DEAL", { ...S.deals[0], desc: "Limited time price on high-quality Portland Cement. Order today!" }, tel, "📞 Get Deal Now", "closeOffer")}
${header({})}
<section class="bg-brand text-white py-20 text-center">
  <h2 class="text-4xl font-bold">${esc(S.heroTitle)}</h2>
</section>
<section class="py-20 max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-10">
${S.cards.map(([t, d]) => `  <div class="shadow p-6 rounded">
    <h3 class="text-xl font-semibold mb-2">${esc(t)}</h3>
    <p>${esc(d)}</p>
  </div>`).join("\n")}
</section>
${floatingCta({ wrap: "z-40" })}
${footer({ cols: 4, links: [["About Us", "/about"], ["Products", "/products"], ["Careers", "/careers"]], phone: C.phoneDisplayCompact })}
${scripts(rotatingPopupJs("offerPopup", S.deals, 5000, "closeOffer", true))}`;

const K = C.careers;
const jobs = K.jobs.map((j) => ({ ...j, href: wa(`I want to apply for ${j.title} position`) }));
pages["careers.html"] = head({ title: K.title, description: K.description, keywords: K.keywords, canonicalPath: "/careers" }) + `
<body>
${popup("jobPopup", "bg-accent", "💼 HOT JOB", jobs[0], jobs[0].href, "📱 Apply via WhatsApp", "closeJobPopup")}
${header({})}
<section class="bg-brand text-white py-20 text-center">
  <h2 class="text-4xl font-bold">${esc(K.heroTitle)}</h2>
</section>
<section class="py-20 max-w-5xl mx-auto px-4 space-y-8">
${jobs.map((j) => `  <div class="shadow p-6 rounded">
    <h3 class="text-xl font-semibold">${esc(j.title)}</h3>
    <p class="my-2">${esc(j.desc)}</p>
    <a href="${j.href}" class="text-accent font-semibold">Apply via WhatsApp</a>
  </div>`).join("\n")}
</section>
${floatingCta({ wrap: "", shadow: "" })}
${footer({ cols: 4, links: [["About Us", "/about"], ["Products", "/products"], ["Careers", "/careers"]], phone: C.phoneDisplayCompact })}
${scripts(rotatingPopupJs("jobPopup", jobs, 6000, "closeJobPopup", false, true))}`;

const CT = C.contact;
pages["contact.html"] = head({ title: CT.title, description: CT.description, canonicalPath: "/contact",
  schema: { "@context": "https://schema.org", "@type": "LocalBusiness", name: C.name, address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" }, telephone: C.phone, email: C.email } }) + `
<body>
${header({ desktopActive: { Contact: "text-accent font-semibold" }, mobileActive: "Contact" })}
<section class="bg-brand text-white py-20 text-center">
  <h2 class="text-4xl font-bold">${esc(CT.heroTitle)}</h2>
  <p class="mt-4 text-lg opacity-90">${esc(CT.heroText)}</p>
</section>
<section class="py-20 max-w-4xl mx-auto px-4 text-center space-y-4">
  <p><strong>Location:</strong> ${esc(C.location)}</p>
  <p><strong>Phone:</strong> <a href="${tel}" class="text-accent underline">${C.phoneDisplay}</a></p>
  <p><strong>Email:</strong> <a href="mailto:${C.email}" class="text-accent underline">${C.email}</a></p>
  <a href="${wa()}" class="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg mt-6">💬 Chat on WhatsApp</a>
</section>
${footer({})}
${scripts()}`;

pages["404.html"] = head({ title: `Page not found | ${C.name}`, description: "Page not found", canonicalPath: "/404" }) + `
<body class="text-gray-800">
${header({})}
<section class="bg-brand text-white py-20 text-center"><h2 class="text-4xl font-bold">Page not found</h2>
<p class="mt-4"><a href="/" class="underline">Back to Home</a></p></section>
${footer({})}
${scripts()}`;

// ---------- write ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.cpSync(path.join(ROOT, "public"), DIST, { recursive: true });
for (const [f, html] of Object.entries(pages)) fs.writeFileSync(path.join(DIST, f), html.replace(/\n{3,}/g, "\n\n"));

const urls = [["", "1.0", "weekly"], ["/about", "0.8", "monthly"], ["/products", "0.9", "weekly"], ["/sustainability", "0.7", "monthly"], ["/careers", "0.6", "monthly"], ["/contact", "0.6", "yearly"]];
fs.writeFileSync(path.join(DIST, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, p, c]) => `  <url><loc>${C.siteUrl}${u || "/"}</loc><changefreq>${c}</changefreq><priority>${p}</priority></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, "robots.txt"), `User-agent: *\nDisallow: /admin/\nSitemap: ${C.siteUrl}/sitemap.xml\n`);
console.log("Built", Object.keys(pages).length, "pages into dist/");
