import React, { createContext, useContext, useEffect, useState } from "react";

import { IoIosClose } from "react-icons/io";
import { useAppContext } from "@/app/AppContext";
import MainHeader from "../MainHeader";
import SingleHistoryItem from "./Components/SingleHistoryItem";
import HistorySubHeader from "./Components/HistorySubHeader";
import AllHistoryList from "./Components/AllHistoryList";
import { SingleTemplate } from "@/app/types/AppType";

export type SingleTemplateExtended = SingleTemplate & {
  isSelected: boolean;
};

//Interface of the History conte
interface AllHistoryPageInterface {
  selectedItemsObject: {
    selectedItems: SingleTemplateExtended[];
    setSelectedItems: React.Dispatch<
      React.SetStateAction<SingleTemplateExtended[]>
    >;
  };
}

//
const AllHistoryState = {
  selectedItemsObject: {
    selectedItems: [],
    setSelectedItems: () => {},
  },
};

//Create the context
const AllHistoryPageContext =
  createContext<AllHistoryPageInterface>(AllHistoryState);

export const useAllHistoryContext = () => {
  return useContext(AllHistoryPageContext);
};
//

function History() {
  const {
    isDarkModeObject: { isDarkMode },
    allTemplatesForDropDownObject: { templatesForDropDown },
  } = useAppContext();

  const [selectedItems, setSelectedItems] = useState<SingleTemplateExtended[]>(
    templatesForDropDown.filter((singleItem) => singleItem.isSelected)
  );

  //
  return (
    <div
      className={` flex-1 h-screen flex flex-col overflow-y-auto  ${
        !isDarkMode ? "bg-slate-50" : "bg-slate-700 text-white"
      }`}
    >
      <AllHistoryPageContext.Provider
        value={{
          selectedItemsObject: { selectedItems, setSelectedItems },
        }}
      >
        <MainHeader />
        <HistorySubHeader />
        <AllHistoryList />
      </AllHistoryPageContext.Provider>
    </div>
  );
}

export default History;
