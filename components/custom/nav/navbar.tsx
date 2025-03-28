"use client";
import Link from "next/link";
import Logo from "../logo";
import { AnimatePresence, motion } from "framer-motion";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import AnimatedBars from "../animated_bars";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function NavBar() {
	const { data: session } = useSession();
	const isAuthenticated = !!session;
	const [isHovering, setIsHovering] = useState(false);
	const router = useRouter();
	const { resolvedTheme } = useTheme();
	const barColor = resolvedTheme === "dark" ? "black" : "white";
	const { theme, setTheme } = useTheme();
	const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

	const pathname = usePathname();
	if (pathname.startsWith("/vault")) {
		return null;
	}

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
							<MenubarTrigger className="text-base font-medium cursor-pointer mr-2">Features</MenubarTrigger>
						</motion.div>
						<MenubarContent>
							<MenubarItem className="cursor-pointer">Feature 1</MenubarItem>
							<MenubarItem className="cursor-pointer">Feature 2</MenubarItem>
							<MenubarItem className="cursor-pointer">Feature 3</MenubarItem>
						</MenubarContent>
					</MenubarMenu>

					<motion.div whileHover={{ scale: 1.05 }}>
						<Link href={"https://rileygeddes.com"} target="_blank" className="text-base font-medium cursor-pointer">
							About
						</Link>{" "}
					</motion.div>

					<motion.div whileHover={{ scale: 1.05 }}>
						<Link href="/contact" className="text-base font-medium px-4 py-2 flex items-center cursor-pointer">
							Contact
						</Link>
					</motion.div>

					<div className="mx-4 h-6 w-px bg-gray-300 self-center"></div>

					{isAuthenticated ? (
						<motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
							<DropdownMenu>
								<DropdownMenuTrigger className="focus:outline-none">
									<Avatar className="h-10 w-10 cursor-pointer">
										<AvatarImage src={session?.user?.image || ""} alt="Profile" />
										<AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
									</Avatar>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
										Switch Theme
										{theme === "light" ? (
											<Moon className="text-black dark:text-white" size={20} />
										) : (
											<Sun className="text-black dark:text-white" size={20} />
										)}
									</DropdownMenuItem>
									<DropdownMenuItem
										className="cursor-pointer"
										onClick={() => {
											signOut({ redirect: false }).then(() => {
												router.push("/");
											});
										}}>
										Logout
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</motion.div>
					) : (
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="flex items-center"
							onMouseEnter={() => setIsHovering(true)}
							onMouseLeave={() => setIsHovering(false)}>
							<Button onClick={() => signIn("spotify", { callbackUrl: "/vault" })} variant={"default"} className="cursor-pointer">
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
					)}
				</Menubar>
			</motion.div>
		</nav>
	);
}
