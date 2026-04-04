import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 font-sans">
      <main className="container mx-auto px-4 py-32 flex flex-col items-center text-center gap-6">
        <h1 className="text-5xl md:text-7xl font-extrabold font-heading tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
          Modern Ecommerce <br />
          <span className="text-zinc-500">Premium Experiences.</span>
        </h1>
        <p className="max-w-[600px] text-lg text-zinc-600 dark:text-zinc-400">
          Discover a world of curated products designed for those who value quality and modern aesthetics.
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Button size="lg" asChild className="rounded-full px-8 h-12 text-base font-medium">
            <Link href="/shop">Shop Now</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="rounded-full px-8 h-12 text-base font-medium border-zinc-200">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
