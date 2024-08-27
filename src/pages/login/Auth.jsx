import React, { useState } from "react";

import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Auth = () => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async () => {

  }

  const handleSignUp = async () => {

  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div
        className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw]
      md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2"
      >
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory-Emoji" className="h-[70px] md:h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:bg-transparent 
                  data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500
                  p-3 transition-all duration-1000"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:bg-transparent 
                  data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500
                  p-3 transition-all duration-1000"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login" className='flex flex-col gap-5 mt-10'>
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className='rounded-full p-6' onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent value="signup" className='flex flex-col gap-5'>
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
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
                <Button className='rounded-full p-6' onClick={handleSignUp}>SignUp</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img className="h-[500px]" src={Background} alt="Background-Login-Image"/>
        </div>
      </div>
    </div>
  );
};

export default Auth;
