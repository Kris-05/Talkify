import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import Background from "/login.png";
import Victory from "/victory.svg";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/apiRoutes";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateAuth = (type) => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (type === "register" && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      if (validateAuth("login")) {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email: email, password: password },
          { withCredentials: true }
        );

        const { success, data } = res.data;
        if (success) {
          setUserInfo(data);
          toast.success("Login successful");
          navigate(data.profileSetup ? "/chat" : "/profile");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      console.log(err.response?.data);
    }
  };

  const handleRegister = async () => {
    try {
      if (validateAuth("register")) {
        const res = await apiClient.post(
          SIGNUP_ROUTE,
          { email: email, password: password },
          { withCredentials: true }
        );

        const { success, data } = res.data;
        if (success) {
          setUserInfo(data);
          toast.success("Registration successful");
          navigate("/profile");
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      console.log(err.response?.data);
    }
  };

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[80vh] w-[80vw] bg-white border-2 border-white text-opacity-90 rounded-3xl grid xl:grid-cols-2 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw]">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold">
                Welcome
              </h1>
              <img
                src={Victory}
                alt="Victory"
                className="h-[50px] md:h-[75px] lg:h-[100px]"
              />
            </div>
            <p className="text-sm md:text-xl lg:text-2xl font-medium text-center">
              Fill in the details to get started!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-5" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="register">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleRegister}>
                  Register
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex items-center justify-center">
          <img src={Background} alt="Background" className="h-full" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
