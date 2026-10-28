const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function getCart(){return JSON.parse(localStorage.getItem("infinite loops_cart")||"[]")}
function saveCart(cart){localStorage.setItem("Infinite loops_cart",JSON.stringify(cart));updateCartCount()}
function getWishlist(){return JSON.parse(localStorage.getItem("Infinite loops_wishlist")||"[]")}
function saveWishlist(w){localStorage.setItem("Infinite loops_wishlist",JSON.stringify(w))}
function money(n){return "₹"+Number(n).toLocaleString("en-IN")}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2500)}
function stars(r){return "★".repeat(Math.round(r))+"☆".repeat(5-Math.round(r))}
function productById(id){return PRODUCTS.find(p=>p.id===Number(id))}

function header(){
 const path=location.pathname.split("/").pop()||"index.html";
 const active=x=>path===x?"active":"";
 return `<header class="site-header"><div class="container nav">
   <a class="logo" href="index.html"><span class="logo-mark">♾️</span> Infinite Loops</a>
   <nav class="nav-links" id="nav-links">
    <a class="${active("index.html")}" href="index.html">Home</a><a class="${active("shop.html")}" href="shop.html">Shop</a>
    <a class="${active("custom-order.html")}" href="custom-order.html">Custom Order</a><a class="${active("about.html")}" href="about.html">Our Story</a><a class="${active("contact.html")}" href="contact.html">Contact</a>
   </nav>
   <div class="nav-actions"><button class="icon-btn" id="wishlist-nav" title="Wishlist">♡</button><a class="icon-btn" href="cart.html" title="Cart">🛒<span class="cart-count">0</span></a><button class="icon-btn menu-btn" id="menu-btn">☰</button></div>
 </div></header>`;
}
function footer(){
 return `<footer class="site-footer"><div class="container"><div class="footer-grid">
 <div><a class="logo" href="index.html">♾️ Infinite Loops</a><p style="margin-top:14px">Handmade crochet creations for little moments and big feelings.</p></div>
 <div><h3>Shop</h3><p><a href="shop.html">All Products</a></p><p><a href="shop.html?category=Amigurumi">Amigurumi</a></p><p><a href="shop.html?category=Flowers">Flowers</a></p></div>
 <div><h3>Help</h3><p><a href="contact.html">Contact</a></p><p><a href="custom-order.html">Custom Orders</a></p><p><a href="cart.html">Shopping Bag</a></p></div>
 <div><h3>Follow along</h3><p>Instagram : @ by_infinite_art</p><p>WhatsApp : +91 9677077105</p></div>
 </div><div class="footer-bottom"><span>© 2026 Infinite Loops Crochet. All rights reserved.</span><span>Handmade with ♡</span></div></div></footer>`;
}
function mountChrome(){if($("#site-header"))$("#site-header").innerHTML=header();if($("#site-footer"))$("#site-footer").innerHTML=footer();updateCartCount();setupMenu()}
function setupMenu(){$("#menu-btn")?.addEventListener("click",()=>$("#nav-links").classList.toggle("open"));$("#wishlist-nav")?.addEventListener("click",()=>toast("Wishlist is available on product cards."))}
function updateCartCount(){const count=getCart().reduce((s,i)=>s+i.qty,0);$$(".cart-count").forEach(e=>e.textContent=count)}

function productCard(p){
 const w=getWishlist();const active=w.includes(p.id);
 return `<article class="product-card">
   ${p.badge?`<span class="badge">${p.badge}</span>`:""}<button class="wishlist ${active?"active":""}" data-wish="${p.id}">${active?"♥":"♡"}</button>
   <a href="product.html?id=${p.id}"><div class="product-image"> <img src="${p.image}" alt="${p.name}"></div></a>
   <div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><span class="price">${money(p.price)}</span>
   <div class="product-actions"><a class="btn btn-outline" href="product.html?id=${p.id}">View</a><button class="btn btn-primary add-btn" data-add="${p.id}">Add to bag</button></div></div>
 </article>`;
}
function renderProducts(list,target){if(!target)return;target.innerHTML=list.length?list.map(productCard).join(""):`<div class="empty" style="grid-column:1/-1"><span>🧶</span><h2>No stitches found</h2><p>Try another search or category.</p></div>`;bindProductActions()}
function bindProductActions(){
 $$(".add-btn").forEach(b=>b.onclick=()=>addToCart(Number(b.dataset.add)));
 $$(".wishlist").forEach(b=>b.onclick=()=>toggleWish(Number(b.dataset.wish),b));
}
function addToCart(id,qty=1){const cart=getCart();const item=cart.find(i=>i.id===id);if(item)item.qty+=qty;else cart.push({id,qty});saveCart(cart);toast("Added to your bag ♡")}
function toggleWish(id,button){let w=getWishlist();if(w.includes(id)){w=w.filter(x=>x!==id);button.classList.remove("active");button.textContent="♡";toast("Removed from wishlist")}else{w.push(id);button.classList.add("active");button.textContent="♥";toast("Saved to wishlist ♡")}saveWishlist(w)}

