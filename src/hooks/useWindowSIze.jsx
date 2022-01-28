import React from "react";
const useWindowSize = () => {
  const isClient = typeof window === "object";
  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }
  const [windowSize, setWindowSize] = React.useState(getSize);
  React.useEffect(() => {
    if (!isClient) {
      return () => null;
    }
    function handleResize() {
      setWindowSize(getSize());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return [windowSize];
};

export default useWindowSize;
