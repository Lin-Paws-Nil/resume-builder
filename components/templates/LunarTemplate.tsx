import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
interface LunarTemplateProps {
  resume: ResumeData;
}

export function LunarTemplate({ resume }: LunarTemplateProps) {
  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section className="mb-6">
            <h2 className="font-bold border-b border-gray-300 pb-2 mb-3 text-gray-900">
              {" "}
              {""} {displayName}
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
            <h2 className="font-bold border-b border-gray-300 pb-2 mb-3 text-gray-900">
              {" "}
              {""} {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-4">
              {" "}
              {""}{" "}
              {data.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {" "}
                        {exp.position}
                        {""}{" "}
                      </h3>
                      <p className="text-gray-600 text-xs">{exp.company} </p>
                    </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {" "}
                      {exp.startDate} – {exp.current ? "Current" : exp.endDate}
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
            </div>
          </section>
        );
      case "education":
        return (
          <section className="mb-6">
            <h2 className="font-bold border-b border-gray-300 pb-2 mb-3 text-gray-900">
              {" "}
              {""} {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((edu: any) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-gray-900" style={{ fontSize: '14px' }}>
                    {" "}
                    {edu.degree 
                      ? (edu.field ? `${edu.degree} in ${edu.field}` : edu.degree)
                      : (edu.field || 'Education')
                    }
                    {""}{" "}
                  </h3>
                  <p className="text-gray-600 text-xs">{edu.institution || ''} </p>
                  <p className="text-gray-500 text-xs">
                    {" "}
                    {edu.startDate} – {edu.endDate}
                    {edu.gpa && ` • ${edu.gpa}`}
                    {""}{" "}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "skills":
        return (
          <section className="mb-6">
            <h2 className="font-bold border-b border-gray-300 pb-2 mb-3 text-gray-900">
              {" "}
              {""} {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-2">
              {" "}
              {""}{" "}
              {data.map((skill: any) => (
                <div key={skill.id}>
                  {" "}
                  {""}{" "}
                  {skill.category && (
                    <span className="font-semibold text-gray-900 text-xs">
                      {" "}
                      {skill.category}:{""}{" "}
                    </span>
                  )}
                  <span
                    className={`text-gray-700 ${skill.category ? "ml-2" : ""}`}
                    style={{ fontSize: "12px" }}
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
            <h2 className="font-bold border-b border-gray-300 pb-2 mb-3 text-gray-900">
              {" "}
              {""} {displayName}
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
            <h2 className="font-bold border-b border-gray-300 pb-2 mb-3 text-gray-900">
              {" "}
              {""} {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-2">
              {" "}
              {""}{" "}
              {data.map((cert: any) => (
                <div key={cert.id}>
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
            <h2 className="font-bold border-b border-gray-300 pb-2 mb-3 text-gray-900">
              {" "}
              {""} {displayName}
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
      <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="font-bold text-gray-900 mb-2">
          {" "}
          {""} {resume.personalInfo.fullName || "Your Name"}
          {""}{" "}
        </h1>
        <p className="text-gray-700 mb-3 text-xs">
          {" "}
          {""} {resume.experiences?.[0]?.position || "Your Title"}
          {""}{" "}
        </p>
        <div className="flex justify-center gap-4 text-gray-600 text-xs">
          {" "}
          {""}{" "}
          {resume.personalInfo.email && (
            <span>{resume.personalInfo.email} </span>
          )}
          {""}{" "}
          {resume.personalInfo.phone && (
            <span>{resume.personalInfo.phone} </span>
          )}
          {""}{" "}
          {resume.personalInfo.location && (
            <span>{resume.personalInfo.location} </span>
          )}
        </div>
      </div>
      {""}{" "}
      <TemplateSectionRenderer resume={resume} renderSection={renderSection} />
    </div>
  );
}
