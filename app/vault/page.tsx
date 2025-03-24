"use client";

import Home from "@/components/custom/vault/home";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VaultPage() {
	const router = useRouter();

	// useEffect(() => {
	// 	if (status === "unauthenticated") {
	// 		router.push("/");
	// 	}
	// }, [status, router]);

	// useEffect(() => {
	// 	localStorage.setItem("lastVisited", "/vault");
	// }, []);

	return (
		<div>
			<SidebarTrigger className="ml-2 cursor-pointer" />
			<Button
				className="cursor-pointer"
				onClick={() => {
					signOut({ redirect: false }).then(() => {
						router.push("/");
					});
				}}>
				Logout
			</Button>
			<Home />
		</div>
	);
}
