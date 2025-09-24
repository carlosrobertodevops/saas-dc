"use client";
import { useAppContext } from "@/app/AppContext";
import { MenuItem } from "@/app/types/AppType";
import React, { useState } from "react";
import { MdDarkMode, MdSettings, MdLogout } from "react-icons/md"; // Icons for Dark Mode, Settings, Log Out
import { MdLightMode } from "react-icons/md";
import { useAuth } from "@clerk/nextjs";
function OthersSection() {
  const {
    secondMenuItemsObject: { secondMenuItems, setSecondMenuItems },
    isDarkModeObject: { isDarkMode, setIsDarkMode },
    isSideBarHiddenObject: { isSideBarHidden },
  } = useAppContext();

  const { signOut } = useAuth();

  function updateDarkModeIcon(
    isDarkModeOn: boolean
  ): React.ComponentType<React.SVGProps<SVGSVGElement>> {
    if (isDarkModeOn) {
      return MdDarkMode;
    }

    return MdLightMode;
  }

  async function handleClickedItem(index: number) {
    if (index === 1) {
      try {
        await signOut();
        console.log("User logged out");
        // Optionally, redirect to the login or home page after logging out
        window.location.href = "/";
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  }

  return (
    <div className="mt-10 pr-3  ">
      <hr></hr>
      <ul className="mt-6 flex flex-col gap-[4px] ">
        {secondMenuItems.map((item, index) => (
          <li
            onClick={() => handleClickedItem(index)}
            key={index}
            className="flex items-center justify-between gap-2 text-slate-400"
          >
            <div className="flex gap-2 items-center py-[6px] px-2 cursor-pointer select-none">
              {item.label === "Dark Mode"
                ? React.createElement(updateDarkModeIcon(isDarkMode))
                : React.createElement(item.icon)}
              <span
                style={{ display: isSideBarHidden ? "none" : "block" }}
                className="text-[14px]"
              >
                {item.label}
              </span>
            </div>

            {item.label === "Dark Mode" && <DarkModeToggle />}
          </li>
        ))}
      </ul>
    </div>
  );

  function DarkModeToggle() {
    function updateDarkModeState(option: "left" | "right") {
      if (option === "right") {
        setIsDarkMode(true);
        localStorage.setItem("isDarkMode", JSON.stringify(true));
      } else {
        setIsDarkMode(false);
        localStorage.setItem("isDarkMode", JSON.stringify(false));
      }
    }

    return (
      <div
        className={` w-[30px] h-[17px]   relative rounded-xl flex ${
          !isDarkMode ? "bg-slate-200" : "bg-purple-100"
        }`}
      >
        <div className=" h-full w-[45px] z-40  flex justify-center items-center">
          {/* Left */}
          <div
            onClick={() => updateDarkModeState("left")}
            className="  w-1/2 h-full"
          ></div>
          {/* Right */}
          <div
            onClick={() => updateDarkModeState("right")}
            className="  w-1/2  h-full"
          ></div>
        </div>
        {/* Rounded circle */}
        <div
          className={`w-[10px] absolute h-[10px] top-[3px]  ${
            !isDarkMode ? "bg-white" : "bg-purple-600"
          } transform  
          rounded-full transition-all ${
            isDarkMode ? "right-[3px]" : "left-[3px]"
          }`}
        ></div>
      </div>
    );
  }
}

export default OthersSection;
