"use client";
import AnimatedBars from "@/components/custom/animated_bars";
import ArtistLineGraph from "@/components/custom/landing/ArtistLineGraph";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { ListMusic } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";

export default function EnterVaultSection() {
	const [isHovering, setIsHovering] = useState(false);
	const { resolvedTheme } = useTheme();
	const barColor = resolvedTheme === "dark" ? "black" : "white";

	return (
		<>
			<div className="text-center">
				<motion.h1
					className="text-5xl font-bold"
					initial={{ clipPath: "inset(0% 100% -10% 0%)" }}
					animate={{ clipPath: "inset(0% 0% -20% 0%)" }}
					transition={{ duration: 1.5, ease: "easeOut" }}>
					Spotify Wrapped Year Round
				</motion.h1>

				<motion.p
					className="text-xl mt-4 text-gray-600 dark:text-gray-300"
					initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
					animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
					transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}>
					Your sonic journey, decoded 24/7. No more waiting for December.
				</motion.p>

				<motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-center mt-8">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center"
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}>
						<Button
							onClick={() => signIn("spotify", { callbackUrl: "/vault" })}
							variant={"default"}
							className={`${isHovering ? "ml-2 cursor-pointer text-lg p-5" : "text-lg p-5"}`}>
							<AnimatePresence>
								{isHovering && (
									<motion.div
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "auto" }}
										exit={{ opacity: 0, width: 0 }}
										transition={{ duration: 0.2 }}>
										<AnimatedBars barwidth={2} barcolor={barColor} />
									</motion.div>
								)}
							</AnimatePresence>
							Enter the Vault
							<ListMusic size={18} />
						</Button>
					</motion.div>
				</motion.div>
			</div>

			<div className="w-full max-w-6xl relative flex flex-col">
				<div className="absolute z-0 overflow-visible hidden md:block" style={{ left: "25%", top: "-25px", transform: "translateX(-50%)" }}>
					<motion.div
						className="relative"
						style={{ width: "375px", height: "475px" }}
						initial={{ y: 30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.4 } }}>
						<Image
							src="/images/landing/big_taylor_swift.png"
							alt="Taylor Swift"
							layout="fill"
							objectFit="contain"
							objectPosition="center top"
							className="motion-safe:transition-all"
						/>
					</motion.div>
				</div>

				<div className="absolute z-0 overflow-visible" style={{ left: "50%", top: "-40px", transform: "translateX(-50%)" }}>
					<motion.div
						className="relative"
						style={{ width: "375px", height: "475px" }}
						initial={{ y: 30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.4 } }}>
						<Image
							src="/images/landing/big_kendrick_lamar.png"
							alt="Kendrick Lamar"
							layout="fill"
							objectFit="contain"
							objectPosition="center top"
							className="motion-safe:transition-all"
						/>
					</motion.div>
				</div>

				<div className="absolute z-0 overflow-visible hidden md:block" style={{ left: "80%", top: "-30px", transform: "translateX(-70%)" }}>
					<motion.div
						className="relative"
						style={{ width: "350px", height: "450px" }}
						initial={{ y: 30, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						whileHover={{ y: -15, scale: 1.05, transition: { duration: 0.4 } }}>
						<Image
							src="/images/landing/big_drake.png"
							alt="Drake"
							layout="fill"
							objectFit="contain"
							objectPosition="center top"
							className="motion-safe:transition-all"
						/>
					</motion.div>
				</div>

				<div className="relative z-10 flex justify-center w-full mt-20">
					<ArtistLineGraph />
				</div>
			</div>
		</>
	);
}
