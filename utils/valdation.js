const validation = {
    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Password validation (min 8 chars, at least one number and one letter)
    isValidPassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    },

    // Name validation (letters, spaces, and hyphens only)
    isValidName(name) {
        const nameRegex = /^[A-Za-z\s-]{2,50}$/;
        return nameRegex.test(name);
    },

    // Price validation (positive number with up to 2 decimal places)
    isValidPrice(price) {
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        return priceRegex.test(price) && parseFloat(price) > 0;
    },

    // Year validation (between 1900 and current year + 1)
    isValidYear(year) {
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear + 1;
    },

    // Mileage validation (positive number)
    isValidMileage(mileage) {
        return !isNaN(mileage) && mileage >= 0;
    },

    // URL validation for images
    isValidImageUrl(url) {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(url);
    },

    // Form validation messages
    getValidationMessage(field, value) {
        switch (field) {
            case 'email':
                return this.isValidEmail(value) ? '' : 'Please enter a valid email address';
            case 'password':
                return this.isValidPassword(value) ? '' : 'Password must be at least 8 characters long and contain both letters and numbers';
            case 'name':
                return this.isValidName(value) ? '' : 'Name should only contain letters, spaces, and hyphens (2-50 characters)';
            case 'price':
                return this.isValidPrice(value) ? '' : 'Please enter a valid price (positive number with up to 2 decimal places)';
            case 'year':
                return this.isValidYear(value) ? '' : 'Please enter a valid year (1900 to next year)';
            case 'mileage':
                return this.isValidMileage(value) ? '' : 'Please enter a valid mileage (positive number)';
            case 'imageUrl':
                return this.isValidImageUrl(value) ? '' : 'Please enter a valid image URL';
            default:
                return '';
        }
    }
};

// Export the validation object
window.validation = validation;