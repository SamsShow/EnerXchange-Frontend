/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'sell-image': "url('https://media.istockphoto.com/id/933395700/video/wind-turbine-farm-at-sunset.jpg?s=640x640&k=20&c=X7Rdz19utZSHqP2Ob5bEg2AcEV-4MudLuMLfxvUZ8U8=')",
      },
    },
  },
  plugins: [],
}

