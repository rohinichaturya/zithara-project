import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCartItemQuantity } from "../../redux/slices/cartSlice";
import { FaStar } from "react-icons/fa"; // Importing React Icons for stars
import Topbar from "../Layout/Topbar";
import Navbar from "../Layout/Navbar";
import Footer from "../Common/Footer";

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cart = useSelector((state) => state.cart.cart.products);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/products/${productId}`);
        const productData = response.data;
        setProduct(productData);

        if (productData?.category) {
          const similarResponse = await axios.get(
            `http://localhost:9000/api/products?category=${productData.category}`
          );

          const filteredProducts = similarResponse.data
            .filter((item) => item.sku !== productData.sku)
            .slice(0, 4);

          setSimilarProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    if (!user) {
      toast.error("You need to log in first to add items to the cart.");
      navigate("/login");
      return;
    }

    const existingProduct = cart.find((item) => item.productId === product._id);

    if (existingProduct) {
      dispatch(updateCartItemQuantity({
        productId: product?._id,
        quantity: existingProduct.quantity + 1,
        userId: user?._id,
      }));
    } else {
      dispatch(addToCart({
        productId: product?._id,
        quantity: 1,
        userId: user?._id,
      }));
    }

    toast.success("Product added to cart successfully!");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg font-semibold">
        {error}
      </div>
    );

  return (
    <div>
      <Topbar />
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 mt-28">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={product?.images?.[0]?.url || "/images/default.jpg"}
              alt={product?.images?.[0]?.altText || "Product Image"}
              className="w-full h-96 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
              onError={(e) => (e.target.src = "/images/default.jpg")}
            />
          </div>
          <div className="p-6 w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{product?.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{product?.description}</p>
            <p className="text-xl font-semibold text-green-600 mb-2">Price: ₹ {Math.round(product?.metadata?.discount_price)}</p>
            <p className="text-sm line-through text-gray-500">Original Price: ₹{product?.metadata?.original_price}</p>
            <p className="text-gray-700"><span className="font-semibold">Material:</span> {product?.material}</p>
            <p className="text-gray-700"><span className="font-semibold">Category:</span> {product?.category}</p>
            <p className="text-gray-700"><span className="font-semibold">SKU:</span> {product?.sku}</p>
            <p className="text-gray-700"><span className="font-semibold">Available Stock:</span> {product?.countInStock}</p>

            <button
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="max-w-5xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((item) => (
                <Link key={item.sku} to={`/product/${item._id}`}>
                  <div className="bg-white p-4 shadow-lg rounded-lg cursor-pointer hover:shadow-xl transition">
                    <img
                      src={item?.images?.[0]?.url || "/images/default.jpg"}
                      alt={item?.images?.[0]?.altText || "Similar Product Image"}
                      className="w-full h-40 object-cover rounded-lg"
                      onError={(e) => (e.target.src = "/images/default.jpg")}
                    />
                    <h3 className="text-lg font-semibold text-gray-700 mt-2">{item.name}</h3>
                    <p className="text-green-600 font-semibold">₹ {Math.round(item.metadata?.discount_price)}</p>
                    <h3 className="text-lg font-semibold text-gray-700 mt-2">{item.occasion}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="max-w-5xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {[{
              name: "John Doe",
              rating: 5,
              comment: "Excellent product, really loved it!"
            },
            {
              name: "Jane Smith",
              rating: 4,
              comment: "Good quality, but delivery took longer than expected."
            }].map((review, index) => (
              <div key={index} className="mb-4 border-b pb-4">
                <p className="font-semibold text-gray-700">{review.name}</p>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
