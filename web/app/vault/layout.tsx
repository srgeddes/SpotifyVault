import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { VaultSideBar } from "@/components/custom/vault/sidebar";
import { Provider } from "@radix-ui/react-tooltip";

export default function VaultLayout({ children }: { children: React.ReactNode }) {
	return (
		<Provider>
			<SidebarProvider>
				<div className="flex flex-col flex-grow">
					<div className="flex flex-row flex-grow">
						<VaultSideBar />
						<SidebarTrigger className="mt-6 ml-2" />

						<main className="flex-1 p-4 pr-10 mt-20"> {children}</main>
					</div>
				</div>
			</SidebarProvider>
		</Provider>
	);
}
