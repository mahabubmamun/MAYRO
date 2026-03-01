/**
 * AURUM PARFUMS — E-Commerce JavaScript
 * Luxury Perfume Brand · Bangladesh
 * ====================================
 * Features:
 *  - Product render & filtering
 *  - Smart cart with localStorage
 *  - Checkout simulation
 *  - Toast notifications
 *  - Sticky navbar, scroll animations
 *  - Mobile menu, filter sidebar
 */

'use strict';

/* =============================================
   1. PRODUCT DATA
   ============================================= */
const PRODUCTS = [
  {
    id: 1,
    name: 'Oud Royal',
    category: 'Men',
    size: '50ml',
    price: 1299,
    badge: 'Bestseller',
    isNew: false,
    createdAt: 1
  },
  {
    id: 2,
    name: 'Rose D\'Orient',
    category: 'Women',
    size: '30ml',
    price: 899,
    badge: 'New',
    isNew: true,
    createdAt: 8
  },
  {
    id: 3,
    name: 'Night Noir',
    category: 'Unisex',
    size: '100ml',
    price: 1999,
    badge: null,
    isNew: false,
    createdAt: 3
  },
  {
    id: 4,
    name: 'Amber Essence',
    category: 'Men',
    size: '100ml',
    price: 2499,
    badge: 'New',
    isNew: true,
    createdAt: 7
  },
  {
    id: 5,
    name: 'Velvet Musk',
    category: 'Women',
    size: '50ml',
    price: 1499,
    badge: null,
    isNew: false,
    createdAt: 2
  },
  {
    id: 6,
    name: 'Silk & Saffron',
    category: 'Unisex',
    size: '30ml',
    price: 799,
    badge: 'New',
    isNew: true,
    createdAt: 9
  },
  {
    id: 7,
    name: 'Dhaka Nights',
    category: 'Men',
    size: '100ml',
    price: 2999,
    badge: 'Premium',
    isNew: false,
    createdAt: 4
  },
  {
    id: 8,
    name: 'Jasmine Pearl',
    category: 'Women',
    size: '50ml',
    price: 1199,
    badge: 'New',
    isNew: true,
    createdAt: 10
  }
];

/* =============================================
   2. STATE
   ============================================= */
let cart = loadCartFromLocalStorage();
let activeFilters = {
  categories: [],
  sizes: [],
  maxPrice: 5000,
  sort: 'default'
};

/* =============================================
   3. DOM REFERENCES
   ============================================= */
const DOM = {
  loader:            document.getElementById('loader'),
  navbar:            document.getElementById('navbar'),
  hamburger:         document.getElementById('hamburger'),
  navLinks:          document.getElementById('navLinks'),
  cartBtn:           document.getElementById('cartBtn'),
  cartCount:         document.getElementById('cartCount'),
  toast:             document.getElementById('toast'),
  newInGrid:         document.getElementById('newInGrid'),
  productGrid:       document.getElementById('productGrid'),
  productCount:      document.getElementById('productCount'),
  priceRange:        document.getElementById('priceRange'),
  priceValue:        document.getElementById('priceValue'),
  sortSelect:        document.getElementById('sortSelect'),
  clearFilters:      document.getElementById('clearFilters'),
  filterSidebar:     document.getElementById('filterSidebar'),
  filterToggleBtn:   document.getElementById('filterToggleBtn'),
  // Cart Modal
  cartModal:         document.getElementById('cartModal'),
  cartItems:         document.getElementById('cartItems'),
  cartFooter:        document.getElementById('cartFooter'),
  cartClose:         document.getElementById('cartClose'),
  // Checkout Modal
  checkoutModal:     document.getElementById('checkoutModal'),
  checkoutForm:      document.getElementById('checkoutForm'),
  checkoutClose:     document.getElementById('checkoutClose'),
  orderSummary:      document.getElementById('orderSummary'),
  // Success Modal
  successModal:      document.getElementById('successModal'),
  successClose:      document.getElementById('successClose'),
  orderId:           document.getElementById('orderId'),
  // Contact
  contactForm:       document.getElementById('contactForm')
};

/* =============================================
   4. LOADER
   ============================================= */
window.addEventListener('load', () => {
  setTimeout(() => {
    DOM.loader.classList.add('hidden');
    triggerEntryAnimations();
  }, 2000);
});

