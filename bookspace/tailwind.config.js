import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [{
    pattern: /col-start-+/,
    variants: ["sm"],
  }],
  plugins: [forms, aspectRatio],
};
