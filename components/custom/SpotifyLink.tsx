import React from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface SpotifyLinkProps {
	id: string;
	externalUrl: string;
	type: "track" | "artist";
	children: React.ReactNode;
}

export const SpotifyLink: React.FC<SpotifyLinkProps> = ({ id, externalUrl, type, children }) => {
	const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		e.preventDefault();
		const spotifyURI = `spotify:${type}:${id}`;

		window.location.href = spotifyURI;
	};

	return (
		<Link href={externalUrl} onClick={handleClick} className="cursor-pointer" target="_blank">
			<Badge variant={type === "track" ? "outline" : "secondary"} className="text-sm hover:bg-accent/80">
				{children}
			</Badge>
		</Link>
	);
};
