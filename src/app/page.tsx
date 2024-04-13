import Image from "next/image";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
      <main className="flex min-h-screen h-screen flex-col items-center justify-between w-full">
          <section>
              <Hero/>
          </section>
      </main>
  );
}
