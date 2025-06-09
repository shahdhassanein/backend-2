// public/js/purchases.js

document.addEventListener('DOMContentLoaded', async () => {
    const purchasesTableBody = document.querySelector('#purchasesTable tbody');
    const loadingMessage = document.getElementById('loading');
    const messageDiv = document.getElementById('message');

    // --- IMPORTANT: How to get the User ID and Token ---
    // In a real application, after a user logs in, you would store their
    // JWT token and potentially their user ID in localStorage.
    // For this example, let's assume they are stored like this:
    const token = localStorage.getItem('token'); // Get token from localStorage
    const userId = localStorage.getItem('userId'); // Get user ID from localStorage

    // You might have gotten the userId from the login response.
    // Example: If your login response gives you: { _id: "user_id", token: "jwt_token" }
    // You would save them: localStorage.setItem('userId', data._id); localStorage.setItem('token', data.token);

    if (!token || !userId) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Please log in to view your purchase history.';
        loadingMessage.style.display = 'none';
        return;
    }

    try {
        // Construct the API URL for the current user's purchases
        // Ensure this URL matches the route in your node.js: /api/users/:userId/purchases
        const apiUrl = `http://localhost:3000/api/users/${userId}/purchases`;

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token, // Send the JWT token for authentication
            },
        });

        loadingMessage.style.display = 'none'; // Hide loading message

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch purchases.');
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
            data.data.forEach(purchase => {
                const row = purchasesTableBody.insertRow();

                // Format purchase date nicely
                const purchaseDate = new Date(purchase.purchaseDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Insert cells and set their content
                // Ensure these property names (userId.name, carId.name, etc.) match
                // what your backend returns after population.
                row.insertCell().textContent = purchase.userId ? purchase.userId.name : 'N/A'; // Populated user name
                row.insertCell().textContent = purchase.carId ? purchase.carId.name : 'N/A';   // Populated car name
                row.insertCell().textContent = purchase.carId ? purchase.carId.brand : 'N/A';
                row.insertCell().textContent = purchase.carId ? purchase.carId.model : 'N/A';
                row.insertCell().textContent = purchase.quantity || 'N/A'; // Ensure quantity exists
                row.insertCell().textContent = purchase.unitPrice ? `$${purchase.unitPrice.toFixed(2)}` : 'N/A'; // Ensure unitPrice exists
                row.insertCell().textContent = purchase.totalPrice ? `$${purchase.totalPrice.toFixed(2)}` : 'N/A'; // Ensure totalPrice exists
                row.insertCell().textContent = purchaseDate;
                row.insertCell().textContent = purchase.status || 'N/A';

                // Add data-label for responsive design on mobile
                row.cells[0].setAttribute('data-label', 'Username');
                row.cells[1].setAttribute('data-label', 'Car Name');
                row.cells[2].setAttribute('data-label', 'Brand');
                row.cells[3].setAttribute('data-label', 'Model');
                row.cells[4].setAttribute('data-label', 'Quantity');
                row.cells[5].setAttribute('data-label', 'Unit Price');
                row.cells[6].setAttribute('data-label', 'Total Price');
                row.cells[7].setAttribute('data-label', 'Purchase Date');
                row.cells[8].setAttribute('data-label', 'Status');
            });
        } else {
            messageDiv.className = 'message';
            messageDiv.textContent = 'No purchase history found.';
        }

    } catch (error) {
        console.error('Failed to fetch purchases:', error);
        messageDiv.className = 'message error';
        messageDiv.textContent = `Error: ${error.message}`;
    }
});