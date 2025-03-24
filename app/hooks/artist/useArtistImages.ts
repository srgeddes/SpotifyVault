import { useEffect, useState } from "react";

export interface ArtistImages {
	[artist: string]: string | null;
}

export function useArtistImages(artists: string[]): ArtistImages {
	const [artistImages, setArtistImages] = useState<ArtistImages>({});

	useEffect(() => {
		const fetchImages = async () => {
			const images: ArtistImages = {};
			await Promise.all(
				artists.map(async (artist) => {
					try {
						const response = await fetch(`/api//spotify/artist?artist=${encodeURIComponent(artist)}`);
						const data = await response.json();
						images[artist] = data.imageUrl;
					} catch (error) {
						images[artist] = null;
					}
				})
			);
			setArtistImages(images);
		};

		fetchImages();
	}, [artists]);

	return artistImages;
}
