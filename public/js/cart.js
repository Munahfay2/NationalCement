// Products page: modal + cart + WhatsApp checkout (mirrors original logic; cart persisted in localStorage)
(function () {
  var products = window.PRODUCTS || [], KEY = "ncc_cart", current = null;
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) {}
  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n) { return Number(n).toLocaleString("en-US"); };
  var modal = $("productModal");

  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }

  document.querySelectorAll(".view-product").forEach(function (b) {
    b.addEventListener("click", function () {
      current = products[+b.dataset.product];
      $("modalName").textContent = current.name;
      $("modalPrice").textContent = "KSh " + fmt(current.price);
      $("modalUnit").textContent = current.unit;
      $("modalImg").src = current.img; $("modalImg").alt = current.name;
      $("modalQty").value = 1;
      modal.classList.remove("hidden"); modal.classList.add("flex");
    });
  });
  window.closeModal = function () { modal.classList.add("hidden"); modal.classList.remove("flex"); };
  modal.addEventListener("click", function (e) { if (e.target === modal) window.closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") window.closeModal(); });

  window.addToCart = function () {
    var qty = Math.floor(+$("modalQty").value);
    if (!current || !(qty >= 1)) return;
    var item = cart.find(function (i) { return i.name === current.name; });
    if (item) item.qty += qty; else cart.push({ name: current.name, price: current.price, unit: current.unit, img: current.img, qty: qty });
    window.closeModal(); save(); render();
  };

  function render() {
    var box = $("cartItems"), total = 0, count = 0;
    box.innerHTML = "";
    cart.forEach(function (i, idx) {
      total += i.price * i.qty; count += i.qty;
      var row = document.createElement("div"); row.className = "flex items-center justify-between";
      var left = document.createElement("div"); left.className = "flex items-center gap-2";
      var img = document.createElement("img"); img.src = i.img; img.alt = ""; img.className = "w-12 h-12 object-contain rounded";
      var name = document.createElement("span"); name.textContent = i.name + " x" + i.qty;
      left.append(img, name);
      var right = document.createElement("div"); right.className = "flex items-center gap-2";
      var price = document.createElement("span"); price.textContent = "KSh " + fmt(i.price * i.qty);
      var rm = document.createElement("button"); rm.className = "text-red-500 font-bold"; rm.textContent = "✕"; rm.setAttribute("aria-label", "Remove " + i.name);
      rm.onclick = function () { cart.splice(idx, 1); save(); render(); };
      right.append(price, rm); row.append(left, right); box.appendChild(row);
    });
    $("cartTotal").textContent = fmt(total);
    var c = $("cartCount"); if (c) { c.textContent = count ? " (" + count + ")" : ""; c.classList.toggle("hidden", !count); }
  }
  window.toggleCart = function () { $("floatingCart").classList.toggle("hidden"); };
  window.checkoutWhatsApp = function () {
    if (!cart.length) return alert("Cart is empty");
    var msg = "Hello, I would like to order:\n\n", total = 0;
    cart.forEach(function (i) { msg += "- " + i.name + " x" + i.qty + " = KSh " + fmt(i.price * i.qty) + "\n"; total += i.price * i.qty; });
    msg += "\n*Total: KSh " + fmt(total) + "*";
    window.location.href = "https://wa.me/" + window.WA_NUMBER + "?text=" + encodeURIComponent(msg);
  };
  render();
})();
