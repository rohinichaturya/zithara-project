import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import ProductList from "../Components/Products/ProductsList";
import RIMG from "../Assests/RIMG.webp";
import Topbar from "../Components/Layout/Topbar";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Common/Footer";
import PList from "../Components/Layout/PList";

const CollectionPage = () => {
  const { category } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = `category=${category || ""}`;
        if (gender) query += `&gender=${gender}`;
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products?${query}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, gender]);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navbar />
      <PList />

      {/* Header Image - Full Width */}
      <div className="w-full">
        <div className="w-full h-52 md:h-64 lg:h-80 flex items-center justify-center">
          <img 
            src={RIMG} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="flex-1 w-full px-4">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-16 z-10 bg-white py-4">
          <h1 className="text-xl font-bold capitalize text-center">
            {category || gender} Collection
          </h1>
        </div>


        {/* Product List - Full Width */}
        <div className="w-full">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              <ProductList products={products} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CollectionPage;