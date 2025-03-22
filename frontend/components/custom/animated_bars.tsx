import React from "react";
import styled from "styled-components";

interface AnimatedBarsProps {
	barwidth?: number;
	barcolor?: string;
	scale?: number;
}

const AnimatedBars: React.FC<AnimatedBarsProps> = ({ barwidth = 2, barcolor = "white", scale = 1 }) => {
	return (
		<StyledBars barwidth={barwidth} barcolor={barcolor} scale={scale}>
			<div className="loading">
				<div className="load"></div>
				<div className="load"></div>
				<div className="load"></div>
				<div className="load"></div>
			</div>
		</StyledBars>
	);
};

const StyledBars = styled.div<{ barwidth: number; barcolor: string; scale: number }>`
	transform: scale(${(props) => props.scale});

	.loading {
		display: flex;
		align-items: flex-end;
		height: 20px; /* Adjust as needed */
	}

	.load {
		width: ${(props) => props.barwidth}px;
		height: 20px; /* Adjust as needed */
		background-color: ${(props) => props.barcolor};
		animation: 1s move6 infinite;
		border-radius: 5px;
		margin: 0.1em;
		transform-origin: bottom;
	}

	.load:nth-child(1) {
		animation-delay: 0.2s;
	}

	.load:nth-child(2) {
		animation-delay: 0.4s;
	}

	.load:nth-child(3) {
		animation-delay: 0.6s;
	}

	/* Default state - no animation */
	.link-container:not(:hover) .load {
		animation: none;
		height: 5px;
	}

	@keyframes move6 {
		0% {
			height: 4px;
		}
		25% {
			height: 10px;
		}
		50% {
			height: 20px;
		}
		100% {
			height: 4px;
		}
	}
`;

export default AnimatedBars;
