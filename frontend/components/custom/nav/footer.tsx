"use client";
import Link from "next/link";
import { Github, Mail } from "lucide-react";
import Logo from "@/components/custom/logo";
import { motion } from "framer-motion";

const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full bg-transparent backdrop-blur-sm border-t border-slate-200/20">
			<div className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
				<div className="flex justify-between">
					<div className="flex flex-col">
						<Link href="/">
							<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer flex items-center">
								<Logo />
								<span className="text-xl font-bold text-black ml-2">SpotifyVault</span>
							</motion.div>
						</Link>

						<div className="flex space-x-4 mt-2">
							<motion.div whileHover={{ scale: 1.15 }} className="cursor-pointer">
								<Link href="https://github.com/srgeddes/SpotifyVault" className="text-neutral-700">
									<Github size={20} />
									<span className="sr-only">GitHub</span>
								</Link>
							</motion.div>
							<motion.div whileHover={{ scale: 1.15 }} className="cursor-pointer">
								<Link href="mailto:rileygeddes@virginia.edu" className="text-neutral-700">
									<Mail size={20} />
									<span className="sr-only">Email</span>
								</Link>
							</motion.div>
						</div>
					</div>

					<div className="flex space-x-8 items-center h-8">
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="/" className="text-black">
								Home
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="/about" className="text-black">
								About Us
							</Link>
						</motion.div>
						<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
							<Link href="/services" className="text-black">
								Services
							</Link>
						</motion.div>
					</div>
				</div>

				<div className="mt-4">
					<p className="text-center text-black">© {currentYear} SpotifyVault. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
