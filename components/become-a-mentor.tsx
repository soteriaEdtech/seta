"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BecomeAMentor() {
	return (
		<section
			id="become-a-mentor"
			className="relative py-16 bg-linear-to-b from-transparent to-background"
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="bg-card border border-border rounded-2xl px-6 py-10 md:px-12 md:py-12 lg:flex lg:items-center lg:justify-between">
					<div className="max-w-3xl">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
							Stop Watching. <span className="text-primary">Start Shaping.</span>
						</h2>

						<p className="text-lg text-muted-foreground max-w-2xl">
							Are you passionate about growing the next generation of L&D talents? Partner with us as a mentor and provide expert guidance across SETA’s specialized learning tracks. You will support participants through real-world projects, design reviews, career guidance, and portfolio refinement—helping learners translate training into true job readiness.
						</p>
					</div>

					<div className="mt-6 lg:mt-0 lg:ml-8 shrink-0">
						<Button size="lg" className="text-base px-6 py-3">
							<Link target="_blank" href="https://luma.com/m2kujjme?tk=QenSyy" className="flex items-center justify-center w-full">
								Become a SETA mentor
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}

export default BecomeAMentor;

