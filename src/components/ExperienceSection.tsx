import React from "react";
import { ExternalLink } from "lucide-react";
import { getExperiences, getEducation, getAwards } from "@/lib/mdx";

export default function ExperienceSection() {
  const experiences = getExperiences();
  const education = getEducation();
  const awards = getAwards();

  return (
    <section id="experience" className="space-y-12 scroll-mt-20">
      {/* Experience */}
      <div className="space-y-8">
        <h2 className="font-serif text-2xl text-[#f1eee7]">Experience</h2>

        <div className="space-y-10">
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <div>
                  <h3 className="text-[15px] text-[#f1eee7] font-medium">
                    {exp.role}
                  </h3>
                  <p className="text-[14px] text-white/40">{exp.organization}</p>
                </div>
                <p className="text-[12px] text-white/30 font-mono shrink-0">
                  {exp.period}
                </p>
              </div>

              <ul className="space-y-1.5">
                {exp.responsibilities.map((r, i) => (
                  <li
                    key={i}
                    className="text-[14px] leading-[1.7] text-white/45 pl-4 border-l border-white/[0.06]"
                  >
                    {r}
                  </li>
                ))}
              </ul>

              {exp.links && exp.links.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {exp.links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[12px] text-white/35 hover:text-white/70 transition-colors"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="space-y-4 pt-8 border-t border-white/[0.06]">
        <h2 className="font-serif text-2xl text-[#f1eee7]">Education</h2>
        <div className="space-y-1">
          <h3 className="text-[15px] text-[#f1eee7] font-medium">
            {education.institution}
          </h3>
          <p className="text-[14px] text-white/40">
            {education.degree} — {education.specialization}
          </p>
          <p className="text-[12px] text-white/30 font-mono">{education.period}</p>
        </div>
      </div>

      {/* Awards - brief */}
      <div className="space-y-4 pt-8 border-t border-white/[0.06]">
        <h2 className="font-serif text-2xl text-[#f1eee7]">Recognition</h2>
        <div className="space-y-3">
          {awards.map((award, i) => (
            <div key={i} className="flex items-baseline justify-between gap-4">
              <p className="text-[14px] text-white/45">{award.title}</p>
              <span className="text-[12px] text-white/25 font-mono shrink-0">
                {award.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
