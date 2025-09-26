"use client";
import React, { useState } from "react";

// Importing the useAppContext hook from the AppContext file
import { useAppContext } from "@/src/app/AppContext";

// MainSection component
function MainSection() {
  // Destructuring mainMenuItems and setMainMenuItems from the mainMenuItemsObject in the AppContext
  const {
    mainMenuItemsObject: { mainMenuItems, setMainMenuItems },
    isSideBarHiddenObject: { isSideBarHidden, setIsSideBarHidden },
  } = useAppContext();

  // Function to handle selection change of menu items
  const handleSelectionChange = (index: number) => {
    // Updating the mainMenuItems by setting the isSelected property of the selected item to true and the rest to false
    setMainMenuItems(
      mainMenuItems.map((item, i) => ({
        ...item,
        isSelected: i === index,
      }))
    );
  };

  // Returning the JSX for the MainSection component
  return (
    <div className="space-y-3  pr-3  ">
      {/* Empty div to replace the space gone from hiding the main menu div */}
      {isSideBarHidden && <div className="h-4"></div>}

      <h2
        className={` ${
          isSideBarHidden ? "hidden  " : "block"
        } text-[13px] px-2 font-semibold text-gray-400 uppercase`}
      >
        Main Menu
      </h2>
      <ul
        className={`flex flex-col gap-[4px] ${
          !isSideBarHidden ? "pr-12" : "pr-[35px]"
        }  `}
      >
        {/* Overview */}
        {mainMenuItems.map((item, index) => (
          <li
            key={index}
            onClick={() => handleSelectionChange(index)}
            className={`flex items-center space-x-2 select-none cursor-pointer   ${
              item.isSelected
                ? "bg-purple-50 py-[6px] px-2 rounded-md text-purple-600"
                : "text-gray-400 py-[6px] px-2"
            } ${item.label === "Subscriptions" && "hidden"}`}
          >
            {React.createElement(item.icon, {
              className: `${
                item.isSelected ? "text-purple-600" : "text-slate-400"
              }`,
            })}
            <span
              style={{ display: isSideBarHidden ? "none" : "block" }}
              className="text-[14px]"
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Exporting the MainSection component
export default MainSection;
