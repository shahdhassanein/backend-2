document.addEventListener("DOMContentLoaded", async () => {
    const carsContainer = document.getElementById('cars-container');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const noCarsMessage = document.getElementById('no-cars-message');

    const createCarCard = (car) => {
    const carCard = document.createElement('div');
    carCard.className = 'car-card';

    carCard.innerHTML = `
        <img src="${car.image}" alt="${car.name} ${car.model}" class="car-image">
        <div class="car-details">
            <h3>${car.name} ${car.model}</h3>
            <p><strong>Price:</strong> $${car.price.toLocaleString()}</p>
            <p><strong>Engine:</strong> ${car.engine}</p>
            <p><strong>Color:</strong> ${car.color}</p>
        </div>
        <button class="view-details-btn">Add to cart</button>
    `;

    // Add event listener to the button
    const addToCartBtn = carCard.querySelector('.view-details-btn');
    addToCartBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(car)
            });

            if (!response.ok) {
                throw new Error('Failed to add car to cart');
            }

            const result = await response.json();
            alert('✅ Car added to cart successfully!');
        } catch (err) {
            console.error('Error adding to cart:', err);
            alert('❌ Failed to add car to cart. Please try again.');
        }
    });

    return carCard;
};

    // Function to load cars from the API
    const loadCars = async () => {
        loadingMessage.style.display = 'block'; // Show loading message
        errorMessage.style.display = 'none';    // Hide error message
        noCarsMessage.style.display = 'none';   // Hide no cars message
        carsContainer.innerHTML = ''; // Clear previous content

        try {
            const response = await fetch('/addcars/all'); // Call your new API endpoint

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch car data.');
            }

            const data = await response.json();

            if (data.success && data.cars.length > 0) {
                data.cars.forEach(car => {
                    const carCard = createCarCard(car);
                    carsContainer.appendChild(carCard);
                });
                loadingMessage.style.display = 'none'; // Hide loading message
            } else {
                loadingMessage.style.display = 'none'; // Hide loading message
                noCarsMessage.style.display = 'block'; // Show no cars message
            }

        } catch (error) {
            console.error('Error loading cars:', error);
            loadingMessage.style.display = 'none'; // Hide loading message
            errorMessage.style.display = 'block'; // Show error message
            errorMessage.textContent = `Failed to load cars: ${error.message}. Please check your server and network connection.`;
        }
    };

    // Load cars when the page loads
    loadCars();
});