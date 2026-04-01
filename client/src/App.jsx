import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import Auth from "./pages/auth/Auth";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import NotFound from "./pages/NotFound";
import SplashPage from "./pages/SplashPage";

import { apiClient } from "./lib/apiClient";
import { GET_USER_INFO } from "./utils/apiRoutes";

// not authenticated, go to auth page
const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

// if authenticated, go to chat page
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const LoadSpinner = () => (
  <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white gap-3">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
    <span className="text-lg font-medium tracking-wide">
      Loading your data...
    </span>
  </div>
);

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });

        if (data.success) {
          setUserInfo(data.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (err) {
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) getUserData();
    else setLoading(false);
  }, [userInfo, setUserInfo]);

  if (loading) return <LoadSpinner />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
