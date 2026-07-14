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
  return new Promise((resolve) =>
    setTimeout(() => resolve(terms.length > 0 ? initialResults : []), 2000),
  );
}

export default function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selected, setSelected] = useState<Cell | null>(null);
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Cell[]>([]);

  const debouncedSearch = useDebouncedCallback(async (terms: string) => {
    const response = await fetchResults(terms);
    setResults(response);
  }, 300);

  function handleKeyDown(e: React.KeyboardEvent) {
    let selectedIndex =
      results.findIndex((item) => item.title === value) ?? INITIAL_INDEX;

    switch (e.key) {
      case "ArrowDown":
        selectedIndex = cycleIndex(selectedIndex + 1, results.length);
        break;
      case "ArrowUp":
        selectedIndex = cycleIndex(selectedIndex - 1, results.length);
        break;
      case "Escape":
        selectedIndex = INITIAL_INDEX;
        break;
    }

    if (selectedIndex > INITIAL_INDEX) {
      updateSelected(results[selectedIndex]);
    } else {
      setSelected(null);
    }
  }

  function updateSelected(selected: Cell) {
    setSelected(selected);
    setValue(selected.title);
  }

  function updateSelectedByValue(value: string) {
    const selected = results.find((item) => item.title === value);
    setSelected(selected ?? null);
  }

  function clearSelected() {
    setValue("");
    setSelected(null);
    setResults([]);
  }

  function cycleIndex(index: number, length: number) {
    return index < 0 ? length + index : index % length;
  }

  return (
    <div className="flex h-full group/search">
      <div className="relative flinch-has-focus">
        <input
          ref={inputRef}
          type="search"
          name="search"
          className="w-64 h-full rounded-l-lg border-3 border-gray-700 bg-gray-900 pl-2 pr-8 hover:border-gray-600 focus:outline-none"
          placeholder="Search"
          aria-description="Search box."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            updateSelectedByValue(e.target.value);
            debouncedSearch(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />

        {value && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 focus:outline-none"
            onMouseDown={(e) => {
              e.preventDefault();
              clearSelected();
            }}
          >
            <X size={14} />
          </button>
        )}

        <div className="absolute w-64 left-0 top-full mt-1 hidden z-50 group-focus-within/search:block">
          {results?.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-800">
              {results.map((item) => (
                <div
                  key={item.id}
                  className={`cursor-pointer p-2 hover:bg-gray-700 ${
                    item.id === selected?.id ? "bg-gray-700" : ""
                  }`}
                  onMouseDown={() => updateSelected(item)}
                >
                  <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        className="flex w-10 items-center justify-center rounded-r-lg bg-gray-700 hover:bg-gray-600"
        aria-description="Search button."
      >
        <Search />
      </button>
    </div>
  );
}
