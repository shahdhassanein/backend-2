// ==== Fetch Cars Function ====
async function fetchCars() {
  try {
    const response = await fetch('/addcars/all'); // Ensure this matches your route
    const cars = await response.json();

    const carsGrid = document.getElementById('cars-grid');
    carsGrid.innerHTML = ''; // Clear grid before adding

    cars.forEach(car => {
      const carCard = document.createElement('div');
      carCard.classList.add('car-card');
      carCard.innerHTML = `
        <img src="${car.image || 'default.jpg'}" alt="${car.name}">
        <h3>${car.name}</h3>
        <p>Model: ${car.model}</p>
        <p>Price: $${car.price}</p>
        <p>Engine: ${car.engine}</p>
        <p>Color: ${car.color}</p>
      `;
      carsGrid.appendChild(carCard);
    });
  } catch (err) {
    console.error('Failed to load cars:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Load cars on page load
  fetchCars();

  // ==== ADD CAR ====
  const addPopup = document.getElementById('addPopup');
  const addBtn = document.getElementById('add-car-btn');
  const closeAdd = document.querySelector('.close-add');
  const addForm = document.getElementById('add-car-form');
  const addMessage = document.getElementById('add-message');

  addBtn.onclick = () => {
    addPopup.style.display = 'block';
  };

  closeAdd.onclick = () => {
    addPopup.style.display = 'none';
    addForm.reset();
    addMessage.textContent = '';
  };

  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newCar = {
      name: document.getElementById('addName').value,
      model: document.getElementById('addModel').value,
      price: document.getElementById('addPrice').value,
      engine: document.getElementById('addEngine').value,
      color: document.getElementById('addColor').value,
      image: document.getElementById('addImage').value
    };

    try {
      const res = await fetch('/addcars/addcars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar)
      });

      const data = await res.json();

      if (res.ok) {
        addMessage.textContent = 'Car added successfully!';
        addMessage.style.color = 'green';
        addForm.reset();
        fetchCars(); // Refresh car list
      } else {
        addMessage.textContent = data.error || 'Failed to add car.';
        addMessage.style.color = 'red';
      }
    } catch (err) {
      addMessage.textContent = 'Server error.';
      addMessage.style.color = 'red';
    }
  });

  // ==== REMOVE CAR ====
  const removeBtn = document.getElementById("remove-car-btn");
  const removePopup = document.getElementById("removePopup");
  const closeRemove = document.querySelector(".close");

  removeBtn.addEventListener("click", () => {
    removePopup.style.display = "block";
  });

  closeRemove.addEventListener("click", () => {
    removePopup.style.display = "none";
  });

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
      fetchCars();
    } catch (err) {
      messageEl.textContent = "❌ Error: " + err.message;
      messageEl.style.color = "red";
    }
  });

  // ==== UPDATE CAR ====
  const updateBtn = document.getElementById("update-car-btn");
  const updatePopup = document.getElementById("updatePopup");
  const closeUpdate = document.querySelector(".close-update");

  updateBtn.addEventListener("click", () => {
    updatePopup.style.display = "block";
  });

  closeUpdate.addEventListener("click", () => {
    updatePopup.style.display = "none";
  });

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
      fetchCars();
    } catch (err) {
      messageEl.textContent = "❌ Error: " + err.message;
      messageEl.style.color = "red";
    }
  });

  // ==== Global Modal Close on Outside Click ====
  window.addEventListener("click", (e) => {
    if (e.target === removePopup) {
      removePopup.style.display = "none";
    }
    if (e.target === updatePopup) {
      updatePopup.style.display = "none";
    }
    if (e.target === addPopup) {
      addPopup.style.display = "none";
      addForm.reset();
      addMessage.textContent = '';
    }
  });
});
