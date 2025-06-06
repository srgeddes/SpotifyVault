"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import AnimatedBars from "@/components/custom/animated_bars";

function LoadingScreen() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-950">
			<AnimatedBars scale={5} />
		</div>
	);
}

export function Providers({ children }: { children: React.ReactNode }) {
	const [isContentLoaded, setIsContentLoaded] = useState(false);

	useEffect(() => {
		const timeoutId = setTimeout(() => setIsContentLoaded(true), 300);
		return () => clearTimeout(timeoutId);
	}, []);

	return (
		<SessionProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{!isContentLoaded ? <LoadingScreen /> : children}
			</ThemeProvider>
		</SessionProvider>
	);
}
