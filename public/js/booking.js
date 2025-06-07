(() => {
    function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  }
  //for booking
  function initBookingPage() {
    const bookingList = document.getElementById("booking-list");
    if (!bookingList) return;

    // Example: add tooltip showing status on each booking
    Array.from(bookingList.children).forEach(item => {
      const status = item.dataset.status || "Unknown";
      item.title = `Status: ${status}`;
    });

    console.log("Booking page initialized");
  }
  //for purchase 
   function initPurchasePage() {
    const purchaseList = document.getElementById("purchase-list");
    if (!purchaseList) return;

    // Example: format purchase date nicely on each purchase
    Array.from(purchaseList.children).forEach(item => {
      const dateStr = item.dataset.purchasedate;
      const formattedDate = formatDate(dateStr);

      // Append formatted date in a new span for clarity
      const dateSpan = document.createElement("span");
      dateSpan.textContent = ` (Purchased on: ${formattedDate})`;
      dateSpan.style.fontStyle = "italic";
      dateSpan.style.marginLeft = "10px";

      item.appendChild(dateSpan);
    });