"use client";
import { Globe } from "@/components/magicui/globe";
import { motion } from "framer-motion";

const containerVariants = {
	hidden: {},
	visible: {
		transition: { staggerChildren: 0.3 },
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		delay: 0.2,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

export default function YourPeopleSection() {
	return (
		<div className="container mx-auto px-4 pt-20">
			<motion.div className="text-center" initial="hidden" animate="visible" variants={containerVariants}>
				<motion.h2 variants={itemVariants} className="text-3xl font-bold text-black mb-4 dark:text-neutral-200">
					Sound Like Your People
				</motion.h2>
				<motion.p variants={itemVariants} className="text-xl text-gray-700 max-w-2xl mx-auto dark:text-gray-400">
					Join the Vibe — Connect through music like never before.
				</motion.p>
			</motion.div>

			<div className="relative flex h-[66vh]">
				<div>
					<Globe />
				</div>
				<div className="pointer-events-none absolute inset-0 min-h-full" />
			</div>
		</div>
	);
}
