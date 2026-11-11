/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        display: ["var(--font-manrope)", "system-ui", "sans-serif"],
        // Legacy aliases → Manrope so older class names stay consistent
        spartan: ["var(--font-manrope)", "system-ui", "sans-serif"],
        karla: ["var(--font-manrope)", "system-ui", "sans-serif"],
        Inter: ["var(--font-manrope)", "system-ui", "sans-serif"],
        Poppins: ["var(--font-manrope)", "system-ui", "sans-serif"],
        jakarta: ["var(--font-manrope)", "system-ui", "sans-serif"],
      },
      colors: {
        white: "hsl(0, 0%, 100%)",
        dark: "hsl(240, 8%, 12%)",
        // Logo navy from /public/assets/logo/logo-blue.png
        navyBlue: "#002860",
        darkBlue: "#1A4A8A",
        darkGreen: "hsl(145, 49%, 51%)",
        darkPink: "hsl(330, 70%, 58%)",
        darkPurple: "hsl(270,89%,68%)",
        blackBlue: "hsl(210, 20%, 18%)",
        grey: "hsla(0, 0%, 0%, 0.7)",
        lightBlue: "#E8EEF5",
        lightPink: "hsl(327,73%,97%)",
        lightPurple: "hsl(276,56%,96%)",
        lightGreen: "hsl(140,55%,91%)",
        soft: {
          canvas: "#F4F5F7",
          card: "#FFFFFF",
          ink: "#0B1A2E",
          muted: "#6B7280",
          line: "rgba(0,40,96,0.08)",
          // Exact logo primary (#002860)
          primary: "#002860",
          "primary-soft": "#E8EEF5",
          "primary-muted": "#3A5F8C",
          lavender: "#EEE8FF",
          "lavender-ink": "#5B4B8A",
          blue: "#E8EEF5",
          "blue-ink": "#002860",
          pink: "#FFE4EE",
          "pink-ink": "#8A3D5A",
          peach: "#F6E7D8",
          "peach-ink": "#7A5A3C",
          mint: "#E5F6EE",
          "mint-ink": "#2F6B4F",
        },
      },
      borderRadius: {
        "soft-sm": "12px",
        "soft-md": "16px",
        "soft-lg": "20px",
        "soft-xl": "24px",
        "soft-2xl": "32px",
      },
      boxShadow: {
        // Border-first elevation: hairline, short, low-opacity
        soft: "0 1px 2px rgba(11, 26, 46, 0.03), 0 3px 10px rgba(11, 26, 46, 0.03)",
        "soft-sm": "0 1px 2px rgba(11, 26, 46, 0.025)",
        "soft-md":
          "0 1px 2px rgba(11, 26, 46, 0.03), 0 4px 14px rgba(11, 26, 46, 0.035)",
        "soft-lg":
          "0 1px 3px rgba(11, 26, 46, 0.03), 0 8px 20px rgba(11, 26, 46, 0.045)",
        "soft-float":
          "0 1px 3px rgba(0, 40, 96, 0.06), 0 6px 16px rgba(0, 40, 96, 0.08)",
        "soft-inset": "inset 0 1px 0 rgba(255,255,255,0.8)",
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
      "2xl": "1920px",
    },
  },
  plugins: [],
};
