"use client";

import { useAppContext } from "@/src/app/AppContext.tsx";
import StatsDropDown from "@/src/app/DropDowns/StatsDropDown.tsx";
import ContentGeneratorForm from "./ContentGenerator/ContentGenerator";
import ContentGenerator from "./ContentGenerator/ContentGenerator";
import AllHistory from "./Hisotry/AllHistory";
import MainArea from "./MainArea/page";
import SideBar from "./SideBar/SideBar";
import FavoriteTemplates from "./FavoriteTemplates/FavoriteTemplates";
import AllTemplatesPage from "./Templates/AllTemplatesPage.tsx";
import { Toaster } from "react-hot-toast";
import ConfirmationWindow from "@/src/app/Windows/DeleteConfirmationWindow.tsx";
import SubscriptionPlans from "./subscription/SubscriptionPage";
import PaymentWindow from "@/src/app/Windows/PayementWindow.tsx";

export default function Page() {
  const {
    mainMenuItemsObject: { mainMenuItems },
  } = useAppContext();

  const componentMap: Record<number, React.ReactNode> = {
    0: <MainArea />,
    1: <AllHistory />,
    2: <AllTemplatesPage />,
    3: <FavoriteTemplates />,
    4: <SubscriptionPlans />,
  };

  const findComponentKey = mainMenuItems.findIndex(
    (menuItem) => menuItem.isSelected
  );

  const selectedComponent = componentMap[findComponentKey];

  return (
    <div className="poppins flex">
      <PaymentWindow />
      <Toaster />
      <ConfirmationWindow />
      <SoftLayer />
      <SideBar />
      <ContentGeneratorForm />
      {selectedComponent}
    </div>
  );
}

function SoftLayer() {
  const {
    openConfirmationWindowObject: { openConfirmationWindow },
    openPaymentWindowObject: { openPaymentWindow },
  } = useAppContext();
  return (
    openConfirmationWindow ||
    (openPaymentWindow && (
      <div className="w-full fixed h-full z-50 bg-black opacity-60"></div>
    ))
  );
}
