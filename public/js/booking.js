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
  function init() {
    if (document.getElementById("booking-page")) {
      initBookingPage();
    } else if (document.getElementById("purchase-page")) {
      initPurchasePage();
    }
  }
    document.addEventListener("DOMContentLoaded", init);
})();