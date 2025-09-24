"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { MdArrowDropDown } from "react-icons/md";
import { LuHistory } from "react-icons/lu"; // Example icons, replace with actual icons if needed

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppContext } from "@/app/AppContext";
import StatsDropDown from "@/app/DropDowns/StatsDropDown";
import DaysDropDown from "@/app/DropDowns/DaysDropDown";
import {
  formatAndAggregateAverageWords,
  formatAndAggregateTimeSaved,
  formatAndAggregateTotalCount,
  formatAndCountDocuments,
  newHistoryData,
  sortAndShortenMonth,
} from "@/app/LocalData/mainData";

const data = [
  { name: "Day 1", words: 0 },
  { name: "Day 2", words: 0 },
  { name: "Day 3", words: 10 },
  { name: "Day 4", words: 10 },
  { name: "Day 5", words: 20 },
  { name: "Day 6", words: 34 },
  { name: "Day 7", words: 34 },
];

const ChartContainer = () => {
  const {
    isDarkModeObject: { isDarkMode },
  } = useAppContext();
  return (
    <div
      className={`p-5 flex gap-3 flex-col rounded-md    ${
        isDarkMode
          ? "bg-slate-800 text-white"
          : "bg-white border border-slate-50"
      } mx-4 
    mt-6`}
    >
      <ChartHeader />
      <TheChart />
    </div>
  );

  function ChartHeader() {
    const [openDropDown, setOpenDropDown] = useState(false);
    const [openDaysDropDown, setOpenDaysDropDown] = useState(false);
    const {
      statsDropDownItemsObject: { statsData, setStatsData },
      daysDropDownObject: { daysDropDown },
    } = useAppContext();

    const getSelectedItem = [...statsData].find(
      (singleItem) => singleItem.isSelected === true
    );

    const getSelectedDaysItem = [...daysDropDown].find(
      (singleItem) => singleItem.isSelected === true
    );

    return (
      <div className="  flex justify-between items-center    ">
        {/* Header menu */}
        <div className="flex gap-2 items-center  ">
          {/* Icon */}
          <div
            className="  bg-purple-100 rounded-md p-[8px] flex 
        items-center justify-center"
          >
            {getSelectedItem?.icon}
          </div>

          {/*  Title */}
          <div className="flex flex-col relative">
            <div
              onClick={() => setOpenDropDown(!openDropDown)}
              className="flex gap-1 items-center"
            >
              <span className=" text-[13px] hover:text-purple-600 text-slate-500 cursor-pointer max-sm:text-sm">
                {getSelectedItem?.title}
              </span>
              <MdArrowDropDown className="text-[17px] text-slate-500" />
            </div>

            <span
              className={` text-[16px] ${
                isDarkMode ? "text-white" : "text-slate-700"
              } font-semibold cursor-pointer max-sm:text-sm`}
            >
              {getSelectedItem?.value}
            </span>
            {/* Drop down to choose the stats items */}
            {openDropDown && (
              <StatsDropDown
                statsData={statsData}
                setStatsData={setStatsData}
                openDropDown={openDropDown}
                setOpenDropDown={setOpenDropDown}
              />
            )}
          </div>
        </div>

        {/* days */}
        <div className="flex gap-1 items-center relative">
          <span
            onClick={() => setOpenDaysDropDown(!openDaysDropDown)}
            className="text-[13px] text-slate-500 hover:text-purple-600 cursor-pointer"
          >
            {getSelectedDaysItem?.title}
          </span>
          <MdArrowDropDown className="text-[17px] text-slate-500" />
          {openDaysDropDown && (
            <DaysDropDown
              openDaysDropDown={openDaysDropDown}
              setOpenDaysDropDown={setOpenDaysDropDown}
            />
          )}
        </div>
      </div>
    );
  }

  function TheChart() {
    const {
      allHistoryDataObject: { allHistoryData },
      statsDropDownItemsObject: { statsData },
      daysDropDownObject: { daysDropDown },
    } = useAppContext();

    // Get the current date
    const currentDate = new Date();

    function daysSelected() {
      const findSelectedDay = daysDropDown.find((day) => day.isSelected);
      if (findSelectedDay?.id === 1) {
        return 5;
      }
      if (findSelectedDay?.id === 2) {
        return 10;
      }
      if (findSelectedDay?.id === 3) {
        return 15;
      }

      return 5;
    }

    // Function to filter history data based on the last X days
    const filterDataByDays = (days: number) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(currentDate.getDate() - days);

      return allHistoryData.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= cutoffDate; // Keep items within the last 'days' days
      });
    };

    // Call the function to get the formatted and aggregated data
    function returnedValues() {
      const findSelectedItem = statsData.find((data) => data.isSelected);

      // Determine number of days based on selected item (you may need a way to set this based on user interaction)
      const daysToShow = daysSelected(); // Example: change id to match your dropdown
      const filteredData = filterDataByDays(daysToShow);

      const totalWordsCount = sortAndShortenMonth(
        formatAndAggregateTotalCount(filteredData) // Use filteredData here
      );
      const totalDocCount = sortAndShortenMonth(
        formatAndCountDocuments(filteredData) // Use filteredData here
      );

      const totalTimeSaved = formatAndAggregateTimeSaved(filteredData); // Use filteredData here
      const totalAvWordPerDoc = formatAndAggregateAverageWords(filteredData); // Use filteredData here
      console.log(totalAvWordPerDoc);

      if (findSelectedItem?.id === 1) {
        return totalWordsCount;
      }

      if (findSelectedItem?.id === 2) {
        return totalDocCount;
      }

      if (findSelectedItem?.id === 3) {
        return totalTimeSaved;
      }

      if (findSelectedItem?.id === 4) {
        return totalAvWordPerDoc;
      }

      return totalWordsCount;
    }

    return (
      <div className=" ">
        <ResponsiveContainer
          className={"  text-[12px]"}
          width="100%"
          height={176}
        >
          <AreaChart
            data={returnedValues()}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWords" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" color="#64748b" />
            <YAxis />
            <CartesianGrid strokeOpacity={0} strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorWords)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
};

export default ChartContainer;
