"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { StatsDropDownItem } from "../types/AppType";
import { useAppContext } from "../AppContext";
import useClickOutside from "../Hooks/useClickOutside";

function StatsDropDown({
  statsData,
  setStatsData,
  openDropDown,
  setOpenDropDown,
}: {
  statsData: StatsDropDownItem[];
  setStatsData: React.Dispatch<React.SetStateAction<StatsDropDownItem[]>>;
  openDropDown: boolean;
  setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dropDownRef = useRef<HTMLDivElement>(null);
  const {
    isDarkModeObject: { isDarkMode },
  } = useAppContext();
  function handleItemClicked(dropDownItemClicked: StatsDropDownItem) {
    const updateStatsDropDown = statsData.map((singleDropDown) => ({
      ...singleDropDown,
      isSelected: singleDropDown.id === dropDownItemClicked.id ? true : false,
    }));

    setStatsData(updateStatsDropDown);
    setOpenDropDown(false);
  }

  //This useEffect handle the logic of closing the drop down when the user clicks outside of it
  useClickOutside(dropDownRef, () => setOpenDropDown(false), openDropDown);

  //Jsx
  return (
    <div
      ref={dropDownRef}
      className={`${
        isDarkMode ? "bg-slate-700" : "bg-white border border-slate-50 "
      } absolute p-3  top-6
          z-[90]  w-[220px]   
      select-none shadow-md rounded-lg flex 
      flex-col gap-2`}
    >
      {statsData.map((item, index) => (
        <SingleItem
          key={index}
          dropDownItem={item}
          onItemClick={handleItemClicked}
        />
      ))}
    </div>
  );
}
export default StatsDropDown;

function SingleItem({
  dropDownItem,
  onItemClick,
}: {
  dropDownItem: StatsDropDownItem;
  onItemClick: (dropDownItemClicked: StatsDropDownItem) => void;
}) {
  function handleClickedItem(dropDownItemClicked: StatsDropDownItem) {
    onItemClick(dropDownItemClicked);
  }

  const {
    isDarkModeObject: { isDarkMode },
  } = useAppContext();
  return (
    <div
      onClick={() => {
        handleClickedItem(dropDownItem);
      }}
      className={` ${
        dropDownItem.isSelected &&
        ` ${
          isDarkMode ? "bg-purple-50" : "bg-purple-50 border border-purple-600"
        }`
      } flex items-center justify-between  gap-7 p-1 rounded-lg text-slate-600  cursor-pointer  `}
    >
      <div className={`flex gap-2 items-center `}>
        {/* Icon */}

        <div
          className={`${
            dropDownItem.isSelected ? "bg-purple-200" : "bg-purple-100"
          } p-[7px] rounded-md`}
        >
          {dropDownItem.icon}
        </div>
        <span className="text-[12px] text-slate-500 mt-1 hover:text-purple-600 cursor-pointer">
          {dropDownItem.title}
        </span>
      </div>
    </div>
  );
}
