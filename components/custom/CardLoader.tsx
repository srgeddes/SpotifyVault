"use client";

import React from "react";
import { useTheme } from "next-themes";
import AnimatedBars from "@/components/custom/animated_bars";

const CardLoader = () => {
	const { resolvedTheme } = useTheme();
	const barColor = resolvedTheme === "dark" ? "white" : "black";

	return (
		<div className="flex items-center justify-center h-32">
			<AnimatedBars scale={5} barcolor={barColor} />
		</div>
	);
};

export default CardLoader;
