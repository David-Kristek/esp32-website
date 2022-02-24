module.exports = {
  mode: "jit",

  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        verydarkgreen: "#192120", 
        darkgreen: "#3A6949",
        lightgreen: "#7EAD75",
        verylightgreen: "#E5F2E2",
      },
    },
  },
  plugins: [],
};
