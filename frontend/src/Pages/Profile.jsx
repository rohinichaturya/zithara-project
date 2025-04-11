import { useSelector } from "react-redux";
import Footer from "../Components/Common/Footer";
import Navbar from "../Components/Layout/Navbar";
import Topbar from "../Components/Layout/Topbar";
import MyOrdersPage from "./MyOrdersPage";

const Profile = () => {
  // Get user data from Redux store
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 mt-28">
        <div className="container mx-auto px-4">
          {user ? (
            <div className="flex flex-col gap-6">
              {/* Profile Section - Full Width */}
              <div className="w-full">
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {user.name || 'Not provided'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                      <p className="mt-1 text-lg font-semibold text-gray-900">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500">Order History</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {orders?.length || 0} orders placed
                    </p>
                  </div>
                </div>
              </div>

              {/* Orders Section - Full Width */}
              <div className="w-full">
                <div className="bg-white shadow-sm rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>
                  <MyOrdersPage />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Please log in to view your profile
              </h2>
              <p className="text-gray-600">
                You need to be logged in to access your profile information and order history.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;