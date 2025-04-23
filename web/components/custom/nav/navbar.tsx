"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../logo";
import { ScrollProgress } from "@/components/magicui/scroll-progress";
import { usePathname } from "next/navigation";
import { signIn } from "next-auth/react";
import AnimatedBars from "../animated_bars";
import { useTheme } from "next-themes";

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [, setIsMobile] = useState(false);
	const [isHovering, setIsHovering] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 640);
		};
		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);
		return () => {
			window.removeEventListener("resize", checkIfMobile);
		};
	}, []);

	const pathname = usePathname();
	if (pathname.startsWith("/vault")) {
		return null;
	}

	const barColor = theme === "dark" ? "black" : "white";

	return (
		<nav className="fixed top-0 z-50 w-full bg-background-custom/60 backdrop-blur-md py-4 border-neutral-300 dark:bg-black/70">
			<div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
				<Link href="/" className="flex items-end">
					<Logo width={50} height={50} />
					<span className="ml-1 text-xl font-bold text-black dark:text-white">sonalli</span>
				</Link>

				<motion.div whileHover={{ scale: 1.05 }}>
					<Button
						variant="default"
						onClick={() => signIn("spotify", { callbackUrl: "/vault" })}
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}>
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
						Login
					</Button>
				</motion.div>

				<Button
					variant="ghost"
					size="sm"
					className="md:hidden p-1"
					onClick={(e) => {
						e.stopPropagation();
						setMobileMenuOpen(!mobileMenuOpen);
					}}>
					<Menu size={24} />
				</Button>
			</div>

			{mobileMenuOpen && (
				<div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md rounded-b-xl">
					<div className="flex flex-col px-4 py-2 space-y-3"></div>
				</div>
			)}

			<ScrollProgress className="top-[82px]" />
		</nav>
	);
}
