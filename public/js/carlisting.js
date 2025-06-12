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

        const addToCartBtn = carCard.querySelector('.view-details-btn');
        addToCartBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ _id: car._id })
                });

                if (!response.ok) throw new Error('Failed to add car to cart');

                const result = await response.json();
                alert('✅ Car added to cart successfully!');
            } catch (err) {
                console.error('Error adding to cart:', err);
                alert('❌ Failed to add car to cart. Please try again.');
            }
        });

        return carCard;
    };

    const loadCars = async () => {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        noCarsMessage.style.display = 'none';
        carsContainer.innerHTML = '';

        try {
            const response = await fetch('/addcars/all');
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
                loadingMessage.style.display = 'none';
            } else {
                loadingMessage.style.display = 'none';
                noCarsMessage.style.display = 'block';
            }

        } catch (error) {
            console.error('Error loading cars:', error);
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.textContent = `Failed to load cars: ${error.message}. Please check your server and network connection.`;
        }
    };

    loadCars();
});
