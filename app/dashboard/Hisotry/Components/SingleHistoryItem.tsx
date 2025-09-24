import React from "react";
import { LuHistory } from "react-icons/lu"; // Example icons, replace with actual icons if needed
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import { useAppContext } from "@/app/AppContext";
import { SingleTemplateExtended } from "../AllHistory";
import { HistoryData } from "@/app/types/AppType";
import { FaRegCopy } from "react-icons/fa";
import { convertFromTextToReactNode } from "../../ContentGenerator/LeftSection/LeftSection";
import { loadManifestWithRetries } from "next/dist/server/load-components";
import toast from "react-hot-toast";

export function SingleHistoryItem({
  SingleHistory,
}: {
  SingleHistory: HistoryData;
}) {
  const {
    windowWidthObject: { windowWidth },
    openConfirmationWindowObject: { setOpenConfirmationWindow },
    selectedHistoryEntryObject: { setSelectedHistoryEntry },
  } = useAppContext();

  const isMobileView = windowWidth <= 694;

  function ActionsButtons() {
    return (
      <div className="flex gap-14 font-bold items-center   justify-center    ">
        <div className="flex gap-2 items-center justify-center">
          {/* Copy Button */}
          <div
            onClick={() => {
              navigator.clipboard
                .writeText(SingleHistory.content)
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
            <FaRegCopy className="text-purple-600 text-[15px]" />
          </div>

          {/* Delete Button */}
          <div
            onClick={() => {
              setOpenConfirmationWindow(true);
              setSelectedHistoryEntry(SingleHistory);
            }}
            className=" rounded-[4px] p-1  flex items-center justify-center 
        cursor-pointer bg-slate-200 hover:bg-slate-300 transition-all"
          >
            <MdDelete className="text-slate-600 text-[15px]" />
          </div>
        </div>
      </div>
    );
  }

  function TemplateNameIcon() {
    return (
      <div className="flex gap-2 items-center  ">
        {/* Icon */}
        {!isMobileView && (
          <div
            className="  bg-purple-200 rounded-md p-[7px] flex 
        items-center justify-center"
          >
            {convertFromTextToReactNode(SingleHistory.template)}
          </div>
        )}

        {/*  Title */}
        <div className="flex flex-col">
          <span className=" text-[13px] cursor-pointer max-sm:text-sm">
            {SingleHistory.template}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className=" py-[18px] px-4 border-b border-x  border-slate-200   ">
      <div
        className={`w-full grid gap-9 ${
          isMobileView ? "grid-cols-4" : "grid-cols-5"
        }  text-slate-500 `}
      >
        {/* Template */}

        <TemplateNameIcon />
        {/* Name */}
        <div>
          <span className="text-[13px]">
            {truncateString(SingleHistory.title, 60)}
          </span>
        </div>
        {/* Created At */}
        {!isMobileView && (
          <div>
            <span className="text-[13px] ">
              {formatIsoDate(SingleHistory.createdAt)}
            </span>
          </div>
        )}

        {/* Total Words*/}
        <div>
          <span className={`text-[13px] ${isMobileView && "ml-3"}  `}>
            {countWords(SingleHistory.content)}
          </span>
        </div>
        {/* Actions Buttons */}
        <ActionsButtons />
      </div>
    </div>
  );
}

export function countWords(text: string): number {
  // Split the string by spaces and filter out any empty strings
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function truncateString(text: string, maxLength: number): string {
  // If the text length is shorter than or equal to maxLength, return it as is
  if (text.length <= maxLength) {
    return text;
  }

  // Otherwise, truncate the string and add '...'
  return text.slice(0, maxLength) + "...";
}

export function formatIsoDate(isoDate: string): string {
  // Create a new Date object from the ISO string
  const date = new Date(isoDate);

  // Define an array of month names
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Extract day, month, and year from the date
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Return the formatted string
  return `${day} ${month} ${year}`;
}

export default SingleHistoryItem;
