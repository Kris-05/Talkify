import Avatar from "@/components/common/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/apiClient";
// import Input from '@/components/common/Input';
import { useAppStore } from "@/store";
import { UPDATE_PROFILE_ROUTE } from "@/utils/apiRoutes";
import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();

  const [name, setName] = useState("");
  const [about, setAbout] = useState("Hey there!");
  const [image, setImage] = useState("/default_avatar.png");

  // to get data when he needs to update profile
  useEffect(() => {
    if (userInfo.profileSetup) {
      setName(userInfo.name || "");
      setAbout(userInfo.about || "Hey there!");
      setImage(userInfo.profilePic || "/default_avatar.png");
    }
  }, [userInfo]);

  const onboardUserHandler = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { name, about, image },
          { withCredentials: true }
        );
        const { success, data } = res.data;
        
        if(success) {
          setUserInfo({ ...data });         
          toast.success("Profile updated successfully");
          navigate("/chat");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Can't update profile");
        console.log(err.response?.data);
      }
    }
  };

  const validateProfile = () => {
    if (!name) {
      toast.error("Name is required");
      return false;
    }
    if (!about) {
      toast.error("Pls set ur about");
      return false;
    }
    return true;
  };

  const handleNavigate = () => {
    if(userInfo.profileSetup){
      navigate('/chat');
    } else {
      toast.error("Please setup profile")
    }
  }

  return (
    <div className="bg-[#202c33] h-[100vh] text-white flex flex-col gap-10 items-center justify-center">
      <div className="flex flex-col justify-center items-center gap-10 w-[80vw] md:w-max">
        <div className="w-full flex justify-start items-center gap-5">
          <IoArrowBack onClick={handleNavigate} className="text-2xl lg:text-4xl text-white/90 cursor-pointer" />
          <h2 className="text-2xl">Create your profile</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <Avatar type="xl" image={image} setImage={setImage} />
          </div>
          <div className="flex flex-col items-center justify-center mt-5 gap-6">
            <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none focus:outline-none focus:ring-0 focus:z-0"
              />
              <Input
                placeholder="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
              <Input
                placeholder="About"
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button
            className="flex items-center justify-center gap-7 bg-[#111b21] transition-all duration-300 p-5 rounded-lg"
            onClick={onboardUserHandler}
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
