import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
import { getTextColorForBackground } from "@/lib/utils/template-colors";

interface AuroraTemplateProps {
  resume: ResumeData;
}

export function AuroraTemplate({ resume }: AuroraTemplateProps) {
  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section>
            <h2 className="text-lg font-bold uppercase mb-3 text-gray-900">
              {displayName}
            </h2>
            <div className="text-gray-700 leading-relaxed text-xs">
              {renderHTML(data)}
            </div>
          </section>
        );
      case "experiences":
        return (
          <section>
            <h2 className="text-lg font-bold uppercase mb-3 text-gray-900">
              {displayName}
            </h2>
            <div className="space-y-4">
              {data.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {exp.position.toUpperCase()}
                      </h3>
                      <p className="text-gray-600 font-medium text-xs">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {exp.startDate} – {exp.current ? "Current" : exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="mt-2 text-gray-700 text-xs">
                      {renderDescription(exp.description)}
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
            <h2 className="text-lg font-bold uppercase mb-3 text-gray-900">
              {displayName}
            </h2>
            <div className="space-y-3">
              {data.map((edu: any) => (
                <div key={edu.id}>
                  <p className="font-semibold text-gray-900 text-xs">
                    {edu.startDate} – {edu.endDate}
                    {edu.gpa && ` • ${edu.gpa}`}
                    {edu.institution && `: ${edu.institution}`}
                  </p>
                  <p className="text-gray-600" style={{ fontSize: "14px" }}>
                    {edu.degree 
                      ? (edu.field ? `${edu.degree} - ${edu.field}` : edu.degree)
                      : (edu.field || 'Education')
                    }
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "skills":
        return (
          <section>
            <h2 className="text-lg font-bold uppercase mb-3 text-gray-900">
              {displayName}
            </h2>
            <div className="space-y-2">
              {data.map((skill: any) => (
                <div key={skill.id}>
                  {skill.category && (
                    <p className="font-semibold text-gray-900 text-xs">
                      {skill.category}
                    </p>
                  )}
                  <p className="text-gray-700 text-xs" style={{ fontSize: "12px" }}>
                    {skill.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return (
          <section>
            <h2 className="text-lg font-bold uppercase mb-3 text-gray-900">
              {displayName}
            </h2>
            <div className="space-y-3">
              {data.map((proj: any) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-gray-900">{proj.name}</h3>
                  <div className="text-gray-700 text-xs">
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
            <h2 className="text-lg font-bold uppercase mb-3 text-gray-900">
              {displayName}
            </h2>
            <div className="space-y-2">
              {data.map((cert: any) => (
                <div key={cert.id}>
                  <p className="text-gray-900 text-xs">
                    {cert.name}
                    {cert.issuer && ` – ${cert.issuer}`}
                    {cert.date && ` (${cert.date})`}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "hobbies":
        return (
          <section>
            <h2 className="text-lg font-bold uppercase mb-3 text-gray-900">
              {displayName}
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {data.map((hobby: any) => (
                <span
                  key={hobby.id}
                  className="px-2 py-1 bg-gray-200 rounded text-xs"
                >
                  {hobby.name}
                </span>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const headerColor = resume.templateColor || '#1F2937'; // Default gray-900
  const sidebarColor = resume.templateColor || '#F3F4F6'; // Default gray-100
  const headerTextColor = getTextColorForBackground(headerColor);
  const sidebarTextColor = getTextColorForBackground(sidebarColor);

  return (
    <div className="font-sans bg-white">
      {/* Header with Name and Title */}
      <div 
        className="p-6"
        style={{ 
          backgroundColor: headerColor === 'transparent' ? '#1F2937' : headerColor,
          color: headerTextColor,
        }}
      >
        <div className={resume.showProfileImage && resume.profileImage ? "flex items-center gap-4" : ""}>
          {resume.showProfileImage && resume.profileImage && (
            <img
              src={resume.profileImage}
              alt={resume.personalInfo.fullName || "Profile"}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2"
              style={{ borderColor: headerTextColor === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' }}
            />
          )}
          <div>
            <h1 className="text-3xl font-bold uppercase mb-1">
              {resume.personalInfo.fullName || "Your Name"}
            </h1>
            <p className="uppercase tracking-wide" style={{ fontSize: "14px" }}>
              {resume.experiences?.[0]?.position || "Your Title"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-0">
        {/* Left Column - Experience & Education */}
        <div className="col-span-2 p-6 space-y-6">
          <TemplateSectionRenderer
            resume={resume}
            renderSection={renderSection}
          />
        </div>

        {/* Right Column - Contact & Skills */}
        <div 
          className="p-6 space-y-6"
          style={{ 
            backgroundColor: sidebarColor === 'transparent' ? '#F3F4F6' : sidebarColor,
            color: sidebarTextColor,
          }}
        >
          <div>
            <h2 
              className="text-lg font-bold uppercase mb-3"
              style={{ color: sidebarTextColor }}
            >
              Contact
            </h2>
            <div className="space-y-2 text-xs" style={{ color: sidebarTextColor }}>
              {resume.personalInfo.email && <p>{resume.personalInfo.email}</p>}
              {resume.personalInfo.phone && <p>{resume.personalInfo.phone}</p>}
              {resume.personalInfo.location && (
                <p>{resume.personalInfo.location}</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
