(() => {
    function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  }
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