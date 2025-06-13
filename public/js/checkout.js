document.addEventListener('DOMContentLoaded', function() {
    console.log("Checkout.js: Script loaded.");

    const paymentMethodSelect = document.getElementById('paymentMethod');
    const creditCardDetailsDiv = document.getElementById('credit-card-details');
    const checkoutForm = document.getElementById('checkout-form');

    // Function to toggle visibility and required attributes of credit card fields
    function toggleCreditCardFields() {
        const isCreditCard = paymentMethodSelect.value === 'credit-card';
        creditCardDetailsDiv.style.display = isCreditCard ? 'block' : 'none';

        // Get all input fields within the credit card details div
        const creditCardInputs = creditCardDetailsDiv.querySelectorAll('input');

        creditCardInputs.forEach(input => {
            if (isCreditCard) {
                input.setAttribute('required', 'true');
            } else {
                input.removeAttribute('required');
                // Optional: Clear values when hidden, so they aren't sent if user switches
                input.value = '';
            }
        });
    }

    // Add event listener to the payment method dropdown
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', toggleCreditCardFields);
        // Call it once on load to set initial state based on default selection
        toggleCreditCardFields();
    } else {
        console.warn("Checkout.js: 'paymentMethod' select element not found.");
    }

    // --- Form Submission Logic (to send data to backend) ---
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(checkoutForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            console.log("Checkout.js: Form data collected:", data);

            // Construct paymentInfo object based on selected method
            let paymentInfo = {};
            if (data.paymentMethod === 'credit-card') {
                paymentInfo = {
                    cardholderName: data.cardHolder,
                    cardNumber: data.cardNumber, // You might hash/tokenize this before sending to a real API
                    expiryDate: data.expiryDate,
                    cvv: data.cvv // Never store raw CVV on your server
                };
            }
            // You should also include shipping info directly in the data object for the backend
            const checkoutData = {
                fullName: data.fullName,
                address: data.address,
                phone: data.phone,
                paymentMethod: data.paymentMethod,
                paymentDetails: paymentInfo // Send collected payment info
            };


            try {
                const token = localStorage.getItem('token');
                const headers = { 'Content-Type': 'application/json' };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch('/api/cart/checkout', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(checkoutData)
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Checkout failed.');
                }

                const result = await response.json();
                showNotification(result.message || 'Order placed successfully!', 'success');
                console.log('Checkout successful:', result);

                // Redirect to mypurchases page after successful checkout
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                } else {
                    window.location.href = '/mypurchases'; // Fallback
                }

            } catch (error) {
                console.error('Checkout.js: Error during checkout submission:', error);
                showNotification(`Checkout failed: ${error.message}`, 'error');
            }
        });
    } else {
        console.warn("Checkout.js: Checkout form element not found.");
    }

    // Helper function to show temporary notifications (copy from cart.js or common.js)
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`; // Add type for styling different messages (e.g., 'error', 'success')
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove(), {
                once: true
            });
        }, 3000);
    }
});