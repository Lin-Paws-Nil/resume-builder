import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
interface HyperionTemplateProps {
  resume: ResumeData;
}

export function HyperionTemplate({ resume }: HyperionTemplateProps) {
  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase mb-2 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="text-gray-700 leading-relaxed text-xs">
              {" "}
              {renderHTML(data)}
            </div>
          </section>
        );
      case "experiences":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-4">
              {" "}
              {""}{" "}
              {data.map((exp: any) => (
                <div key={exp.id} className="border-l-4 border-gray-800 pl-4 pb-1">
                  <div className="flex justify-between items-start mb-1 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">
                        {" "}
                        {exp.position}
                        {""}{" "}
                      </h3>
                      <p className="text-gray-600 font-medium text-xs mt-0.5">
                        {" "}
                        {exp.company}
                        {""}{" "}
                      </p>
                    </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap flex-shrink-0">
                      {" "}
                      {""} {exp.startDate} – {exp.current ? "Current" : exp.endDate}
                      {""}{" "}
                    </span>
                  </div>
                  {""}{" "}
                  {exp.description && (
                    <div className="mt-2 text-gray-700 text-xs leading-relaxed">
                      {" "}
                      {""} {renderDescription(exp.description)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "education":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((edu: any) => (
                <div key={edu.id} className="pb-1">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">
                    {" "}
                    {edu.degree 
                      ? (edu.field ? `${edu.degree} in ${edu.field}` : edu.degree)
                      : (edu.field || 'Education')
                    }
                    {""}{" "}
                  </h3>
                  <p className="text-gray-700 text-xs mt-0.5 font-medium">
                    {edu.institution || ''}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-gray-500 text-xs">
                      {" "}
                      {edu.startDate} – {edu.endDate}
                      {""}{" "}
                    </p>
                    {edu.gpa && (
                      <span className="text-gray-500 text-xs">• {edu.gpa}</span>
                    )}
                  </div>
                  {edu.honors && (
                    <p className="text-gray-600 text-xs mt-0.5 italic">{edu.honors}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "skills":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-2">
              {" "}
              {""}{" "}
              {data.map((skill: any) => (
                <div key={skill.id} className="pb-0.5">
                  {" "}
                  {""}{" "}
                  {skill.category && (
                    <span className="font-semibold text-gray-900 text-xs">
                      {" "}
                      {skill.category}:{" "}
                    </span>
                  )}
                  <span
                    className={`text-gray-700 text-xs ${skill.category ? "ml-1" : ""}`}
                  >
                    {" "}
                    {skill.items.join(", ")}
                    {""}{" "}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((proj: any) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-gray-900">{proj.name} </h3>
                  <div className="text-gray-700 text-xs">
                    {" "}
                    {renderHTML(proj.description)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-2">
              {" "}
              {""}{" "}
              {data.map((cert: any) => (
                <div key={cert.id} className="pb-0.5">
                  <span className="font-semibold text-gray-900 text-xs">
                    {" "}
                    {cert.name}
                    {""}{" "}
                  </span>
                  {cert.issuer && (
                    <span className="text-gray-700 ml-2 text-xs">
                      {" "}
                      – {cert.issuer}{cert.date && ` (${cert.date})`}
                      {""}{" "}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "hobbies":
        return (
          <section className="mb-6">
            <h2 className="font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <p className="text-gray-700 text-xs">
              {" "}
              {data.map((h: any) => h.name).join(",")}
              {""}{" "}
            </p>
          </section>
        );
      default:
        return null;
    }
  };
  return (
    <div className="font-sans bg-white">
      {" "}
      {""} {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-gray-900 mb-1 text-xl leading-tight">
              {" "}
              {""} {resume.personalInfo.fullName || "Your Name"}
              {""}{" "}
            </h1>
            <p className="text-gray-700 uppercase text-xs mt-0.5">
              {" "}
              {""} {resume.experiences?.[0]?.position || "Your Title"}
              {""}{" "}
            </p>
          </div>
          <div className="text-right text-gray-600 text-xs flex-shrink-0 space-y-0.5">
            {" "}
            {""}{" "}
            {resume.personalInfo.phone && <p className="leading-tight">{resume.personalInfo.phone} </p>}
            {""}{" "}
            {resume.personalInfo.email && <p className="leading-tight">{resume.personalInfo.email} </p>}
            {""}{" "}
            {resume.personalInfo.location && (
              <p className="leading-tight">{resume.personalInfo.location} </p>
            )}
          </div>
        </div>
      </div>
      {""}{" "}
      <TemplateSectionRenderer resume={resume} renderSection={renderSection} />
    </div>
  );
}
