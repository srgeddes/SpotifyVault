"use client";

import useSWR from "swr";

export interface UserData {
	id: string;
	spotifyId: string;
	email?: string;
	displayName?: string;
	refreshToken?: string;
	createdAt: string;
	updatedAt: string;
}

const fetcher = (url: string): Promise<UserData> => fetch(url).then((res) => res.json());

export function useUserData(userId: string) {
	const { data, error } = useSWR<UserData>(userId ? `/api/spotify/user?id=${userId}` : null, fetcher);

	return {
		user: data,
		isLoading: !error && !data,
		isError: error,
	};
}
