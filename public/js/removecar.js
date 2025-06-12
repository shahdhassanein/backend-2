// public/js/removecar.js

document.addEventListener('DOMContentLoaded', () => {
    const removeCarForm = document.getElementById('removeCarForm');
    const carIdInput = document.getElementById('carId');
    const messageDiv = document.getElementById('message');

    // Function to show messages (for success/error on the form)
    function showMessage(msg, type = 'success') {
        messageDiv.textContent = msg;
        messageDiv.className = `p-3 mb-4 rounded-md text-sm ${type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`;
        messageDiv.style.display = 'block';
    }

    // Function to hide messages
    function hideMessage() {
        messageDiv.style.display = 'none';
    }

    // Add event listener for form submission
    removeCarForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission (stops page reload)

        hideMessage(); // Clear any previous messages

        const carId = carIdInput.value.trim(); // Get the car ID from the input field

        if (!carId) {
            showMessage('Please enter a Car ID.', 'error');
            return;
        }

        try {
            // Send a DELETE request to your API endpoint
            const response = await fetch(`/api/cars/${carId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // If your API requires an authentication token (e.g., for admin access),
                    // your 'protect' middleware should handle it.
                    // 'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE`
                }
            });

            const data = await response.json(); // Parse the JSON response from the server

            if (response.ok) { // If the response status is 2xx (e.g., 200 OK)
                showMessage(data.message || 'Car deleted successfully!', 'success');
                carIdInput.value = ''; // Clear the input field after successful deletion
            } else { // If the response status is 4xx or 5xx
                showMessage(data.message || 'Failed to delete car. Please check the ID.', 'error');
            }
        } catch (error) {
            console.error('Error during car deletion:', error);
            showMessage('An unexpected error occurred during deletion.', 'error');
        }
    });
});