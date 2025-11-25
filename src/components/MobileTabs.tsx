import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { updateActive } from "../../store/stateSlice";


interface TabItem {
  name: string;
  logo: string;
  inactiveLogo: string;
}

interface TabsProps {
  item: TabItem;
  active: string;
}

const MobileTabs:React.FC<TabsProps> = ({item, active}) => {
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => dispatch(updateActive(item.name))}
      className="flex items-center flex-col cursor-pointer w-full h-full justify-center relative font-Inter "
    >
      <Image
        src={active === item.name ? item.logo : item.inactiveLogo}
        width={1000}
        height={1000}
        className="w-[24px] h-[24px] transition"
        alt={item.name}
        quality={100}
      />
      <h2
        className={`${
          active === item.name ? "font-semibold" : "font-normal text-[#a7a7a7]"
        } text-[12px] text-[#062863]`}
      >
        {item.name}
      </h2>
    </div>
  );
};

export default MobileTabs;
