import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EnterVaultSection from "@/components/custom/landing/EnterVaultSection";
import DiveDNASection from "@/components/custom/landing/DiveDNASection";
import { authOptions } from "@/lib/authOptions";
import { FAQSection } from "@/components/custom/landing/FAQSection";

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/vault");
	}

	return (
		<div className="flex flex-col items-center w-full min-h-screen space-y-20 md:space-y-15 pt-40">
			<EnterVaultSection />
			<DiveDNASection />
			<FAQSection />
		</div>
	);
}
