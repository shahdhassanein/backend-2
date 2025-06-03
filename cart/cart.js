// cart.js - Cart functionality for Car Showroom website

document.addEventListener('DOMContentLoaded', function() {
    // Load cart data from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if we're on the cart page
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        renderCart();
    }
    
    // Update cart count on all pages
    updateCartCount();

    // Event delegation for cart interactions (if we're on the cart page)
    if (cartContainer) {
        cartContainer.addEventListener('click', function(e) {
            const target = e.target;
            const cartItem = target.closest('.cart-item');
            if (!cartItem) return;

            const itemId = cartItem.dataset.id;
            const itemIndex = cart.findIndex(item => item.id === itemId);

            // Remove item
            if (target.classList.contains('remove-btn')) {
                cartItem.classList.add('removing');
                setTimeout(() => {
                    cart.splice(itemIndex, 1);
                    saveCart();
                    renderCart();
                    updateCartCount();
                }, 300);
            }

            // Quantity controls
            if (target.classList.contains('quantity-btn')) {
                const item = cart[itemIndex];
                if (target.classList.contains('increase')) {
                    item.quantity = (item.quantity || 1) + 1;
                } else if (target.classList.contains('decrease')) {
                    item.quantity = Math.max(1, (item.quantity || 1) - 1);
                }
                saveCart();
                renderCart();
                updateCartCount();
            }
        });
    }

    // Function to render cart items (only on cart page)
    function renderCart() {
        if (!cartContainer) return;
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
        } else {
            cartContainer.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        ${item.brand ? `<p>${item.brand}</p>` : ''}
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease">-</button>
                            <span>${item.quantity || 1}</span>
                            <button class="quantity-btn increase">+</button>
                        </div>
                    </div>
                    <div class="cart-item-price">
                        $${(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                    <button class="remove-btn">✕</button>
                </div>
            `).join('');
        }

        updateTotal();
    }

    // Update cart totals
    function updateTotal() {
        const subtotalElement = document.querySelector('.subtotal-amount');
        const totalElement = document.querySelector('.total-amount');
        
        if (!subtotalElement || !totalElement) return;
        
        const subtotal = cart.reduce((sum, item) => 
            sum + (item.price * (item.quantity || 1)), 0);
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update cart count badge on all pages
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const countElements = document.querySelectorAll('.count');
        
        countElements.forEach(el => {
            el.textContent = count;
        });
    }

    // Make addToCart available globally
    window.addToCart = function(product) {
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Increase quantity if already in cart
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            // Add new item with quantity 1
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                brand: product.brand || ''
            });
        }
        
        // Save updated cart and update UI
        saveCart();
        renderCart();
        updateCartCount();
        
        console.log('Added to cart:', product);
    };
});