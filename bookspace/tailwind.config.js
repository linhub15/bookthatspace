import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  safelist: [{
    pattern: /col-start-+/,
    variants: ["sm"],
  }],
  plugins: [forms, aspectRatio],
};
