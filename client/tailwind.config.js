/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"DM Sans"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        purple: {
          light: "#EEEDFE",
          mid: "#7F77DD",
          dark: "#3C3489",
        },
        red: {
          light: "#FCEBEB",
          mid: "#E24B4A",
          dark: "#A32D2D",
        },
        amber: {
          light: "#FAEEDA",
          mid: "#EF9F27",
          dark: "#854F0B",
        },
        green: {
          light: "#EAF3DE",
          mid: "#639922",
          dark: "#3B6D11",
        },
        blue: {
          light: "#E6F1FB",
          mid: "#378ADD",
          dark: "#185FA5",
        },
        bg: {
          primary: "#ffffff",
          secondary: "#F5F4FB",
        },
        border: "rgba(0,0,0,0.10)",
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        card:
          "0 1px 2px rgba(60, 52, 137, 0.04), 0 8px 28px rgba(60, 52, 137, 0.07)",
      },
    },
  },
  plugins: [],
};
