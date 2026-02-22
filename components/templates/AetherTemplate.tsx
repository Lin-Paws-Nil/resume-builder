import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
interface AetherTemplateProps {
  resume: ResumeData;
}

export function AetherTemplate({ resume }: AetherTemplateProps) {
  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section>
            <h2 className="font-bold mb-2 text-gray-900">{displayName}</h2>
            <div className="text-gray-700 leading-relaxed text-xs">
              {" "}
              {renderHTML(data)}
            </div>
          </section>
        );
      case "experiences":
        return (
          <section>
            <h2 className="font-bold mb-3 text-gray-900">{displayName}</h2>
            <div className="space-y-4">
              {" "}
              {""}{" "}
              {data.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {" "}
                        {exp.position}{" "}
                      </h3>
                      <p className="text-gray-600 text-xs">{exp.company}</p>
                    </div>
                    <span className="text-gray-500 text-xs">
                      {" "}
                      {""} {exp.startDate} –{""}{" "}
                      {exp.current ? "Current" : exp.endDate}
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
          <section>
            <h2 className="font-bold mb-3 text-gray-900">{displayName}</h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((edu: any) => (
                <div key={edu.id}>
                  <h3 className="font-bold text-gray-900">
                    {" "}
                    {edu.degree 
                      ? (edu.field ? `${edu.degree} in ${edu.field}` : edu.degree)
                      : (edu.field || 'Education')
                    }{" "}
                  </h3>
                  <p className="text-gray-600 text-xs">{edu.institution || ''}</p>
                  <p className="text-gray-500 text-xs">
                    {" "}
                    {edu.startDate} - {edu.endDate}{" "}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "skills":
        return (
          <section>
            <h2 className="font-bold mb-3 text-gray-900">{displayName}</h2>
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
                      {skill.category}:{" "}
                    </span>
                  )}
                  <span
                    className={`text-gray-700 ${skill.category ? "ml-2" : ""}`}
                    style={{ fontSize: "12px" }}
                  >
                    {" "}
                    {skill.items.join(",")}{" "}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return (
          <section>
            <h2 className="font-bold mb-3 text-gray-900">{displayName}</h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((proj: any) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
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
          <section>
            <h2 className="font-bold mb-3 text-gray-900">{displayName}</h2>
            <div className="space-y-2">
              {" "}
              {""}{" "}
              {data.map((cert: any) => (
                <div key={cert.id}>
                  <span className="font-semibold text-gray-900 text-xs">
                    {" "}
                    {cert.name}{" "}
                  </span>
                  <span className="text-gray-700 ml-2 text-xs">
                    {" "}
                    - {cert.issuer} ({cert.date}){" "}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      case "hobbies":
        return (
          <section>
            <h2 className="font-bold mb-3 text-gray-900">{displayName}</h2>
            <p className="text-gray-700 text-xs">
              {" "}
              {data.map((h: any) => h.name).join(",")}{" "}
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
      {""} {/* Header Banner */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-bold mb-1">
              {" "}
              {""} {resume.personalInfo.fullName || "Your Name"}
              {""}{" "}
            </h1>
            <div className="flex gap-4">
              {" "}
              {""}{" "}
              {resume.personalInfo.email && (
                <span>{resume.personalInfo.email}</span>
              )}
              {""}{" "}
              {resume.personalInfo.phone && (
                <span>{resume.personalInfo.phone}</span>
              )}
              {""}{" "}
              {resume.personalInfo.location && (
                <span>{resume.personalInfo.location}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      {""} {/* Title */}
      <div className="text-center py-3 border-b-2 border-blue-600">
        <p className="font-semibold text-gray-900 text-xs">
          {" "}
          {""} {resume.experiences?.[0]?.position || "Your Title"}
          {""}{" "}
        </p>
      </div>
      <div className="p-6 space-y-6">
        {" "}
        {""}{" "}
        <TemplateSectionRenderer
          resume={resume}
          renderSection={renderSection}
        />
      </div>
    </div>
  );
}
