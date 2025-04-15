import Close from "../assets/images/close.svg";
import Warning from "../assets/images/alert.svg";
import {Button} from "./button";
import React from "react";

type Props = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleResetCanvas: () => void;
}

export const Modal = ({setIsModalOpen, handleResetCanvas}: Props) => {
    return (
        <div className={"absolute left-0 top-0 w-screen h-screen"}>
            <div className={"absolute left-0 top-0 w-screen h-screen bg-black opacity-40 z-999"}></div>
            <div
                className={"w-1/2 py-16 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg flex flex-col items-center justify-center z-1000"}>
                <button className={"absolute top-6 right-6"} onClick={() => setIsModalOpen(false)}>
                    <img src={Close} alt={"Close modal"} className={"w-4 h-4"}/>
                </button>
                <img src={Warning} alt={"Warning"} className={"w-1/4"}/>
                <div className={"w-3/4 text-center"}>
                    <h2 className={"font-bold text-32 text-black"}>Warning</h2>
                    <p className={"font-medium text-18 text-center text-black75"}>You're about to reset your
                        whole progress.
                        Are you sure you want to do it?</p>
                    <div className={"flex gap-x-4 justify-center mt-8"}>
                        <button className={"font-medium text-18"} onClick={() => setIsModalOpen(false)}>Cancel
                        </button>
                        <Button text={"Reset"} onClick={() => {
                            handleResetCanvas()
                            setIsModalOpen(false)
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}