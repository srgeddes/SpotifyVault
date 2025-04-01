"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ban, Lock } from "lucide-react";

interface LockVaultModalProps {
	isOpen: boolean;
	onClose: () => void;
	onLockVault: () => void;
}

export function LockVaultModal({ isOpen, onClose, onLockVault }: LockVaultModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="min-w-1/2 h-1/2 flex flex-col">
				<DialogHeader className="flex-grow flex flex-col justify-center items-center text-center">
					<DialogTitle className="text-4xl mb-4">Lock SpotifyVault</DialogTitle>
					<DialogDescription className="text-xl text-foreground">
						Are you sure you want to lock your SpotifyVault? This means SpotifyVault will no longer track your Spotify data.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex justify-end space-x-4">
					<Button variant="secondary" onClick={onClose} className="px-6 py-3">
						Cancel
						<Ban />
					</Button>
					<Button variant="destructive" onClick={onLockVault} className="px-6 py-3">
						Lock
						<Lock />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
