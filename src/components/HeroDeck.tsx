import React from "react";
import { Link } from "next-view-transitions";
import { ArrowRight } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { getProjects } from "@/lib/mdx";

export default function HeroDeck() {
  const projects = getProjects();

  return (
    <section className="space-y-16">
      {/* Intro */}
      <div className="max-w-2xl space-y-5">
        <h1 className="font-serif text-4xl md:text-5xl text-[#f1eee7]">
          {PERSONAL_INFO.name}
        </h1>
        <p className="text-[15px] leading-[1.8] text-white/50">
          I&rsquo;m an incoming{" "}
          <span className="text-[#f1eee7]">Engineering Science</span> student at
          the University of Toronto, specializing in Robotics. Previously Chief
          Engineer for{" "}
          <a
            href="https://www.chiefdelphi.com/t/team-minekee-frc-7520-2026-robot-reveal-oasis/516166"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f1eee7] underline decoration-white/20 underline-offset-[3px] hover:decoration-white/60 transition-colors"
          >
            FRC 7520
          </a>
          , where I led 60+ students to two consecutive World Championship
          appearances. I build control systems, embedded hardware, and software.
        </p>
        <p className="text-[15px] leading-[1.8] text-white/50">
          I also enjoy building{" "}
          <a
            href="https://github.com/RunTheBot/erLay"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f1eee7] underline decoration-white/20 underline-offset-[3px] hover:decoration-white/60 transition-colors"
          >
            3D printers
          </a>
          ,{" "}
          <a
            href="https://github.com/RunTheBot/AstralCNC"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#f1eee7] underline decoration-white/20 underline-offset-[3px] hover:decoration-white/60 transition-colors"
          >
            CNC controllers
          </a>
          , and occasionally competing in{" "}
          <span className="text-[#f1eee7]">hackathons</span>.
        </p>
      </div>

      {/* Project Cards with images */}
      <div id="projects">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group block rounded-none overflow-hidden bg-white/[0.02] border border-white/[0.15] hover:border-white/[0.3] transition-all duration-200 hover:-translate-y-1"
            >
              {/* Image */}
              {project.heroImage && (
                <div 
                  className="aspect-[16/10] w-full overflow-hidden bg-white/[0.02]"
                  style={{ viewTransitionName: `project-image-${project.id}` }}
                >
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              )}

              {/* Text */}
              <div className="p-5">
                <h3 
                  className="font-serif text-lg text-[#f1eee7] mb-1.5"
                  style={{ viewTransitionName: `project-title-${project.id}` }}
                >
                  {project.title}
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed mb-4 line-clamp-2">
                  {project.tagline}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-white/30 font-mono">
                    {project.year}
                  </span>
                  <span className="text-[12px] text-white/30 group-hover:text-white/60 flex items-center gap-1 transition-colors">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
