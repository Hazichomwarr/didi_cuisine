//app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { MENU } from "./_menuConfig/menu";
import PageTransition from "./_components/ui/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <main className="min-h-screen bg-neutral-950 text-neutral-100">
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          {/* Background Image */}
          <Image
            src="/foodImages/gnoo.jpeg"
            alt="Wifey Kitchen signature dishes"
            fill
            priority
            className="object-cover opacity-40"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80" />

          {/* Content */}
          <div className="relative mx-auto max-w-6xl px-6 py-32 text-center">
            <span className="mb-4 inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-sm text-amber-300">
              Home-style • Slow-marinated • Made with love
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Food That Tastes <br />
              <span className="text-amber-400">Like Home</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-300">
              At <span className="font-bold italic text-teal-300">DIDI's</span>,
              every dish is seasoned for days, grilled to perfection, and cooked
              the way family deserves.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/order"
                className="rounded-full bg-amber-400 px-8 py-3 font-semibold text-neutral-900 transition hover:bg-amber-300"
              >
                Order Now
              </Link>

              <Link
                href="#menu"
                className="rounded-full border border-neutral-600 px-8 py-3 text-neutral-200 transition hover:border-neutral-400"
              >
                View Menu
              </Link>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 sm:grid-cols-3">
            <Feature
              title="Slow-Seasoned"
              description="Our meats are marinated for up to 48 hours so flavor runs deep — not just on the surface."
            />
            <Feature
              title="Grilled Fresh"
              description="Every order is grilled fresh. No shortcuts. No reheats. Just real cooking."
            />
            <Feature
              title="Cooked with Care"
              description="This is food made with intention — the kind you remember and crave again."
            />
          </div>
        </section>

        {/* SIGNATURE DISH */}
        <section id="menu" className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Our Signature Favorites
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-neutral-400">
            Simple menu. Bold flavors. Every item perfected.
          </p>

          <div className="mt-16 grid gap-10 sm:grid-cols-3">
            <Dish
              id={MENU.dibi.id}
              label={MENU.dibi.label}
              note="48-hour seasoned • Smoky & tender"
            />
            <Dish
              id={MENU.chicken.id}
              label={MENU.chicken.label}
              note="Juicy • Deeply marinated"
            />
            <Dish
              id={MENU["jollof-rice"].id}
              label={MENU["jollof-rice"].label}
              note="Rich • Comforting • Legendary"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-amber-400 text-neutral-900">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <h3 className="text-3xl font-bold">
              Ready for a real home-style meal?
            </h3>
            <p className="mt-4 text-lg">
              Orders are limited to maintain quality.
            </p>

            <Link
              href="/order"
              className="mt-8 inline-block rounded-full bg-neutral-900 px-10 py-4 font-semibold text-amber-400 transition hover:bg-neutral-800"
            >
              Place Your Order
            </Link>
          </div>
        </section>
        <footer className="mt-2 p-2 text-end text-xs text-stone-200 border border-amber-300">
          Created&Designed By{" "}
          <span className="text-yellow-400">Hamza Mare</span>. &copy; 2026 All
          rights reserved.
        </footer>
      </main>
    </PageTransition>
  );
}

/* ---------- Components ---------- */

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8">
      <h3 className="text-xl font-semibold text-amber-400">{title}</h3>
      <p className="mt-3 text-neutral-400">{description}</p>
    </div>
  );
}

function Dish({
  id,
  label,
  note,
}: {
  id?: string;
  label: string;
  note: string;
}) {
  let imgScr = "";
  if (id === "dibi") imgScr = "/foodImages/dibi.jpeg";
  else if (id === "chicken") imgScr = "/foodImages/chicken.jpeg";
  else if (id === "jollof-rice") imgScr = "/foodImages/jollof-rice.jpeg";

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 flex flex-col items-center justify-between">
      <h4 className="text-xl font-semibold">{label}</h4>
      <img src={imgScr} alt={label} className="rounded-lg p-2 w-cover" />
      <p className="mt-2 text-neutral-400">{note}</p>
    </div>
  );
}
