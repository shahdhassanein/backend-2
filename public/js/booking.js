(() => {
  function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(); 
    } catch {
      return "Invalid date";
    }
  }

  // For booking page
  function initBookingPage() {
    const bookingList = document.getElementById("booking-list");
    if (!bookingList) return;

    Array.from(bookingList.children).forEach(item => {
      const status = item.dataset.status || "Unknown";
      item.title = `Status: ${status}`;
    });

    console.log("Booking page initialized");
  }

  // For purchase page
  function initPurchasePage() {
    const purchaseList = document.getElementById("purchase-list");
    if (!purchaseList) return;

    Array.from(purchaseList.children).forEach(item => {
      const dateStr = item.dataset.purchasedate;
      const formattedDate = formatDate(dateStr);

      const dateSpan = document.createElement("span");
      dateSpan.textContent = ` (Purchased on: ${formattedDate})`;
      dateSpan.style.fontStyle = "italic";
      dateSpan.style.marginLeft = "10px";

      item.appendChild(dateSpan);
    });

    console.log("Purchase page initialized");
  }

  // Page router based on existing element
  function init() {
    if (document.getElementById("booking-list")) {
      initBookingPage();
    } else if (document.getElementById("purchase-list")) {
      initPurchasePage();
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
