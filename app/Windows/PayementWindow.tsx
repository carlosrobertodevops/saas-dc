import { useAppContext } from "../AppContext";
import { FaCheck } from "react-icons/fa";

export default function PaymentWindow() {
  const {
    isDarkModeObject: { isDarkMode },
    openPaymentWindowObject: { openPaymentWindow, setOpenPaymentWindow },
    mainMenuItemsObject: { setMainMenuItems },
  } = useAppContext();
  const darkModeClass = `${
    isDarkMode ? "bg-slate-800 text-white" : "bg-white"
  }`;
  return (
    <div
      className={` 
      w-[38%] max-sm:w-[91%] p-6 fixed  shadow-md  ${darkModeClass} ${
        openPaymentWindow ? "block" : "hidden"
      }
  z-[90] rounded-lg flex items-center top-[30%] left-1/2 -translate-x-1/2`}
    >
      <div className=" rounded-lg p-6 w-full  ">
        <div className=" flex items-center justify-center  ">
          <div className="w-11 h-11 bg-purple-200 rounded-full flex items-center justify-center">
            <FaCheck className="text-[17px] text-purple-600" />
          </div>
        </div>
        <p
          className={`  mb-4 text-[13px] w-full text-center mt-7 text-lg font-semibold  `}
        >
          Payment Successful
        </p>

        <div className="flex w-full items-center justify-center  gap-2 mt-11 text-[13px] ">
          <button
            onClick={() => {
              setMainMenuItems((prevMenu) =>
                prevMenu.map((menu) => {
                  if (menu.label === "Dashboard") {
                    return { ...menu, isSelected: true };
                  }

                  return { ...menu, isSelected: false };
                })
              );

              setOpenPaymentWindow(false);
            }}
            className="px-14 py-2 bg-purple-600 rounded-lg text-white "
          >
            Go Back To Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
