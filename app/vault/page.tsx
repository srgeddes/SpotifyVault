"use client";

import Home from "@/components/custom/vault/home/home";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VaultPage() {
	const router = useRouter();
	const { status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	return (
		<div>
			<div className="mt-7">
				<Home />
			</div>
		</div>
	);
}
