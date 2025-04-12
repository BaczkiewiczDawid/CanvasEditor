import React from "react";

type Props = {
    text: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

export const Button = ({text, onClick, disabled, className}: Props) => {
    return (
        <button
            className={`bg-primary hover:bg-buttonHover focus:border-primary50 focus:border-2 disabled:bg-black50 text-white font-bold py-2 px-4 rounded ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {text}
        </button>
    )
}