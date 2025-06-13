
document.addEventListener('DOMContentLoaded', function() {
    console.log("Cart.js: Script loaded.");

    let cart = []; // Initialize as empty, as we'll fetch from backend.

    const cartContainer = document.getElementById('cart-items-container');
    const emptyCartMessageContainer = document.querySelector('.empty-cart-message-container');
    const subtotalElement = document.querySelector('.subtotal-amount');
    const totalElement = document.querySelector('.total-amount');
    const cartSummary = document.querySelector('.cart-summary');
    const checkoutButton = document.getElementById('checkout-button');

    // --- Core Function: Fetch cart from backend ---
    async function fetchCartFromBackend() {
        try {
            const token = localStorage.getItem('token'); // Assuming JWT for auth, adapt if using sessions
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/cart', {
                method: 'GET',
                headers: headers
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn("Cart.js: Not authenticated. Cart will not load.");
                    // Optionally redirect to login or show login message
                    showNotification('Please log in to view your cart.');
                    cart = []; // Clear cart if not authenticated
                    renderCart();
                    updateCartCount();
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch cart from backend.');
            }

            const data = await response.json();
            console.log('Cart.js: Fetched cart from backend:', data);

            // IMPORTANT: Map the backend's populated 'carId' details to your frontend 'item' structure
            cart = data.cart && data.cart.items ? data.cart.items.map(item => ({
                id: item.carId._id, // Use the car's actual ID from the populated object
                name: item.carId.name,
                model: item.carId.model,
                price: item.carId.price,
                engine: item.carId.engine,
                color: item.carId.color,
                image: item.carId.image,
                quantity: item.quantity
            })) : [];

            renderCart();
            updateCartCount(); // Update cart icon count

        } catch (error) {
            console.error('Cart.js: Error fetching cart from backend:', error);
            showNotification('Error loading cart. Please try again.');
            // Fallback to localStorage if backend fetch fails (e.g., network issue or initial login problem)
            cart = JSON.parse(localStorage.getItem('cart')) || [];
            renderCart();
            updateCartCount();
        }
    }

    // Call this function immediately when the DOM is loaded
    fetchCartFromBackend();


    // --- Event Listeners ---
    if (cartContainer) {
        cartContainer.addEventListener('click', async function(e) {
            const Clicked = e.target;
            const itemElement = Clicked.closest('.cart-item');
            if (!itemElement) return;

            const itemId = itemElement.dataset.id; // This is the car's _id

            if (Clicked.classList.contains('remove-btn')) {
                await removeItemFromBackend(itemId);
            } else if (Clicked.classList.contains('quantity-btn')) {
                const change = Clicked.classList.contains('increase') ? 1 : -1;
                const item = cart.find(item => item.id === itemId);
                if (!item) return;
                const newQuantity = item.quantity + change;

                if (newQuantity < 1) {
                    await removeItemFromBackend(itemId);
                } else if (newQuantity > 4) {
                    showNotification('Maximum quantity reached for this item (4).');
                } else {
                    await updateQuantityOnBackend(itemId, newQuantity);
                }
            }
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', async function() {
            // For a real app, you'd collect payment info here (e.g., from a form)
            alert('Initiating checkout process! (This is a placeholder for payment collection)');
            await checkoutCartOnBackend();
        });
    }


    // --- Backend Interaction Functions (from frontend) ---

    async function removeItemFromBackend(carId) {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`/api/cart/remove/${carId}`, {
                method: 'DELETE',
                headers: headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove item from cart.');
            }

            showNotification('Item removed from cart.');
            await fetchCartFromBackend(); // Re-fetch cart state to ensure consistency

        } catch (error) {
            console.error('Cart.js: Error removing item from backend:', error);
            showNotification('Error removing item from cart. Please try again.');
        }
    }

    async function updateQuantityOnBackend(carId, newQuantity) {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`/api/cart/update-quantity/${carId}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update item quantity.');
            }

            showNotification('Item quantity updated.');
            await fetchCartFromBackend(); // Re-fetch to ensure consistency

        } catch (error) {
            console.error('Cart.js: Error updating quantity on backend:', error);
            showNotification('Error updating quantity. Please try again.');
        }
    }

    async function checkoutCartOnBackend() {
        // Placeholder for payment info - replace with actual form data
        const paymentInfo = { /* ... your payment details ... */ };

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/cart/checkout', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ paymentInfo })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Checkout failed.');
            }

            const data = await response.json();
            showNotification(data.message || 'Checkout completed!');
            console.log('Checkout response:', data);

            // After successful checkout, the cart should be cleared on frontend too
            cart = [];
            renderCart();
            updateCartCount();

        } catch (error) {
            console.error('Cart.js: Error during checkout:', error);
            showNotification(`Checkout failed: ${error.message}`);
        }
    }


    // --- Utility Functions ---

    function renderCart() {
        if (!cartContainer) {
            console.warn("Cart.js: #cart-items-container not found. Cannot render cart.");
            return;
        }

        if (cart.length === 0) {
            cartContainer.innerHTML = '';
            if (emptyCartMessageContainer) emptyCartMessageContainer.style.display = 'block';
            if (cartSummary) cartSummary.style.display = 'none';
            console.log("Cart.js: Cart is empty. Displaying empty message.");
            return;
        }

        if (emptyCartMessageContainer) emptyCartMessageContainer.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';

        cartContainer.innerHTML = cart.map(item => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            const itemSubtotal = price * quantity;

            return `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image || '/images/default-car.jpg'}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name} (${item.model})</h3>
                        <p class="item-price">Price: $${price.toLocaleString()}</p>
                        <p class="item-color">Color: ${item.color}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn decrease" ${quantity <= 1 ? 'disabled' : ''}>-</button>
                            <span class="quantity-display">${quantity}</span>
                            <button class="quantity-btn increase" ${quantity >= 4 ? 'disabled' : ''}>+</button>
                        </div>
                        <p class="item-subtotal">Item Total: $${itemSubtotal.toLocaleString()}</p>
                    </div>
                    <button class="remove-btn">✕</button>
                </div>
            `;
        }).join('');

        updateCartTotal();
        console.log("Cart.js: Cart rendered successfully.");
    }

    function updateCartTotal() {
        if (!subtotalElement || !totalElement) {
            console.warn("Cart.js: Subtotal or Total elements not found. Cannot update totals.");
            return;
        }

        const subtotal = cart.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.quantity));
        }, 0);

        subtotalElement.textContent = `$${subtotal.toLocaleString()}`;
        totalElement.textContent = `$${subtotal.toLocaleString()}`;
        console.log("Cart.js: Cart totals updated. Subtotal:", subtotal);
    }

    function updateCartCount() {
        const count = cart.reduce((total, item) => total + Number(item.quantity), 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
        console.log("Cart.js: Cart count updated to:", count);
    }

    // --- Global addToCart function (exposed to other scripts like carllisting.js) ---
    window.addToCart = async function (product) {
        console.log("Cart.js: window.addToCart called with product:", product);

        if (!product || !product.id || !product.name || typeof product.price === 'undefined') {
            console.error('Product must have at least ID, Name, and Price to be added to cart.', product);
            showNotification('Error: Missing product details.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch('/api/cart/add-item', { // This matches your backend route
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    carId: product.id, // Ensure this matches what backend expects
                    name: product.name,
                    model: product.model,
                    price: product.price,
                    image: product.image,
                    engine: product.engine,
                    color: product.color,
                    quantity: 1 // Always add 1 for new items via this button
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add item to cart.');
            }

            const data = await response.json();
            console.log('✅ Backend cart updated:', data);
            showNotification('Item added to cart successfully!');

            await fetchCartFromBackend(); // Re-fetch to sync frontend cart display

        } catch (err) {
            console.error('❌ Failed to add to cart:', err);
            showNotification('Error adding item to cart. Please log in or try again.');
        }
    };
});

// Helper function to show temporary notifications (can remain outside DOMContentLoaded)
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => notification.remove(), {
            once: true
        });
    }, 3000);
}