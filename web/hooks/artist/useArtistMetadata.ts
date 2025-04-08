"use client";

import useSWR from "swr";
import type { ArtistMetadata } from "@/services/dynamoService";

const fetcher = async (url: string): Promise<ArtistMetadata[]> => {
	const res = await fetch(url);
	const data = await res.json();
	if (!res.ok) {
		throw new Error(data.error || "Failed to fetch artist metadata");
	}
	return Array.isArray(data) ? data : [data];
};

export function useArtistMetadata(artistIds: string[]) {
	const queryString = artistIds.join(",");
	const { data, error } = useSWR<ArtistMetadata[]>(artistIds.length > 0 ? `/api/spotify/artist/artistMetadata?ids=${queryString}` : null, fetcher);
	return {
		metadata: data || [],
		isLoading: artistIds.length > 0 ? !error && !data : false,
		isError: error,
	};
}
