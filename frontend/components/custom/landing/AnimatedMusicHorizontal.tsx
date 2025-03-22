import React from "react";

const AnimatedMusicHorizontal = ({ scale = 1 }) => {
	return (
		<div>
			<ul
				className="flex justify-center items-center p-0 m-0 cursor-pointer hover:bg-black transition-all duration-200 ease-in-out border-4 border-black rounded-full bg-white"
				style={{
					width: 200 * scale,
					height: 45 * scale,
				}}>
				<li
					className="list-none h-8 w-1 rounded-lg bg-black mx-1.5 p-0 animate-wave1 hover:bg-white transition-all duration-200 ease-in-out"
					style={{
						height: 30 * scale,
						width: 4 * scale,
						margin: `0 ${6 * scale}px`,
					}}
				/>
				<li
					className="list-none h-8 w-1 rounded-lg bg-black mx-1.5 p-0 animate-wave2 hover:bg-white transition-all duration-200 ease-in-out"
					style={{
						height: 30 * scale,
						width: 4 * scale,
						margin: `0 ${6 * scale}px`,
						animationDelay: "0.2s",
					}}
				/>
				<li
					className="list-none h-8 w-1 rounded-lg bg-black mx-1.5 p-0 animate-wave3 hover:bg-white transition-all duration-200 ease-in-out"
					style={{
						height: 30 * scale,
						width: 4 * scale,
						margin: `0 ${6 * scale}px`,
						animationDelay: "0.23s",
						animationDuration: "0.4s",
					}}
				/>
				<li
					className="list-none h-8 w-1 rounded-lg bg-black mx-1.5 p-0 animate-wave4 hover:bg-white transition-all duration-200 ease-in-out"
					style={{
						height: 30 * scale,
						width: 4 * scale,
						margin: `0 ${6 * scale}px`,
						animationDelay: "0.1s",
						animationDuration: "0.3s",
					}}
				/>
				<li
					className="list-none h-8 w-1 rounded-lg bg-black mx-1.5 p-0 animate-wave1 hover:bg-white transition-all duration-200 ease-in-out"
					style={{
						height: 30 * scale,
						width: 4 * scale,
						margin: `0 ${6 * scale}px`,
						animationDelay: "0.5s",
					}}
				/>
				<li
					className="list-none h-8 w-1 rounded-lg bg-black mx-1.5 p-0 animate-wave2 hover:bg-white transition-all duration-200 ease-in-out"
					style={{
						height: 30 * scale,
						width: 4 * scale,
						margin: `0 ${6 * scale}px`,
						animationDuration: "0.5s",
					}}
				/>
			</ul>
			<style jsx>{`
				@keyframes wave1 {
					from {
						transform: scaleY(1);
					}
					to {
						transform: scaleY(0.5);
					}
				}
				@keyframes wave2 {
					from {
						transform: scaleY(0.3);
					}
					to {
						transform: scaleY(0.6);
					}
				}
				@keyframes wave3 {
					from {
						transform: scaleY(0.6);
					}
					to {
						transform: scaleY(0.8);
					}
				}
				@keyframes wave4 {
					from {
						transform: scaleY(0.2);
					}
					to {
						transform: scaleY(0.5);
					}
				}
				.animate-wave1 {
					animation-name: wave1;
					animation-duration: 0.3s;
					animation-iteration-count: infinite;
					animation-direction: alternate;
				}
				.animate-wave2 {
					animation-name: wave2;
					animation-duration: 0.3s;
					animation-iteration-count: infinite;
					animation-direction: alternate;
				}
				.animate-wave3 {
					animation-name: wave3;
					animation-duration: 0.3s;
					animation-iteration-count: infinite;
					animation-direction: alternate;
				}
				.animate-wave4 {
					animation-name: wave4;
					animation-duration: 0.3s;
					animation-iteration-count: infinite;
					animation-direction: alternate;
				}
			`}</style>
		</div>
	);
};

export default AnimatedMusicHorizontal;
