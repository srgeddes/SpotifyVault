import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/custom/nav/footer";
import NavBar from "@/components/custom/nav/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "SpotifyVault",
	icons: {
		icon: "/images/logo.png",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} min-h-screen flex flex-col`}>
				<Providers>
					<NavBar />
					<div className="flex flex-col flex-grow pb-20">{children}</div>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
