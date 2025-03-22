"use client";
import { motion } from "framer-motion";
import ArtistMoodRadarChart from "@/components/custom/landing/ArtistMoodRadarChart";
import EnterVaultSection from "@/components/custom/landing/EnterVaultSection";
import DiveDNASection from "@/components/custom/landing/DiveDNASection";

export default function Home() {
	return (
		<div className="flex flex-col items-center w-full min-h-screen justify-around space-y-14">
			<EnterVaultSection />
			<DiveDNASection />
		</div>
	);
}
