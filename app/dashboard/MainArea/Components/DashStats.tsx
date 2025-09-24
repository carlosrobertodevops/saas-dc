import React, { useEffect, useState } from "react";
import { MdOutlineSummarize } from "react-icons/md";
import { CgFileDocument } from "react-icons/cg";
import { LuWholeWord } from "react-icons/lu";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { BiChart } from "react-icons/bi";
import { useAppContext } from "@/app/AppContext";
import { HistoryData } from "@/app/types/AppType";

const DashStats = () => {
  const {
    statsDropDownItemsObject: { statsData, setStatsData },
    allHistoryDataObject: { allHistoryData },
  } = useAppContext();
  const {
    isDarkModeObject: { isDarkMode, setIsDarkMode },
    windowWidthObject: { windowWidth, setWindowWidth },
  } = useAppContext();

  const updateTheStatsData =
    windowWidth <= 1215
      ? statsData.filter((data) => data.title !== "Total time saved")
      : statsData;

  const calculateStats = (allHistoryData: HistoryData[]) => {
    const averageWPM = 40; // average words per minute

    // Calculate total words
    const totalWords = allHistoryData.reduce(
      (sum, singleHistory) => sum + singleHistory.totalWords,
      0
    );

    // Calculate total documents generated
    const totalDocGenerated = allHistoryData.length;

    // Calculate the average word per document
    const averageWordsPerDoc =
      totalDocGenerated > 0 ? totalWords / totalDocGenerated : 0;

    // Calculate total time saved (in minutes)
    const totalTimeSaved = totalWords / averageWPM;
    // Convert time saved to hours and minutes
    const hours = Math.floor(totalTimeSaved / 60); // Get full hours
    const minutes = Math.floor(totalTimeSaved % 60); // Get remaining minutes

    // Format the time saved as "xh xxmin" or just "xxmin" if less than 1 hour
    const formattedTimeSaved =
      hours > 0 ? `${hours} h ${minutes} min` : `${minutes} minutes`;

    return {
      totalWords,
      totalDocGenerated,
      averageWordsPerDoc,
      formattedTimeSaved,
    };
  };

  //Update the stats data array
  useEffect(() => {
    const {
      totalWords,
      totalDocGenerated,
      averageWordsPerDoc,
      formattedTimeSaved,
    } = calculateStats(allHistoryData);

    setStatsData((prevStatsData) =>
      prevStatsData.map((singleItem) => {
        if (singleItem.id === 1) {
          return { ...singleItem, value: totalWords.toString() };
        }

        if (singleItem.id === 2) {
          return { ...singleItem, value: totalDocGenerated.toString() };
        }

        if (singleItem.id === 3) {
          return {
            ...singleItem,
            value: formattedTimeSaved,
          };
        }

        if (singleItem.id === 4) {
          return {
            ...singleItem,
            value: averageWordsPerDoc.toFixed(2).toString(),
          };
        }

        return singleItem;
      })
    );
  }, [allHistoryData]);

  return (
    <div className="flex flex-col gap-3 px-4 pt-3 ">
      <h2 className="font-semibold text-[16px] text-slate-400">Overview</h2>

      <div
        className={`grid ${
          windowWidth <= 1215 ? "grid-cols-3" : "grid-cols-4"
        }   gap-3  `}
      >
        {updateTheStatsData.map((stat, index) => (
          <div
            key={index}
            className={`flex    ${
              windowWidth <= 634 ? "flex-col gap-3" : "items-center"
            } rounded-md p-3  ${isDarkMode ? "bg-slate-800 " : "bg-white"}`}
          >
            <div
              className={`bg-purple-100 p-2 rounded-md ${
                windowWidth <= 634 && "w-[35px]"
              } `}
            >
              {stat.icon}
            </div>

            <div className={`${windowWidth >= 634 && "ml-4"}`}>
              <p
                className={`text-[16px] font-semibold  ${
                  isDarkMode ? "text-white" : "text-slate-800"
                } `}
              >
                {stat.value}
              </p>
              <p
                className={`text-slate-500  ${
                  windowWidth <= 634 ? "text-[10px]" : "text-[11px]"
                }`}
              >
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashStats;
