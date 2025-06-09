document.getElementById("add-car-btn").addEventListener("click", () => {
  const formHTML = `
    <form id="add-car-form">
      <input type="text" name="brand" placeholder="Brand" required />
      <input type="text" name="model" placeholder="Model" required />
      <input type="number" name="year" placeholder="Year" required />
      <input type="text" name="color" placeholder="Color" required />
      <input type="number" name="price" placeholder="Price" required />
      <input type="text" name="imageUrl" placeholder="Image URL" />
      <button type="submit">Submit</button>
    </form>
  `;
  document.querySelector(".main-content").insertAdjacentHTML("beforeend", formHTML);

  document.getElementById("add-car-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/admin/add-car", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Request failed");

      alert("Car added successfully!");
    } catch (err) {
      alert("An error occurred while adding the car.");
      console.error(err);
    }
  });
});
