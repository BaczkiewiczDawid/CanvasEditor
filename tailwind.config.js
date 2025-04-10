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
                "black100": "353535",
                "black75": "#676767",
                "black50": "#989898",
                "black25": "#CDCDCD",
                "white": "#FFFFFF",
                "white98": "#FAFAFA",
                "white97": "#F7F7F8",
            },
            fontSize: {
                "18": "18px",
                "32": "32px",
            }
        },
    },
    plugins: [],
}