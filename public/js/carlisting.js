// public/js/carllisting.js

document.addEventListener("DOMContentLoaded", () => {
    const carsContainer = document.getElementById("cars-container");

    const loadingMessage = document.createElement("div");
    loadingMessage.textContent = "Loading cars...";
    loadingMessage.style.textAlign = "center";
    loadingMessage.style.padding = "20px";
    carsContainer.before(loadingMessage);

    const errorMessage = document.createElement("div");
    errorMessage.style.display = "none";
    errorMessage.style.color = "red";
    errorMessage.style.textAlign = "center";
    errorMessage.style.padding = "20px";
    carsContainer.before(errorMessage);

    const successMessage = document.createElement("div"); // For car listing specific success messages
    successMessage.style.display = "none";
    successMessage.style.color = "green";
    successMessage.style.textAlign = "center";
    successMessage.style.padding = "20px";
    carsContainer.before(successMessage);

    const noCarsMessage = document.createElement("div");
    noCarsMessage.style.display = "none";
    noCarsMessage.style.textAlign = "center";
    noCarsMessage.style.padding = "20px";
    carsContainer.before(noCarsMessage);

    // Ensure these filter elements exist in your HTML (carllisting.ejs)
    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");
    const brandFilter = document.getElementById("brand-filter");
    const resetButton = document.getElementById("reset-filters");

    let allCars = []; // Stores all fetched cars

    async function fetchCars() {
        try {
            const res = await fetch("/admin/all"); // Your existing route to fetch all cars
            if (!res.ok) throw new Error(`Status: ${res.status}`);

            const data = await res.json();
            loadingMessage.style.display = "none";

            if (!data || data.length === 0) {
                noCarsMessage.textContent = "No cars available.";
                noCarsMessage.style.display = "block";
                return;
            }

            allCars = data; // Store all cars for filtering
            populateFilters(allCars);
            renderCars(allCars); // Render all cars initially
        } catch (err) {
            loadingMessage.style.display = "none";
            errorMessage.textContent = "❌ Failed to load cars.";
            errorMessage.style.display = "block";
        }
    }

    function renderCars(carList) {
        carsContainer.innerHTML = ""; // Clear existing content

        if (!carList || carList.length === 0) {
            noCarsMessage.textContent = "No matching cars found.";
            noCarsMessage.style.display = "block";
            return;
        }

        noCarsMessage.style.display = "none"; // Hide if cars are found

        carList.forEach((car) => {
            const card = document.createElement("div");
            card.className = "car-card";

            card.innerHTML = `
                <img src="${car.image || '/images/default-car.jpg'}" alt="${car.model}" class="car-image">
                <div class="car-details">
                    <h3>${car.name} ${car.model}</h3>
                    <p><strong>Price:</strong> $${car.price.toLocaleString()}</p>
                    <p><strong>Engine:</strong> ${car.engine}</p>
                    <p><strong>Color:</strong> ${car.color}</p>
                    <button class="add-to-cart-btn" data-id="${car._id}">Add to Cart</button>
                </div>
            `;

            const button = card.querySelector(".add-to-cart-btn");
            button.addEventListener("click", async () => {
                // Check if window.addToCart is available (meaning cart.js has loaded)
                if (typeof window.addToCart === 'function') {
                    // Call the global addToCart function from public/js/cart.js
                    // Pass the complete product object including its MongoDB _id
                    await window.addToCart({
                        id: car._id, // This is the carId your backend expects
                        name: car.name,
                        model: car.model,
                        price: car.price,
                        engine: car.engine,
                        color: car.color,
                        image: car.image || "/images/default-car.jpg",
                        quantity: 1 // Always add 1 for new items via this button
                    });
                    // The success/error messages for adding to cart are now handled by cart.js's showNotification
                } else {
                    console.error("window.addToCart is not defined. Ensure cart.js is loaded BEFORE carllisting.js in your HTML.");
                    errorMessage.textContent = "Cart functionality not available. Please refresh.";
                    errorMessage.style.display = "block";
                    setTimeout(() => (errorMessage.style.display = "none"), 3000);
                }
            });

            carsContainer.appendChild(card);
        });
    }

    function populateFilters(cars) {
        // Clear previous options
        brandFilter.innerHTML = '<option value="">All Brands</option>';
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        priceFilter.innerHTML = `
            <option value="">All Prices</option>
            <option value="0-25000">$0 - $25,000</option>
            <option value="25001-50000">$25,001 - $50,000</option>
            <option value="50001-75000">$50,001 - $75,000</option>
            <option value="75001-100000">$75,001 - $100,000</option>
            <option value="100000+">$100,000+</option>
        `;


        const brands = [...new Set(cars.map((c) => c.name))];
        const categories = [...new Set(cars.map((c) => c.model))];

        brands.forEach((brand) => {
            const opt = document.createElement("option");
            opt.value = brand;
            opt.textContent = brand;
            brandFilter.appendChild(opt);
        });

        categories.forEach((cat) => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.textContent = cat;
            categoryFilter.appendChild(opt);
        });
    }

    function applyFilters() {
        let filtered = [...allCars];
        const brand = brandFilter.value;
        const category = categoryFilter.value;
        const price = priceFilter.value;

        if (brand) {
            filtered = filtered.filter((c) => c.name === brand);
        }

        if (category) {
            filtered = filtered.filter((c) => c.model === category);
        }

        if (price) {
            if (price === "100000+") {
                filtered = filtered.filter((c) => c.price >= 100000);
            } else {
                const [min, max] = price.split("-").map(Number);
                filtered = filtered.filter((c) => c.price >= min && c.price <= max);
            }
        }

        renderCars(filtered);
    }

    // Event listeners for filters
    if (brandFilter) brandFilter.addEventListener("change", applyFilters);
    if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
    if (priceFilter) priceFilter.addEventListener("change", applyFilters);
    if (resetButton) resetButton.addEventListener("click", () => {
        brandFilter.value = "";
        categoryFilter.value = "";
        priceFilter.value = "";
        renderCars(allCars); // Re-render all cars after reset
    });

    // Initial fetch of cars when the page loads
    fetchCars();
});