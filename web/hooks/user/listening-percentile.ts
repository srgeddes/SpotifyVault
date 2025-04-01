import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useListeningPercentile(daysAgo: number = 10000) {
	const { data, error } = useSWR(`/api/spotify/user/listening-percentile?daysAgo=${daysAgo}`, fetcher);

	return {
		percentileData: data?.percentileData,
		loading: !error && !data,
		error,
	};
}
