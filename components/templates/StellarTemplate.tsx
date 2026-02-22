import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
import { getTextColorForBackground } from "@/lib/utils/template-colors";
interface StellarTemplateProps {
  resume: ResumeData;
}

export function StellarTemplate({ resume }: StellarTemplateProps) {
  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section>
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
          <section>
            <h2 className="font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
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
      case "projects":
        return (
          <section>
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
          <section>
            <h2 className="font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
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
                  <span className="text-gray-700 ml-2 text-xs">
                    {" "}
                    - {cert.issuer} ({cert.date}) {""}{" "}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      case "hobbies":
        return (
          <section>
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
  const sidebarColor = resume.templateColor || '#EFF6FF'; // Default blue-50
  const sidebarTextColor = getTextColorForBackground(sidebarColor);

  return (
    <div className="font-sans bg-white">
      <div className="grid grid-cols-5 gap-0">
        {" "}
        {""} {/* Left Column - Contact, Education, Skills */}
        <div 
          className="col-span-2 p-6 space-y-6"
          style={{ 
            backgroundColor: sidebarColor === 'transparent' ? '#EFF6FF' : sidebarColor,
            color: sidebarTextColor,
          }}
        >
          {" "}
          {""} {/* Header */}
          <div>
            <h1 
              className="font-bold mb-1"
              style={{ color: sidebarTextColor }}
            >
              {" "}
              {""} {resume.personalInfo.fullName || "Your Name"}
              {""}{" "}
            </h1>
            <p 
              className="text-xs"
              style={{ color: sidebarTextColor }}
            >
              {" "}
              {""} {resume.experiences?.[0]?.position || "Your Title"}
              {""}{" "}
            </p>
          </div>
          {""} {/* Contact */}
          <div>
            <h2 
              className="font-bold uppercase mb-2"
              style={{ color: sidebarTextColor }}
            >
              Contact 
            </h2>
            <div 
              className="space-y-1 text-xs"
              style={{ color: sidebarTextColor }}
            >
              {" "}
              {""}{" "}
              {resume.personalInfo.email && (
                <p>📧 {resume.personalInfo.email} </p>
              )}
              {""}{" "}
              {resume.personalInfo.phone && (
                <p>📞 {resume.personalInfo.phone} </p>
              )}
              {""}{" "}
              {resume.personalInfo.location && (
                <p>📍 {resume.personalInfo.location} </p>
              )}
            </div>
          </div>
          {""} {/* Education */}
          {""}{" "}
          {resume.education.length > 0 && (
            <div>
              <h2 
                className="font-bold uppercase mb-2"
                style={{ color: sidebarTextColor }}
              >
                {" "}
                Education{""}{" "}
              </h2>
              <div className="space-y-3">
                {" "}
                {""}{" "}
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <p 
                      className="font-semibold text-xs"
                      style={{ color: sidebarTextColor }}
                    >
                      {edu.degree 
                        ? (edu.field ? `${edu.degree} in ${edu.field}` : edu.degree)
                        : (edu.field || 'Education')
                      }{" "}
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: sidebarTextColor }}
                    >
                      {edu.institution || ''} 
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: sidebarTextColor }}
                    >
                      {" "}
                      {edu.startDate} - {edu.endDate}
                      {""}{" "}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {""} {/* Skills */}
          {""}{" "}
          {resume.skills.length > 0 && (
            <div>
              <h2 
                className="font-bold uppercase mb-2"
                style={{ color: sidebarTextColor }}
              >
                {" "}
                Skills{""}{" "}
              </h2>
              {""}{" "}
              <ul 
                className="list-disc list-inside space-y-1"
                style={{ color: sidebarTextColor }}
              >
                {" "}
                {""}{" "}
                {resume.skills.flatMap((skill) =>
                  skill.items.map((item, idx) => (
                    <li key={`${skill.id}-${idx}`}>{item}</li>
                  )),
                )}
                {""}{" "}
              </ul>
            </div>
          )}
        </div>
        {""} {/* Right Column - Summary & Experience */}
        <div className="col-span-3 p-6 space-y-6">
          {" "}
          {""}{" "}
          <TemplateSectionRenderer
            resume={resume}
            renderSection={renderSection}
          />
        </div>
      </div>
    </div>
  );
}
