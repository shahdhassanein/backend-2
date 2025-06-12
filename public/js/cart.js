document.addEventListener('DOMContentLoaded', function () {
    // ====== GLOBAL VARIABLES ======
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // ====== DOM ELEMENTS ======
    const cartContainer = document.getElementById('cart-items-container');
    const subtotalElement = document.querySelector('.subtotal-amount');
    const totalElement = document.querySelector('.total-amount');

    // ====== INITIAL SETUP ======
    renderCart();
    updateCartCount();

    // ====== EVENT HANDLERS ======
    if (cartContainer) {
        cartContainer.addEventListener('click', function (e) {
            const clicked = e.target;
            const itemElement = clicked.closest('.cart-item');
            if (!itemElement) return;

            const itemId = itemElement.dataset.id;

            if (clicked.classList.contains('remove-btn')) {
                removeItem(itemId);
            }

            if (clicked.classList.contains('quantity-btn')) {
                const change = clicked.classList.contains('increase') ? 1 : -1;
                updateQuantity(itemId, change);
            }
        });
    }

    // ====== CART FUNCTIONS ======
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
    }

    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        const newQuantity = item.quantity + change;
        if (newQuantity < 1 || newQuantity > 4) return;

        item.quantity = newQuantity;
        saveCart();
        renderCart();
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function renderCart() {
        if (!cartContainer) return;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            const summary = document.querySelector('.cart-summary');
            if (summary) summary.style.display = 'none';
            return;
        }

        const summary = document.querySelector('.cart-summary');
        if (summary) summary.style.display = 'block';

        cartContainer.innerHTML = cart.map(item => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            const subtotal = price * quantity;

            return `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="item-price">Price: $${price.toLocaleString()}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" ${quantity <= 1 ? 'disabled' : ''}>-</button>
                            <span class="quantity-display">${quantity}</span>
                            <button class="quantity-btn increase" ${quantity >= 4 ? 'disabled' : ''}>+</button>
                        </div>
                        <p class="item-subtotal">Subtotal: $${subtotal.toLocaleString()}</p>
                    </div>
                    <button class="remove-btn">✕</button>
                </div>
            `;
        }).join('');

        updateCartTotal();
    }

    function updateCartTotal() {
        if (!subtotalElement || !totalElement) return;

        const subtotal = cart.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.quantity));
        }, 0);

        subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        totalElement.textContent = `$${subtotal.toLocaleString()}`;
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + Number(item.quantity), 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    // Make addToCart available globally
    window.addToCart = function (product) {
        if (!product.id) {
            console.error('Product must have an ID to be added to cart.');
            return;
        }

        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            if (existingItem.quantity < 4) {
                existingItem.quantity += 1;
                showNotification('Item quantity updated in cart');
            } else {
                showNotification('Maximum quantity reached for this item (4)');
                return;
            }
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
            showNotification('Item added to cart successfully!');
        }

        saveCart();
        renderCart();
    };
});

// ====== NOTIFICATION FUNCTION ======
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
