"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "../logo";
import { AnimatedBeam } from "@/components/magicui/animated-beam";

const Circle = forwardRef<HTMLDivElement, { className?: string; children?: React.ReactNode }>(({ className, children }, ref) => (
	<div
		ref={ref}
		className={cn(
			"z-10 flex size-16 items-center justify-center rounded-full border-2 border-border bg-white p-4 shadow-[0_0_24px_-12px_rgba(0,0,0,0.8)]",
			className
		)}>
		{children}
	</div>
));

Circle.displayName = "Circle";

export function MusicServiceBeam({ className }: { className?: string }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const div1Ref = useRef<HTMLDivElement>(null);
	const div2Ref = useRef<HTMLDivElement>(null);
	const div3Ref = useRef<HTMLDivElement>(null);
	const div4Ref = useRef<HTMLDivElement>(null);

	return (
		<div ref={containerRef} className={cn("relative flex h-[600px] w-full items-center justify-center overflow-hidden p-16", className)}>
			<div className="flex size-full max-w-xl flex-row items-stretch justify-between gap-16">
				<div className="flex flex-col justify-center gap-4">
					<Circle ref={div1Ref}>
						<Image src="svgs/spotify.svg" width={32} height={32} alt="Spotify" />
					</Circle>
					<Circle ref={div2Ref}>
						<Image src="svgs/apple-music.svg" width={32} height={32} alt="Apple Music" />
					</Circle>
				</div>

				<div className="flex flex-col justify-center">
					<Circle ref={div3Ref} className="size-20">
						<Logo theme="light" />
					</Circle>
				</div>

				<div className="flex flex-col justify-center gap-4">
					<Circle ref={div4Ref}>
						<icons.user />
					</Circle>
				</div>
			</div>

			<AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div3Ref} />
			<AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div3Ref} />
			<AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={div4Ref} />
		</div>
	);
}

const icons = {
	user: () => (
		<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" xmlns="http://www.w3.org/2000/svg">
			<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	),
};
