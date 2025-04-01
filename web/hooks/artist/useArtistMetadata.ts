"use client";

import useSWR from "swr";
import type { ArtistMetadata } from "@/services/dynamoService";

const fetcher = (url: string): Promise<ArtistMetadata[]> => fetch(url).then((res) => res.json());

export function useArtistMetadata(artistIds: string[]) {
	const queryString = artistIds.join(",");
	const { data, error } = useSWR<ArtistMetadata[]>(artistIds.length > 0 ? `/api/spotify/artist/artistMetadata?ids=${queryString}` : null, fetcher);
	return {
		metadata: data || [],
		isLoading: artistIds.length > 0 ? !error && !data : false,
		isError: error,
	};
}
