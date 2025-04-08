import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ArtistMarqueeProps {
	/**
	 * Optional CSS class name to apply custom styles
	 */
	className?: string;
	/**
	 * Whether to reverse the animation direction
	 * @default false
	 */
	reverse?: boolean;
	/**
	 * Whether to pause the animation on hover
	 * @default false
	 */
	pauseOnHover?: boolean;
	/**
	 * Whether to animate vertically instead of horizontally
	 * @default false
	 */
	vertical?: boolean;
	/**
	 * Number of times to repeat the content
	 * @default 4
	 */
	repeat?: number;
	/**
	 * Artists to display in the marquee
	 */
	artists: Array<{
		name: string;
		imageUrl: string;
	}>;
}

export function ArtistMarquee({ className, reverse = false, pauseOnHover = false, vertical = false, repeat = 4, artists }: ArtistMarqueeProps) {
	return (
		<div
			className={cn(
				"group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
				{
					"flex-row": !vertical,
					"flex-col": vertical,
				},
				className
			)}>
			{Array(repeat)
				.fill(0)
				.map((_, i) => (
					<div
						key={i}
						className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
							"animate-marquee flex-row": !vertical,
							"animate-marquee-vertical flex-col": vertical,
							"group-hover:[animation-play-state:paused]": pauseOnHover,
							"[animation-direction:reverse]": reverse,
						})}>
						{artists.map((artist) => (
							<div key={artist.name} className="flex flex-col items-center mx-4">
								<div className="w-40 h-100 relative">
									{" "}
									<Image src={artist.imageUrl} alt={artist.name} width={300} height={160} className="object-contain" />{" "}
								</div>
							</div>
						))}
					</div>
				))}
		</div>
	);
}
