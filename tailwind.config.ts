import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#20242c",
        muted: "#68717d",
        line: "#dfe4ea",
        paper: "#fbfaf7",
        sage: "#6f8f72",
        moss: "#385940",
        coral: "#c86f5c",
        clay: "#9a6b55",
        sky: "#d9eaf3"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(32, 36, 44, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
