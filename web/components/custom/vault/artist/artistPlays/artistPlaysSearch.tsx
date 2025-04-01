import React, { useState, useEffect, useMemo } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useArtistMetadata } from "@/hooks/artist/useArtistMetadata";
import Image from "next/image";

interface ArtistSearchCommandProps {
	onArtistSelect: (artistId: string) => void;
}

const ArtistSearchCommand: React.FC<ArtistSearchCommandProps> = ({ onArtistSelect }) => {
	const [open, setOpen] = useState(false);
	const { trackPlays, isLoading } = useTrackPlays();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const artistsWithPlayCounts = useMemo(() => {
		if (!trackPlays) return [];
		const counts: Record<string, number> = {};

		trackPlays.forEach((play: { artistIds?: string }) => {
			if (play.artistIds) {
				const ids = play.artistIds.split(",").map((id: string) => id.trim());
				ids.forEach((id: string) => {
					if (id) counts[id] = (counts[id] || 0) + 1;
				});
			}
		});

		return Object.entries(counts).map(([id, count]) => ({
			id,
			playCount: count,
		}));
	}, [trackPlays]);

	const { metadata: allArtistsMetadata, isLoading: isAllArtistsMetadataLoading } = useArtistMetadata(
		artistsWithPlayCounts.map((artist) => artist.id)
	);

	const artistsForSearch = useMemo(() => {
		if (!allArtistsMetadata || allArtistsMetadata.length === 0) return [];

		return allArtistsMetadata
			.map((artist) => {
				const artistWithCount = artistsWithPlayCounts.find((a) => a.id === artist.artistId);
				return {
					id: artist.artistId,
					name: artist.name,
					imageUrl: artist.imageUrl,
					playCount: artistWithCount?.playCount || 0,
				};
			})
			.sort((a, b) => b.playCount - a.playCount);
	}, [allArtistsMetadata, artistsWithPlayCounts]);

	const handleSelect = (artistId: string) => {
		onArtistSelect(artistId);
		setOpen(false);
	};

	return (
		<>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search artists..." />
				<CommandList>
					<CommandEmpty>No artists found</CommandEmpty>
					<CommandGroup heading="Artists">
						{isLoading || isAllArtistsMetadataLoading ? (
							<CommandItem disabled>Loading artists...</CommandItem>
						) : (
							artistsForSearch.map((artist) => (
								<CommandItem key={artist.id} onSelect={() => handleSelect(artist.id)} className="flex items-center gap-2 cursor-pointer">
									{artist.imageUrl ? (
										<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
											<Image src={artist.imageUrl} alt={artist.name} width={32} height={32} className="object-cover" />
										</div>
									) : (
										<div className="w-8 h-8 bg-muted rounded-full flex-shrink-0 flex items-center justify-center">
											<span className="text-xs">{artist.name.substring(0, 2)}</span>
										</div>
									)}
									<div className="flex flex-col">
										<span>{artist.name}</span>
										<span className="text-xs text-muted-foreground">{artist.playCount} plays</span>
									</div>
								</CommandItem>
							))
						)}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	);
};

export default ArtistSearchCommand;
