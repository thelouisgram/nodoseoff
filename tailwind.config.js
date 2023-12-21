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
        montserrant: ["Montserrat", "sans-serif"],
        Inter: ['Inter', 'sans-serif'],
      },
      colors: {
        white: "hsl(0, 0%, 100%)", // White color
        dark: "hsl(240, 8%, 12%)", // Dark color
        grey: "hsl(220, 8%, 95%)", // Grey color
        darkGrey: "hsl(240, 3%, 32%)", // Dark Grey color
        red: "hsl(355, 73%, 56%)", // Red color
        navyBlue: "hsl(218,89%,21%)",
        darkBlue: "hsl(217, 100%, 43%)",
        darkGreen: "hsl(145, 49%, 51%)",
        darkPink: "hsl(330, 70%, 58%)",
        blackBlue: "hsl(210, 20%, 18%)",
        blackII: "hsla(0, 0%, 0%, 0.7)",
        lightBlue: "hsl(196, 100%, 95%)",
        // You can add more custom colors if needed
      },
      height: {},
    },
    screens: {
      xs: "375px",
      ss: "620px",
      sm: "768px",
      md: "1200px",
      lg: "1440px",
      xl: "1700px",
    },
  },
  plugins: [],
};
