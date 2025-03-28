import { useState, useEffect } from "react";

export function useMinutesListened(daysAgo: number = 30) {
	const [minutesListened, setMinutesListened] = useState<number | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchMinutesListened = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/spotify/user/minutes-listened?daysAgo=${daysAgo}`);
				if (!res.ok) {
					throw new Error("Error fetching minutes listened");
				}
				const data = await res.json();
				setMinutesListened(data.minutesListened);
			} catch (err: any) {
				setError(err.message);
			}
			setLoading(false);
		};

		fetchMinutesListened();
	}, [daysAgo]);

	return { minutesListened, loading, error };
}
