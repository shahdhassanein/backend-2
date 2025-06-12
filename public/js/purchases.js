// public/js/purchases.js

document.addEventListener('DOMContentLoaded', async () => {
    const purchasesTableBody = document.getElementById('purchasesTableBody');
    const loadingMessage = document.getElementById('loading');
    const messageDiv = document.getElementById('message');

    // Function to show messages on the page
    function showMessage(msg, type = 'success') {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`; // Apply CSS class for styling (e.g., 'success', 'info', 'error')
        messageDiv.style.display = 'block';
    }

    // Function to hide messages
    function hideMessage() {
        messageDiv.style.display = 'none';
    }

    // Function to fetch and display ALL purchases (typically for an Admin dashboard)
    async function fetchAllPurchases() {
        loadingMessage.style.display = 'block'; // Show "Loading..." indicator
        purchasesTableBody.innerHTML = '';        // Clear any existing rows in the table
        hideMessage();                            // Hide any previous messages

        try {
            // Fetch all purchases from the backend API.
            // This endpoint in bookingsalesroute.js calls getAllPurchases in bookingsalescontroller.js,
            // which populates userId and carId fields.
            const response = await fetch('/api/bookingsales'); 

            // Check if the HTTP response was successful (status code 200-299)
            if (!response.ok) {
                const errorData = await response.json(); // Attempt to parse error message from response
                throw new Error(errorData.message || 'Failed to fetch all purchases.');
            }

            const purchases = await response.json(); // Parse the JSON data received (should be an array of purchase objects)

            loadingMessage.style.display = 'none'; // Hide "Loading..."

            // If no purchases are returned, display an informative message
            if (!purchases || purchases.length === 0) {
                showMessage('No purchase history found for any user.', 'info');
                return; // Stop execution if no data
            }

            // Iterate over each purchase object and render it as a table row
            purchases.forEach(purchase => {
                const row = document.createElement('tr'); // Create a new table row element

                // Populate the row with purchase details.
                // We access populated 'userId.name' and 'carId.name', 'carId.model', etc.
                // The 'purchase' object itself contains 'quantity', 'unitPrice', 'totalPrice', 'purchaseDate', 'status'.
                row.innerHTML = `
                    <td>${purchase.userId ? (purchase.userId.name || 'N/A') : 'N/A'}</td>
                    <td>${purchase.carId ? purchase.carId.name : 'N/A'}</td>
                    <td>${purchase.carId ? purchase.carId.model : 'N/A'}</td>
                    <td>${purchase.quantity || 1}</td>
                    <td>$${(purchase.unitPrice || 0).toFixed(2)}</td>
                    <td>$${(purchase.totalPrice || 0).toFixed(2)}</td>
                    <td>${new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                    <td>${purchase.status || 'N/A'}</td> <!-- Displays the overall purchase status -->
                `;
                purchasesTableBody.appendChild(row); // Add the newly created row to the table body
            });

        } catch (error) {
            loadingMessage.style.display = 'none'; // Ensure loading message is hidden on error
            console.error('Error fetching purchase history:', error);
            // Display a user-friendly error message on the page
            showMessage(`Error fetching purchases: ${error.message}`, 'error'); 
        }
    }

    // Call the function to fetch and display purchases when the page finishes loading
    fetchAllPurchases();
});