/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        spartan: ["League Spartan", "sans-serif"],
        karla: ["Karla", "sans-serif"],
        Inter: ["Inter", "sans-serif"],
        Poppins: ["Open Sans", "sans-serif"],
      },
      colors: {
        white: "hsl(0, 0%, 100%)",
        dark: "hsl(240, 8%, 12%)",
        navyBlue: "hsl(218,89%,21%)",
        darkBlue: "hsl(216,89%,63%)",
        darkGreen: "hsl(145, 49%, 51%)",
        darkPink: "hsl(330, 70%, 58%)",
        darkPurple: "hsl(270,89%,68%)",
        blackBlue: "hsl(210, 20%, 18%)",
        grey: "hsla(0, 0%, 0%, 0.7)",
        lightBlue: "hsl(214,78%,98%)",
        lightPink: "hsl(327,73%,97%)",
        lightPurple: "hsl(276,56%,96%)",
        lightGreen: "hsl(140,55%,91%)",
      },
      height: {},
    },
    screens: {
      xs: "391px",
      ss: "620px",
      sm: "768px",
      ip: "1000px",
      md: "1200px",
      lg: "1440px",
      xl: "1700px",
    },
  },
  plugins: [],
};
