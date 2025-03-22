import Image from "next/image";

type LogoProps = {
	width?: number;
	height?: number;
};

export default function Logo({ width = 40, height = 40 }: LogoProps) {
	return (
		<div className="flex items-center justify-center">
			<Image src="/images/logo.png" width={width} height={height} alt="Logo" />
		</div>
	);
}
