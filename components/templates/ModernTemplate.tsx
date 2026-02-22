import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
import { lightenColor } from "@/lib/utils/template-colors";
interface ModernTemplateProps {
  resume: ResumeData;
}

export function ModernTemplate({ resume }: ModernTemplateProps) {
  const accentColor = resume.templateColor || '#2563EB'; // Default blue-600
  const borderColor = resume.templateColor 
    ? (resume.templateColor === 'transparent' ? '#DBEAFE' : lightenColor(resume.templateColor, 0.4))
    : '#DBEAFE'; // Default blue-200

  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section className="mb-6">
            <h2 
              className="font-semibold mb-2"
              style={{ color: accentColor }}
            >
              {displayName} 
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
            <h2 
              className="font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {displayName} 
            </h2>
            <div className="space-y-4">
              {" "}
              {""}{" "}
              {data.map((exp: any) => (
                <div 
                  key={exp.id} 
                  className="border-l-2 pl-4"
                  style={{ borderColor }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold">{exp.position} </h3>
                      <p className="text-gray-600 text-xs">{exp.company} </p>
                    </div>
                    <span className="text-gray-500 text-xs">
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
            </div>
          </section>
        );
      case "education":
        return (
          <section className="mb-6">
            <h2 
              className="font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {displayName} 
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((edu: any) => (
                <div 
                  key={edu.id} 
                  className="border-l-2 pl-4"
                  style={{ borderColor }}
                >
                  <h3 className="font-semibold">
                    {edu.degree 
                      ? (edu.field ? `${edu.degree} in ${edu.field}` : edu.degree)
                      : (edu.field || 'Education')
                    }
                  </h3>
                  <p className="text-gray-600 text-xs">{edu.institution || ''} </p>
                  <p className="text-gray-500 text-xs">
                    {" "}
                    {""} {edu.startDate} - {edu.endDate}
                    {""} {edu.gpa && ` • GPA: ${edu.gpa}`}
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
            <h2 
              className="font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {displayName} 
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((skill: any) => (
                <div key={skill.id}>
                  {" "}
                  {""}{" "}
                  {skill.category && (
                    <h3 className="font-medium text-gray-800">
                      {" "}
                      {skill.category}:{""}{" "}
                    </h3>
                  )}
                  <p className="text-gray-600 text-xs" style={{ fontSize: "12px" }}>
                    {skill.items.join(",")}{" "}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return (
          <section className="mb-6">
            <h2 
              className="font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {displayName} 
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((proj: any) => (
                <div 
                  key={proj.id} 
                  className="border-l-2 pl-4"
                  style={{ borderColor }}
                >
                  <h3 className="font-semibold">{proj.name} </h3>
                  <div className="text-gray-700 mt-1 text-xs">
                    {" "}
                    {renderHTML(proj.description)}
                  </div>
                  {""}{" "}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-gray-600 mt-1 text-xs">
                      {" "}
                      {""} Technologies: {proj.technologies.join(",")}
                      {""}{" "}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return (
          <section className="mb-6">
            <h2 
              className="font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {displayName} 
            </h2>
            <div className="space-y-2">
              {" "}
              {""}{" "}
              {data.map((cert: any) => (
                <div key={cert.id}>
                  <span className="font-medium">{cert.name} </span> -{""}{" "}
                  {cert.issuer} ({cert.date})
                </div>
              ))}
            </div>
          </section>
        );
      case "hobbies":
        return (
          <section className="mb-6">
            <h2 
              className="font-semibold mb-3"
              style={{ color: accentColor }}
            >
              {displayName} 
            </h2>
            <div className="flex flex-wrap gap-2">
              {" "}
              {""}{" "}
              {data.map((hobby: any) => (
                <span
                  key={hobby.id}
                  className="px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: accentColor === 'transparent' 
                      ? '#DBEAFE' 
                      : lightenColor(accentColor, 0.6),
                    color: accentColor === 'transparent' 
                      ? '#1E40AF' 
                      : accentColor,
                  }}
                >
                  {" "}
                  {""} {hobby.name}
                  {""}{" "}
                </span>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };
  return (
    <div className="font-sans">
      {" "}
      {""} {/* Header */}
      <div 
        className="border-b-2 pb-4 mb-6"
        style={{ borderColor: accentColor }}
      >
        <h1 className="font-bold text-gray-900">
          {" "}
          {""} {resume.personalInfo.fullName || "Your Name"}
          {""}{" "}
        </h1>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-xs">
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
          {""}{" "}
          {resume.personalInfo.linkedin && (
            <span>LinkedIn: {resume.personalInfo.linkedin} </span>
          )}
          {""}{" "}
          {resume.personalInfo.github && (
            <span>GitHub: {resume.personalInfo.github} </span>
          )}
        </div>
      </div>
      {""}{" "}
      <TemplateSectionRenderer resume={resume} renderSection={renderSection} />
    </div>
  );
}
