import { useState, useEffect } from "react";

interface User {
	id: string;
	displayName: string;
	spotifyId: string;
	profilePicture?: string | null;
}

export function useAllUsers() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchAllUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/spotify/user/all-users");
				if (!res.ok) {
					throw new Error("Error fetching users");
				}
				const data = await res.json();
				setUsers(data.users);
			} catch (err: any) {
				setError(err.message);
			}
			setLoading(false);
		};

		fetchAllUsers();
	}, []);

	return { users, loading, error };
}
