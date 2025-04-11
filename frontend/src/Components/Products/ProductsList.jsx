import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFilter, FaTimes, FaChevronLeft, FaChevronRight, FaStar, FaSort } from "react-icons/fa";

const ProductList = () => {
  const { category, gender } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState("default");
  const [filters, setFilters] = useState({
    weight: [],
    price: [],
    metal: [],
    occasion: [],
    shopFor: [],
    rating: []
  });

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 768 ? 6 : 12);
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = [];

        if (category) query.push(`category=${category}`);
        if (gender) query.push(`gender=${gender}`);
        if (searchQuery) query.push(`search=${searchQuery}`);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products${query.length ? `?${query.join("&")}` : ""}`
        );

        setProducts(response.data);
        setFilteredProducts(response.data);
        setSortedProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, gender, searchQuery]);

  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Weight filter
    if (filters.weight.length > 0) {
      result = result.filter(product => {
        const weight = product.weight;
        return filters.weight.some(range => {
          const [min, max] = range.split(" - ").map(parseFloat);
          return weight >= min && weight <= max;
        });
      });
    }

    // Price filter - CORRECTED VERSION
    if (filters.price.length > 0) {
      result = result.filter(product => {
        const price = product.metadata?.discount_price || product.metadata?.original_price || 0;
        return filters.price.some(range => {
          // Remove currency symbol and commas, then split by hyphen
          const [minStr, maxStr] = range.replace(/[^0-9 -]/g, '').split(' - ');
          const min = parseInt(minStr.replace(/,/g, ''), 10);
          const max = parseInt(maxStr.replace(/,/g, ''), 10);
          
          return price >= min && price <= max;
        });
      });
    }

    // Metal filter
    if (filters.metal.length > 0) {
      result = result.filter(product => 
        filters.metal.includes(product.material)
      );
    }

    // Occasion filter
    if (filters.occasion.length > 0) {
      result = result.filter(product => 
        filters.occasion.includes(product.occasion)
      );
    }

    // Shop For filter
    if (filters.shopFor.length > 0) {
      result = result.filter(product => 
        filters.shopFor.includes(product.gender)
      );
    }

    // Rating filter
    if (filters.rating.length > 0) {
      result = result.filter(product => {
        const rating = product.rating || 0;
        return filters.rating.some(starRange => {
          if (starRange.includes("5 Stars")) return rating >= 5;
          if (starRange.includes("4 Stars")) return rating >= 4;
          if (starRange.includes("3 Stars")) return rating >= 3;
          return false;
        });
      });
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [filters, products]);

  useEffect(() => {
    let result = [...filteredProducts];
    
    switch(sortOption) {
      case "price-low-high":
        result.sort((a, b) => (a.metadata?.discount_price || a.metadata?.original_price || 0) - (b.metadata?.discount_price || b.metadata?.original_price || 0));
        break;
      case "price-high-low":
        result.sort((a, b) => (b.metadata?.discount_price || b.metadata?.original_price || 0) - (a.metadata?.discount_price || a.metadata?.original_price || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // Default sorting (no change)
        break;
    }
    
    setSortedProducts(result);
    setCurrentPage(1);
  }, [filteredProducts, sortOption]);

  const displayedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearAllFilters = () => {
    setFilters({
      weight: [],
      price: [],
      metal: [],
      occasion: [],
      shopFor: [],
      rating: []
    });
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    setShowSortDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute right-0 top-0 h-full w-4/5 bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                <button onClick={toggleFilters} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={20} />
                </button>
              </div>
              <button 
                onClick={clearAllFilters}
                className="text-blue-600 text-sm font-medium mb-4"
              >
                Clear All
              </button>
              <FilteredSidebar filters={filters} setFilters={setFilters} />
              <button
                onClick={toggleFilters}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium mt-4"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
                <button 
                  onClick={clearAllFilters}
                  className="text-blue-600 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>
              <FilteredSidebar filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                {searchQuery
                  ? `Search: "${searchQuery}"`
                  : category
                   ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`
                  : gender
                  ? `${gender}'s Jewelry`
                  : "All Products"}
              </h2>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 bg-white border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50"
                  >
                    <FaSort /> 
                    Sort by: {sortOption === "default" ? "Default" : 
                            sortOption === "price-low-high" ? "Price: Low to High" :
                            sortOption === "price-high-low" ? "Price: High to Low" : 
                            "Rating"}
                    <svg 
                      className={`w-4 h-4 ml-1 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={() => handleSortSelect("default")}
                          className={`block w-full text-left px-4 py-2 text-sm ${sortOption === "default" ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          Default
                        </button>
                        <button
                          onClick={() => handleSortSelect("price-low-high")}
                          className={`block w-full text-left px-4 py-2 text-sm ${sortOption === "price-low-high" ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          Price: Low to High
                        </button>
                        <button
                          onClick={() => handleSortSelect("price-high-low")}
                          className={`block w-full text-left px-4 py-2 text-sm ${sortOption === "price-high-low" ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          Price: High to Low
                        </button>
                        <button
                          onClick={() => handleSortSelect("rating")}
                          className={`block w-full text-left px-4 py-2 text-sm ${sortOption === "rating" ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          Rating
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <span className="text-gray-600">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
                </span>
                <button 
                  onClick={toggleFilters}
                  className="md:hidden flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg"
                >
                  <FaFilter /> Filters
                </button>
              </div>
            </div>

            {/* Loading/Error States */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedProducts.length === 0 ? (
                    <div className="col-span-full py-12 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                      <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                      <button 
                        onClick={clearAllFilters}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    displayedProducts.map((product) => (
                      <div
                        key={product._id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                        onClick={() => handleProductClick(product._id)}
                      >
                        <div className="relative pb-[100%] overflow-hidden">
                          <img
                            src={product.images?.length > 0 ? product.images[0].url : "/placeholder-product.jpg"}
                            alt={product.name}
                            className="absolute h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {product.metadata?.discount_price < product.metadata?.original_price && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              {Math.round(100 - (product.metadata.discount_price / product.metadata.original_price * 100))}% OFF
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                          <div className="flex items-center mb-2">
                            {product.rating ? (
                              <>
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < Math.floor(product.rating) ? "fill-current" : "fill-current opacity-30"} />
                                  ))}
                                </div>
                                <span className="text-gray-500 text-sm ml-1">({product.ratingCount || 0})</span>
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm">No ratings</span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{Math.round(product.metadata?.discount_price || product.metadata?.original_price || 0).toLocaleString()}
                            </span>
                            {product.metadata?.discount_price < product.metadata?.original_price && (
                              <span className="text-sm line-through text-gray-500 ml-2">
                                ₹{Math.round(product.metadata.original_price).toLocaleString()}
                              </span>
                            )}
                          </div>
                          {product.tags?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {product.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-12">
                    <nav className="flex items-center gap-1" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaChevronLeft />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg border ${currentPage === pageNum ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaChevronRight />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilteredSidebar = ({ filters, setFilters }) => {
  const handleCheckboxChange = (event, category, option) => {
    const isChecked = event.target.checked;

    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (isChecked) {
        updatedFilters[category] = [...(updatedFilters[category] || []), option];
      } else {
        updatedFilters[category] = updatedFilters[category].filter((item) => item !== option);
      }

      return updatedFilters;
    });
  };

  const filterGroups = [
    { 
      title: "price", 
      options: ["₹5,000 - ₹10,000", "₹10,000 - ₹50,000", "₹50,000 - ₹80,000", "₹80,000 - ₹1,00,000"],
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      title: "metal", 
      options: ["Gold", "Diamond", "Silver", "Platinum"],
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    { 
      title: "weight", 
      options: ["1g - 3g", "4g - 6g", "7g - 9g", "10g - 20g"],
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    { 
      title: "occasion", 
      options: ["Wedding", "Engagement", "Daily Wear", "Festive"],
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      title: "shopFor", 
      options: ["Men", "Women", "Kids", "Unisex"],
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      title: "rating", 
      options: ["⭐⭐⭐⭐⭐ (5 Stars)", "⭐⭐⭐⭐ (4 Stars & Above)", "⭐⭐⭐ (3 Stars & Above)"],
      icon: (
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {filterGroups.map((filter, index) => (
        <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
          <div className="flex items-center gap-2 mb-3">
            {filter.icon}
            <h4 className="font-medium text-gray-900 capitalize">
              {filter.title.replace(/([A-Z])/g, " $1")}
            </h4>
          </div>
          <div className="space-y-2 pl-7">
            {filter.options.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters[filter.title]?.includes(option)}
                    className="sr-only peer"
                    onChange={(e) => handleCheckboxChange(e, filter.title, option)}
                  />
                  <div className="w-5 h-5 rounded border border-gray-300 bg-white peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;