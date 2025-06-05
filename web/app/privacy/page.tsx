"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
			<motion.h1
				className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}>
				Privacy Policy
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
							<AccordionItem value="information-collect">
								<AccordionTrigger className="text-lg font-medium">1. Information We Collect</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<h3>1.1 Information You Provide</h3>
									<ul className="list-disc pl-5 space-y-1">
										<li>
											<strong>Registration Data:</strong> When you log in with Spotify, Sonalli will receive your Spotify username, user ID, email
											address, and profile picture URL.
										</li>
										<li>
											<strong>User Content:</strong> Any playlists you create, comments you post, or other content you voluntarily share.
										</li>
									</ul>
									<h3>1.2 Automatically Collected Data</h3>
									<ul className="list-disc pl-5 space-y-1">
										<li>
											<strong>Usage Data:</strong> We track how you interact with the Service (e.g., pages you visit, features you use, timestamps).
										</li>
										<li>
											<strong>Device Data:</strong> Information about your device (e.g., browser type, operating system, IP address) to help us
											optimize performance.
										</li>
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="how-use-information">
								<AccordionTrigger className="text-lg font-medium">2. How We Use Your Information</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<ul className="list-disc pl-5 space-y-1">
										<li>
											<strong>To Provide and Improve the Service:</strong> We use your data to authenticate you via Spotify, fetch your Spotify
											playlists, and power Sonalli’s features.
										</li>
										<li>
											<strong>Analytics:</strong> To analyze user trends, diagnose problems, and improve functionality.
										</li>
										<li>
											<strong>Communication:</strong> To send you important updates, marketing emails (if you opt in), and respond to support
											requests.
										</li>
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="sharing-information">
								<AccordionTrigger className="text-lg font-medium">3. Sharing Your Information</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<ul className="list-disc pl-5 space-y-1">
										<li>
											<strong>With Third-Party Providers:</strong> We share data with service providers who help us run Sonalli (e.g., hosting,
											analytics).
										</li>
										<li>
											<strong>Legal Requirements:</strong> We may disclose your information if required by law, or to protect our rights or others’
											safety.
										</li>
										<li>
											<strong>Aggregate/Anonymized Data:</strong> We may share non-identifying aggregated statistics publicly or with partners.
										</li>
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="cookies-tracking">
								<AccordionTrigger className="text-lg font-medium">4. Cookies &amp; Tracking Technologies</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										We use cookies and similar tracking technologies to remember your preferences, authenticate sessions, and understand usage
										patterns. You can disable cookies in your browser settings, but this may affect functionality.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="data-security">
								<AccordionTrigger className="text-lg font-medium">5. Data Security</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										We implement reasonable security measures (encryption, secure servers) to protect your information. However, no internet
										transmission is 100% secure—use at your own risk.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="your-rights">
								<AccordionTrigger className="text-lg font-medium">6. Your Rights</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<ul className="list-disc pl-5 space-y-1">
										<li>
											<strong>Access &amp; Correction:</strong> You may request a copy of your data or ask us to correct inaccuracies.
										</li>
										<li>
											<strong>Deletion:</strong> If you wish to delete your Sonalli account, email{" "}
											<a href="mailto:rileygeddes@virginia.edu" className="text-blue-600 dark:text-blue-400 underline">
												rileygeddes@virginia.edu
											</a>
											. We will remove your data within 30 days, unless otherwise required by law.
										</li>
									</ul>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="children-privacy">
								<AccordionTrigger className="text-lg font-medium">7. Children’s Privacy</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										Sonalli is not intended for children under 13. We do not knowingly collect data from anyone under 13. If we learn we have
										collected information from a child under 13, we will delete it as soon as possible.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="changes-policy">
								<AccordionTrigger className="text-lg font-medium">8. Changes to This Privacy Policy</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										We may update this policy periodically. We will post the revised policy with a new “Last updated” date. Continued use after
										changes means you accept the updated policy.
									</p>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="contact-us">
								<AccordionTrigger className="text-lg font-medium">9. Contact Us</AccordionTrigger>
								<AccordionContent className="mt-2 prose prose-sm text-gray-700 dark:prose-dark dark:text-gray-300">
									<p>
										If you have any questions or concerns about this Privacy Policy, please contact us at{" "}
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
