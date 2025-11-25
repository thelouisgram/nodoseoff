import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updateActive } from "../../store/stateSlice";

interface TabItem {
  name: string;
  logo: string;
}

interface TabsProps {
  item: TabItem;
  active: string;
  nav: boolean;
}

const Tabs: React.FC<TabsProps> = ({ item, active, nav }) => {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => dispatch(updateActive(item.name))}
      className={`
        flex items-center lg:gap-3 cursor-pointer h-10 lg:px-3 w-10 lg:w-auto max-lg:justify-center
        transition-all font-Inter rounded-full
        ${item.name === active ? "ring-1 ring-white lg:ring-0" : ""}
      `}
    >
      <Image
        src={item.logo}
        width={512}
        height={512}
        className="w-6 h-6"
        alt={item.name}
        quality={100}
      />

      <span
        className={`
           items-center text-[16px] rounded-md py-1 px-3
          ${nav ? "hidden lg:flex" : "hidden"}
          ${
            item.name === active
              ? "bg-white text-[#062863] font-medium"
              : "text-white"
          }
        `}
      >
        {item.name}
      </span>
    </button>
  );
};

export default Tabs;
