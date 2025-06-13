/*document.addEventListener("DOMContentLoaded", () => {
  const carsContainer = document.getElementById("cars-container");

  // Create message elements
  const loadingMessage = document.createElement("div");
  loadingMessage.id = "loading-message";
  loadingMessage.textContent = "Loading cars...";
  loadingMessage.style.textAlign = "center";
  loadingMessage.style.padding = "20px";
  carsContainer.before(loadingMessage);

  const errorMessage = document.createElement("div");
  errorMessage.id = "error-message";
  errorMessage.style.display = "none";
  errorMessage.style.color = "red";
  errorMessage.style.textAlign = "center";
  errorMessage.style.padding = "20px";
  carsContainer.before(errorMessage);

  const successMessage = document.createElement("div");
  successMessage.id = "success-message";
  successMessage.style.display = "none";
  successMessage.style.color = "green";
  successMessage.style.textAlign = "center";
  successMessage.style.padding = "20px";
  carsContainer.before(successMessage);

  const noCarsMessage = document.createElement("div");
  noCarsMessage.id = "no-cars-message";
  noCarsMessage.style.display = "none";
  noCarsMessage.style.textAlign = "center";
  noCarsMessage.style.padding = "20px";
  carsContainer.before(noCarsMessage);

  let cars = [];

  async function fetchCars() {
    try {
      const response = await fetch("/addcars/all");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      cars = await response.json();
      loadingMessage.style.display = "none";

      if (!cars || cars.length === 0) {
        noCarsMessage.textContent = "No cars available";
        noCarsMessage.style.display = "block";
        return;
      }

      carsContainer.innerHTML = "";

      cars.forEach((car) => {
        const carCard = document.createElement("div");
        carCard.classList.add("car-card");

        carCard.innerHTML = `
          <img src="${car.image || '/images/default-car.jpg'}" alt="${car.model}" class="car-image">
          <div class="car-details">
            <h3>${car.name} ${car.model}</h3>
            <p><strong>Price:</strong> $${car.price.toLocaleString()}</p>
            <p><strong>Engine:</strong> ${car.engine}</p>
            <p><strong>Color:</strong> ${car.color}</p>
            <button class="add-to-cart-btn" data-id="${car._id}">Add To Cart</button>
          </div>
        `;

        carsContainer.appendChild(carCard);
      });

      // Set up event listeners for all Add to Cart buttons
      document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
          const carId = e.target.dataset.id;
          const selectedCar = cars.find(car => car._id === carId);

          if (!selectedCar) {
            console.error("Car not found!");
            return;
          }

          try {
            const response = await fetch('/api/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: selectedCar.name,
                model: selectedCar.model,
                price: selectedCar.price,
                engine: selectedCar.engine,
                color: selectedCar.color,
                image: selectedCar.image || '/images/default-car.jpg'
              })
            });

            const result = await response.json();

            if (response.ok) {
              successMessage.textContent = result.message || "Car added to cart successfully!";
              successMessage.style.display = "block";
              errorMessage.style.display = "none";

              setTimeout(() => {
                successMessage.style.display = "none";
              }, 3000);
            } else {
              throw new Error(result.message || "Something went wrong");
            }
          } catch (error) {
            console.error("Add to cart error:", error);
            errorMessage.textContent = error.message || "Failed to add car to cart.";
            errorMessage.style.display = "block";

            setTimeout(() => {
              errorMessage.style.display = "none";
            }, 3000);
          }
        });
      });

    } catch (error) {
      console.error("Failed to fetch cars:", error);
      loadingMessage.style.display = "none";
      errorMessage.textContent = "Failed to load cars. Please try again later.";
      errorMessage.style.display = "block";
    }
  }

  fetchCars();
});
*/document.addEventListener("DOMContentLoaded", () => {
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

  const successMessage = document.createElement("div");
  successMessage.style.display = "none";
  successMessage.style.color = "green";
  carsContainer.before(successMessage);

  const categoryFilter = document.getElementById("category-filter");
  const priceFilter = document.getElementById("price-filter");
  const brandFilter = document.getElementById("brand-filter");
  const resetButton = document.getElementById("reset-filters");

  let allCars = [];

  async function fetchCars() {
    try {
      const res = await fetch("/addcars/all");
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
      button.addEventListener("click", async () => {
        const token = localStorage.getItem("token");

        try {
          const res = await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: car.name,
              model: car.model,
              price: car.price,
              engine: car.engine,
              color: car.color,
              image: car.image || "/images/default-car.jpg",
            }),
          });

          const result = await res.json();

          if (!res.ok) throw new Error(result.message || "Add to cart failed");

          successMessage.textContent = "✅ Car added to cart!";
          successMessage.style.display = "block";
          setTimeout(() => (successMessage.style.display = "none"), 3000);
        } catch (err) {
          errorMessage.textContent = err.message;
          errorMessage.style.display = "block";
          setTimeout(() => (errorMessage.style.display = "none"), 3000);
        }
      });

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

  fetchCars();
});
