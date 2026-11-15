import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ shopSlug: string }>;
}

export default async function CustomerShopPage({ params }: PageProps) {
  const { shopSlug } = await params;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-xl text-center space-y-6 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
          Customer Portal
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Shop:{" "}
          <span className="text-blue-600 dark:text-blue-400">{shopSlug}</span>
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Upload specifications and document upload flow placeholder for this
          shop.
        </p>
        <div className="pt-4">
          <Link href="/" className={buttonVariants({ variant: "outline" })}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
