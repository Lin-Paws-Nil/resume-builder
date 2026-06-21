import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
interface ZenithTemplateProps {
  resume: ResumeData;
}

export function ZenithTemplate({ resume }: ZenithTemplateProps) {
  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section className="mt-5">
            <h2 className="text-sm font-bold uppercase mb-2 text-gray-900">
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
          <section className="mt-5">
            <h2 className="text-sm font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((exp: any) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-xs">
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
      case "education":
        return (
          <section className="mt-5">
            <h2 className="text-sm font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((edu: any) => (
                <div key={edu.id}>
                  <h3 className="font-semibold text-gray-900 text-xs">
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
                    {edu.startDate} - {edu.endDate}
                    {""}{" "}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );
      case "projects":
        return (
          <section className="mt-5">
            <h2 className="text-sm font-bold uppercase mb-3 text-gray-900">
              {" "}
              {displayName}
              {""}{" "}
            </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((proj: any) => (
                <div key={proj.id}>
                  <h3 className="font-semibold text-gray-900 text-xs">{proj.name} </h3>
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
          <section className="mt-5">
            <h2 className="text-sm font-bold uppercase mb-3 text-gray-900">
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
                  {(cert.issuer || cert.date) && (
                    <span className="text-gray-700 ml-2 text-xs">
                      {cert.issuer && `– ${cert.issuer}`}{cert.issuer && cert.date ? ' ' : ''}{cert.date && `(${cert.date})`}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "hobbies":
        return (
          <section className="mt-5">
            <h2 className="text-sm font-bold uppercase mb-3 text-gray-900">
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
      {/* Header */}
      <div className="mb-5">
        <div className={resume.showProfileImage && resume.profileImage ? "flex items-center gap-4" : ""}>
          {resume.showProfileImage && resume.profileImage && (
            <img
              src={resume.profileImage}
              alt={resume.personalInfo.fullName || "Profile"}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
            />
          )}
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {resume.personalInfo.fullName || "Your Name"}
            </h1>
            <p className="text-gray-600 text-xs">
              {resume.experiences?.[0]?.position || "Your Title"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
      </div>

      {/* Skills as inline tags */}
      {resume.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-bold uppercase mb-2 text-gray-900">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.flatMap((skill) =>
              skill.items.map((item, idx) => (
                <span
                  key={`${skill.id}-${idx}`}
                  className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-700"
                >
                  {item}
                </span>
              )),
            )}
          </div>
        </div>
      )}

      {/* Sections */}
      <TemplateSectionRenderer
        resume={resume}
        renderSection={renderSection}
      />
    </div>
  );
}
