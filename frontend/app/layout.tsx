"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import Navbar from "@/components/custom/nav/navbar";
import Footer from "@/components/custom/nav/footer";
import AnimatedBars from "@/components/custom/animated_bars";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const [isContentLoaded, setIsContentLoaded] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => setIsContentLoaded(true), 300);
		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/images/logo.png" type="image/png" />
			</head>
			<body className={`${inter.className} bg-gray-100 dark:bg-gray-950`}>
				{!isContentLoaded ? (
					<div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-950">
						<AnimatedBars scale={5} barcolor="black" />
					</div>
				) : (
					<>
						<Navbar />
						<main className="flex-grow pt-32 pb-32">{children}</main>
						<Footer />
					</>
				)}
			</body>
		</html>
	);
}
