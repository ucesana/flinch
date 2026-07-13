import { SquareArrowLeft, SquareArrowRight } from "lucide-react";
import { useState } from "react";
import ButtonIcon from "../buttons/button-icon";

type Props = {
  title: string;
  align?: "left" | "right";
  children: React.ReactNode;
};

export default function SideBar({ title, align = "left", children }: Props) {
  const [minimised, setMinimised] = useState(false);

  function handleMinimise() {
    setMinimised(true);
  }

  function handleMaximise() {
    setMinimised(false);
  }

  return (
    <div
      className={`${minimised ? "w-14" : "w-14 sm:w-64"} p-2 text-white bg-gray-800 shadow-gray-950 shadow-lg h-full overflow-y-auto`}
    >
      {minimised ? (
        align === "left" ? (
          <div className="hidden sm:flex">
            <div className="grow"></div>
            <div className="flex-1" onClick={handleMaximise}>
              <ButtonIcon title="Expand" icon={<SquareArrowRight />} />
            </div>
          </div>
        ) : (
          <div className="hidden sm:flex">
            <div className="flex-1" onClick={handleMaximise}>
              <ButtonIcon title="Expand" icon={<SquareArrowRight />} />
            </div>
            <div className="grow"></div>
          </div>
        )
      ) : align === "left" ? (
        <div className="hidden sm:flex items-center">
          <p className="">{title}</p>
          <div className="grow"></div>
          <div onClick={handleMinimise}>
            <ButtonIcon title="Collapse" icon={<SquareArrowLeft />} />
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex h-10">
          <div onClick={handleMinimise}>
            <ButtonIcon title="Collapse" icon={<SquareArrowLeft />} />
          </div>
          <div className="grow"></div>
          <div className="flex justify-center">
            <p className="">{title}</p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
