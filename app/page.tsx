import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EnterVaultSection from "@/components/custom/landing/EnterVaultSection";
import DiveDNASection from "@/components/custom/landing/DiveDNASection";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {
	const session = await getServerSession(authOptions);

	if (session) {
		redirect("/vault");
	}

	return (
		<div className="flex flex-col items-center w-full min-h-screen justify-around space-y-14 pt-30">
			<EnterVaultSection />
			<DiveDNASection />
		</div>
	);
}
