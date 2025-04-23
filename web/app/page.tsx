import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import OneVibeSection from "@/components/custom/landing/one-vibe-section";
import YourPeopleSection from "@/components/custom/landing/your-people-section";
import LearnYourListeningHabitsSection from "@/components/custom/landing/learn-your-listening-habits-section";
import DiveDNASection from "@/components/custom/landing/dive-dna-section";

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/vault");
	}

	return (
		<div className="flex flex-col w-full min-h-screen">
			<OneVibeSection />
			<YourPeopleSection />
			<LearnYourListeningHabitsSection />
			<DiveDNASection />
		</div>
	);
}
