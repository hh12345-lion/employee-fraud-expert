"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { photos } from "@/lib/photos";
import { photosFor } from "@/lib/pagePhotos";

/** Client only to read the path; rendered on the server with the page. */
export function HeroPhotos({ large = false }: { large?: boolean }) {
  const [a, b] = photosFor(usePathname() || "/");
  const main = photos[a];
  const second = photos[b];
  const size = large ? "h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]" : "h-[260px] w-[260px] sm:h-[330px] sm:w-[330px]";

  return (
    <div className="relative mx-auto flex w-full max-w-[460px] items-center justify-center py-6 lg:mx-0 lg:ml-auto">
      <div className={`ring ${size}`}>
        <div className="relative h-full w-full overflow-hidden rounded-full bg-sand">
          <Image src={main.src} alt={main.alt} fill priority sizes="400px" className="object-cover" />
        </div>
      </div>
      <div className="absolute bottom-2 left-0 h-32 w-32 overflow-hidden rounded-full border-[6px] border-cream shadow-xl sm:h-40 sm:w-40">
        <Image src={second.src} alt={second.alt} fill sizes="160px" className="object-cover" />
      </div>
      <span className="absolute right-6 top-4 h-6 w-6 rounded-full bg-accent" aria-hidden="true" />
      <span className="absolute bottom-10 right-2 h-4 w-4 rounded-full bg-sand" aria-hidden="true" />
    </div>
  );
}
