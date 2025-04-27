"use client";

import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "../logo";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import Link from "next/link";

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
	const userRef1 = useRef<HTMLDivElement>(null);
	const userRef2 = useRef<HTMLDivElement>(null);
	const userRef3 = useRef<HTMLDivElement>(null);
	const userRef4 = useRef<HTMLDivElement>(null);
	const userRef5 = useRef<HTMLDivElement>(null);

	return (
		<div ref={containerRef} className={cn("relative flex h-[600px] w-full items-center justify-center overflow-hidden p-16", className)}>
			<div className="flex size-full max-w-xl flex-row items-stretch justify-between gap-16">
				<div className="flex flex-col justify-center gap-4">
					<Circle ref={div1Ref}>
						<Link href="https://www.spotify.com" target="_blank" rel="noopener noreferrer">
							<Image src="svgs/spotify.svg" width={32} height={32} alt="Spotify" />
						</Link>
					</Circle>
				</div>

				<div className="flex flex-col justify-center">
					<Circle ref={div3Ref} className="size-20">
						<Logo theme="light" />
					</Circle>
				</div>

				<div className="flex flex-col justify-between py-8">
					<Circle ref={userRef1}>
						<icons.user />
					</Circle>
					<Circle ref={userRef2}>
						<icons.user />
					</Circle>
					<Circle ref={userRef3}>
						<icons.user />
					</Circle>
					<Circle ref={userRef4}>
						<icons.user />
					</Circle>
					<Circle ref={userRef5}>
						<icons.user />
					</Circle>
				</div>
			</div>

			<AnimatedBeam containerRef={containerRef} fromRef={div1Ref} toRef={div3Ref} duration={3} />
			<AnimatedBeam containerRef={containerRef} fromRef={div2Ref} toRef={div3Ref} duration={3} />
			<AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={userRef1} duration={3} />
			<AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={userRef2} duration={3} />
			<AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={userRef3} duration={3} />
			<AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={userRef4} duration={3} />
			<AnimatedBeam containerRef={containerRef} fromRef={div3Ref} toRef={userRef5} duration={3} />
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
