"use client";

import useRoutes from "@/app/hooks/useRoutes";
import { useState } from "react";
import DesktopItem from "./DeskstopItem";
import { User } from "@prisma/client";
import Avator from "../Avator";
import SettingsModal from "./SettingModal";

interface DeskstopSidebarProps {
    currentUser: User;
}

const DeskstopSidebar: React.FC<DeskstopSidebarProps> = ({ currentUser }) => {
    const route = useRoutes();
    const [isOpen, setIsOpen] = useState(false);
    console.log(currentUser);
    
  return (
    <>
    <SettingsModal currentUser={currentUser} isOpen={isOpen} onClose={() => setIsOpen(false)}/>
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-26 xl:px-2 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
        <nav className="mt-4 flex flex-col justify-between">
            <ul role="list" className="flex flex-col items-center space-y-1">
                {route.map((item, index) => (
                    <DesktopItem
                        key={index}
                        label={item.label}
                        href={item.href}
                        icon={item.icon}
                        active={item.active}
                        onClick={item.onClick}
                    />
                ))
                }
            </ul>
        </nav>
        <nav className="mt-4 flex flex-col justify-between items-center">
                <div onClick={() => setIsOpen(true)}
                className="cursor-pointer hover:opcity-75 transition"
                >
                    <Avator user={currentUser} />
                </div>
        </nav>
    </div>
    </>
  )
}

export default DeskstopSidebar