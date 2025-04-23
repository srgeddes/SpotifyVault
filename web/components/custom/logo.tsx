"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useState, useEffect } from "react";

type LogoProps = {
	width?: number;
	height?: number;
	theme?: "light" | "dark";
};

export default function Logo({ width = 40, height = 40, theme }: LogoProps) {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	const effectiveTheme = theme ?? resolvedTheme;
	const logoSrc = effectiveTheme === "dark" ? "/images/logo_dark.png" : "/images/logo.png";

	return (
		<div className="flex items-center justify-center">
			<Image src={logoSrc} width={width} height={height} alt="Logo" />
		</div>
	);
}
