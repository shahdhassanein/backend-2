console.log("Carlisting.js: Script loaded.");

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Carlisting.js: DOMContentLoaded event fired.");

    const carsContainer = document.getElementById("cars-container");

    const loadingMessage = document.createElement("div");
    loadingMessage.textContent = "Loading cars...";
    carsContainer.before(loadingMessage);

    const errorMessage = document.createElement("div");
    errorMessage.style.display = "none";
    errorMessage.style.color = "red";
    carsContainer.before(errorMessage);

    const noCarsMessage = document.createElement("div");
    noCarsMessage.style.display = "none";
    carsContainer.before(noCarsMessage);

    const successMessage = document.createElement("div"); // For success message in carlisting.js itself
    successMessage.style.display = "none";
    successMessage.style.color = "green";
    carsContainer.before(successMessage);

    const categoryFilter = document.getElementById("category-filter");
    const priceFilter = document.getElementById("price-filter");
    const brandFilter = document.getElementById("brand-filter");
    const resetButton = document.getElementById("reset-filters");

    let allCars = [];

    async function fetchCars() {
        console.log("Carlisting.js: fetchCars function called.");
        try {
            const res = await fetch("api/cars/all");
            if (!res.ok) throw new Error(`Status: ${res.status}`);

            const data = await res.json();
            loadingMessage.style.display = "none";

            if (!data || data.length === 0) {
                noCarsMessage.textContent = "No cars available.";
                noCarsMessage.style.display = "block";
                return;
            }

            allCars = data;
            populateFilters(allCars);
            renderCars(allCars);
        } catch (err) {
            loadingMessage.style.display = "none";
            errorMessage.textContent = "❌ Failed to load cars.";
            errorMessage.style.display = "block";
        }
    }

    function renderCars(carList) {
        console.log("Carlisting.js: renderCars function called with", carList.length, "cars.");
        carsContainer.innerHTML = "";

        if (!carList || carList.length === 0) {
            noCarsMessage.textContent = "No matching cars found.";
            noCarsMessage.style.display = "block";
            return;
        }

        noCarsMessage.style.display = "none";

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
            if (button) {
                console.log(`Carlisting.js: Found add-to-cart-btn for car ${car._id}`);
                button.addEventListener("click", async () => {
                    console.log(`Carlisting.js: Add to cart button clicked for car ${car._id}`);

                    // Use the globally exposed window.addToCart function from cart.js
                    // This function already handles the backend call, notifications,
                    // and updating the cart count display.
                    const selectedCar = carList.find(c => c._id === car._id);
                    if (selectedCar) {
                        // The window.addToCart function already has its own success/error notifications.
                        // You can remove the successMessage/errorMessage display logic here if you prefer
                        // cart.js to handle all notifications related to cart actions.
                        await window.addToCart({
                            id: selectedCar._id,
                            name: selectedCar.name,
                            model: selectedCar.model,
                            price: selectedCar.price,
                            engine: selectedCar.engine,
                            color: selectedCar.color,
                            image: selectedCar.image
                        });
                        // If you want the local successMessage to still show:
                        // successMessage.textContent = "✅ Car added to cart!";
                        // successMessage.style.display = "block";
                        // setTimeout(() => (successMessage.style.display = "none"), 3000);

                    } else {
                        console.error("Carlisting.js: Car not found in current list for adding to cart.");
                        // Use the global showNotification if you removed the successMessage/errorMessage
                        // showNotification('Error: Could not find car details.');
                        errorMessage.textContent = 'Error: Could not find car details.';
                        errorMessage.style.display = 'block';
                        setTimeout(() => (errorMessage.style.display = 'none'), 3000);
                    }
                });
            } else {
                console.warn(`Carlisting.js: No add-to-cart-btn found for car ${car._id}`);
            }

            carsContainer.appendChild(card);
        });
    }

    function populateFilters(cars) {
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

    brandFilter.addEventListener("change", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);
    priceFilter.addEventListener("change", applyFilters);
    resetButton.addEventListener("click", () => {
        brandFilter.value = "";
        categoryFilter.value = "";
        priceFilter.value = "";
        renderCars(allCars);
    });

    // This call starts the whole process of fetching and rendering cars
    fetchCars();
});