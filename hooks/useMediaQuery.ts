import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		if (typeof window !== "undefined") {
			const media = window.matchMedia(query);
			const updateMatch = () => setMatches(media.matches);
			updateMatch();
			media.addEventListener("change", updateMatch);
			return () => media.removeEventListener("change", updateMatch);
		}
	}, [query]);
	return matches;
};
