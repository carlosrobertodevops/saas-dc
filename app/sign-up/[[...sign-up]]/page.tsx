import React from "react";
import { SignUp } from "@clerk/nextjs";

const signUp = () => {
  return (
    <div className={`w-full h-screen  flex justify-center items-center`}>
      <span>Ai Verse</span>
      <SignUp />
    </div>
  );
};

export default signUp;