function triggerEntryAnimations() {
  // Animate elements as they enter viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .gift-card, .stat, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* =============================================
   5. TOAST NOTIFICATIONS
   ============================================= */
let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  DOM.toast.textContent = message;
  DOM.toast.classList.add('show');
  toastTimeout = setTimeout(() => {
    DOM.toast.classList.remove('show');
  }, 3000);
}

/* =============================================
   6. STICKY NAVBAR
   ============================================= */
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    DOM.navbar.classList.add('scrolled');
  } else {
    DOM.navbar.classList.remove('scrolled');
  }
});

/* =============================================
   7. MOBILE NAV
   ============================================= */
DOM.hamburger.addEventListener('click', () => {
  DOM.hamburger.classList.toggle('active');
  DOM.navLinks.classList.toggle('open');
});

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    DOM.hamburger.classList.remove('active');
    DOM.navLinks.classList.remove('open');
  });
});

/* =============================================
   8. RENDER PRODUCTS — COLLECTION GRID
   ============================================= */
/**
 * Creates the HTML for a single product card
 * @param {Object} product 
 * @returns {string} HTML string
 */
function createProductCard(product) {
  const colorClass = `color-${product.category.toLowerCase()}`;
  const badgeHTML = product.badge
    ? `<div class="product-badge">${product.badge}</div>`
    : '';

  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-size="${product.size}" data-price="${product.price}">
      <div class="product-img-wrap">
        ${badgeHTML}
        <div class="product-placeholder">
          <div class="bottle-svg">
            <div class="bottle-cap"></div>
            <div class="bottle-neck"></div>
            <div class="bottle-body ${colorClass}"></div>
          </div>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-meta">${product.size} · Eau de Parfum</div>
        <div class="product-price"><span>৳</span>${product.price.toLocaleString('en-BD')}</div>
        <div class="product-actions">
          <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render all products (or filtered subset) to the product grid
 * @param {Array} products 
 */
function renderProducts(products) {
  if (!DOM.productGrid) return;
  if (products.length === 0) {
    DOM.productGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 3rem; color: var(--gray);">
        <p style="font-family: var(--font-display); font-size: 1.5rem; margin-bottom: 0.5rem;">No products found</p>
        <p style="font-size: 0.85rem;">Try adjusting your filters.</p>
      </div>`;
    return;
  }
  DOM.productGrid.innerHTML = products.map(createProductCard).join('');
  DOM.productCount.textContent = `Showing ${products.length} product${products.length !== 1 ? 's' : ''}`;

  // Trigger animation for newly rendered cards
  DOM.productGrid.querySelectorAll('.product-card').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.35s, box-shadow 0.35s';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, i * 60);
  });
}

/* =============================================
   9. RENDER "NEW IN" SECTION (4 newest)
   ============================================= */
function renderNewIn() {
  if (!DOM.newInGrid) return;
  const newProducts = [...PRODUCTS]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4);
  DOM.newInGrid.innerHTML = newProducts.map(createProductCard).join('');
}

/* =============================================
   10. FILTER & SORT
   ============================================= */
/**
 * Filter products based on activeFilters state
 * @returns {Array} filtered & sorted products
 */
function filterProducts() {
  let result = [...PRODUCTS];

  // Category filter
  if (activeFilters.categories.length > 0) {
    result = result.filter(p => activeFilters.categories.includes(p.category));
  }

  // Size filter
  if (activeFilters.sizes.length > 0) {
    result = result.filter(p => activeFilters.sizes.includes(p.size));
  }

  // Price range
  result = result.filter(p => p.price <= activeFilters.maxPrice);

  // Sort
  switch (activeFilters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => b.createdAt - a.createdAt);
      break;
    default:
      break;
  }

  return result;
}

/** Apply filters and re-render */
function applyFilters() {
  const filtered = filterProducts();
  renderProducts(filtered);
}

// Category checkboxes
document.querySelectorAll('input[name="category"]').forEach(cb => {
  cb.addEventListener('change', () => {
    activeFilters.categories = Array.from(
      document.querySelectorAll('input[name="category"]:checked')
    ).map(el => el.value);
    applyFilters();
  });
});

// Size checkboxes
document.querySelectorAll('input[name="size"]').forEach(cb => {
  cb.addEventListener('change', () => {
    activeFilters.sizes = Array.from(
      document.querySelectorAll('input[name="size"]:checked')
    ).map(el => el.value);
    applyFilters();
  });
});

// Price range slider
DOM.priceRange.addEventListener('input', () => {
  activeFilters.maxPrice = parseInt(DOM.priceRange.value);
  DOM.priceValue.textContent = `৳${Number(DOM.priceRange.value).toLocaleString('en-BD')}`;
  applyFilters();
});

// Sort select
DOM.sortSelect.addEventListener('change', () => {
  activeFilters.sort = DOM.sortSelect.value;
  applyFilters();
});

// Clear filters
DOM.clearFilters.addEventListener('click', () => {
  // Reset checkboxes
  document.querySelectorAll('input[name="category"], input[name="size"]').forEach(cb => cb.checked = false);
  DOM.priceRange.value = 5000;
  DOM.priceValue.textContent = '৳5,000';
  DOM.sortSelect.value = 'default';
  activeFilters = { categories: [], sizes: [], maxPrice: 5000, sort: 'default' };
  applyFilters();
  showToast('Filters cleared.');
});

// Mobile filter toggle
DOM.filterToggleBtn.addEventListener('click', () => {
  DOM.filterSidebar.classList.toggle('open');
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 900 &&
    DOM.filterSidebar.classList.contains('open') &&
    !DOM.filterSidebar.contains(e.target) &&
    e.target !== DOM.filterToggleBtn) {
    DOM.filterSidebar.classList.remove('open');
  }
});

// Dropdown nav filter links
document.querySelectorAll('.dropdown-menu [data-filter]').forEach(link => {
  link.addEventListener('click', (e) => {
    const filter = e.target.getAttribute('data-filter');
    if (filter && filter !== 'All' && filter !== 'Gift') {
      // Uncheck others, check this
      document.querySelectorAll('input[name="category"]').forEach(cb => {
        cb.checked = cb.value === filter;
      });
      activeFilters.categories = [filter];
      applyFilters();
      // Scroll to collection
      setTimeout(() => {
        document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } else if (filter === 'All') {
      DOM.clearFilters.click();
    }
  });
});

/* =============================================
   11. CART SYSTEM
   ============================================= */

/** Load cart from localStorage */
function loadCartFromLocalStorage() {
  try {
    return JSON.parse(localStorage.getItem('aurum_cart')) || [];
  } catch {
    return [];
  }
}

/** Save cart to localStorage */
function saveCartToLocalStorage() {
  localStorage.setItem('aurum_cart', JSON.stringify(cart));
}

/** Update cart count badge */
function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  DOM.cartCount.textContent = total;
  DOM.cartCount.style.transform = 'scale(1.3)';
  setTimeout(() => { DOM.cartCount.style.transform = 'scale(1)'; }, 200);
}

/**
 * Add product to cart by ID
 * @param {number} productId 
 */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCartToLocalStorage();
  updateCartCount();
  showToast(`✓ ${product.name} added to cart`);
}

/**
 * Add gift set to cart
 * @param {Object} giftItem 
 */
function addGiftToCart(giftItem) {
  const existing = cart.find(item => item.id === giftItem.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...giftItem, category: 'Gift', size: 'Set' });
  }
  saveCartToLocalStorage();
  updateCartCount();
  showToast(`✓ ${giftItem.name} added to cart`);
}

/**
 * Remove item from cart
 * @param {string|number} id 
 */
function removeFromCart(id) {
  cart = cart.filter(item => item.id != id);
  saveCartToLocalStorage();
  updateCartCount();
  renderCartModal();
}

/**
 * Update quantity of cart item
 * @param {string|number} id 
 * @param {number} delta — +1 or -1
 */
function updateQuantity(id, delta) {
  const item = cart.find(item => item.id == id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCartToLocalStorage();
  updateCartCount();
  renderCartModal();
}

/** Calculate cart subtotal */
function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

/** Render cart modal contents */
function renderCartModal() {
  if (cart.length === 0) {
    DOM.cartItems.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛍</div>
        <p>Your cart is empty</p>
        <p style="font-size: 0.75rem; margin-top: 0.5rem;">Add some luxury to your life.</p>
      </div>`;
    DOM.cartFooter.innerHTML = '';
    return;
  }

  // Render items
  DOM.cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        <div class="mini-bottle"></div>
      </div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${item.category || ''} · ${item.size || ''}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
        </div>
        <button class="btn-remove" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
      <div class="cart-item-price">৳${(item.price * item.qty).toLocaleString('en-BD')}</div>
    </div>
  `).join('');

  // Render footer
  const subtotal = getCartSubtotal();
  DOM.cartFooter.innerHTML = `
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <span>৳${subtotal.toLocaleString('en-BD')}</span>
    </div>
    <div class="cart-actions">
      <button class="btn-gold btn-checkout" onclick="openCheckout()">Checkout</button>
      <button class="btn-clear" onclick="clearCart()">Clear</button>
    </div>`;
}

/** Clear entire cart */
function clearCart() {
  if (cart.length === 0) return;
  cart = [];
  saveCartToLocalStorage();
  updateCartCount();
  renderCartModal();
  showToast('Cart cleared.');
}

/* =============================================
   12. CART MODAL OPEN/CLOSE
   ============================================= */
DOM.cartBtn.addEventListener('click', () => {
  renderCartModal();
  openModal(DOM.cartModal);
});

DOM.cartClose.addEventListener('click', () => closeModal(DOM.cartModal));
DOM.cartModal.addEventListener('click', (e) => {
  if (e.target === DOM.cartModal) closeModal(DOM.cartModal);
});

/* =============================================
   13. CHECKOUT
   ============================================= */
function openCheckout() {
  closeModal(DOM.cartModal);
  renderOrderSummary();
  openModal(DOM.checkoutModal);
}

function renderOrderSummary() {
  const subtotal = getCartSubtotal();
  const itemsHTML = cart.map(item => `
    <div class="summary-item">
      <span>${item.name} × ${item.qty}</span>
      <span>৳${(item.price * item.qty).toLocaleString('en-BD')}</span>
    </div>
  `).join('');

  DOM.orderSummary.innerHTML = `
    <h4>Order Summary</h4>
    ${itemsHTML}
    <div class="summary-total">
      <span>Total</span>
      <span>৳${subtotal.toLocaleString('en-BD')}</span>
    </div>`;
}

DOM.checkoutClose.addEventListener('click', () => closeModal(DOM.checkoutModal));
DOM.checkoutModal.addEventListener('click', (e) => {
  if (e.target === DOM.checkoutModal) closeModal(DOM.checkoutModal);
});

// Place order
DOM.checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();
  placeOrder();
});

function placeOrder() {
  // Collect form data
  const orderData = {
    id: 'AUR-' + Date.now(),
    name:    document.getElementById('fullName').value,
    phone:   document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city:    document.getElementById('city').value,
    payment: document.querySelector('input[name="payment"]:checked')?.value || 'Unknown',
    items:   [...cart],
    total:   getCartSubtotal(),
    date:    new Date().toISOString()
  };

  // Save to localStorage
  saveOrderToLocalStorage(orderData);

  // Clear cart
  clearCart();

  // Close checkout, show success
  closeModal(DOM.checkoutModal);
  DOM.orderId.textContent = `Order ID: ${orderData.id}`;
  openModal(DOM.successModal);

  // Reset form
  DOM.checkoutForm.reset();
}

function saveOrderToLocalStorage(order) {
  const orders = JSON.parse(localStorage.getItem('aurum_orders') || '[]');
  orders.push(order);
  localStorage.setItem('aurum_orders', JSON.stringify(orders));
}

DOM.successClose.addEventListener('click', () => closeModal(DOM.successModal));
DOM.successModal.addEventListener('click', (e) => {
  if (e.target === DOM.successModal) closeModal(DOM.successModal);
});

/* =============================================
   14. MODAL HELPERS
   ============================================= */
function openModal(modalEl) {
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

// ESC key closes any open modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    [DOM.cartModal, DOM.checkoutModal, DOM.successModal].forEach(closeModal);
  }
});

/* =============================================
   15. CONTACT FORM
   ============================================= */
DOM.contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('✓ Message sent! We\'ll be in touch soon.');
  DOM.contactForm.reset();
});

/* =============================================
   16. INTERSECTION OBSERVER — ENTRY ANIMATIONS
   ============================================= */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Observe section headers
  document.querySelectorAll('.section-header, .gift-card, .contact-item, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
}

/* =============================================
   17. SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });
}

/* =============================================
   18. INIT — ENTRY POINT
   ============================================= */
function init() {
  // Render product sections
  renderNewIn();
  renderProducts(PRODUCTS);

  // Sync cart count on load
  updateCartCount();

  // Start scroll animations
  initScrollAnimations();
  initSmoothScroll();
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);

// Expose global functions used by inline onclick handlers
window.addToCart = addToCart;
window.addGiftToCart = addGiftToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.openCheckout = openCheckout;