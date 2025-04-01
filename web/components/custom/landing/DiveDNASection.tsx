"use client";
import { motion } from "framer-motion";
import ArtistMoodRadarChart from "./ArtistMoodRadarChart";
import ArtistSharePieChart from "./ArtistSharePieChart";

export default function DiveDNASection() {
	return (
		<div className="w-5/6 max-w-8xl mx-auto relative min-h-screen" id="dive-dna">
			<div className="w-full mt-20 text-left px-6 py-10">
				<motion.h1
					className="text-3xl md:text-5xl font-bold"
					initial={{ clipPath: "inset(0% 100% -10% 0%)" }}
					animate={{ clipPath: "inset(0% 0% -20% 0%)" }}
					transition={{ duration: 1, ease: "easeOut" }}>
					Dive Into Your Musical DNA{" "}
				</motion.h1>
				<motion.p
					className="text-lg md:text-xl mt-4 text-gray-600 dark:text-gray-300 mb-16"
					initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
					animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
					transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}>
					Uncover the rhythm of your life with insights that never miss a beat{" "}
				</motion.p>
			</div>
			<div className="w-full mt-15 md:mt-20 px-6 flex flex-col md:flex-row gap-6">
				<div className="w-full md:w-1/2">
					<ArtistMoodRadarChart />
				</div>
				<div className="w-full md:w-1/2 mt-30 md:mt-0">
					<ArtistSharePieChart />
				</div>
			</div>
		</div>
	);
}
