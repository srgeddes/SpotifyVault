"use client";
import { ChevronDown, Guitar, Headphones, Home, Lock, LogOut, MicVocal, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Logo from "../logo";
import { useSession } from "next-auth/react";
import { LockVaultModal } from "./home/lockVaultModal";

export function VaultSideBar() {
	const { data: session } = useSession();
	const router = useRouter();
	const [isLockVaultModalOpen, setIsLockVaultModalOpen] = useState(false);
	const userName = session?.user?.name || "User";

	const handleLockVault = () => {
		console.log("Vault locked");
		setIsLockVaultModalOpen(false);
		router.push("/");
	};

	const items = [
		{
			title: "Home",
			url: "/vault",
			icon: Home,
		},
		{
			title: "Track",
			url: "/vault/track",
			icon: Headphones,
		},
		{
			title: "Artist",
			url: "#",
			icon: MicVocal,
		},
		{
			title: "Genre",
			url: "#",
			icon: Guitar,
		},
		{
			title: userName,
			url: "#",
			icon: UserRound,
			dropdown: [
				{
					title: "Lock Vault",
					icon: Lock,
					action: "lockVault",
					className: "text-red-600",
					onClick: () => setIsLockVaultModalOpen(true),
				},
				{
					title: "Logout",
					icon: LogOut,
					action: "logout",
				},
			],
		},
	];

	return (
		<>
			<Sidebar>
				<div className="flex items-center p-4 border-b">
					<Logo />
					<span className="text-lg font-bold ml-2">SpotifyVault</span>
				</div>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Application</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{items.map((item) => (
									<SidebarMenuItem key={item.title}>
										{item.dropdown ? (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<SidebarMenuButton className="flex items-center cursor-pointer">
														<item.icon className="mr-2 h-5 w-5" />
														<span>{item.title}</span>
														<ChevronDown className="ml-auto h-4 w-4" />
													</SidebarMenuButton>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													side="bottom"
													align="end"
													sideOffset={5}
													className="w-48 p-2 bg-white dark:bg-background  shadow-md rounded">
													{item.dropdown.map((dropdownItem) => (
														<DropdownMenuItem
															key={dropdownItem.title}
															onClick={
																dropdownItem.action === "logout"
																	? () => {
																			signOut({ redirect: false }).then(() => {
																				router.push("/");
																			});
																	  }
																	: dropdownItem.onClick
															}
															className={`p-2 cursor-pointer hover:bg-gray-100 flex items-center dark:hover:bg-neutral-900 ${
																dropdownItem.className || ""
															}`}>
															<dropdownItem.icon className="mr-2 h-4 w-4" />
															{dropdownItem.title}
														</DropdownMenuItem>
													))}
												</DropdownMenuContent>
											</DropdownMenu>
										) : (
											<SidebarMenuButton asChild>
												<a href={item.url} className="flex items-center">
													<item.icon className="mr-2 h-5 w-5" />
													<span>{item.title}</span>
												</a>
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</Sidebar>

			<LockVaultModal isOpen={isLockVaultModalOpen} onClose={() => setIsLockVaultModalOpen(false)} onLockVault={handleLockVault} />
		</>
	);
}

export default VaultSideBar;
