// tailwind.config.js
module.exports = {
	theme: {
		extend: {
			keyframes: {
				marquee: {
					"0%": { transform: "translateX(0%)" },
					"100%": { transform: "translateX(-100%)" },
				},
				"marquee-vertical": {
					"0%": { transform: "translateY(0%)" },
					"100%": { transform: "translateY(-100%)" },
				},
			},
			animation: {
				marquee: "marquee var(--duration, 40s) linear infinite",
				"marquee-vertical": "marquee-vertical var(--duration, 40s) linear infinite",
			},
		},
	},
};
