import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { VaultSideBar } from "@/components/custom/vault/sidebar";
import { Provider } from "@radix-ui/react-tooltip";

export default function VaultLayout({ children }: { children: React.ReactNode }) {
	return (
		<Provider>
			<SidebarProvider>
				<div className="flex flex-col flex-grow">
					<div className="flex flex-row flex-grow">
						<VaultSideBar />
						<main className="flex-1 p-4">{children}</main>
					</div>
				</div>
			</SidebarProvider>
		</Provider>
	);
}
