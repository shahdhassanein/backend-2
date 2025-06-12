// backend-2/controllers/cartController.js

// عرض كل العناصر في السلة (مثال)
const getCartItems = (req, res) => {
  res.json({ message: 'Here are the cart items!' });
};

// إضافة عنصر للسلة (مثال)
const addToCart = (req, res) => {
  res.json({ message: 'Item added to cart!' });
};

// حذف عنصر من السلة (مثال)
const removeFromCart = (req, res) => {
  res.json({ message: 'Item removed from cart!' });
};

module.exports = {
  getCartItems,
  addToCart,
  removeFromCart
};
