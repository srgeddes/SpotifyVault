"use client";
import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ArtistLineGraph from "./ArtistLineGraph";
import { TextReveal } from "@/components/magicui/text-reveal";
import { MusicServiceBeam } from "./MusicServiceBeam";

export default function LearnYourListeningHabitsSection() {
	const [, setRevealed] = useState(false);
	const sectionRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const contentOpacity = useTransform(scrollYProgress, [0.4, 0.5, 0.8, 0.9], [0, 1, 1, 0]);

	return (
		<section ref={sectionRef} className="w-full py-16 px-6 sm:px-8 lg:px-12">
			<div className="text-center mb-8">
				<TextReveal onComplete={() => setRevealed(true)}>Connect &amp; Visualize Your Sound</TextReveal>
			</div>

			<motion.div style={{ opacity: contentOpacity }} transition={{ duration: 0.5 }} className="transform-none">
				<p className="text-xl sm:text-2xl text-gray-700 max-w-2xl mx-auto mb-8 dark:text-gray-300">
					Link your streaming service, explore sleek data snapshots, and share listening journeys with friends—all in real time.
				</p>
				<div className="flex flex-col md:flex-row gap-8">
					<div className="w-full md:w-1/3 flex flex-col justify-center">
						<MusicServiceBeam />
					</div>
					<div className="w-full md:w-2/3 flex justify-center items-center">
						<ArtistLineGraph />
					</div>
				</div>
			</motion.div>
		</section>
	);
}
