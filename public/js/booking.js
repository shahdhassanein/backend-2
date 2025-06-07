(() => {
    function formatDate(dateStr) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  }