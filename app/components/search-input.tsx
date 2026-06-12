import { Search, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const INITIAL_INDEX = -1;

type Cell = { id: string; title: string };

const initialResults: Cell[] = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  {
    id: "3",
    title:
      "Very Long Item here to test the container stretching beyond its minimum width.",
  },

  { id: "4", title: "Item 4" },
];

function fetchResults(terms: string): Promise<Cell[]> {
  console.log("calling with terms", terms);
  return new Promise((resolve: (results: Cell[]) => void) =>
    setTimeout(() => resolve(terms.length > 0 ? initialResults : []), 2000),
  );
}

export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Cell | null>(null);
  const [value, setValue] = useState<string | "">("");
  const [results, setResults] = useState<Cell[]>([]);

  const debouncedSearch = useDebouncedCallback(async (terms: string) => {
    const response = await fetchResults(terms);
    setResults(response);
  }, 300);

  function handleKeyDown(e: React.KeyboardEvent) {
    let selectedIndex: number =
      results.findIndex((item) => item.title === value) ?? INITIAL_INDEX;

    switch (e.key) {
      case "ArrowDown":
        selectedIndex = cycleIndex(selectedIndex + 1, results.length);
        break;
      case "ArrowUp":
        selectedIndex = cycleIndex(selectedIndex - 1, results.length);
        break;
      case "Enter":
        break;
      case "Escape":
        selectedIndex = INITIAL_INDEX;
        break;
    }

    if (selectedIndex > INITIAL_INDEX) {
      const selected = results[selectedIndex];
      updateSelected(selected);
    } else {
      setSelected(null);
    }
  }

  function updateSelected(selected: Cell): void {
    setSelected(selected);
    setValue(selected?.title ?? "");
  }

  function updateSelectedByValue(value: string): void {
    const selected = results.find((item) => item.title === value);
    if (selected) {
      setSelected(selected);
    }
  }

  function clearSelected(): void {
    setValue("");
    setSelected(null);
  }

  function cycleIndex(index: number, length: number): number {
    return index < 0 ? length + index : index % length;
  }

  return (
    <div className="relative flex h-full bg-none flinch-has-focus group/search">
      <input
        ref={inputRef}
        type="search"
        name="search"
        className="bg-gray-900 border-3 border-gray-700 hover:border-gray-600 focus:outline-none rounded-l-lg h-full pl-2 pr-2"
        placeholder="Search"
        aria-description="Search box."
        value={value}
        onChange={async (e) => {
          setValue(e.target.value);
          updateSelectedByValue(e.target.value);
          debouncedSearch(e.target.value);
        }}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button
          className="absolute right-12 top-1/2 -translate-y-1/2 focus:outline-none"
          onMouseDown={(e) => {
            e.preventDefault();
            clearSelected();
          }}
        >
          <X size={14} />
        </button>
      )}
      <div
        className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-l-none rounded-r-lg h-full w-10 cursor-pointer"
        aria-description="Search button."
      >
        <Search />
      </div>

      <div className="absolute top-full left-0 min-w-full hidden group-focus-within/search:block">
        <div
          ref={containerRef}
          className="absolute top-full left-0 min-w-full mt-1 bg-gray-800 not-empty:border border-gray-700 rounded-lg z-50 whitespace-nowrap"
        >
          {results.map((item) => (
            <div
              key={item.id}
              className={`p-2 cursor-pointer hover:bg-gray-700 ${item.id === selected?.id ? "bg-gray-700" : ""}`}
              onMouseDown={() => updateSelected(item)}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
