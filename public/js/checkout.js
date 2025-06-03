function toggleFields() {
    let method = document.getElementById("payment-method").value;
    let cardFields = document.getElementById("card-fields");

    if (method === "visa" || method === "credit-card") {
        cardFields.classList.add("show");
        cardFields.classList.remove("hidden");
    } else {
        cardFields.classList.add("hidden");
        cardFields.classList.remove("show");
    }
}

function initCheckout() {
    const paymentMethod = document.getElementById("payment-method");
    if (paymentMethod) {
        paymentMethod.addEventListener("change", toggleFields);
    }

}

document.addEventListener("DOMContentLoaded", function() {
    initCheckout();
});