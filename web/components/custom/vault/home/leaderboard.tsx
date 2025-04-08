"use client";
import { useAllUsersWithMinutes } from "@/hooks/user/use-all-users-with-minutes";
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";
import { User } from "lucide-react";
import { SpotifyLink } from "../../SpotifyLink";
import Image from "next/image";

export function Leaderboard({ className }: { className?: string }) {
	const { users, error, loading } = useAllUsersWithMinutes();

	const formatMinutes = (minutes: number): string => {
		if (!minutes || isNaN(minutes)) return "0m";
		const hours = Math.floor(minutes / 60);
		const mins = Math.round(minutes % 60);
		return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
	};

	const topUsers = users.slice(0, 5);
	const animatedUsers = [...topUsers].reverse();

	return (
		<div className={cn("relative flex w-5/6 flex-col overflow-visible", className)}>
			{loading ? (
				<div className="text-center p-4"></div>
			) : error ? (
				<div className="text-center text-red-500 p-4">Error loading leaderboard</div>
			) : (
				<div className="max-h-[40vh] overflow-y-auto pr-5 mt-2">
					<AnimatedList delay={200}>
						{animatedUsers.map((user, index) => {
							const rank = topUsers.length - index;
							return (
								<SpotifyLink key={user.id} id={user.spotifyId} externalUrl={user.profileURL} type="user">
									<div
										className={cn(
											"relative min-h-fit w-full cursor-pointer overflow-visible rounded-lg p-4",
											"transition-all duration-200 ease-in-out hover:scale-[101%]",
											"bg-white dark:bg-neutral-900 dark:backdrop-blur-md dark:border dark:border-white/10",
											"shadow-sm"
										)}>
										<div className="flex items-start gap-3">
											<div className="relative">
												<div
													className={cn(
														"absolute -left-1 -top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium z-10", // Added z-10 here
														rank === 1
															? "bg-yellow-400 text-black"
															: rank === 2
															? "bg-gray-300 text-black"
															: rank === 3
															? "bg-amber-700 text-white"
															: "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
													)}>
													{rank}
												</div>

												{user.profileImage ? (
													<div className="w-14 h-14 relative rounded-full overflow-hidden">
														<Image src={user.profileImage} alt="Artist" layout="fill" objectFit="cover" />
													</div>
												) : (
													<div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
														<User className="w-6 h-6 text-gray-400" />
													</div>
												)}
											</div>
											<div className="flex flex-col overflow-hidden flex-1">
												<span className="font-medium truncate">{user.displayName || "Anonymous User"}</span>
												<span className="text-sm text-gray-500 dark:text-neutral-400">{formatMinutes(user.minutesListened)} listened</span>
											</div>
										</div>
									</div>
								</SpotifyLink>
							);
						})}
					</AnimatedList>
				</div>
			)}
		</div>
	);
}
