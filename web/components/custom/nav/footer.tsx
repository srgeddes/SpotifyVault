"use client";
import Link from "next/link";
import { Github, Mail, Sun, Moon } from "lucide-react";
import Logo from "@/components/custom/logo";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation"; // Add this import

export default function Footer() {
	const currentYear = new Date().getFullYear();
	const { theme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
	const pathname = usePathname(); // Get the current path
	const isVaultPage = pathname?.includes("/vault"); // Check if path contains '/vault'
	const footerBgClass = isVaultPage ? "bg-transparent dark:bg-black" : "bg-transparent"; // Create conditional class

	return (
		<footer className={`w-full ${footerBgClass}`}>
			<div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="md:hidden flex flex-col space-y-6">
					<div className="flex justify-end">
						<Link href="/" className="flex items-end">
							<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer flex items-center">
								<Logo />
								<span className="text-xl font-bold text-black dark:text-white ml-2">sonalli</span>
							</motion.div>
						</Link>
					</div>
					<div className="flex justify-center space-x-8">
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="/" className="text-black dark:text-white">
								Home
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="https://rileygeddes.com" className="text-black dark:text-white">
								About
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="mailto:rileygeddes@virginia.edu" className="text-black dark:text-white">
								Contact
							</Link>
						</motion.div>
					</div>
					<div className="flex justify-center space-x-4">
						<motion.div whileHover={{ scale: 1.15 }} className="cursor-pointer">
							<Link href="https://github.com/srgeddes/sonalli" className="text-neutral-700">
								<Github className="dark:text-neutral-400" size={20} />
								<span className="sr-only">GitHub</span>
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.15 }} className="cursor-pointer">
							<Link href="mailto:rileygeddes@virginia.edu" className="text-neutral-700">
								<Mail className="dark:text-neutral-400" size={20} />
								<span className="sr-only">Email</span>
							</Link>
						</motion.div>
						<button onClick={toggleTheme} className="p-0 lg:p-2 cursor-pointer">
							{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
						</button>
					</div>
				</div>

				<div className="hidden md:flex flex-row justify-between items-start">
					<div className="flex flex-col items-start">
						<Link href="/">
							<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer flex items-end">
								<Logo />
								<span className="text-xl font-bold text-black dark:text-white ml-2">sonalli</span>
							</motion.div>
						</Link>
						<div className="flex space-x-4 mt-2">
							<motion.div whileHover={{ scale: 1.15 }} className="cursor-pointer">
								<Link href="https://github.com/srgeddes/sonalli" className="text-neutral-700">
									<Github className="dark:text-neutral-400" size={20} />
									<span className="sr-only">GitHub</span>
								</Link>
							</motion.div>
							<motion.div whileHover={{ scale: 1.15 }} className="cursor-pointer">
								<Link href="mailto:rileygeddes@virginia.edu" className="text-neutral-700">
									<Mail className="dark:text-neutral-400" size={20} />
									<span className="sr-only">Email</span>
								</Link>
							</motion.div>
						</div>
					</div>
					<div className="flex flex-row space-x-8 items-center">
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="/" className="text-black dark:text-white">
								Home
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="https://rileygeddes.com" className="text-black dark:text-white">
								About
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="mailto:rileygeddes@virginia.edu" className="text-black dark:text-white">
								Contact
							</Link>
						</motion.div>
						<button onClick={toggleTheme} className="p-0 lg:p-2 cursor-pointer">
							{theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
						</button>
					</div>
				</div>
				<div className="mt-4">
					<p className="text-center text-black dark:text-neutral-400">© {currentYear} sonalli. All rights reserved.</p>
					<p className="text-center text-black/70 dark:text-neutral-400 text-sm mt-2">This site has no affiliation with Spotify</p>
					<p className="text-center text-black/50 dark:text-neutral-400 text-sm mt-2">Made by Riley Geddes</p>
				</div>
			</div>
		</footer>
	);
}
