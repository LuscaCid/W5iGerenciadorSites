import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function BackToTop() 
{
  const [ showButton, setShowButton ] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
      <button
        onClick={scrollToTop}
        className={`${showButton ?  "opacity-100" : "opacity-0 pointer-events-none"} fixed bottom-6 right-6 bg-blue-600 text-white px-2 py-2 md:px-4 md:py-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-200 z-20`}
      >
        <ArrowUp size={20}/> 
      </button>
  );
}
