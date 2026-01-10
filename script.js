const TELEGRAM_HANDLE = "abrsh26"; // send orders here

let cart = JSON.parse(localStorage.getItem('abrsh_cart')||'[]');

function saveCart(){ localStorage.setItem('abrsh_cart', JSON.stringify(cart)); updateCartCount(); }

function updateCartCount(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('#cart-count').forEach(el=> el.textContent = count);
}

function addToCart(name, price){
  const existing = cart.find(i=>i.name===name);
  if(existing){ existing.qty += 1; } else { cart.push({name,price,qty:1}); }
  saveCart();
  alert(name + " added to cart");
}

function renderCartPage(){
  const container = document.getElementById('cart-items');
  if(!container) return;
  container.innerHTML = '';
  if(cart.length===0){ container.innerHTML = '<p>Your cart is empty.</p>'; document.getElementById('cart-total').textContent='0'; return; }
  const table = document.createElement('table');
  table.className='table';
  table.innerHTML = `<thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr></thead>`;
  const tbody = document.createElement('tbody');
  let total = 0;
  cart.forEach((item, idx)=>{
    const tr = document.createElement('tr');
    const subtotal = item.price * item.qty;
    total += subtotal;
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.price} ETB</td>
      <td>
        <button class="qty-btn" onclick="changeQty(${idx}, -1)">-</button>
        ${item.qty}
        <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
      </td>
      <td>${subtotal} ETB</td>
      <td><button class="qty-btn" onclick="removeItem(${idx})">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
  document.getElementById('cart-total').textContent = total;
}

function changeQty(idx, delta){
  cart[idx].qty += delta;
  if(cart[idx].qty<=0){ cart.splice(idx,1); }
  saveCart();
  renderCartPage();
}

function removeItem(idx){
  cart.splice(idx,1);
  saveCart();
  renderCartPage();
}

function checkout(){
  if(cart.length===0){ alert('Cart is empty'); return; }
  let message = '🛒 Order from Abrsh Community:%0A';
  cart.forEach(it=> message += `• ${it.name} x${it.qty} = ${it.price*it.qty} ETB%0A`);
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  message += `%0ATotal: ${total} ETB%0A%0A`;
  const url = `https://t.me/${TELEGRAM_HANDLE}?text=` + message;
  // open and then clear cart
  window.open(url, '_blank');
  cart = [];
  saveCart();
  renderCartPage();
}

// attach events on load
document.addEventListener('DOMContentLoaded', ()=>{
  updateCartCount();
  renderCartPage();
  const checkoutBtn = document.getElementById('checkout-btn');
  if(checkoutBtn) checkoutBtn.addEventListener('click', checkout);
});


// add mobile nav toggle button dynamically
document.addEventListener('DOMContentLoaded', function(){
  try {
    var header = document.querySelector('header');
    if(!header) return;
    var nav = header.querySelector('nav');
    if(!nav) return;
    if(header.querySelector('.nav-toggle')) return; // already added
    var btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.innerHTML = '\u2630'; // ☰
    header.appendChild(btn);
    btn.addEventListener('click', function(e){
      var opened = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', opened ? 'true' : 'false');
      e.stopPropagation();
    });
    // close menu when clicking outside
    document.addEventListener('click', function(ev){
      if(nav.classList.contains('open')){
        if(!header.contains(ev.target)){
          nav.classList.remove('open');
          var t = header.querySelector('.nav-toggle');
          if(t) t.setAttribute('aria-expanded','false');
        }
      }
    });
  } catch(err){ console.error(err); }
});
