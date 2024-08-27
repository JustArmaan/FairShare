/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    extend: {
      dropShadow: {
        graph: "-4px 6px 4px rgb(0 0 0 / 0.5)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 100 },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
      borderRadius: {
        sm: "0.625rem",
        md: "0.75rem",
        lg: "1.25rem",
      },
      margin: {
        "sm-separator": "0.5rem",
        "semi-separator": "0.625rem",
        "md-separator": "0.75rem",
        "lg-separator": "1rem",
        "xl-separator": "1.25rem",
      },
    },
    colors: {
      "category-color-0": "#ff4d4d", //red/guava pink
      "category-color-1": "#ff8b4d", //orange
      "category-color-2": "#ffcb4d", //yellow/
      "category-color-3": "#bcc902", //lime
      "category-color-4": "#b6ff4d", //lime green
      "category-color-5": "#36b50e", //green
      "category-color-6": "#4dff61", //light green
      "category-color-7": "#4dffa1", //teal
      "category-color-8": "#4dffdf", //cyan
      "category-color-9": "#26ccd7", //light blue(4ddfff)
      "category-color-10": "#0052ba", //blue-saphire blue(4da1ff)
      "category-color-11": "#4d61ff", //indigo
      "category-color-12": "#774dff", //violet
      "category-color-13": "#b64dff", //purple
      "category-color-14": "#f54dff", //pink
      "category-color-15": "#ff4dca", //hot-pink
      "category-color-16": "#ff4d8b", //coral
      "primary-grey": "#E7E7E7",
      "accent-blue": "#4CAEF8",
      "accent-purple": "#9079FF",
      "accent-red": "#FF7969",
      "accent-yellow": "#F4C56A",
      "accent-green": "#00D59C",
      "accent-teal": "#42DCD3",
      "pure-white": "#FFFFFF",
      "font-grey": "#8D8D93",
      "font-grey-background-black": "#8D8D93",
      "light-grey": "#686868",
      "card-black": "#1C1C1E",
      "positive-number": "#37BA3C",
      "negative-number": "#DD4242",
      "font-black": "#2F2F2F",
      "font-off-white": "#F9F9F9",
      "primary-black-page": "#181616",
      "primary-black": "#343434",
      "primary-faded-black": "#4E4E4E",
      "primary-faded-black": "#4E4E4E",
      "primary-dark-grey": "#686868",
      "card-red": "#e60000",
      "second-black-background": "#232222",
      periwinkle: "#adbaf2",
      "grass-green": "#71c060",
      "guava-pink": "#fc5878",
      citron: "#eedc7c",
      "robin-egg-blue": "#26ccd7",
      plum: "#8e4696",
      "dark-cyan": "#008b8b",
      "poppy-red": "#d83434",
      tangerine: "#f09c4b",
      "sappire-blue": "#0052ba",
      "pink-blush": "#efaff0",
      "forest-green": "#066839",
      redwood: "#be4d4b",
      "field-grey": "#dadada",
    },
    fontFamily: {
      sans: ["Work Sans", "sans-serif"],
    },
  },
  safelist: [
    // Need to add new category colors here (periwinkle, )
    "bg-category-color-0",
    "bg-category-color-1",
    "bg-category-color-2",
    "bg-category-color-3",
    "bg-category-color-4",
    "bg-category-color-5",
    "bg-category-color-6",
    "bg-category-color-7",
    "bg-category-color-8",
    "bg-category-color-9",
    "bg-category-color-10",
    "bg-category-color-11",
    "bg-category-color-12",
    "bg-category-color-13",
    "bg-category-color-14",
    "bg-category-color-15",
    "bg-category-color-16",
    "bg-category-color-17",
    "text-accent-blue",
    "text-accent-red",
    "text-accent-green",
    "text-accent-yellow",
    "text-accent-purple",
    "border-accent-blue",
    "border-accent-red",
    "border-accent-green",
    "border-accent-yellow",
    "border-accent-purple",
    "border-card-red",
    "border-positive-number",
    "border-negative-number",
    "bg-accent-blue",
    "bg-accent-red",
    "bg-accent-green",
    "bg-accent-yellow",
    "bg-accent-purple",
    "bg-accent-teal",
    "bg-card-red",
    "bg-positive-number",
    "bg-negative-number",
    "border-b-blue",
    "border-b-red",
    "border-b-green",
    "border-b-yellow",
    "border-b-purple",
    "border-b-red",
    "border-b-number",
    "border-b-number",
  ],
  variants: {
    extend: {
      display: ["group-hover"],
    },
  },
  mode: "jit",
  plugins: [],
};
