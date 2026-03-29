import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Pretendard",
          "Nunito",
          "ui-sans-serif",
          "system-ui",
          "sans-serif"
        ]
      },
      colors: {
        ivory: "#F7F5F1",
        ink: "#1E2430",
        mist: "#EAEFF5",
        blueSoft: "#6FA6DA",
        blueDeep: "#4278B8",
        roseSoft: "#EADDD8"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(31, 41, 55, 0.08)",
        card: "0 18px 40px rgba(15, 23, 42, 0.08)"
      },
      borderRadius: {
        xl2: "1.4rem",
        xl3: "1.8rem"
      }
    }
  },
  plugins: []
};

export default config;
