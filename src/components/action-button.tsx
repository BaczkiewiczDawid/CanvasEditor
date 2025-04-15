import React from "react";

type Props = {
    onClick: () => void;
    handleFileChange?: (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "background") => void
    imageInputRef?: React.RefObject<HTMLInputElement | null>
    image?: any
    name: string
}

export const ActionButton = ({onClick, handleFileChange, imageInputRef, image, name}: Props) => {
    return (
        <div>
            <button
                className="bg-white97 p-4 rounded shadow-sm flex flex-col items-center justify-center"
                onClick={onClick}
            >
                <div className="flex items-center justify-center mb-2">
                    <img className={"w-32 h-32"} src={image} alt={name}/>
                </div>
                <p className="text-18 text-black100 font-medium">{name}</p>
            </button>
            {handleFileChange && (
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "image")}
                    ref={imageInputRef}
                    className="hidden"/>
            )}
        </div>
    )
}