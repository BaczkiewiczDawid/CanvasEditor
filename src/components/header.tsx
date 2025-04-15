import Logo from "../assets/images/logo.svg";
import Reset from "../assets/images/reset.svg";
import React from "react";

type Props = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header = ({setIsModalOpen}: Props) => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <img src={Logo} alt={"Canvas Editor"}/>
                <h1 className="font-bold text-black100 text-32 ml-4">CanvasEditor</h1>
            </div>
            <button className={"border-b-2 border-redPrimary flex items-center justify-between gap-x-2"}
                    onClick={() => {
                        setIsModalOpen(true)
                    }}>
                <p className="text-redPrimary text-sm">Reset</p>
                <img src={Reset} alt="Reset" className={"w-6"}/>
            </button>
        </div>
    )
}
