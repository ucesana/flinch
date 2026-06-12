import { useRef, useState, useEffect } from "react";

interface Props extends React.ComponentProps<"button"> {
  title: string;
  icon: React.ReactNode;
  align?: "left" | "right";
  className?: string;
  children?: React.ReactNode;
}

export default function ButtonIcon({
  title,
  icon,
  align = "left",
  className = "",
  children: items,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutsideClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  function toggleDropdown() {
    setOpen((o) => !o);
  }

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center h-10 ${className}`}
    >
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center hover:rounded-2xl hover:bg-gray-700 h-full w-10 flinch-focus"
        title={title}
        aria-description={title}
        onClick={toggleDropdown}
        {...props}
      >
        {icon}
      </button>
      {open && items && (
        <div
          className={`absolute top-full ${align === "left" ? "left-0" : "right-0"} mt-1 bg-gray-800 not-empty:border border-gray-700 rounded-lg z-50 whitespace-nowrap p-2`}
        >
          {items}
        </div>
      )}
    </div>
  );
}
