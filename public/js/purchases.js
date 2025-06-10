// public/js/purchases.js

document.addEventListener('DOMContentLoaded', async () => {
    const purchasesTableBody = document.getElementById('purchasesTableBody');
    const loadingMessage = document.getElementById('loading');
    const messageDiv = document.getElementById('message');

    // Function to show messages on the page
    function showMessage(msg, type = 'success') {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    }

    // Function to hide messages
    function hideMessage() {
        messageDiv.style.display = 'none';
    }

    // Function to fetch and display ALL purchases for the admin view
    async function fetchAllPurchases() {
        loadingMessage.style.display = 'block'; // Show "Loading..."
        purchasesTableBody.innerHTML = '';      // Clear any old data in the table body
        hideMessage();                          // Hide any previous messages

        try {
            // This is the correct API call to the unprotected route we set up
            const response = await fetch('/api/bookingsales'); 

            // Check if the request was successful
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch all purchases.');
            }

            const purchases = await response.json(); // Parse the JSON data received (it's an array directly)

            loadingMessage.style.display = 'none'; // Hide "Loading..."

            // If no purchases are found, show a message (check purchases.length directly)
            if (purchases.length === 0) {
                showMessage('No purchase history found.', 'info');
                return;
            }

            // Loop through each purchase and add it as a row to the table
            purchases.forEach(purchase => {
                const row = document.createElement('tr'); // Create a new table row element

                // Populate cells based on the data structure in your MongoDB 'orders' collection
                // and assuming your backend might populate 'userId' and 'carId' with object details.
                row.innerHTML = `
                    <td>${purchase.userId ? (purchase.userId.username || purchase.userId._id) : 'N/A'}</td>
                    <td>${purchase.carId ? (purchase.carId.name || purchase.carId.id) : 'N/A'}</td>
                    <td>${purchase.carId ? purchase.carId.brand : 'N/A'}</td>
                    <td>${purchase.carId ? purchase.carId.model : 'N/A'}</td>
                    <td>${purchase.quantity || 1}</td>
                    <td>$${(purchase.carId && purchase.carId.price) ? purchase.carId.price.toFixed(2) : 'N/A'}</td>
                    <td>$${(purchase.totalPrice || 0).toFixed(2)}</td>
                    <td>${new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                    <td>${purchase.paymentInfo ? (purchase.paymentInfo.status || 'N/A') : 'N/A'}</td>
                `;
                purchasesTableBody.appendChild(row); // Add the populated row to the table body
            });

        } catch (error) {
            loadingMessage.style.display = 'none'; // Hide "Loading..."
            console.error('Error fetching purchase history:', error);
            showMessage(`Error: ${error.message}`, 'error'); // Display error message on the page
        }
    }

    // Call the fetchAllPurchases function when the page is fully loaded
    fetchAllPurchases();
});