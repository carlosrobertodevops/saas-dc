"use client";
import React from "react";

import { LuHistory } from "react-icons/lu"; // Example icons, replace with actual icons if needed
import { MdDelete } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { useAppContext } from "@/app/AppContext";
import { FaRegCopy } from "react-icons/fa";
import SingleHistoryItem, {
  countWords,
  formatIsoDate,
  truncateString,
} from "../../Hisotry/Components/SingleHistoryItem";
import { HistoryData } from "@/app/types/AppType";
import { convertFromTextToReactNode } from "../../ContentGenerator/LeftSection/LeftSection";
import toast from "react-hot-toast";
const AllHistoryList = () => {
  const {
    isDarkModeObject: { isDarkMode },
    windowWidthObject: { windowWidth },
    allHistoryDataObject: { allHistoryData },
    mainMenuItemsObject: { setMainMenuItems },
  } = useAppContext();

  const listHeaderItems = [
    {
      title: "Template",
      className: "text-[13px] text-slate-500 font-semibold",
    },
    {
      title: "Title",
      className: "text-[13px] text-slate-500 font-semibold",
    },
    {
      title: "Created At",
      className: "text-[13px] text-slate-500 font-semibold",
    },
    {
      title: "Total Words",
      className: "text-[13px] text-slate-500 font-semibold",
    },
    {
      title: "Actions",
      className: "text-[13px] text-slate-500 font-semibold text-center",
    },
  ];

  let updateListHeaderItems = [...listHeaderItems];

  if (windowWidth <= 634) {
    updateListHeaderItems = updateListHeaderItems.filter(
      (header) =>
        header.title !== "Total Words" && header.title !== "Created At"
    );
  } else if (windowWidth <= 1215) {
    updateListHeaderItems = updateListHeaderItems.filter(
      (header) => header.title !== "Created At"
    );
  }

  const getGridCols = () => {
    if (windowWidth < 634) return "grid-cols-3";
    if (windowWidth < 1215) return "grid-cols-4";
    return "grid-cols-5";
  };

  const sortedAllHistoryDataByRecentDate = allHistoryData.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });

  return (
    <div
      className={`p-6 flex gap-3 flex-col  rounded-md ${
        isDarkMode
          ? "bg-slate-800 text-white"
          : " bg-white border border-slate-50"
      }   mx-4 mt-6`}
    >
      {/* History Header */}
      <div className="flex gap-2 justify-between items-center">
        <div className="  text-slate-700 flex gap-3 items-center">
          <span className="text-[17px] font-bold">Recent History</span>
          <div
            className="bg-purple-200 w-[24px] h-[24px] p-1 rounded-full 
          text-[12px] text-white flex items-center justify-center"
          >
            <span className="text-purple-600">{allHistoryData.length}</span>
          </div>
        </div>
        {/*  */}
        <a
          onClick={() => {
            setMainMenuItems((prevArray) =>
              prevArray.map((singleItem) => {
                if (singleItem.label === "History") {
                  return { ...singleItem, isSelected: true };
                }
                return { ...singleItem, isSelected: false };
              })
            );
          }}
          className="text-[13px] text-purple-600 cursor-pointer hover:text-purple-800 items-center"
        >
          View All
        </a>
      </div>
      {/* List Header */}
      <div
        className={`
    w-full mt-3 py-[6px]
    ${windowWidth < 634 ? "px-1" : "px-4"}
    grid
    ${
      windowWidth < 634
        ? "grid-cols-3"
        : windowWidth < 1215
        ? "grid-cols-4"
        : "grid-cols-5"
    }
  `}
      >
        {updateListHeaderItems.map((item, index) => (
          <span key={index} className={item.className}>
            {item.title}
          </span>
        ))}
      </div>

      <div className="flex gap-4 px-4 flex-col">
        {sortedAllHistoryDataByRecentDate
          .slice(0, 3)
          .map((singleHistory, index) => (
            <SingleItem singleHistory={singleHistory} key={index} />
          ))}
      </div>
    </div>
  );
};

export default AllHistoryList;

function SingleItem({ singleHistory }: { singleHistory: HistoryData }) {
  const {
    windowWidthObject: { windowWidth },
    selectedTemplatesObject: { selectedTemplate },
    selectedHistoryEntryObject: { setSelectedHistoryEntry },
    openConfirmationWindowObject: { setOpenConfirmationWindow },
  } = useAppContext();

  return (
    <div className=" ">
      <div
        className={`w-full grid     ${
          windowWidth < 634
            ? "grid-cols-3"
            : windowWidth < 1215
            ? "grid-cols-4"
            : "grid-cols-5"
        }`}
      >
        {/* Template */}
        <div className="flex gap-2 items-center  ">
          {/* Icon */}
          {windowWidth >= 634 && (
            <div
              className="  bg-purple-200 rounded-md p-[5px] flex 
               items-center justify-center"
            >
              {convertFromTextToReactNode(singleHistory.template)}
            </div>
          )}

          {/*  Title */}
          <div className="flex flex-col">
            <span className=" text-[12px] cursor-pointer max-sm:text-sm">
              {singleHistory.template}
            </span>
          </div>
        </div>
        {/* Name */}
        <div>
          <span className="text-[12px]">
            {truncateString(singleHistory.title, 100)}
          </span>
        </div>
        {/* Created At */}
        {windowWidth >= 1215 && (
          <div>
            <span className="text-[12px]  ">
              {formatIsoDate(singleHistory.createdAt)}
            </span>
          </div>
        )}

        {/* Total Words*/}
        {windowWidth >= 634 && (
          <div>
            <span className="text-[12px]  ">
              {countWords(singleHistory.content)}
            </span>
          </div>
        )}

        {/* Actions Buttons */}
        <div className="flex gap-14 font-bold items-center justify-center    ">
          <div className="flex gap-2 items-center">
            {/* View Button */}
            <div
              onClick={() => {
                navigator.clipboard
                  .writeText(singleHistory.content)
                  .then(() => {
                    toast.success("Content copied successfully");
                  })
                  .catch(() => {
                    toast.error("Failed to copy this history content");
                  });
              }}
              className=" rounded-[4px] p-1  flex items-center justify-center 
              cursor-pointer bg-purple-200 hover:bg-purple-300 transition-all"
            >
              <FaRegCopy className="text-purple-600 text-[11px]" />
            </div>

            {/* Delete Button */}
            <div
              onClick={() => {
                setSelectedHistoryEntry(singleHistory);
                setOpenConfirmationWindow(true);
              }}
              className=" rounded-[4px] p-1  flex items-center justify-center 
              cursor-pointer bg-slate-200 hover:bg-slate-300 transition-all"
            >
              <MdDelete className="text-slate-600 text-[11px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
