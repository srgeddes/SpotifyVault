"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			<motion.h1
				className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}>
				Terms of Service
			</motion.h1>
			<p className="mt-2 text-center text-gray-600 dark:text-gray-400">Last updated: June 2025</p>

			<motion.div
				className="mt-8 max-w-3xl mx-auto"
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.5 }}>
				<Card className="bg-white dark:bg-gray-800 shadow-lg">
					<CardContent className="px-6 py-8">
						<Accordion type="single" collapsible className="space-y-4">
							<AccordionItem value="eligibility">
								<AccordionTrigger className="text-lg font-medium">1. Eligibility</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<ul className="list-disc pl-5 space-y-1">
										<li>You must be at least 13 years old to use Sonalli.</li>
										<li>If you are under 18, you confirm that a parent or guardian has reviewed and agreed to these Terms on your behalf.</li>
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="account-registration">
								<AccordionTrigger className="text-lg font-medium">2. Account Registration</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<ul className="list-disc pl-5 space-y-1">
										<li>To use certain features, you will need to authenticate via Spotify.</li>
										<li>
											You are responsible for maintaining the confidentiality of your Spotify credentials and for any activity under your account.
										</li>
										<li>You agree not to share your account credentials or allow unauthorized access.</li>
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="user-content">
								<AccordionTrigger className="text-lg font-medium">3. User-Provided Content</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										Any playlists, comments, or content you create via Sonalli (“User Content”) remain yours. You grant Sonalli a non-exclusive,
										worldwide, royalty-free license to display, distribute, and otherwise use your User Content solely to operate and improve the
										Service. You represent and warrant that you own or have the necessary rights to any content you upload or share.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="prohibited-conduct">
								<AccordionTrigger className="text-lg font-medium">4. Prohibited Conduct</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>When using Sonalli, you agree not to:</p>
									<ul className="list-disc pl-5 space-y-1">
										<li>Violate any applicable laws or regulations.</li>
										<li>Collect or store personal information about other users without their consent.</li>
										<li>Reverse engineer, hack, or otherwise tamper with Sonalli or its underlying infrastructure.</li>
										<li>Use Sonalli for any commercial purpose without prior written permission.</li>
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="intellectual-property">
								<AccordionTrigger className="text-lg font-medium">5. Intellectual Property</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										All Sonalli trademarks, logos, and service names are our property or that of our licensors. You agree not to use them without
										permission. Sonalli does not claim any ownership of your Spotify playlists or music data; those remain subject to Spotify’s terms.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="disclaimers">
								<AccordionTrigger className="text-lg font-medium">6. Disclaimers &amp; Limitation of Liability</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										Sonalli is provided “as is.” We do not guarantee uninterrupted or error-free access. To the maximum extent permitted by law, in no
										event will Sonalli or Riley Geddes be liable for any indirect, special, incidental, or consequential damages arising from your use
										of (or inability to use) Sonalli. In jurisdictions that do not allow limiting liability, the above limitations may not apply to
										you.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="termination">
								<AccordionTrigger className="text-lg font-medium">7. Termination</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										We may suspend or terminate your access at any time, with or without cause or notice. Upon termination, all licenses granted to
										you will immediately cease.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="governing-law">
								<AccordionTrigger className="text-lg font-medium">8. Governing Law</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										These Terms are governed by the laws of the Commonwealth of Virginia, without regard to its conflict-of-laws principles. Any
										dispute must be resolved in state or federal courts in Charlottesville, Virginia.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="changes-to-terms">
								<AccordionTrigger className="text-lg font-medium">9. Changes to These Terms</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										We reserve the right to modify these Terms at any time. We will post the revised Terms with an updated “Last updated” date.
										Continued use after changes constitutes acceptance.
									</p>
									<p>
										If you have questions, reach out to{" "}
										<a href="mailto:rileygeddes@virginia.edu" className="text-blue-600 dark:text-blue-400 underline">
											rileygeddes@virginia.edu
										</a>
										.
									</p>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</CardContent>
				</Card>
			</motion.div>
		</div>
	);
}
