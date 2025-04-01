import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export interface TopTrack {
	id: string;
	name: string;
	album: {
		images: { url: string }[];
	};
	external_urls: {
		spotify: string;
	};
}

interface TopTracksHook {
	topTracks: TopTrack[];
	loading: boolean;
	error: Error | null;
}

export function TopTracks(timeRange: string = "long_term", limit: number = 3): TopTracksHook {
	const { data: session } = useSession();
	const [topTracks, setTopTracks] = useState<TopTrack[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!session) return;

		setLoading(true);
		fetch(`/api/spotify/user/top-tracks?time_range=${timeRange}&limit=${limit}`)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch top tracks");
				return res.json();
			})
			.then((data) => {
				setTopTracks(data.topTracks);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching top tracks:", err);
				setError(err);
				setLoading(false);
			});
	}, [session, timeRange, limit]);

	return { topTracks, loading, error };
}
