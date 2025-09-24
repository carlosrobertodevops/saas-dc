"use client";

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { LuWholeWord } from "react-icons/lu";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { BiChart } from "react-icons/bi";
import { useAppContext } from "../AppContext";
import { DaysDropDownItem } from "../types/AppType";
import useOutsideClick from "../Hooks/useClickOutside";

//Defining the type of each element in the drop down
type StatsDropDownItem = {
  id: number;
  title: string;
  icon: ReactNode;
  isSelected: boolean;
};

function DaysDropDown({
  openDaysDropDown,
  setOpenDaysDropDown,
}: {
  openDaysDropDown: boolean;
  setOpenDaysDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  //Stats drop down array
  const {
    daysDropDownObject: { daysDropDown, setDaysDropDown },
    isDarkModeObject: { isDarkMode, setIsDarkMode },
  } = useAppContext();

  const dropDownRef = useRef<HTMLDivElement>(null);

  function handleClickedItem(itemClicked: DaysDropDownItem) {
    const updatedDaysDropDown = daysDropDown.map((singleItem) => ({
      ...singleItem,
      isSelected: itemClicked.id === singleItem.id ? true : false,
    }));

    setDaysDropDown(updatedDaysDropDown);
  }

  //Handle the outside click from this custom hook
  useOutsideClick(
    dropDownRef,
    () => setOpenDaysDropDown(false),
    openDaysDropDown
  );

  //Jsx
  return (
    <div
      ref={dropDownRef}
      className={`  ${
        isDarkMode ? "bg-slate-700" : "bg-white border border-slate-50 "
      }    absolute p-3 top-7 right-1
          z-[90]   w-[180px]   
       select-none shadow-md rounded-lg flex 
      flex-col gap-2`}
    >
      {daysDropDown.map((item, index) => (
        <SingleItem
          key={index}
          dropDownItem={item}
          onItemClicked={handleClickedItem}
        />
      ))}
    </div>
  );
}
export default DaysDropDown;

function SingleItem({
  dropDownItem,
  onItemClicked,
}: {
  dropDownItem: DaysDropDownItem;
  onItemClicked: (item: DaysDropDownItem) => void;
}) {
  const {
    isDarkModeObject: { isDarkMode },
  } = useAppContext();
  return (
    <div
      onClick={() => {
        onItemClicked(dropDownItem);
      }}
      className={` ${
        dropDownItem.isSelected
          ? ` ${!isDarkMode && "border border-purple-600"} bg-purple-50`
          : ""
      } flex items-center justify-between  gap-7 p-[4px] rounded-lg text-slate-600  cursor-pointer  `}
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
