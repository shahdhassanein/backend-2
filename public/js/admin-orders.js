// Load orders when page opens
async function loadOrders() {
  const response = await fetch('/admin/orders');
  const orders = await response.json();
  
  const tbody = document.getElementById('orders-body');
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>#${order._id.toString().slice(-6)}</td>
      <td>${order.user.name}</td>
      <td>${order.items[0].car.brand} ${order.items[0].car.model}</td>
      <td>${new Date(order.createdAt).toLocaleDateString()}</td>
      <td>$${order.totalAmount.toFixed(2)}</td>
      <td>${order.status}</td>
    </tr>
  `).join('');
}

//testtttt
document.querySelector('[data-tab="orders"]').addEventListener('click', loadOrders);