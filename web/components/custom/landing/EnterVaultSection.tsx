"use client";
import AnimatedBars from "@/components/custom/animated_bars";
import ArtistLineGraph from "@/components/custom/landing/ArtistLineGraph";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ListMusic } from "lucide-react";
import { signIn } from "next-auth/react";
import { useTheme } from "next-themes";

export default function EnterVaultSection() {
	const [isHovering, setIsHovering] = useState(false);
	const { theme } = useTheme();
	const barColor = theme === "dark" ? "black" : "white";
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);

		return () => {
			window.removeEventListener("resize", checkIfMobile);
		};
	}, []);

	return (
		<>
			<div className="text-center px-4 sm:px-6" id="enter-vault">
				<motion.h1
					className="text-4xl sm:text-4xl md:text-5xl font-bold"
					initial={{ clipPath: "inset(0% 100% -10% 0%)" }}
					animate={{ clipPath: "inset(0% 0% -20% 0%)" }}
					transition={{ duration: 1.5, ease: "easeOut" }}>
					Spotify Wrapped Year Round
				</motion.h1>
				<motion.p
					className="text-base sm:text-lg md:text-xl mt-3 md:mt-4 text-gray-600 dark:text-gray-300 px-2"
					initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
					animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
					transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}>
					Your sonic journey, decoded 24/7. No more waiting for December.
				</motion.p>
				<motion.div whileHover={{ scale: 1.05 }} className="flex items-center justify-center mt-6 md:mt-8">
					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center"
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}>
						<Button
							onClick={() => signIn("spotify", { callbackUrl: "/vault" })}
							variant={"default"}
							className={`${isHovering ? "ml-2 cursor-pointer text-base sm:text-lg p-4 sm:p-5" : "text-base sm:text-lg p-4 sm:p-5"}`}>
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
							<ListMusic size={16} className="ml-1 sm:ml-2" />
						</Button>
					</motion.div>
				</motion.div>
			</div>
			<div className="w-full max-w-6xl relative flex flex-col">
				<div
					className="absolute z-0 overflow-visible"
					style={{
						left: "50%",
						top: isMobile ? "-60px" : "-79px",
						transform: "translateX(-50%)",
					}}>
					<motion.div
						className="relative"
						style={{
							width: isMobile ? "300px" : "375px",
							height: isMobile ? "375px" : "475px",
						}}
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
				<div className="relative z-10 flex justify-center w-full mt-12 sm:mt-16 md:mt-20 px-4 sm:px-6">
					<ArtistLineGraph />
				</div>
			</div>
		</>
	);
}
