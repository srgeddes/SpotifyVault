import { useEffect, useState } from "react";

export function TopUsers(daysAgo: number = 30, numUsers: number = 5) {
	const [topUsers, setTopUsers] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTopUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/spotify/user/top-users?daysAgo=${daysAgo}&numUsers=${numUsers}`);
				if (!res.ok) {
					throw new Error("Error fetching top users");
				}
				const data = await res.json();
				setTopUsers(data.topUsers);
			} catch (err: any) {
				setError(err.message);
			}
			setLoading(false);
		};

		fetchTopUsers();
	}, [daysAgo, numUsers]);

	return { topUsers, loading, error };
}
