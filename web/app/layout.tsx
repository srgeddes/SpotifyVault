import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Footer from "@/components/custom/nav/footer";
import NavBar from "@/components/custom/nav/navbar";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "sonalli",
	description: "Catch the vibe of your people. Real-time listening, shared effortlessly.",
	icons: {
		icon: "images/logo.png",
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${inter.className} antialiased bg-background-custom min-h-screen flex flex-col dark:bg-black`}>
				{" "}
				<Providers>
					<NavBar />
					<div className="flex flex-col flex-grow pb-20 dark:bg-black">{children}</div>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
