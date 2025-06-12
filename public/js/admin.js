document.addEventListener('DOMContentLoaded', () => {
  // Fetch and display cars
  fetch('/addcars')
    .then(res => res.json())
    .then(data => {
      const carsGrid = document.getElementById('cars-grid');
      carsGrid.innerHTML = '';

      data.forEach(car => {
        const carCard = document.createElement('div');
        carCard.className = 'car-card';
        carCard.innerHTML = `
          <h3>${car.name}</h3>
          <p>Model: ${car.model}</p>
          <p>Price: ${car.price}</p>
        `;
        carsGrid.appendChild(carCard);
      });
    })
    .catch(err => console.error('Error fetching cars:', err));

  // Remove Car Popup Logic
  const removeBtn = document.getElementById("remove-car-btn");
  const removePopup = document.getElementById("removePopup");
  const closeRemove = document.querySelector(".close");

  removeBtn.addEventListener("click", () => {
    removePopup.style.display = "block";
  });

  closeRemove.addEventListener("click", () => {
    removePopup.style.display = "none";
  });

  // Update Car Popup Logic
  const updateBtn = document.getElementById("update-car-btn");
  const updatePopup = document.getElementById("updatePopup");
  const closeUpdate = document.querySelector(".close-update");

  updateBtn.addEventListener("click", () => {
    updatePopup.style.display = "block";
  });

  closeUpdate.addEventListener("click", () => {
    updatePopup.style.display = "none";
  });

  // Global click to close modals
  window.addEventListener("click", (e) => {
    if (e.target === removePopup) {
      removePopup.style.display = "none";
    }
    if (e.target === updatePopup) {
      updatePopup.style.display = "none";
    }
  });

  // Remove Car Form Submit
  document.getElementById("remove-car-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const carId = document.getElementById("carId").value;
    const messageEl = document.getElementById("remove-message");

    try {
      const response = await fetch("/addcars/deletecar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: carId })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      messageEl.textContent = "✅ Car removed successfully!";
      messageEl.style.color = "green";
    } catch (err) {
      messageEl.textContent = "❌ Error: " + err.message;
      messageEl.style.color = "red";
    }
  });

  // Update Car Form Submit
  document.getElementById("update-car-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedCar = {
      id: document.getElementById("updateCarId").value,
      name: document.getElementById("updateName").value,
      model: document.getElementById("updateModel").value,
      price: document.getElementById("updatePrice").value,
      engine: document.getElementById("updateEngine").value,
      color: document.getElementById("updateColor").value,
      image: document.getElementById("updateImage").value,
    };

    const messageEl = document.getElementById("update-message");

    try {
      const res = await fetch("/addcars/updatecar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCar),
      });

      if (!res.ok) throw new Error(await res.text());

      messageEl.textContent = "✅ Car updated successfully!";
      messageEl.style.color = "green";
    } catch (err) {
      messageEl.textContent = "❌ Error: " + err.message;
      messageEl.style.color = "red";
    }
  });
});
