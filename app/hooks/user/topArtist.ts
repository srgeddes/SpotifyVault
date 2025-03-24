import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TopArtistsHook {
	topArtists: string[];
	loading: boolean;
	error: Error | null;
}

export function TopArtist(timeRange: string = "long_term", limit: number = 3): TopArtistsHook {
	const { data: session } = useSession();
	const [topArtists, setTopArtists] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		if (!session) return;

		setLoading(true);
		fetch(`/api/spotify/user/top-artist?time_range=${timeRange}&limit=${limit}`)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch top artists");
				return res.json();
			})
			.then((data) => {
				setTopArtists(data.topArtists);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching top artists:", err);
				setError(err);
				setLoading(false);
			});
	}, [session, timeRange, limit]);

	return { topArtists, loading, error };
}
