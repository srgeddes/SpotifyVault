import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQSection() {
	return (
		<Accordion type="single" collapsible className="w-1/2">
			<AccordionItem value="item-1">
				<AccordionTrigger className="cursor-pointer">How is SpotifyVault different from Spotify Wrapped</AccordionTrigger>
				<AccordionContent>
					SpotifyVault offers year-round, in-depth insights into your Spotify activity with rich visuals and customizable data, unlike Spotify Wrapped
					which is a once-a-year summary. With SpotifyVault, you can track your music trends anytime—not just in December.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger className="cursor-pointer">What types of metrics does SpotifyVault track that Spotify Wrapped does not?</AccordionTrigger>
				<AccordionContent>
					The biggest difference is that SpotifyVault tracks individual listens in real time, rather than relying on broad yearly summaries. This
					means you can explore detailed trends like how often you listen to a specific song, changes in your favorite genres over time, and even your
					daily or weekly listening patterns. These granular insights allow SpotifyVault to generate rich, personalized visuals that evolve with your
					music taste all year long.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger className="cursor-pointer">How often is my Spotify data updated in SpotifyVault</AccordionTrigger>
				<AccordionContent>Once you connect your account, SpotifyVault will start updating your listening stats every 2 hours</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
