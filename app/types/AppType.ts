import { Dispatch, ReactNode } from "react";
import { SingleTemplateExtended } from "../dashboard/Hisotry/AllHistory";
import { IconType } from "react-icons";

export type SingleFilteringItem = {
  id: number;
  name: string;
  icon: React.ReactNode;
  isSelected: boolean;
  templates: string[];
};

export type MenuItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isSelected?: boolean;
};

export type StatsDropDownItem = {
  id: number;
  title: string;
  value: string;
  icon: ReactNode;
  isSelected: boolean;
};

export type DaysDropDownItem = {
  id: number;
  title: string;
  icon: ReactNode;
  isSelected: boolean;
};

export type SingleTemplate = {
  id: number;
  title: string;
  icon: ReactNode;
  description: string;
  totalWordsCount: number;
  isFavorite: boolean;
  shortSubTitle: string;
  isForPro: boolean;
};

export type HistoryData = {
  id: string;
  clerkUserId: string;
  template: string;
  title: string;
  createdAt: string;
  totalWords: number;
  content: string;
};

export type User = {
  isPro: boolean;
  cumulativeWords: number;
  userId: string;
  lastName: string | null;
  firstName: string | null;
};

// Define an interface for the context type.
export type AppType = {
  fakeUser: User;
  setFakeUser: React.Dispatch<React.SetStateAction<User>>;
  contentGeneratedObject: {
    contentGenerated: string;
    setContentGenerated: React.Dispatch<React.SetStateAction<string>>;
  };

  selectedTemplatesObject: {
    selectedTemplate: SingleTemplate | null;
    setSelectedTemplate: React.Dispatch<
      React.SetStateAction<SingleTemplate | null>
    >;
  };
  openContentGeneratorFormObject: {
    openContentGeneratorForm: boolean;
    setOpenContentGeneratorForm: React.Dispatch<React.SetStateAction<boolean>>;
  };
  templateFilteringItemsObject: {
    templatesFilteringItems: SingleFilteringItem[];
    setTemplatesFilteringItems: React.Dispatch<
      React.SetStateAction<SingleFilteringItem[]>
    >;
  };
  allHistoryDataObject: {
    allHistoryData: HistoryData[];
    setAllHistoryData: React.Dispatch<React.SetStateAction<HistoryData[]>>;
  };
  allTemplatesForDropDownObject: {
    templatesForDropDown: SingleTemplateExtended[];
    setTemplatesForDropDown: React.Dispatch<
      React.SetStateAction<SingleTemplateExtended[]>
    >;
  };

  allTemplatesObject: {
    allTemplates: SingleTemplate[];
    setAllTemplates: Dispatch<React.SetStateAction<SingleTemplate[]>>;
  };

  statsDropDownItemsObject: {
    statsData: StatsDropDownItem[];
    setStatsData: Dispatch<React.SetStateAction<StatsDropDownItem[]>>;
  };
  mainMenuItemsObject: {
    mainMenuItems: MenuItem[];
    setMainMenuItems: Dispatch<React.SetStateAction<MenuItem[]>>;
  };

  secondMenuItemsObject: {
    secondMenuItems: MenuItem[];
    setSecondMenuItems: Dispatch<React.SetStateAction<MenuItem[]>>;
  };

  isDarkModeObject: {
    isDarkMode: boolean;
    setIsDarkMode: Dispatch<React.SetStateAction<boolean>>;
  };

  isSideBarHiddenObject: {
    isSideBarHidden: boolean;
    setIsSideBarHidden: Dispatch<React.SetStateAction<boolean>>;
  };

  windowWidthObject: {
    windowWidth: number;
    setWindowWidth: Dispatch<React.SetStateAction<number>>;
  };

  stretchSideBarObject: {
    stretchSideBar: boolean;
    setStretchSideBar: Dispatch<React.SetStateAction<boolean>>;
  };

  daysDropDownObject: {
    daysDropDown: DaysDropDownItem[];
    setDaysDropDown: Dispatch<React.SetStateAction<DaysDropDownItem[]>>;
  };

  openConfirmationWindowObject: {
    openConfirmationWindow: boolean;
    setOpenConfirmationWindow: Dispatch<React.SetStateAction<boolean>>;
  };

  selectedHistoryEntryObject: {
    selectedHistoryEntry: HistoryData | null;
    setSelectedHistoryEntry: Dispatch<React.SetStateAction<HistoryData | null>>;
  };

  openPaymentWindowObject: {
    openPaymentWindow: boolean;
    setOpenPaymentWindow: Dispatch<React.SetStateAction<boolean>>;
  };
};
