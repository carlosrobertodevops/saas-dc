import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import SingleHistoryItem from "./SingleHistoryItem";
import { useAppContext } from "@/app/AppContext";
import { SingleTemplateExtended, useAllHistoryContext } from "../AllHistory";
import { HistoryData, SingleTemplate } from "@/app/types/AppType";

function AllHistoryList() {
  const {
    windowWidthObject: { windowWidth },
    isDarkModeObject: { isDarkMode },
    allTemplatesForDropDownObject: {
      setTemplatesForDropDown,
      templatesForDropDown,
    },
  } = useAppContext();

  const {
    selectedItemsObject: { selectedItems, setSelectedItems },
  } = useAllHistoryContext();

  const isMobileView = windowWidth <= 694;

  function FilterOptions() {
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedItems.map((singleItem, index) => (
          <React.Fragment key={index}>
            <OptionSelected singleItem={singleItem} />
          </React.Fragment>
        ))}
      </div>
    );

    function OptionSelected({
      singleItem,
    }: {
      singleItem: SingleTemplateExtended;
    }) {
      return (
        <div className=" bg-purple-100 p-1 flex gap-1 items-center text-purple-600 rounded-md">
          <span className="text-[12px]">{singleItem.title}</span>
          <IoIosClose
            onClick={() => {
              const updateTemplateArray = templatesForDropDown.map(
                (singleItemDrop) => {
                  if (singleItem.id === singleItemDrop.id) {
                    return { ...singleItemDrop, isSelected: false };
                  }

                  return singleItemDrop;
                }
              );

              setSelectedItems(
                updateTemplateArray.filter((item) => item.isSelected)
              );
              setTemplatesForDropDown(updateTemplateArray);
            }}
            className="text-[16px] cursor-pointer"
          />
        </div>
      );
    }
  }

  function AllColumns() {
    return (
      <div
        className={`w-full border rounded-t-lg bg-slate-100 border-slate-200  
      py-2 overflow-hidden px-[13px] grid ${
        isMobileView ? "grid-cols-4" : "grid-cols-5"
      }`}
      >
        {/* First column */}
        <span className="text-[14px] text-slate-400 font-semibold">
          Template
        </span>
        {/* Second column */}
        <span className="text-[14px] text-slate-400 font-semibold">Title</span>
        {!isMobileView && (
          <span className="text-[14px] text-slate-400 font-semibold">
            Created At
          </span>
        )}

        <span className="text-[14px] text-slate-400 font-semibold">
          Total Words
        </span>
        <span className="text-[14px]   text-center text-slate-400 font-semibold">
          Actions
        </span>
      </div>
    );
  }

  const singleItemsContainer = `flex   flex-col ${
    isDarkMode ? "bg-slate-800" : "bg-white"
  }`;

  const {
    allHistoryDataObject: { allHistoryData },
  } = useAppContext();

  //Extract the title of the themplate in selected items array
  const extractSelectedTemplates = selectedItems.map((item) => item.title);

  const filteredTemplates =
    selectedItems.length > 0
      ? allHistoryData.filter((singleHistory) =>
          extractSelectedTemplates.includes(singleHistory.template)
        )
      : allHistoryData;

  // Sort the filtered array by createdAt in descending order
  const sortedFilteredTemplates = filteredTemplates.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
  const areElementsNotFoundWithFilter =
    filteredTemplates.length === 0 && selectedItems.length > 0;

  function RenderFilteredTemplates() {
    if (areElementsNotFoundWithFilter) {
      return (
        <div className="flex w-full h-20 items-center justify-center ">
          <span className="text-gray-400 text-[13px]">
            No history entry was found with the template(s) selected
          </span>
        </div>
      );
    }

    return (
      <>
        {sortedFilteredTemplates.map((singleHistory, index) => (
          <React.Fragment key={index}>
            <SingleHistoryItem SingleHistory={singleHistory} />
          </React.Fragment>
        ))}
      </>
    );
  }

  return (
    <div className=" flex  flex-col mt-7 mx-5  rounded-md">
      <FilterOptions />
      {/* List Header */}
      <AllColumns />
      {/* SingleItems */}
      <div className={singleItemsContainer}>
        <RenderFilteredTemplates />
      </div>
    </div>
  );
}

export default AllHistoryList;
