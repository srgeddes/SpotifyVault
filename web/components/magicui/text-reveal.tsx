"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { FC, ComponentPropsWithoutRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
	children: string;
	onComplete?: () => void;
}

interface WordRevealProps {
	text: string;
	index: number;
	total: number;
	scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

const WordReveal: FC<WordRevealProps> = ({ text, index, total, scrollYProgress }) => {
	const start = 0.1 + (index / total) * 0.3;
	const end = start + 0.1;
	const opacity = useTransform(scrollYProgress, [start - 0.05, start, end], [0, 1, 1]);
	return (
		<motion.span style={{ opacity }} className="mx-1 text-3xl md:text-4xl lg:text-5xl font-bold">
			{text}
		</motion.span>
	);
};

export const TextReveal: FC<TextRevealProps> = ({ children, className, onComplete }) => {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	useEffect(() => {
		const unsubscribe = scrollYProgress.on("change", (p) => {
			if (p >= 0.5) onComplete?.();
		});
		return unsubscribe;
	}, [scrollYProgress, onComplete]);

	const containerOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 1], [0, 1, 1, 1]);
	const words = children.split(" ");

	return (
		<div ref={ref} className={cn("relative z-0 h-[60vh] my-4", className)}>
			<motion.div style={{ opacity: containerOpacity }} className="sticky top-[40vh] mx-auto flex max-w-4xl flex-wrap justify-center px-4">
				{words.map((word, i) => (
					<WordReveal key={i} text={word} index={i} total={words.length} scrollYProgress={scrollYProgress} />
				))}
			</motion.div>
		</div>
	);
};
