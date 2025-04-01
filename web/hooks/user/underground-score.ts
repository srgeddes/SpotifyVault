import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUndergroundScore() {
	const { data, error } = useSWR("/api/spotify/user/underground-score", fetcher);

	return {
		undergroundScore: data?.undergroundScore,
		loading: !error && !data,
		error,
	};
}
