"use client";
import { AuroraText } from "@/components/magicui/aurora-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

export default function OneVibeSection() {
	return (
		<div className="flex flex-col items-center w-full space-y-6 pt-40 px-4">
			<div className="text-center max-w-4xl">
				<motion.h1
					className="text-5xl sm:text-6xl md:text-7xl font-bold text-black mb-6 dark:text-white"
					initial={{ clipPath: "inset(0% 100% -10% 0%)" }}
					animate={{ clipPath: "inset(0% 0% -20% 0%)" }}
					transition={{ duration: 1.5, ease: "easeOut" }}>
					One vibe. Real-time. <br /> <AuroraText> All together.</AuroraText>
				</motion.h1>

				<motion.p
					className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto dark:text-gray-300"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 1 }}>
					Dive into the heartbeat of your community — share, discover, and connect through music that moves you.
				</motion.p>

				<motion.div
					className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.8 }}>
					<ShimmerButton
						onClick={() => signIn("spotify", { callbackUrl: "/vault" })}
						className="px-8 py-3 dark:text-white"
						borderRadius="0.8rem"
						background="var(--prussian-blue)">
						<span>Get Started</span>
					</ShimmerButton>
					<Button
						onClick={() => signIn("demo", { callbackUrl: "/vault" })}
						className="btn btn-xl px-8 py-6 border bg-white border-black text-black rounded-lg hover:bg-gray-50 transition-colors">
						Try Demo
					</Button>
				</motion.div>
			</div>
		</div>
	);
}
