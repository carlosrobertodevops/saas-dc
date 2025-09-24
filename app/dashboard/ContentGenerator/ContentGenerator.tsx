"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import LeftSection from "./LeftSection/LeftSection";
import RightSection from "./RightSection/RightSection";
import { useAppContext } from "@/app/AppContext";
import { SingleTemplate } from "@/app/types/AppType";

function ContentGeneratorForm() {
  const {
    openContentGeneratorFormObject: {
      openContentGeneratorForm,
      setOpenContentGeneratorForm,
    },

    isDarkModeObject: { isDarkMode },
    windowWidthObject: { windowWidth },
  } = useAppContext();
  return (
    <div
      className={` ${
        isDarkMode ? "bg-slate-800 border border-slate-600" : "bg-white border"
      }     left-1/2 top-5 -translate-x-1/2 z-50  
        w-[95%] rounded-lg flex gap-2 shadow-lg  ${
          openContentGeneratorForm ? "fixed" : "hidden"
        } ${
        windowWidth <= 836
          ? "flex-col h-[1210px] absolute"
          : "flex-row h-[90vh]"
      }`}
    >
      <LeftSection />
      <RightSection />
    </div>
  );
}

export default ContentGeneratorForm;
