import React, { useState } from "react";

export interface ArtistOption {
	id: string;
	name: string;
}

interface ArtistSearchProps {
	options: ArtistOption[];
	onSelect: (artistId: string) => void;
}

const ArtistSearch: React.FC<ArtistSearchProps> = ({ options, onSelect }) => {
	const [query, setQuery] = useState("");

	const filteredOptions = options.filter((opt) => opt.name.toLowerCase().includes(query.toLowerCase()));

	return (
		<div className="relative">
			<input
				type="text"
				value={query}
				placeholder="Search Artist"
				onChange={(e) => {
					setQuery(e.target.value);
					if (e.target.value === "") onSelect("");
				}}
				className="w-full border rounded-md p-2 text-sm bg-background h-9"
			/>
			{query && filteredOptions.length > 0 && (
				<div className="absolute z-10 bg-background border rounded-md w-full mt-1 max-h-40 overflow-auto">
					{filteredOptions.map((option) => (
						<div
							key={option.id}
							onClick={() => {
								onSelect(option.id);
								setQuery(option.name);
							}}
							className="p-2 hover:bg-muted cursor-pointer text-sm">
							{option.name}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default ArtistSearch;
