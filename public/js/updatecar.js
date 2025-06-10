
document.addEventListener('DOMContentLoaded', async () => {
    const carIdInput = document.getElementById('carId');
    const updateCarForm = document.getElementById('updateCarForm');
    const messageDiv = document.getElementById('message');

    // Check if carIdInput and updateCarForm exist
    if (!carIdInput || !updateCarForm) {
        console.error('Essential form elements not found.');
        return;
    }

    const carId = carIdInput.value;

    // Function to display messages
    const displayMessage = (msg, type) => {
        messageDiv.textContent = msg;
        messageDiv.className = `alert mt-3 alert-${type}`;
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000); // Hide after 5 seconds
    };

    // Fetch current car data to pre-fill the form
    const fetchCarData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                displayMessage('Authentication token not found. Please log in.', 'danger');
                window.location.href = '/login'; // Redirect to login
                return;
            }

            const response = await fetch(`/api/cars/${carId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch car data.');
            }

            const car = await response.json();

            // Pre-fill the form fields
            document.getElementById('name').value = car.name || '';
            document.getElementById('brand').value = car.brand || '';
            document.getElementById('model').value = car.model || '';
            document.getElementById('category').value = car.category || '';
            document.getElementById('price').value = car.price || '';
            document.getElementById('stock').value = car.stock || '';
            document.getElementById('engine').value = car.engine || '';
            document.getElementById('color').value = car.color || '';
            document.getElementById('image').value = car.image || '';

        } catch (error) {
            console.error('Error fetching car data:', error);
            displayMessage(`Error loading car: ${error.message}`, 'danger');
        }
    };

    // Call fetchCarData when the page loads
    fetchCarData();

    // Handle form submission
    updateCarForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const carData = {
            name: document.getElementById('name').value,
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value),
            stock: parseInt(document.getElementById('stock').value, 10),
            engine: document.getElementById('engine').value,
            color: document.getElementById('color').value,
            image: document.getElementById('image').value
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                displayMessage('Authentication token not found. Please log in.', 'danger');
                window.location.href = '/login'; // Redirect to login
                return;
            }

            const response = await fetch(`/api/cars/${carId}`, {
                method: 'PUT', // Use PUT for updates
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(carData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update car.');
            }

            displayMessage('Car updated successfully!', 'success');
           

        } catch (error) {
            console.error('Error updating car:', error);
            displayMessage(`Error updating car: ${error.message}`, 'danger');
        }
    });
});