function initHome(){renderProducts(PRODUCTS.slice(0,4),$("#featured-products"))}
function initShop(){
 const chips=$$("#category-chips .chip"), search=$("#shop-search"), sort=$("#shop-sort");
 let category=new URLSearchParams(location.search).get("category")||"All";
 chips.forEach(c=>{c.classList.toggle("active",c.dataset.category===category);c.onclick=()=>{category=c.dataset.category;chips.forEach(x=>x.classList.toggle("active",x===c));draw()}});
 function draw(){let list=PRODUCTS.filter(p=>(category==="All"||p.category===category)&&(p.name+" "+p.desc).toLowerCase().includes(search.value.toLowerCase()));const s=sort.value;if(s==="low")list.sort((a,b)=>a.price-b.price);if(s==="high")list.sort((a,b)=>b.price-a.price);if(s==="name")list.sort((a,b)=>a.name.localeCompare(b.name));renderProducts(list,$("#shop-products"))}
 search.oninput=draw;sort.onchange=draw;draw()
}
function initProduct(){
 const p=productById(new URLSearchParams(location.search).get("id"))||PRODUCTS[0], target=$("#product-detail");
 target.innerHTML=`<section class="detail"><div class="container"><div class="detail-grid">
  <div class="detail-image"><img src="${p.image}" alt="${p.name}"></div><div class="detail-meta"><span class="eyebrow">${p.category.toUpperCase()}</span><h1>${p.name}</h1><div class="rating">${stars(p.rating)} <span style="color:var(--muted);font-size:.85rem"> ${p.rating}/5</span></div><p class="description">${p.desc}</p>
  <ul class="detail-list"><li><strong>Material:</strong> ${p.material}</li><li><strong>Size:</strong> ${p.size}</li><li><strong>Care:</strong> Gentle hand wash and air dry.</li><li><strong>Made to order:</strong> Allow 3–7 working days.</li></ul>
  <div class="price">${money(p.price)}</div><div class="quantity"><button class="qty-btn" id="minus">−</button><span class="qty-value" id="qty">1</span><button class="qty-btn" id="plus">+</button></div>
  <button class="btn btn-primary btn-full" id="detail-add">Add to shopping bag</button><a class="btn btn-outline btn-full" style="margin-top:10px" href="custom-order.html">Want a different color? Custom order →</a>
  </div></div></div></section>
  <section class="section soft"><div class="container"><div class="section-head"><h2>You may also like</h2><a class="text-link" href="shop.html">Shop all →</a></div><div class="product-grid" id="related"></div></div></section>`;
 let q=1;$("#minus").onclick=()=>{q=Math.max(1,q-1);$("#qty").textContent=q};$("#plus").onclick=()=>{q++;$("#qty").textContent=q};$("#detail-add").onclick=()=>addToCart(p.id,q);renderProducts(PRODUCTS.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,4),$("#related"))
}
function cartTotals(cart){let subtotal=cart.reduce((s,i)=>s+productById(i.id).price*i.qty,0);let shipping=subtotal===0?0:(subtotal>=1500?0:99);return {subtotal,shipping,total:subtotal+shipping}}
function initCart(){
 const target=$("#cart-page");let cart=getCart();
 function draw(){
  cart=getCart();if(!cart.length){target.innerHTML=`<div class="empty"><span>🛍️</span><h2>Your bag is waiting</h2><p>Pick something handmade and bring it home.</p><a class="btn btn-primary" href="shop.html">Start shopping</a></div>`;return}
  const t=cartTotals(cart);
  target.innerHTML=`<div class="cart-layout"><div class="cart-list"><h2>Your items</h2>${cart.map(i=>{const p=productById(i.id);return `<div class="cart-row"><div class="cart-thumb"> <img src="${p.image}" alt="${p.name}"></div><div class="cart-info"><h3>${p.name}</h3><p>${money(p.price)} · ${p.category}</p><div class="cart-controls"><button class="qty-btn cart-minus" data-id="${p.id}">−</button><strong>${i.qty}</strong><button class="qty-btn cart-plus" data-id="${p.id}">+</button><button class="remove" data-remove="${p.id}">Remove</button></div></div><strong>${money(p.price*i.qty)}</strong></div>`}).join("")}</div>
  <aside class="summary-card"><h3>Order summary</h3><div class="summary-line"><span>Subtotal</span><strong>${money(t.subtotal)}</strong></div><div class="summary-line"><span>Shipping</span><strong>${t.shipping?money(t.shipping):"FREE"}</strong></div><div class="summary-total"><span>Total</span><span>${money(t.total)}</span></div><p style="font-size:.8rem">Free shipping on orders above ₹1,500.</p><a class="btn btn-primary btn-full" href="checkout.html">Proceed to checkout</a></aside></div>`;
  $$(".cart-minus").forEach(b=>b.onclick=()=>changeQty(+b.dataset.id,-1));$$(".cart-plus").forEach(b=>b.onclick=()=>changeQty(+b.dataset.id,1));$$("[data-remove]").forEach(b=>b.onclick=()=>{saveCart(getCart().filter(i=>i.id!==+b.dataset.remove));draw()})
 }
 function changeQty(id,d){let c=getCart(),i=c.find(x=>x.id===id);if(i){i.qty+=d;if(i.qty<1)c=c.filter(x=>x.id!==id);saveCart(c);draw()}}draw()
}
function initCheckout(){
 const summary=$("#checkout-summary"),cart=getCart();const t=cartTotals(cart);
 if(!cart.length){summary.innerHTML=`<div class="empty"><span>♾️</span><h3>Your bag is empty</h3><a href="shop.html" class="text-link">Shop now →</a></div>`;return}
 summary.innerHTML=`<h3>Order summary</h3>${cart.map(i=>{const p=productById(i.id);return `<div class="summary-line"><span>${p.name} × ${i.qty}</span><strong>${money(p.price*i.qty)}</strong></div>`}).join("")}<div class="summary-line"><span>Shipping</span><strong>${t.shipping?money(t.shipping):"FREE"}</strong></div><div class="summary-total"><span>Total</span><span>${money(t.total)}</span></div>`;
 $("#checkout-form").onsubmit=e=>{e.preventDefault();const order="CL"+Date.now().toString().slice(-6);localStorage.removeItem("Infinite loops_cart");updateCartCount();document.querySelector(".checkout-grid").innerHTML=`<div class="empty" style="grid-column:1/-1"><span>🎉</span><h2>Order received!</h2><p>Thank you for choosing handmade. Your demo order <strong>#${order}</strong> has been created.</p><a class="btn btn-primary" href="shop.html">Continue shopping</a></div>`;toast("Order placed successfully!")};
}
function initCustom(){$("#custom-form")?.addEventListener("submit",e=>{e.preventDefault();e.target.reset();toast("Your custom request has been sent ♡")})}
function initContact(){$("#contact-form")?.addEventListener("submit",e=>{e.preventDefault();e.target.reset();toast("Thanks! We'll get back to you soon.")});$("#newsletter-form")?.addEventListener("submit",e=>{e.preventDefault();e.target.reset();toast("You're on the list! ♡")})}

document.addEventListener("DOMContentLoaded",()=>{
 mountChrome();
 const file=location.pathname.split("/").pop()||"index.html";
 if(file==="index.html"||file==="")initHome();
 if(file==="shop.html")initShop();
 if(file==="product.html")initProduct();
 if(file==="cart.html")initCart();
 if(file==="checkout.html")initCheckout();
 if(file==="custom-order.html")initCustom();
 if(file==="contact.html")initContact();
});
