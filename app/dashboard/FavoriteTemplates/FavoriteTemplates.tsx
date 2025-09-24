import { useAppContext } from "@/app/AppContext";
import React from "react";
import MainHeader from "../MainHeader";
import TemplateSingleCard from "../Templates/Components/TemplateSingleCard";
import { TbMoodEmpty } from "react-icons/tb";

function FavoriteTemplates() {
  const {
    isDarkModeObject: { isDarkMode },
  } = useAppContext();
  return (
    <div
      className={`w-full min-h-screen  ${
        !isDarkMode ? "bg-slate-50" : "bg-slate-700"
      }`}
    >
      <MainHeader />
      <RenderFavoriteTemplates />
    </div>
  );
}

function RenderFavoriteTemplates() {
  const {
    allTemplatesObject: { allTemplates },
    isDarkModeObject: { isDarkMode },
    windowWidthObject: { windowWidth },
  } = useAppContext();

  const filterByIsFavorite = allTemplates.filter(
    (singleTemplate) => singleTemplate.isFavorite
  );

  function updateGrid(): string {
    if (windowWidth < 505) {
      return "grid-cols-1";
    } else if (windowWidth < 834) {
      return "grid-cols-2";
    } else if (windowWidth <= 1350) {
      return "grid-cols-3";
    }

    return "grid-cols-4";
  }

  if (filterByIsFavorite.length === 0) {
    return (
      <div className="w-full h-64 flex justify-center items-center  mt-28 flex-col gap-5">
        <TbMoodEmpty className="text-[98px] text-opacity-60 text-slate-400" />
        <p className="text-sm text-slate-400">
          There are no templates marked as favorites yet...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`p-7 ${!isDarkMode && "border-slate-200"}   
      gap-3 grid ${updateGrid()} mt-10`}
    >
      {filterByIsFavorite.map((singleTemplate, index) => (
        <TemplateSingleCard key={index} singleTemplate={singleTemplate} />
      ))}
    </div>
  );
}

export default FavoriteTemplates;
