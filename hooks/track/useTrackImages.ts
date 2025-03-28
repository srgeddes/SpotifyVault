import { useEffect, useState } from "react";

export interface TrackImages {
	[trackId: string]: string | null;
}

export function useTrackImages(trackIds: string[]): TrackImages {
	const [trackImages, setTrackImages] = useState<TrackImages>({});

	useEffect(() => {
		const fetchImages = async () => {
			const images: TrackImages = {};
			await Promise.all(
				trackIds.map(async (trackId) => {
					try {
						const response = await fetch(`/api/spotify/track?track=${encodeURIComponent(trackId)}`);
						const data = await response.json();
						images[trackId] = data.imageUrl;
					} catch (error) {
						images[trackId] = null;
					}
				})
			);
			setTrackImages(images);
		};

		fetchImages();
	}, [trackIds]);

	return trackImages;
}
