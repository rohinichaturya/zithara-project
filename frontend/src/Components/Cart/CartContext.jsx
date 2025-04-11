import { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCartItemQuantity, removeFromCart } from "../../redux/slices/cartSlice";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartState = useSelector((state) => state.cart.cart || { products: [] });
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();

  // Get products for current user
  const products = cartState.userId === userId ? cartState.products : [];

  const updateCart = (productId, quantity) => {
    if (!userId) return;
    dispatch(updateCartItemQuantity({ productId, quantity, userId }));
  };

  const removeItem = (productId) => {
    if (!userId) return;
    dispatch(removeFromCart({ productId, userId }));
  };

  return (
    <CartContext.Provider value={{ cart: products, updateCart, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);