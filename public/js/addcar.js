document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const model = document.getElementById("model").value;
    const price = document.getElementById("price").value;
    const engine = document.getElementById("engine").value;
    const color = document.getElementById("color").value;
    const image = document.getElementById("image").value;

    const carData = { name, model, price, engine, color, image };

    try {
      const response = await fetch("/cars/addcar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(carData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save car: ${errorText}`);
      }

      alert("✅ Car saved successfully!");
      window.location.href = "/admin"; // ✅ redirect to admin after adding
    } catch (err) {
      console.error("❌ Error:", err.message);
      alert("❌ Could not save the car. Check console for details.");
    }
  });
});
