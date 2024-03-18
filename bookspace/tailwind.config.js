import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";
import * as colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo[600],
        muted: colors.gray[500],
      },
    },
  },
  plugins: [forms, aspectRatio],
};
