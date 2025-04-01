"use client";

import useSWR from "swr";
import type { TrackMetadata } from "@/services/dynamoService";

const fetcher = (url: string): Promise<TrackMetadata[]> => fetch(url).then((res) => res.json());

export function useTrackMetadata(trackIds: string[]) {
	const queryString = trackIds.join(",");
	const { data, error } = useSWR<TrackMetadata[]>(`/api/spotify/track/trackMetadata?ids=${queryString}`, fetcher);

	return {
		metadata: data,
		isLoading: !error && !data,
		isError: error,
	};
}
