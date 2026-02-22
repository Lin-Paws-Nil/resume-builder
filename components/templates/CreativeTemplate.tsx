import type { ResumeData } from "@/lib/types/resume";
import { TemplateSectionRenderer } from "./TemplateSectionRenderer";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
interface CreativeTemplateProps {
  resume: ResumeData;
}

export function CreativeTemplate({ resume }: CreativeTemplateProps) {
  const renderSection = (sectionId: string, data: any, displayName: string) => {
    switch (sectionId) {
      case "personalInfo":
        return null; // Handled in header
      case "summary":
        return (
          <section className="mb-6 p-4 bg-pink-50 rounded-lg">
            <h2 className="font-bold text-pink-600 mb-2">About Me </h2>
            <div className="text-gray-700 text-xs">{renderHTML(data)}</div>
          </section>
        );
      case "experiences":
        return (
          <section className="mb-6">
            <h2 className="font-bold text-orange-600 mb-4">Work Experience </h2>
            <div className="space-y-4">
              {" "}
              {""}{" "}
              {data.map((exp: any) => (
                <div key={exp.id} className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-bold">{exp.position} </h3>
                  <p className="text-orange-600 font-medium">{exp.company} </p>
                  <p className="text-gray-500 mb-2 text-xs">
                    {" "}
                    {""} {exp.startDate} -{""}{" "}
                    {exp.current ? "Present" : exp.endDate}
                    {""}{" "}
                  </p>
                  {""}{" "}
                  {exp.description && (
                    <div className="text-gray-700 text-xs">
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
            <h2 className="font-bold text-pink-600 mb-4">Education </h2>
            {""}{" "}
            {data.map((edu: any) => (
              <div key={edu.id} className="mb-3 p-3 bg-pink-50 rounded">
                <h3 className="font-bold">
                  {edu.degree 
                    ? (edu.field ? `${edu.degree} in ${edu.field}` : edu.degree)
                    : (edu.field || 'Education')
                  }
                </h3>
                <p className="text-gray-600 text-xs">{edu.institution || ''} </p>
              </div>
            ))}
          </section>
        );
      case "skills":
        return (
          <section className="mb-6">
            <h2 className="font-bold text-orange-600 mb-4">Skills </h2>
            <div className="flex flex-wrap gap-2">
              {" "}
              {""}{" "}
              {data.flatMap((skill: any) =>
                skill.items.map((item: string, idx: number) => (
                  <span
                    key={`${skill.id}-${idx}`}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-medium"
                  >
                    {" "}
                    {""} {item}
                    {""}{" "}
                  </span>
                )),
              )}
            </div>
          </section>
        );
      case "projects":
        return (
          <section className="mb-6">
            <h2 className="font-bold text-pink-600 mb-4">Projects </h2>
            <div className="space-y-3">
              {" "}
              {""}{" "}
              {data.map((proj: any) => (
                <div key={proj.id} className="border-l-4 border-pink-500 pl-4">
                  <h3 className="font-bold">{proj.name} </h3>
                  <div className="text-gray-700 mt-1 text-xs">
                    {" "}
                    {renderHTML(proj.description)}
                  </div>
                  {""}{" "}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {" "}
                      {""}{" "}
                      {proj.technologies.map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-pink-100 text-pink-800 rounded"
                        >
                          {" "}
                          {""} {tech}
                          {""}{" "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      case "certifications":
        return (
          <section className="mb-6">
            <h2 className="font-bold text-orange-600 mb-4">Certifications </h2>
            <div className="space-y-2">
              {" "}
              {""}{" "}
              {data.map((cert: any) => (
                <div key={cert.id} className="p-3 bg-orange-50 rounded">
                  <span className="font-bold">{cert.name} </span> -{""}{" "}
                  {cert.issuer} ({cert.date})
                </div>
              ))}
            </div>
          </section>
        );
      case "hobbies":
        return (
          <section className="mb-6">
            <h2 className="font-bold text-pink-600 mb-4">
              {" "}
              Hobbies & Interests{""}{" "}
            </h2>
            <div className="flex flex-wrap gap-2">
              {" "}
              {""}{" "}
              {data.map((hobby: any) => (
                <span
                  key={hobby.id}
                  className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full font-medium"
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
      <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 rounded-lg mb-6">
        <h1 className="font-bold mb-2">
          {" "}
          {""} {resume.personalInfo.fullName || "Your Name"}
          {""}{" "}
        </h1>
        <div className="flex flex-wrap gap-4">
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
