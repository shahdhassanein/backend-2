const validation = {
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    isValidPassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    },

    isValidName(name) {
        const nameRegex = /^[A-Za-z\s-]{2,50}$/;
        return nameRegex.test(name);
    },

    isValidPrice(price) {
        const priceRegex = /^\d+(\.\d{1,2})?$/;
        return priceRegex.test(price) && parseFloat(price) > 0;
    },

    isValidYear(year) {
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear + 1;
    },

    isValidMileage(mileage) {
        return !isNaN(mileage) && mileage >= 0;
    },

    isValidImageUrl(url) {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return urlRegex.test(url);
    },

    isLength(text, min, max) { 
        const trimmedText = String(text).trim();
        return trimmedText.length >= min && (max ? trimmedText.length <= max : true);
    },
    isEmpty(text) { 
        return String(text).trim() === '';
    },
    isValidPhoneNumber(phone) { 
        return /^\+?\d{1,4}?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}$/.test(String(phone).trim());
    },

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


module.exports = validation;

if (typeof window !== 'undefined') {
    window.validation = validation;
}