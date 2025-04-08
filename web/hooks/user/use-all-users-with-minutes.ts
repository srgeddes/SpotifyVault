import { useState, useEffect } from "react";

interface UserWithMinutes {
	id: string;
	displayName: string;
	spotifyId: string;
	profileImage?: string | null;
	minutesListened: number;
	profileURL: string;
}

export function useAllUsersWithMinutes(daysAgo: number = 100000) {
	const [users, setUsers] = useState<UserWithMinutes[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAllUsersWithMinutes = async () => {
			try {
				setLoading(true);
				const res = await fetch(`/api/spotify/user/minutes-listened-all?daysAgo=${daysAgo}`);
				if (!res.ok) {
					throw new Error("Error fetching users with minutes");
				}
				const data = await res.json();

				const usersWithProfileURL = data.users.map((user: Omit<UserWithMinutes, "profileURL">) => ({
					...user,
					profileURL: `https://open.spotify.com/user/${user.spotifyId}`,
				}));

				setUsers(usersWithProfileURL);
			} catch (err: any) {
				setError(err.message);
			}
			setLoading(false);
		};

		fetchAllUsersWithMinutes();
	}, [daysAgo]);

	return { users, error, loading };
}
