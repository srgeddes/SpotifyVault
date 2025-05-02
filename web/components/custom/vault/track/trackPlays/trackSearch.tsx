"use client";
import React, { useState, useEffect, useMemo } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useTrackPlays } from "@/hooks/user/track-plays";
import { useTrackMetadata } from "@/hooks/track/useTrackMetadata";
import Image from "next/image";

interface TrackSearchProps {
	onTrackSelect: (trackId: string) => void;
}

const TrackSearch: React.FC<TrackSearchProps> = ({ onTrackSelect }) => {
	const [open, setOpen] = useState(false);
	const { trackPlays, isLoading } = useTrackPlays();

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const counts = useMemo(() => {
		if (!trackPlays) return {};
		return trackPlays.reduce((acc: Record<string, number>, p) => {
			if (p.trackId) acc[p.trackId] = (acc[p.trackId] || 0) + 1;
			return acc;
		}, {});
	}, [trackPlays]);

	const trackIds = useMemo(() => Object.keys(counts), [counts]);
	const { metadata: allTracks, isLoading: isTracksLoading } = useTrackMetadata(trackIds);

	const tracksForSearch = useMemo(() => {
		if (!allTracks || allTracks.length === 0) return [];
		return allTracks
			.map((track) => ({
				id: track.trackId,
				name: track.name,
				imageUrl: track.albumImageUrl,
				playCount: counts[track.trackId] || 0,
			}))
			.sort((a, b) => b.playCount - a.playCount);
	}, [allTracks, counts]);

	const handleSelect = (trackId: string) => {
		onTrackSelect(trackId);
		setOpen(false);
	};

	return (
		<>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search tracks..." />
				<CommandList>
					<CommandEmpty>No tracks found</CommandEmpty>
					<CommandGroup heading="Tracks">
						{isLoading || isTracksLoading ? (
							<CommandItem disabled>Loading tracks...</CommandItem>
						) : (
							tracksForSearch.map((track) => (
								<CommandItem key={track.id} onSelect={() => handleSelect(track.id)} className="flex items-center gap-2 cursor-pointer">
									{track.imageUrl ? (
										<div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
											<Image src={track.imageUrl} alt={track.name} width={32} height={32} className="object-cover" />
										</div>
									) : (
										<div className="w-8 h-8 bg-muted rounded-full flex-shrink-0 flex items-center justify-center">
											<span className="text-xs">{track.name.substring(0, 2)}</span>
										</div>
									)}
									<div className="flex flex-col">
										<span>{track.name}</span>
										<span className="text-xs text-muted-foreground">{track.playCount} plays</span>
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

export default TrackSearch;
