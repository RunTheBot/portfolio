import React from "react";
import Header from "@/components/Header";
import HeroDeck from "@/components/HeroDeck";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { getProfile } from "@/lib/mdx";

export default function Home() {
  const profile = getProfile();

  return (
    <>
      <Header profile={profile} />
      <main className="max-w-[1400px] mx-auto px-6 md:px-10 pt-28 pb-20 space-y-24">
        <HeroDeck />
        <ExperienceSection />
        <ContactSection profile={profile} />
      </main>
      <ThemeSwitcher />
    </>
  );
}
