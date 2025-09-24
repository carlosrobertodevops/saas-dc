import { useEffect } from "react";

function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  isOpen: boolean
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback(); // Trigger callback when clicked outside
      }
    }

    if (isOpen) {
      // Use a slight delay to ensure dropdown opens before adding the event listener
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId); // Clear timeout if component unmounts
        document.removeEventListener("mousedown", handleClickOutside);
      };
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [ref, callback, isOpen]);
}

export default useClickOutside;
