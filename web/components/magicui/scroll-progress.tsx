"use client";

import { cn } from "@/lib/utils";
import { motion, MotionProps, useScroll } from "framer-motion";
import React from "react";
type ScrollProgressProps = Omit<React.HTMLAttributes<HTMLElement>, keyof MotionProps>;

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(({ className, ...props }, ref) => {
	const { scrollYProgress } = useScroll();

	return (
		<motion.div
			ref={ref}
			className={cn("fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-prussian-blue to-[#00609D]", className)}
			style={{
				scaleX: scrollYProgress,
			}}
			{...props}
		/>
	);
});

ScrollProgress.displayName = "ScrollProgress";
