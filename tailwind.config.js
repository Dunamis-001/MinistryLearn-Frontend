/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c7d7fe",
          300: "#a5b8fc",
          400: "#8b91f8",
          500: "#7c75f5", // vibrant purple-blue
          600: "#6c5ee6",
          700: "#5848c8",
          800: "#483ca3",
          900: "#3e3682"
        },
        accent: {
          50: "#fef3f2",
          100: "#fee4e2",
          200: "#fecdca",
          300: "#fda9a5",
          400: "#fb8079",
          500: "#f84d4f", // coral red
          600: "#e93134",
          700: "#d02128",
          800: "#ad2127",
          900: "#8f2328"
        },
        secondary: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6", // teal
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
