import React from "react";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AuthDemo = () => {
  const [activeTab, setActiveTab] = React.useState("signin");

  const handleSignIn = (userData: any) => {
    console.log("Sign in successful with:", userData);
    alert(`Signed in as ${userData.name} (${userData.role})`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Authentication Demo
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="signin">
            <SignIn onSignIn={handleSignIn} />
          </TabsContent>

          <TabsContent value="signup">
            <SignUp />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AuthDemo;
