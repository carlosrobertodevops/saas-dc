"use client";

import React, { useEffect, useRef, useState } from "react";
import Logo from "./Components/Logo";
import MainSection from "./Components/MainSection";
import OthersSection from "./Components/OthersSection";
import RemainingWords from "./Components/RemainingWords";
import { useAppContext } from "@/app/AppContext";

function SideBar() {
  //Variables
  const {
    isDarkModeObject: { isDarkMode },
    isSideBarHiddenObject: { isSideBarHidden, setIsSideBarHidden },
    windowWidthObject: { windowWidth, setWindowWidth },
    stretchSideBarObject: { stretchSideBar, setStretchSideBar },
  } = useAppContext();

  let hideSideBarClass;
  const menuRef = useRef<HTMLDivElement>(null);

  //If the window size is less than 995
  if (windowWidth <= 995) {
    //if the use click on the menu bar icon to stretch the side bar
    if (stretchSideBar) {
      //Use fixed position and block to show the side bar
      hideSideBarClass = "block fixed z-[90] shadow-md";
      //Set the side bar hidden to false to view all the elements in the side bar
      setIsSideBarHidden(false);
    } else {
      //Otherwise don't show the side bar at all
      hideSideBarClass = "hidden";
    }
  } else {
    // This block, will handle the case, when the size window is bigger than 995
    //we want the side bar to go back its previous state when it was hidden,
    //and I'm using the local storage for that
    const getIsSideBarHidden = localStorage.getItem("isSideBarHidden");
    if (getIsSideBarHidden !== null) {
      setIsSideBarHidden(JSON.parse(getIsSideBarHidden));
    }
  }

  //This useEffect handle the logic of closing the side bar when the user clicks outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setStretchSideBar(false);
      }
    }

    if (stretchSideBar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [stretchSideBar]);

  //Jsx
  return (
    <div>
      <div
        ref={menuRef}
        className={`  ${isSideBarHidden ? "w-[120px]" : "w-[274px]"} ${
          isDarkMode ? "bg-slate-800" : "bg-white"
        } ${hideSideBarClass} h-screen px-5  py-7  border-slate-200   transition-all  `}
      >
        {/* Branding Section */}
        <Logo />
        {/* Main Section */}
        <MainSection />

        {/* Tools Section */}
        <OthersSection />

        {/* Remaining words card */}
        {!isSideBarHidden && <RemainingWords />}
      </div>
    </div>
  );
}

export default SideBar;
