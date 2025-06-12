document.addEventListener('DOMContentLoaded', () => {
  fetch('/addcars') // This should match the Express route
    .then(res => res.json())
    .then(data => {
      const carsGrid = document.getElementById('cars-grid');
      carsGrid.innerHTML = ''; // Clear previous content

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
});
document.getElementById("remove-car-btn").addEventListener("click", () => {
  document.getElementById("removePopup").style.display = "block";
});

document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("removePopup").style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target.id === "removePopup") {
    document.getElementById("removePopup").style.display = "none";
  }
});
document.getElementById("remove-car-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const carId = document.getElementById("carId").value;
  const messageEl = document.getElementById("remove-message");

  try {
    const response = await fetch("/cars/deletecar", {
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
