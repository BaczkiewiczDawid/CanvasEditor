/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
            },
            colors: {
                "primary": "#7209B7",
                "primary50": "#B984DB",
                "primary25": "#E4BAFF",
                "black100": "353535",
                "black75": "#676767",
                "black50": "#989898",
                "black25": "#CDCDCD",
                "white": "#FFFFFF",
                "white98": "#FAFAFA",
                "white97": "#F7F7F8",
                "buttonHover": "#550788",
                "redPrimary": "#CB0000",
            },
            fontSize: {
                "18": "18px",
                "32": "32px",
            }
        },
    },
    plugins: [],
}