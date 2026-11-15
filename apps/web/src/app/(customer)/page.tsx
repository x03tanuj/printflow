import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Welcome to PrintFlow
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Upload your documents, choose print specifications, pay online, and
          pick up your prints seamlessly.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/s/campus-hub"
            className={buttonVariants({ variant: "default" })}
          >
            Customer Demo Shop (/s/campus-hub)
          </Link>
          <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
            Shop Dashboard (/shop)
          </Link>
        </div>
      </div>
    </main>
  );
}
