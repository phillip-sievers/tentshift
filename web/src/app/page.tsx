import Link from "next/link";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
            <main className="flex flex-col items-center gap-8 p-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight">TentShift</h1>
                <p className="text-xl text-muted-foreground">
                    K-Ville Scheduling & Management
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Link
                        href="/login"
                        className="rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                        <h2 className="mb-2 text-xl font-semibold">
                            Login &rarr;
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Sign in to your account.
                        </p>
                    </Link>

                    <Link
                        href="/dashboard"
                        className="rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                        <h2 className="mb-2 text-xl font-semibold">
                            Dashboard &rarr;
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            View your tent's status.
                        </p>
                    </Link>

                    <Link
                        href="/dashboard/availability"
                        className="rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                        <h2 className="mb-2 text-xl font-semibold">
                            Availability &rarr;
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your schedule.
                        </p>
                    </Link>

                    <Link
                        href="/onboarding"
                        className="rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                        <h2 className="mb-2 text-xl font-semibold">
                            Onboarding &rarr;
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Create or join a tent.
                        </p>
                    </Link>
                </div>
            </main>
        </div>
    );
}
