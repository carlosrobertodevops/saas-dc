import { useAppContext } from '@/src/app/AppContext';
import { useEffect, useLayoutEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { HistoryData } from '../types/AppType';
export default function ConfirmationWindow() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    openConfirmationWindowObject: {
      openConfirmationWindow,
      setOpenConfirmationWindow,
    },
    isDarkModeObject: { isDarkMode },
    allHistoryDataObject: { allHistoryData, setAllHistoryData },
    selectedHistoryEntryObject: {
      selectedHistoryEntry,
      setSelectedHistoryEntry,
    },
  } = useAppContext();

  const header = 'Delete History Entry';
  const message =
    'Are you sure you want to delete this history entry? This action cannot be undone.';

  const darkModeClass = `${
    isDarkMode ? 'bg-slate-800 text-white' : 'bg-white'
  }`;

  const darkModeMessageText = `${
    isDarkMode ? ' text-slate-400' : 'text-slate-600'
  }`;

  async function deleteHistoryEntry() {
    try {
      // Update the isLoading variable
      setIsLoading(true);

      // Make a DELETE request to the API
      const deleteResponse = await fetch(
        `/api/histories?id=${selectedHistoryEntry?.id}`,
        {
          method: 'DELETE',
        },
      );

      // Check if the delete request was successful
      if (deleteResponse.ok) {
        // Update the all history data array
        setAllHistoryData((prevData) => {
          return prevData.filter(
            (singleData) => singleData.id !== selectedHistoryEntry?.id,
          );
        });

        // Show a success toast notification
        toast.success('The history entry has been deleted successfully!');

        // Close the confirmation window
        setOpenConfirmationWindow(false);
      } else {
        // Handle errors if the deletion failed
        const errorData = await deleteResponse.json();
        toast.error(`Error: ${errorData.error}`);
      }
    } catch (error) {
      // Handle any unexpected errors
      toast.error('Something went wrong...');
      console.error('Error deleting history entry:', error);
    } finally {
      // Set loading to false after the operation completes
      setIsLoading(false);
    }
  }

  return (
    <div
      className={` 
        w-[38%] ${darkModeClass} ${
        openConfirmationWindow ? 'block' : 'hidden'
      } max-sm:w-[91%] p-6 fixed  shadow-md  
    z-[90] rounded-lg flex items-center top-[30%] left-1/2 -translate-x-1/2`}
    >
      <div className=" rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-5">{header}</h2>
        <p className={`${darkModeMessageText} mb-4 text-[13px]  `}>{message}</p>

        <div className="flex w-full justify-end gap-2 mt-11 text-[13px] ">
          <button
            onClick={() => {
              setOpenConfirmationWindow(false);
              setSelectedHistoryEntry(null);
            }}
            className="px-4  py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              deleteHistoryEntry();
            }}
            className="px-4 py-2 bg-purple-600 rounded-lg text-white "
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
