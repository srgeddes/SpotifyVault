import AnimatedBars from "./animated_bars";

export default function Loading() {
	return (
		<div className="flex items-center justify-center h-100">
			<AnimatedBars scale={5} />
		</div>
	);
}
