import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function ShopDashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <div className="max-w-xl text-center space-y-6 p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          Shop Owner Portal
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Shop Dashboard</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Monitor incoming print queues, revenue, and active shop agents here.
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
