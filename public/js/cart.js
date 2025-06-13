document.addEventListener('DOMContentLoaded', function(){
    console.log("script loaded");

    let cart= json.parse (localStorage.getItem('cart')) || [];
    console.log("initial cart state", cart);

    const cartContainer =document.getElementById('cart-items-container');
     const emptyCartMessageContainer = document.querySelector('.empty-cart-message-container');
     const subtotalElement = document.querySelector('.subtotal-amount');
     const totalElement = document.querySelector('.total-amount');
     const cartSummary = document.querySelector('.cart-summary');
    const checkoutButton = document.getElementById('checkout-button');

    renderCart();
    updateCartCount();

    if (cartContainer){
        cartContainer.addEventListener('click', function(e){
            const Clicked=e.target;
            const itemElement=Clicked.closest('.cart-item');
            if(!itemElement) return;
            const itemId = itemElement.dataset.id; // Get the product ID

            if (clicked.classList.contains('remove-btn')) {
                console.log(`Cart.js: Attempting to remove item with ID: ${itemId}`); // Debugging log
                removeItem(itemId);
            } else if (clicked.classList.contains('quantity-btn')) {
                const change = clicked.classList.contains('increase') ? 1 : -1;
                console.log(`Cart.js: Attempting to update quantity for ID: ${itemId}, change: ${change}`); // Debugging log
                updateQuantity(itemId, change);
            }
         });
    };
})
   // Event listener for checkout button (if you have one)
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            // Implement your checkout logic here.
            // This might involve sending the 'cart' array to a backend /checkout endpoint.
            alert('Proceeding to checkout! (This is a placeholder)');
            console.log('Cart.js: Checkout button clicked. Current cart:', cart);
            // Example: fetch('/checkout', { method: 'POST', body: JSON.stringify(cart), headers: { 'Content-Type': 'application/json' }})
        });
    }

    // Function to remove an item from the cart
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        renderCart();
        showNotification('Item removed from cart.'); // User feedback
    }

    // Function to update item quantity in the cart
    function updateQuantity(id, change) {
        const item = cart.find(item => item.id === id);
        if (!item) return;

        const newQuantity = item.quantity + change;
        // Limit quantity between 1 and 4 (as per your original code)
        if (newQuantity < 1) {
            // Optionally remove item if quantity goes below 1
            removeItem(id);
            return;
        }
        if (newQuantity > 4) {
            showNotification('Maximum quantity reached for this item (4).');
            return;
        }

        item.quantity = newQuantity;
        saveCart();
        renderCart();
        showNotification('Item quantity updated.'); // User feedback
    }

    // Function to save the current cart state to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log("Cart.js: Cart saved to localStorage:", cart); // Debugging log
        updateCartCount(); // Update cart icon count
    }

    // Function to render/re-render the cart items in the HTML
    function renderCart() {
        if (!cartContainer) {
            console.warn("Cart.js: #cart-items-container not found. Cannot render cart.");
            return; // Exit if container doesn't exist
        }

        if (cart.length === 0) {
            cartContainer.innerHTML = ''; // Clear items if any were rendered previously
            if (emptyCartMessageContainer) emptyCartMessageContainer.style.display = 'block'; // Show empty message
            if (cartSummary) cartSummary.style.display = 'none'; // Hide summary
            console.log("Cart.js: Cart is empty. Displaying empty message."); // Debugging log
            return;
        }

        // If cart has items, hide empty message and show summary
        if (emptyCartMessageContainer) emptyCartMessageContainer.style.display = 'none';
        if (cartSummary) cartSummary.style.display = 'block';

        // Generate HTML for each item in the cart
        cartContainer.innerHTML = cart.map(item => {
            const price = Number(item.price);
            const quantity = Number(item.quantity);
            const itemSubtotal = price * quantity; // Subtotal for this specific item
    });
}