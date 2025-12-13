"use client";

import { Info, Heart, HelpCircle, Mail, Github, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header / Back Navigation */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/?tab=schedule")}
                        className="px-4 py-2 text-sm font-medium text-[#003087] bg-blue-50/50 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2">
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold text-[#003087]">
                        About K-Ville Scheduler
                    </h1>
                </div>

                {/* Project Info Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-xl font-semibold text-[#003087]">
                        <Info className="w-6 h-6" />
                        <h2>What is this?</h2>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-4">
                        <p className="leading-relaxed text-muted-foreground">
                            The K-Ville Scheduler is a dedicated tool designed
                            to help Duke students manage their tenting schedules
                            efficiently. We know how chaotic K-Ville can get,
                            and this project aims to streamline the process of
                            scheduling shifts, trading spots, and ensuring your
                            tent is always covered.
                        </p>
                        <p className="leading-relaxed text-muted-foreground">
                            Our goal is to reduce the stress of tenting so you
                            can focus on the fun parts of the season (and the
                            game!).
                        </p>
                    </div>
                </section>

                {/* Donation Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-xl font-semibold text-[#003087]">
                        <Heart className="w-6 h-6 text-[#DA291C]" />{" "}
                        {/* Using a red-ish color for heart, or maybe Duke Copper */}
                        <h2>Support the Project</h2>
                    </div>
                    <div className="p-6 bg-blue-50/30 border border-blue-100 rounded-xl shadow-sm">
                        <p className="mb-6 text-muted-foreground">
                            This project is built and maintained by students for
                            students. If you find it helpful, consider
                            supporting us to keep the servers running and the
                            coffee flowing!
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() =>
                                    alert("Donation link coming soon!")
                                }
                                className="px-6 py-3 bg-[#003087] text-white rounded-lg font-medium hover:bg-[#00246b] transition-colors shadow-sm">
                                Buy us a Coffee ☕
                            </button>
                            <button
                                onClick={() => alert("Venmo link coming soon!")}
                                className="px-6 py-3 bg-[#3D8FCA] text-white rounded-lg font-medium hover:bg-[#2e7bb0] transition-colors shadow-sm">
                                Venmo
                            </button>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-xl font-semibold text-[#003087]">
                        <HelpCircle className="w-6 h-6" />
                        <h2>Frequently Asked Questions</h2>
                    </div>
                    <div className="grid gap-4">
                        {[
                            {
                                q: "Is this official?",
                                a: "No, this is a student-run project and is not officially affiliated with K-Ville Line Monitors (yet!).",
                            },
                            {
                                q: "How do I report a bug?",
                                a: "You can reach out to us via the contact section below or submit an issue on our GitHub.",
                            },
                            {
                                q: "Is my data safe?",
                                a: "Yes, we prioritize privacy. We only store essential schedule data and do not share it with third parties.",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="p-4 bg-card border border-border rounded-lg">
                                <h3 className="font-medium text-[#003087] mb-2">
                                    {item.q}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* "Me" Placeholder Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-xl font-semibold text-[#003087]">
                        <h2>Meet the Developer</h2>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-2xl">
                            👋
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">
                                Phillip Sievers
                            </h3>
                            <p className="text-muted-foreground mb-2">
                                Lead Developer & Tenter
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Just a CS student trying to make tenting a bit
                                easier. Always open to feedback and feature
                                requests!
                            </p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="pt-12 pb-6 border-t border-border mt-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="font-bold text-[#003087] mb-4">
                                K-Ville Scheduler
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} All rights
                                reserved.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>
                                    <a
                                        href="mailto:contact@kvillescheduler.com"
                                        className="hover:text-[#003087] flex items-center gap-2">
                                        <Mail className="w-4 h-4" />{" "}
                                        contact@kvillescheduler.com
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Socials</h4>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-[#003087]">
                                    <Github className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="text-muted-foreground hover:text-[#003087]">
                                    <Twitter className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
