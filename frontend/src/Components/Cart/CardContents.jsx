import { useSelector, useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import {
  updateCartItemQuantity,
  removeFromCart,
  updateQuantityLocally,
} from "../../redux/slices/cartSlice";

const CardContents = () => {
  const cart = useSelector((state) => state.cart.cart?.products || []);
  const loading = useSelector((state) => state.cart.loading);
  const userId = useSelector((state) => state.auth.user?._id);
  const dispatch = useDispatch();

  const increaseQuantity = (productId) => {
    const product = cart.find((item) => item.productId === productId);
    if (product && userId) {
      const newQuantity = product.quantity + 1;
      dispatch(updateQuantityLocally({ productId, quantity: newQuantity }));
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity, userId }));
    }
  };

  const decreaseQuantity = (productId) => {
    const product = cart.find((item) => item.productId === productId);
    if (product && product.quantity > 1 && userId) {
      const newQuantity = product.quantity - 1;
      dispatch(updateQuantityLocally({ productId, quantity: newQuantity }));
      dispatch(updateCartItemQuantity({ productId, quantity: newQuantity, userId }));
    }
  };

  const removeItem = (productId) => {
    if (userId) {
      dispatch(removeFromCart({ productId, userId }));
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading cart...</p>;
  }

  return (
    <div className="space-y-5">
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        cart.map((product) => {
          const discountPrice = product?.metadata?.discount_price;
          const originalPrice = product?.metadata?.original_price ?? product?.price ?? 0;
          const displayPrice = discountPrice ?? originalPrice;

          return (
            <div key={product.productId} className="flex items-center border p-3 rounded-lg shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 rounded-md object-cover"
              />

              <div className="ml-4 flex-1">
                <h3 className="text-md font-semibold">{product.name}</h3>
                
                {/* Pricing Display */}
                <div className="text-gray-600">
                  ₹{Math.round(displayPrice * product.quantity)}{" "}
                  {discountPrice && (
                    <span className="line-through text-sm text-red-500 ml-2">
                      ₹{Math.round(originalPrice * product.quantity)}
                    </span>
                  )}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center mt-2">
                  <button
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => decreaseQuantity(product.productId)}
                    disabled={product.quantity === 1 || loading || !userId}
                  >
                    -
                  </button>
                  <span className="mx-3 text-lg">{product.quantity}</span>
                  <button
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    onClick={() => increaseQuantity(product.productId)}
                    disabled={loading || !userId}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className="text-red-500 hover:text-red-700 ml-4 disabled:opacity-50"
                onClick={() => removeItem(product.productId)}
                disabled={loading || !userId}
              >
                <FaTrash size={18} />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
};

export default CardContents;
