import { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToHashElement = () => {
  const location = useLocation();

  const hashElement = useMemo(() => {
    const hash = location.hash;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const removeHashCharacter = (str: string) => {
      const result = str.slice(1);
      return result;
    };

    if (hash) {
      const element = document.getElementById(removeHashCharacter(hash));
      return element;
    } else {
      return null;
    }
  }, [location]);

  useEffect(() => {
    if (hashElement) {
      hashElement.scrollIntoView({
        behavior: "smooth",
        // block: "end",
        inline: "nearest",
      });
    }
  }, [hashElement]);

  return null;
};

export default ScrollToHashElement;
