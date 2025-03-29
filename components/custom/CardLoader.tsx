"use client";

import React from "react";
import AnimatedBars from "@/components/custom/animated_bars";

const CardLoader = () => {
	return (
		<div className="flex items-center justify-center h-32">
			<AnimatedBars scale={5} />
		</div>
	);
};

export default CardLoader;
