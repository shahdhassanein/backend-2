// tttttttttttestttttttt will be deleted 
//  public/js/myPurchases.js

/*document.addEventListener('DOMContentLoaded', async () => {
    const purchasesTableBody = document.getElementById('purchasesTableBody');
    // Ensure these message elements exist in your mypurchases.ejs, or remove/adapt them
    const loadingMessage = document.getElementById('loadingMessage'); // You might need to add this ID to an element in mypurchases.ejs
    const errorMessageDiv = document.getElementById('errorMessage'); // You might need to add this ID to an element in mypurchases.ejs

    // Helper function to display messages
    function displayMessage(message, type = 'info') {
        if (errorMessageDiv) {
            errorMessageDiv.textContent = message;
            errorMessageDiv.className = `alert alert-${type}`; // Assuming some CSS classes for alerts
            errorMessageDiv.style.display = 'block';
        } else {
            console.log(`Message (${type}): ${message}`);
        }
    }

    // Function to fetch and display the logged-in user's purchases
    async function fetchMyPurchases() {
        if (loadingMessage) loadingMessage.style.display = 'block'; // Show loading indicator
        if (purchasesTableBody) purchasesTableBody.innerHTML = '';    // Clear existing table content
        if (errorMessageDiv) errorMessageDiv.style.display = 'none'; // Hide any previous error messages

        try {
            // Make the fetch request to your backend API for logged-in user's purchases
            // This endpoint is protected by 'protect' middleware on the backend.
            const response = await fetch('/api/bookingsales/my-purchases');

            if (loadingMessage) loadingMessage.style.display = 'none'; // Hide loading indicator as response is received

            if (!response.ok) {
                if (response.status === 401) {
                    // User is not authenticated, redirect to login (backend middleware should also handle this)
                    displayMessage('You are not logged in. Please log in to view your purchases.', 'warning');
                    // Optionally, you can force a client-side redirect after a delay:
                    setTimeout(() => { window.location.href = '/login'; }, 2000); 
                } else if (response.status === 404) {
                    displayMessage('No purchase history found for your account.', 'info');
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to fetch purchase history.');
                }
                return; // Stop execution if response is not OK
            }

            const purchases = await response.json(); // Parse the JSON response

            if (!purchases || purchases.length === 0) {
                displayMessage('You have no purchase history yet.', 'info');
                return;
            }

            // Populate the table with purchase data
            purchases.forEach(purchase => {
                if (purchasesTableBody) {
                    const row = document.createElement('tr');
                    // Ensure these fields match your Purchase schema and how they are populated from backend
                    // e.g., purchase.carId.name, purchase.carId.model
                    row.innerHTML = `
                        <td>${purchase.carId ? purchase.carId.name : 'N/A'}</td>
                        <td>${purchase.carId ? purchase.carId.model : 'N/A'}</td>
                        <td>${purchase.quantity || 1}</td>
                        <td>$${(purchase.unitPrice || purchase.carId.price || 0).toFixed(2)}</td>
                        <td>$${(purchase.totalPrice || (purchase.quantity * (purchase.carId.price || 0))).toFixed(2)}</td>
                        <td>${new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                        <td>${purchase.status || 'N/A'}</td>
                    `;
                    purchasesTableBody.appendChild(row);
                }
            });

        } catch (error) {
            if (loadingMessage) loadingMessage.style.display = 'none';
            console.error('Error fetching purchase history:', error);
            displayMessage(`An error occurred: ${error.message}`, 'error');
        }
    }

    // Call the function when the page loads
    fetchMyPurchases();
});*/