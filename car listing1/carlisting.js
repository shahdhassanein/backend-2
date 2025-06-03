document.addEventListener('DOMContentLoaded', function() {
    // ======================
    // FILTERING FUNCTIONALITY
    // ======================
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const brandFilter = document.getElementById('brandFilter');
    const resetButton = document.getElementById('resetFilters');
    
    // IMPORTANT: Updated selector to use both car-card and flex-box classes
    const carBoxes = document.querySelectorAll('.car-card, .flex-box');
    
    const PRICE_RANGES = {
        low: { min: 100000, max: 200000 },
        medium: { min: 200001, max: 300000 },
        high: { min: 300001, max: Infinity }
    };

    // Initialize filters
    if (categoryFilter) categoryFilter.addEventListener('change', filterCars);
    if (priceFilter) priceFilter.addEventListener('change', filterCars);
    if (brandFilter) brandFilter.addEventListener('change', filterCars);
    if (resetButton) resetButton.addEventListener('click', resetFilters);
    filterCars();

    // =================
    // CART FUNCTIONALITY
    // =================
    initializeCartButtons();
    updateCartCount();

    // ==============
    // CORE FUNCTIONS
    // ==============
    
    function parsePrice(priceString) {
        if (!priceString) return 0;
        return parseInt(priceString.replace(/[^0-9]/g, ''));
    }
    
    function filterCars() {
        console.log("Filtering cars...");
        
        // Get selected values
        const selectedCategory = categoryFilter.value.toLowerCase();
        const selectedPrice = priceFilter.value;
        const selectedBrand = brandFilter.value.toLowerCase();
        
        console.log("Selected filters:", {
            category: selectedCategory,
            price: selectedPrice,
            brand: selectedBrand
        });
        
        let hasVisibleItems = false;
        
        carBoxes.forEach(box => {
            // Get data from attributes
            const category = (box.dataset.category || "").toLowerCase();
            const price = parsePrice(box.dataset.price);
            const brand = (box.dataset.brand || "").toLowerCase();
            
            console.log("Car data:", {
                element: box,
                category: category,
                price: price,
                brand: brand
            });
            
            // Check if car matches all filters
            const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
            let priceMatch = true;
            if (selectedPrice !== 'all') {
                const range = PRICE_RANGES[selectedPrice];
                priceMatch = price >= range.min && price <= range.max;
            }
            const brandMatch = selectedBrand === 'all' || brand === selectedBrand;
            
            console.log("Matches:", {
                categoryMatch: categoryMatch,
                priceMatch: priceMatch,
                brandMatch: brandMatch
            });
            
            // Show or hide based on filter matches
            const shouldShow = categoryMatch && priceMatch && brandMatch;
            box.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) hasVisibleItems = true;
        });
        
        updateNoResultsMessage(hasVisibleItems);
    }
    
    function resetFilters(e) {
        if (e) e.preventDefault();
        
        categoryFilter.value = 'all';
        priceFilter.value = 'all';
        brandFilter.value = 'all';
        filterCars();
    }
    
    function updateNoResultsMessage(hasVisibleItems) {
        let noResultsMsg = document.getElementById('no-results-message');
        const flexContainer = document.querySelector('.flex-container');
        
        if (!hasVisibleItems && flexContainer) {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('p');
                noResultsMsg.id = 'no-results-message';
                noResultsMsg.textContent = 'No cars match your filters. Try different criteria.';
                noResultsMsg.style.textAlign = 'center';
                noResultsMsg.style.margin = '20px 0';
                noResultsMsg.style.color = '#ff0000';
                noResultsMsg.style.fontWeight = 'bold';
                noResultsMsg.style.fontSize = '18px';
                flexContainer.appendChild(noResultsMsg);
            }
        } else if (hasVisibleItems && noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    // Function to initialize cart buttons
    function initializeCartButtons() {
        const cartButtons = document.querySelectorAll('.add-to-cart');
        
        cartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const product = {
                    id: this.dataset.id,
                    name: this.dataset.name,
                    price: parseFloat(this.dataset.price),
                    brand: this.dataset.brand
                };
                
                // Call addToCart function
                if (typeof addToCart === 'function') {
                    addToCart(product);
                    
                    // Visual feedback
                    this.classList.add('added-to-cart');
                    const originalText = this.textContent;
                    this.textContent = 'Added to Cart!';
                    
                    setTimeout(() => {
                        this.classList.remove('added-to-cart');
                        this.textContent = originalText;
                    }, 1500);
                } else {
                    console.error("addToCart function not found");
                }
            });
        });
    }
    
    // Add a fallback implementation of addToCart if needed
    if (typeof addToCart !== 'function') {
        window.addToCart = function(product) {
            console.log("Adding to cart:", product);
            
            // Get existing cart or initialize new one
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
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
            
            // Save updated cart to local storage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count display
            updateCartCount();
        };
    }
    
    // Function to update cart count
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Update count elements if they exist
        document.querySelectorAll('.count').forEach(el => {
            el.textContent = totalItems;
        });
    }
});