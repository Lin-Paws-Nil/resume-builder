import type { ResumeData } from "@/lib/types/resume";
import { renderDescription } from "@/lib/utils/render-description";
import { renderHTML } from "@/lib/utils/render-html";
import { getTextColorForBackground } from "@/lib/utils/template-colors";

interface StellarTemplateProps {
  resume: ResumeData;
}

export function StellarTemplate({ resume }: StellarTemplateProps) {
  const sidebarColor = resume.templateColor || '#EFF6FF';
  const sidebarTextColor = getTextColorForBackground(sidebarColor);

  return (
    <div className="font-sans bg-white" style={{ display: 'block' }}>
      {/* Header Section - Full Width - Should not break */}
      <section 
        data-section="header"
        className="p-6 pb-4"
        style={{ 
          display: 'block',
          backgroundColor: sidebarColor === 'transparent' ? '#EFF6FF' : sidebarColor,
          color: sidebarTextColor,
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        <div 
          className={resume.showProfileImage && resume.profileImage ? "flex items-center gap-4" : ""}
          style={{ display: resume.showProfileImage && resume.profileImage ? 'flex' : 'block' }}
        >
          {resume.showProfileImage && resume.profileImage && (
            <img
              src={resume.profileImage}
              alt={resume.personalInfo.fullName || "Profile"}
              className="w-16 h-16 rounded-full object-cover border-2 flex-shrink-0"
              style={{ borderColor: sidebarTextColor === '#FFFFFF' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)' }}
            />
          )}
          <div style={{ display: 'block', flex: 1 }}>
            <div style={{ display: 'block', position: 'relative' }}>
              <div style={{ display: 'block' }}>
                <h1 
                  className="text-2xl font-bold mb-1"
                  style={{ color: sidebarTextColor }}
                >
                  {resume.personalInfo.fullName || "Your Name"}
                </h1>
                <p 
                  className="text-sm"
                  style={{ color: sidebarTextColor }}
                >
                  {resume.experiences?.[0]?.position || "Your Title"}
                </p>
              </div>
              {/* Contact Info - Top Right */}
              <div 
                className="text-xs text-right space-y-0.5"
                style={{ 
                  color: sidebarTextColor,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}
              >
                {resume.personalInfo.email && (
                  <p>{resume.personalInfo.email}</p>
                )}
                {resume.personalInfo.phone && (
                  <p>{resume.personalInfo.phone}</p>
                )}
                {resume.personalInfo.location && (
                  <p>{resume.personalInfo.location}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary - Below Name, Full Width */}
        {resume.summary && (
          <div 
            className="mt-4 pt-3 border-t" 
            style={{ 
              display: 'block',
              borderColor: sidebarTextColor === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' 
            }}
          >
            <div 
              className="text-xs leading-relaxed"
              style={{ color: sidebarTextColor }}
            >
              {renderHTML(resume.summary)}
            </div>
          </div>
        )}
      </section>

      {/* Two Column Layout - Using table display for equal height columns */}
      <div 
        style={{ 
          display: 'table',
          width: '100%',
          tableLayout: 'fixed',
        }}
      >
        {/* Left Column - Education, Skills (with blue background extending full height) */}
        <div 
          style={{ 
            display: 'table-cell',
            width: '40%',
            padding: '1.5rem 1rem 1.5rem 1.5rem',
            backgroundColor: sidebarColor === 'transparent' ? '#EFF6FF' : sidebarColor,
            color: sidebarTextColor,
            verticalAlign: 'top',
          }}
        >
          {/* Education */}
          {resume.education.length > 0 && (
            <section data-section="education" style={{ display: 'block', marginBottom: '1.75rem' }}>
              <h2 
                className="font-bold uppercase mb-2 text-sm"
                style={{ 
                  display: 'block',
                  color: sidebarTextColor,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid',
                }}
              >
                Education
              </h2>
              <div style={{ display: 'block' }}>
                {resume.education.map((edu) => (
                  <div 
                    key={edu.id} 
                    className="education-item"
                    style={{ 
                      display: 'block',
                      marginBottom: '0.75rem',
                      pageBreakInside: 'avoid', 
                      breakInside: 'avoid' 
                    }}
                  >
                    <p 
                      className="font-semibold text-xs"
                      style={{ color: sidebarTextColor }}
                    >
                      {edu.degree 
                        ? (edu.field ? `${edu.degree} in ${edu.field}` : edu.degree)
                        : (edu.field || 'Education')
                      }
                    </p>
                    <p 
                      className="text-xs"
                      style={{ color: sidebarTextColor }}
                    >
                      {edu.institution || ''}
                    </p>
                    <p 
                      className="text-xs opacity-80"
                      style={{ color: sidebarTextColor }}
                    >
                      {edu.startDate} - {edu.endDate}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <section data-section="skills" style={{ display: 'block', marginBottom: '1.75rem' }}>
              <h2 
                className="font-bold uppercase mb-2 text-sm"
                style={{ 
                  display: 'block',
                  color: sidebarTextColor,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid',
                }}
              >
                Skills
              </h2>
              <ul 
                className="list-disc list-inside space-y-1 text-xs"
                style={{ display: 'block', color: sidebarTextColor }}
              >
                {resume.skills.flatMap((skill) =>
                  skill.items.map((item, idx) => (
                    <li key={`${skill.id}-${idx}`} style={{ display: 'block' }}>{item}</li>
                  )),
                )}
              </ul>
            </section>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <section data-section="certifications" style={{ display: 'block', marginBottom: '1.75rem' }}>
              <h2 
                className="font-bold uppercase mb-2 text-sm"
                style={{ 
                  display: 'block',
                  color: sidebarTextColor,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid',
                }}
              >
                Certifications
              </h2>
              <ul 
                className="space-y-1.5 text-xs"
                style={{ display: 'block', color: sidebarTextColor }}
              >
                {resume.certifications.map((cert) => (
                  <li 
                    key={cert.id} 
                    className="certification-item"
                    style={{ 
                      display: 'block',
                      marginBottom: '0.5rem',
                      paddingLeft: '0.75rem',
                      position: 'relative',
                      pageBreakInside: 'avoid', 
                      breakInside: 'avoid' 
                    }}
                  >
                    <span 
                      style={{ 
                        position: 'absolute',
                        left: 0,
                        top: '0.375rem',
                        width: '0.25rem',
                        height: '0.25rem',
                        borderRadius: '50%',
                        backgroundColor: sidebarTextColor,
                        opacity: 0.6,
                      }} 
                    />
                    <span className="font-medium">{cert.name}</span>
                    {(cert.issuer || cert.date) && (
                      <span className="opacity-70 ml-1">
                        — {cert.issuer}{cert.issuer && cert.date ? ', ' : ''}{cert.date || ''}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Hobbies */}
          {resume.hobbies && resume.hobbies.length > 0 && (
            <section data-section="hobbies" style={{ display: 'block', marginBottom: '1.75rem' }}>
              <h2 
                className="font-bold uppercase mb-2 text-sm"
                style={{ 
                  display: 'block',
                  color: sidebarTextColor,
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid',
                }}
              >
                Interests
              </h2>
              <p 
                className="text-xs"
                style={{ color: sidebarTextColor }}
              >
                {resume.hobbies.map((h) => h.name).join(", ")}
              </p>
            </section>
          )}
        </div>

        {/* Right Column - Experience, Projects */}
        <div 
          style={{ 
            display: 'table-cell',
            width: '60%',
            padding: '1.5rem 1.5rem 1.5rem 1rem',
            backgroundColor: 'white',
            verticalAlign: 'top',
          }}
        >
          {/* Experience */}
          {resume.experiences && resume.experiences.length > 0 && (
            <section data-section="experience" style={{ display: 'block', marginBottom: '1.25rem' }}>
              <h2 
                className="font-bold uppercase mb-3 text-sm text-gray-900"
                style={{ 
                  display: 'block',
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid',
                }}
              >
                Experience
              </h2>
              <div style={{ display: 'block' }}>
                {resume.experiences.map((exp) => (
                  <div 
                    key={exp.id} 
                    className="experience-item"
                    style={{ 
                      display: 'block',
                      marginBottom: '1rem',
                      pageBreakInside: 'avoid', 
                      breakInside: 'avoid' 
                    }}
                  >
                    <div 
                      style={{ 
                        display: 'block',
                        position: 'relative',
                        marginBottom: '0.25rem',
                        pageBreakAfter: 'avoid', 
                        breakAfter: 'avoid' 
                      }}
                    >
                      <div style={{ display: 'block' }}>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {exp.position}
                        </h3>
                        <p className="text-gray-600 text-xs">{exp.company}</p>
                      </div>
                      <span 
                        className="text-gray-500 text-xs"
                        style={{ 
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <div className="mt-2 text-gray-700 text-xs" style={{ display: 'block' }}>
                        {renderDescription(exp.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <section data-section="projects" style={{ display: 'block', marginBottom: '1.25rem' }}>
              <h2 
                className="font-bold uppercase mb-3 text-sm text-gray-900"
                style={{ 
                  display: 'block',
                  pageBreakAfter: 'avoid',
                  breakAfter: 'avoid',
                }}
              >
                Projects
              </h2>
              <div style={{ display: 'block' }}>
                {resume.projects.map((proj) => (
                  <div 
                    key={proj.id} 
                    className="project-item"
                    style={{ 
                      display: 'block',
                      marginBottom: '0.75rem',
                      pageBreakInside: 'avoid', 
                      breakInside: 'avoid' 
                    }}
                  >
                    <h3 className="font-bold text-gray-900 text-sm">{proj.name}</h3>
                    <div className="text-gray-700 text-xs">
                      {renderHTML(proj.description)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
