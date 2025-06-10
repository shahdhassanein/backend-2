document.addEventListener('DOMContentLoaded', () => {
    const carForm = document.querySelector('form[action="/addcar"]');
    const priceInput = document.getElementById('price');
    const imageInput = document.getElementById('image');

    if (carForm) {
        carForm.addEventListener('submit', (event) => {
            let isValid = true;
            let errorMessage = '';

            // --- Price Validation ---
            const price = parseFloat(priceInput.value);
            if (isNaN(price) || price <= 0) {
                isValid = false;
                errorMessage += 'Price must be a positive number.\n';
                priceInput.classList.add('is-invalid'); // Add Bootstrap's invalid class
            } else {
                priceInput.classList.remove('is-invalid'); // Remove if valid
            }

            // --- Image URL Validation ---
            try {
                // Attempt to create a URL object to validate the format
                new URL(imageInput.value);
                imageInput.classList.remove('is-invalid');
            } catch (e) {
                isValid = false;
                errorMessage += 'Please enter a valid Image URL.\n';
                imageInput.classList.add('is-invalid');
            }

            // --- Prevent Submission if Not Valid ---
            if (!isValid) {
                event.preventDefault(); // Stop the form from submitting
                alert(errorMessage.trim()); // Show an alert with the combined error message
                // Alternatively, you could display error messages next to the fields
            }
        });
    }
});