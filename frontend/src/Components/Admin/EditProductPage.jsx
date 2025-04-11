import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchAdminProducts, updateProduct } from "../../redux/slices/adminProductSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProductPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { products, loading, error } = useSelector((state) => state.adminProducts);
    const product = products.find((prod) => prod._id === id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        countInStock: "",
        sku: "",
        category: "",
        brand: "",
        colors: [],
        collections: "",
        material: "",
        gender: "",
        occasion: "",
        images: [],
        isFeatured: false,
        isPublished: false,
        rating: "",
        numReviews: "",
        tags: [],
        dimensions: { length: "", width: "", height: "" },
        weight: "",
        metadata: { product_id: "", original_price: "", discount_price: "" }
    });

    const [colorInput, setColorInput] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [imageInput, setImageInput] = useState({ 
        url: "", 
        altText: "", 
        public_id: "" 
    });

    useEffect(() => {
        if (!products.length) {
            dispatch(fetchAdminProducts());
        }
    }, [dispatch, products.length]);

    useEffect(() => {
        if (product) {
            setFormData({
                ...product,
                price: Math.round(product.metadata.discount_price),
                dimensions: {
                    length: product.dimensions?.length || "",
                    width: product.dimensions?.width || "",
                    height: product.dimensions?.height || ""
                },
                metadata: {
                    product_id: product.metadata?.product_id || "",
                    original_price: product.metadata?.original_price || "",
                    discount_price: product.metadata?.discount_price || ""
                },
                images: product.images?.map(img => ({
                    url: img.url,
                    altText: img.altText,
                    public_id: img.public_id || ""
                })) || []
            });
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "price") {
            setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, discount_price: value }
            }));
        } else if (name in formData.metadata) {
            setFormData(prev => ({
                ...prev,
                metadata: { ...prev.metadata, [name]: value }
            }));
        } else if (name in formData.dimensions) {
            setFormData(prev => ({
                ...prev,
                dimensions: { ...prev.dimensions, [name]: value }
            }));
        } else if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleArrayAdd = (field, value, setInput) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setInput("");
        }
    };

    const handleArrayRemove = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleImageAdd = () => {
        if (imageInput.url.trim() && imageInput.altText.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, { 
                    url: imageInput.url.trim(), 
                    altText: imageInput.altText.trim(),
                    public_id: imageInput.public_id.trim() 
                }]
            }));
            setImageInput({ url: "", altText: "", public_id: "" });
        }
    };

    const handleImageRemove = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const updatedProduct = {
            ...formData,
            metadata: {
                ...formData.metadata,
                discount_price: parseFloat(formData.metadata.discount_price),
                original_price: parseFloat(formData.metadata.original_price)
            },
            dimensions: {
                length: parseFloat(formData.dimensions.length),
                width: parseFloat(formData.dimensions.width),
                height: parseFloat(formData.dimensions.height)
            }
        };

        try {
            await dispatch(updateProduct({ id: product._id, productData: updatedProduct })).unwrap();
            toast.success("Product updated successfully!");
            navigate("/admin/products");
        } catch (error) {
            toast.error("Failed to update product");
            console.error("Update error:", error);
        }
    };

    if (loading || !product) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100">
                        <span className="text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="px-6 py-4">
                    {/* Basic Information */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)*</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.metadata.discount_price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count*</label>
                                <input
                                    type="number"
                                    name="countInStock"
                                    value={formData.countInStock}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SKU*</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Brand & Collection */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Brand & Collection</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Brand*</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                                <input
                                    type="text"
                                    name="collections"
                                    value={formData.collections}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Colors & Tags */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Attributes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={colorInput}
                                        onChange={(e) => setColorInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleArrayAdd("colors", colorInput, setColorInput))}
                                        placeholder="Add color and press Enter"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleArrayAdd("colors", colorInput, setColorInput)}
                                        className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.colors.map((color, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                            {color}
                                            <button
                                                type="button"
                                                onClick={() => handleArrayRemove("colors", index)}
                                                className="ml-1.5 inline-flex text-indigo-600 hover:text-indigo-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleArrayAdd("tags", tagInput, setTagInput))}
                                        placeholder="Add tag and press Enter"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleArrayAdd("tags", tagInput, setTagInput)}
                                        className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleArrayRemove("tags", index)}
                                                className="ml-1.5 inline-flex text-green-600 hover:text-green-900"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Images</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL*</label>
                                        <input
                                            type="text"
                                            value={imageInput.url}
                                            onChange={(e) => setImageInput({ ...imageInput, url: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text*</label>
                                        <input
                                            type="text"
                                            value={imageInput.altText}
                                            onChange={(e) => setImageInput({ ...imageInput, altText: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Public ID</label>
                                        <input
                                            type="text"
                                            value={imageInput.public_id}
                                            onChange={(e) => setImageInput({ ...imageInput, public_id: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleImageAdd}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Add Image
                                </button>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Images</label>
                                <div className="flex flex-wrap gap-2">
                                    {formData.images.length > 0 ? (
                                        formData.images.map((img, index) => (
                                            <div key={index} className="relative w-20 h-20">
                                                <img
                                                    src={img.url}
                                                    alt={img.altText}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                                                    {img.public_id || 'No ID'}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleImageRemove(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="w-full h-20 flex items-center justify-center bg-gray-100 rounded-md text-gray-400">
                                            No images added
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Product Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                                <input
                                    type="text"
                                    name="occasion"
                                    value={formData.occasion}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dimensions & Weight */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Dimensions & Weight</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Length (cm)</label>
                                <input
                                    type="number"
                                    name="length"
                                    value={formData.dimensions.length}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Width (cm)</label>
                                <input
                                    type="number"
                                    name="width"
                                    value={formData.dimensions.width}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.dimensions.height}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Pricing Metadata</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                                <input
                                    type="text"
                                    name="product_id"
                                    value={formData.metadata.product_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                                <input
                                    type="number"
                                    name="original_price"
                                    value={formData.metadata.original_price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (₹)</label>
                                <input
                                    type="number"
                                    name="discount_price"
                                    value={formData.metadata.discount_price}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="mb-8">
                        <h2 className="text-lg font-medium text-gray-700 mb-4">Options</h2>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">Featured Product</label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-700">Publish Product</label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/products")}
                            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer position="bottom-right" autoClose={5000} />
        </div>
    );
};

export default EditProductPage;