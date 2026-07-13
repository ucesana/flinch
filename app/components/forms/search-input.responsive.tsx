import { Search } from "lucide-react";
import ButtonIcon from "../buttons/button-icon";
import SearchInput from "./search-input";
import { useEffect, useRef, useState } from "react";

export default function ResponsiveSearchInput() {
  const [searchInputFloat, setSearchInputFloat] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleToggleSearchInput() {
    setSearchInputFloat((o) => !o);
  }

  useEffect(() => {
    if (!searchInputFloat) {
      return;
    }

    function handleOutsideClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setSearchInputFloat(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [searchInputFloat]);

  return (
    <div className="relative flex justify-end md:justify-center items-center h-full">
      <div className="items-center h-full hidden sm:inline">
        <SearchInput />
      </div>
      <div ref={containerRef} className="h-full">
        <ButtonIcon
          title={"Search"}
          icon={<Search />}
          className="inline sm:hidden"
          onClick={handleToggleSearchInput}
        ></ButtonIcon>
        {searchInputFloat && (
          <div className="sm:hidden absolute top-full h-10 left-0 min-w-full">
            <SearchInput />
          </div>
        )}
      </div>
    </div>
  );
}
