import { Search } from "lucide-react";
import ButtonIcon from "./button-icon";
import SearchInput from "./search-input";
import { useEffect, useRef, useState } from "react";

export default function ResponsiveSearchInput() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  function handleToggleSearchInput() {
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleOutsideClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

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
        {open && (
          <div className="absolute top-full h-10 left-0 min-w-full">
            <SearchInput />
          </div>
        )}
      </div>
    </div>
  );
}
