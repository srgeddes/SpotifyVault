import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	scope: "user-read-email user-top-read",
	images: {
		domains: ["i.scdn.co"],
	},
};

export default nextConfig;
