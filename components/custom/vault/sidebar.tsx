import { Calendar, ChevronUp, Home, Inbox, Search, Settings, User2, UserRound } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "../logo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const items = [
	{
		title: "Home",
		url: "#",
		icon: Home,
	},
	{
		title: "Artist",
		url: "#",
		icon: UserRound,
	},
	{
		title: "Tracks",
		url: "#",
		icon: Inbox,
	},
	{
		title: "Calendar",
		url: "#",
		icon: Calendar,
	},
	{
		title: "Search",
		url: "#",
		icon: Search,
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings,
	},
];

export function VaultSideBar() {
	return (
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
									<SidebarMenuButton asChild>
										<a href={item.url} className="flex items-center">
											<item.icon className="mr-2 h-5 w-5" />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
					<SidebarFooter>
						<SidebarMenu>
							<SidebarMenuItem>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<SidebarMenuButton className="flex items-center">
											<User2 className="mr-2 h-5 w-5" />
											Username
											<ChevronUp className="ml-auto h-4 w-4" />
										</SidebarMenuButton>
									</DropdownMenuTrigger>
									<DropdownMenuContent side="top" align="center" sideOffset={5} className="w-48 p-2 bg-white shadow-md rounded">
										<DropdownMenuItem className="p-2 cursor-pointer hover:bg-gray-100">Account</DropdownMenuItem>
										<DropdownMenuItem className="p-2 cursor-pointer hover:bg-gray-100">Billing</DropdownMenuItem>
										<DropdownMenuItem className="p-2 cursor-pointer hover:bg-gray-100">Sign out</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarFooter>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

export default VaultSideBar;
