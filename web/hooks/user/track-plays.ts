"use client";
import useSWR from "swr";
import type { TrackPlay } from "@/services/dynamoService";

const fetcher = (url: string): Promise<TrackPlay[]> => fetch(url).then((res) => res.json());

export function useTrackPlays() {
	const { data, error } = useSWR<TrackPlay[]>("/api/spotify/user/track-plays", fetcher);

	return {
		trackPlays: data,
		isLoading: !error && !data,
		isError: error,
	};
}
