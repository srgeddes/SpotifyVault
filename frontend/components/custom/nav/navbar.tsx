import Link from "next/link";
import Logo from "../logo";
import { AnimatePresence, motion } from "framer-motion";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import AnimatedBars from "../animated_bars";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function NavBar() {
	const [isHovering, setIsHovering] = useState(false);

	return (
		<nav className="fixed top-5 z-50 w-full flex justify-center">
			<motion.div
				className="inline-flex bg-white/25 backdrop-blur-lg shadow-sm rounded-full py-4 px-4"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
				whileHover={{
					y: -3,
					boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
					transition: { duration: 0.2 },
				}}>
				<Menubar className="border-none shadow-none bg-transparent">
					<motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
						<Link href="/" className="mr-6 ml-2 flex items-center font-bold">
							<Logo width={40} height={40} />
						</Link>
					</motion.div>

					<MenubarMenu>
						<motion.div whileHover={{ scale: 1.05 }}>
							<MenubarTrigger className="text-base font-medium cursor-pointer">Features</MenubarTrigger>
						</motion.div>
						<MenubarContent>
							<MenubarItem className="cursor-pointer">Feature 1</MenubarItem>
							<MenubarItem className="cursor-pointer">Feature 2</MenubarItem>
							<MenubarItem className="cursor-pointer">Feature 3</MenubarItem>
						</MenubarContent>
					</MenubarMenu>

					<MenubarMenu>
						<motion.div whileHover={{ scale: 1.05 }}>
							<MenubarTrigger className="text-base font-medium cursor-pointer">Resources</MenubarTrigger>
						</motion.div>
						<MenubarContent>
							<MenubarItem className="cursor-pointer">Documentation</MenubarItem>
							<MenubarItem className="cursor-pointer">Guides</MenubarItem>
							<MenubarItem className="cursor-pointer">Support</MenubarItem>
						</MenubarContent>
					</MenubarMenu>

					<MenubarMenu>
						<motion.div whileHover={{ scale: 1.05 }}>
							<MenubarTrigger className="text-base font-medium cursor-pointer">Pricing</MenubarTrigger>
						</motion.div>
						<MenubarContent>
							<MenubarItem className="cursor-pointer">Plans</MenubarItem>
							<MenubarItem className="cursor-pointer">Enterprise</MenubarItem>
							<MenubarItem className="cursor-pointer">Compare</MenubarItem>
						</MenubarContent>
					</MenubarMenu>

					<motion.div whileHover={{ scale: 1.05 }}>
						<Link href="/contact" className="text-base font-medium px-4 py-2 flex items-center cursor-pointer">
							Get in contact
						</Link>
					</motion.div>

					<div className="mx-4 h-6 w-px bg-gray-300 self-center"></div>

					<motion.div
						whileHover={{ scale: 1.05 }}
						className="flex items-center"
						onMouseEnter={() => setIsHovering(true)}
						onMouseLeave={() => setIsHovering(false)}>
						<Link href="api/auth/login" className="flex items-center text-base font-medium px-4 py-2 cursor-pointer">
							<Button className={`${isHovering ? "ml-2 cursor-pointer hover:bg-black" : ""}`}>
								<AnimatePresence>
									{isHovering && (
										<motion.div
											initial={{ opacity: 0, width: 0 }}
											animate={{ opacity: 1, width: "auto" }}
											exit={{ opacity: 0, width: 0 }}
											transition={{ duration: 0.2 }}>
											<AnimatedBars barwidth={2} barcolor="white" />
										</motion.div>
									)}
								</AnimatePresence>
								Login
							</Button>
						</Link>
					</motion.div>
				</Menubar>
			</motion.div>
		</nav>
	);
}
