// Importing required icons
import { useAppContext } from "@/src/app/AppContext";
import { useEffect, useState } from "react";
import { AiFillRobot } from "react-icons/ai";
import { FiSidebar } from "react-icons/fi";

// Logo component
function Logo() {
  const {
    isSideBarHiddenObject: { isSideBarHidden, setIsSideBarHidden },
    windowWidthObject: { windowWidth },
  } = useAppContext();

  function updateTheState() {
    setIsSideBarHidden(!isSideBarHidden);
    // Save the value to localStorage whenever it changes
    localStorage.setItem("isSideBarHidden", JSON.stringify(!isSideBarHidden));
  }

  return (
    // Main container with flexbox properties
    <div className="flex items-center justify-between space-x-2 mt-1 mb-16">
      {/* // Container for the logo and title */}
      <div className="flex gap-2 items-center">
        {/* // Purple rounded background with centered robot icon */}
        <div className="w-9 h-9 bg-purple-600 rounded-md flex items-center justify-center">
          <AiFillRobot className="text-white text-[19px]" />
        </div>
        {/* // Title with bold and light parts */}
        <h1
          className={`text-[20px] flex gap-1 ${
            isSideBarHidden ? "hidden" : "block"
          }`}
        >
          <span className="font-bold text-purple-600">AI</span>
          <span className="font-light text-slate-600">Verse</span>
        </h1>
      </div>

      {/* // Sidebar icon */}
      {windowWidth >= 995 && (
        <FiSidebar
          onClick={updateTheState}
          className="text-slate-500 text-sm cursor-pointer"
        />
      )}
    </div>
  );
}

export default Logo;
