import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
interface ClassicTemplateProps {
  resume: ResumeData;
}

export function ClassicTemplate({ resume }: ClassicTemplateProps) {
  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase tracking-wide mb-2">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="text-gray-700 text-xs">{renderHTML(data)}</div>
          </section>
        );
      case "experiences":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase tracking-wide mb-3">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            {""}{" "}
            {data.map((exp: any) => (
              <div key={exp.id} className="mb-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-bold">{exp.position} </h3>
                    <p className="italic">{exp.company} </p>
                  </div>
                  <span className="">
                    {" "}
                    {""} {exp.startDate} -{""}{" "}
                    {exp.current ? "Present" : exp.endDate}
                    {""}{" "}
                  </span>
                </div>
                {""}{" "}
                {exp.description && (
                  <div className="mt-2 text-gray-700 text-xs">
                    {" "}
                    {""} {renderDescription(exp.description)}
                  </div>
                )}
              </div>
            ))}
          </section>
        );
      case "education":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase tracking-wide mb-3">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            {""}{" "}
            {data.map((edu: any) => (
              <div key={edu.id} className="mb-2">
                <h3 className="font-bold">
                  {" "}
                  {edu.degree 
                    ? (edu.field ? `${edu.degree} in ${edu.field}` : edu.degree)
                    : (edu.field || 'Education')
                  }
                  {""}{" "}
                </h3>
                <p>
                  {" "}
                  {edu.institution || ''} | {edu.startDate} - {edu.endDate}
                  {""}{" "}
                </p>
              </div>
            ))}
          </section>
        );
      case "skills":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase tracking-wide mb-3">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            {""}{" "}
            {data.map((skill: any) => (
              <div key={skill.id} className="mb-2" style={{ fontSize: "12px" }}>
                {" "}
                {""}{" "}
                {skill.category ? (
                  <span className="font-semibold">{skill.category}: </span>
                ) : null}
                {""} {skill.category ? "" : ""} {skill.items.join(",")}
              </div>
            ))}
          </section>
        );
      case "projects":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase tracking-wide mb-3">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            {""}{" "}
            {data.map((proj: any) => (
              <div key={proj.id} className="mb-3">
                <h3 className="font-bold">{proj.name} </h3>
                <div className="text-gray-700 text-xs">
                  {" "}
                  {renderHTML(proj.description)}
                </div>
              </div>
            ))}
          </section>
        );
      case "certifications":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase tracking-wide mb-3">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            {""}{" "}
            {data.map((cert: any) => (
              <div key={cert.id} className="mb-1">
                <span className="font-semibold">{cert.name} </span> -{""}{" "}
                {cert.issuer} ({cert.date})
              </div>
            ))}
          </section>
        );
      case "hobbies":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase tracking-wide mb-3">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <p>{data.map((h: any) => h.name).join(",")} </p>
          </section>
        );
      default:
        return null;
    }
  };
  return (
    <div className="font-serif">
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="font-bold uppercase tracking-wide">
          {" "}
          {""} {resume.personalInfo.fullName || "Your Name"}
          {""}{" "}
        </h1>
        <div className="mt-2">
          {" "}
          {""}{" "}
          {resume.personalInfo.email && (
            <span>{resume.personalInfo.email} | </span>
          )}
          {""}{" "}
          {resume.personalInfo.phone && (
            <span>{resume.personalInfo.phone} | </span>
          )}
          {""}{" "}
          {resume.personalInfo.location && (
            <span>{resume.personalInfo.location} </span>
          )}
          {""}{" "}
          {resume.personalInfo.linkedin && (
            <span>
              {" "}
              {""} |{""}{" "}
              <a
                href={
                  resume.personalInfo.linkedin.startsWith("http")
                    ? resume.personalInfo.linkedin
                    : `https://${resume.personalInfo.linkedin}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {" "}
                LinkedIn{" "}
              </a>
              {""}{" "}
            </span>
          )}
          {""}{" "}
          {resume.personalInfo.github && (
            <span>
              {" "}
              {""} |{""}{" "}
              <a
                href={
                  resume.personalInfo.github.startsWith("http")
                    ? resume.personalInfo.github
                    : `https://${resume.personalInfo.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {" "}
                GitHub{" "}
              </a>
              {""}{" "}
            </span>
          )}
        </div>
      </div>
      {""}{" "}
      <TemplateSectionRenderer resume={resume} renderSection={renderSection} />
    </div>
  );
}
