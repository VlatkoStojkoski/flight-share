/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				heading: ['Inter', 'sans-serif'],
				body: ['Rubik', 'sans-serif'],
				sans: ['Rubik', 'sans-serif'],
			},
			colors: {
				primary: {
					50: '#f0faff',
					100: '#d5f1ff',
					200: '#b2def3',
					300: '#8ecae6',
					400: '#4fb6d5',
					500: '#239bba',
					600: '#1d86a7',
					700: '#186d8d',
					800: '#023047',
					900: '#04151d'
				},
				secondary: {
					50: '#fffbeb',
					100: '#fef3c7',
					200: '#fde68a',
					300: '#fcd34d',
					400: '#fbbf24',
					500: '#f59e0b',
					600: '#d97706',
					700: '#b45309',
					800: '#92400e',
					900: '#78350f',
				}
			}
		},
	},
	plugins: [],
};
