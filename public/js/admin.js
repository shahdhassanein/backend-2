// Show the Add Car form
const addCarBtn = document.getElementById("add-car-btn");
const cancelFormBtn = document.getElementById("cancel-form-btn");
const carFormContainer = document.getElementById("car-form-container");

if (addCarBtn && cancelFormBtn && carFormContainer) {
    addCarBtn.addEventListener("click", function () {
        carFormContainer.style.display = "block";
    });

    cancelFormBtn.addEventListener("click", function () {
        carFormContainer.style.display = "none";
    });
}
