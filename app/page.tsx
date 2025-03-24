"use client";
import EnterVaultSection from "@/components/custom/landing/EnterVaultSection";
import DiveDNASection from "@/components/custom/landing/DiveDNASection";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/vault");
		}
	}, [status, router]);

	return (
		<div className="flex flex-col items-center w-full min-h-screen justify-around space-y-14 pt-30">
			<EnterVaultSection />
			<DiveDNASection />
		</div>
	);
}
