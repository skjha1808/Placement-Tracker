import api from "../../services/api";
import "./StudentDrawer.css";

function StudentDrawer({
    isOpen,
    onClose,
    student,
}) {
    const viewResume = async () => {
        try {
            const response = await api.get(
                `/students/${student._id}/resume`,
                {
                    responseType: "blob",
                }
            );

            const fileURL = URL.createObjectURL(
                new Blob([response.data], {
                    type: "application/pdf",
                })
            );

            window.open(fileURL, "_blank");

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 60000);
        } catch (error) {
            console.error(
                error.response?.data || error.message
            );
        }
    };

    if (!isOpen || !student) {
        return null;
    }

    /* =========================================
       HELPERS
    ========================================= */

    const displayValue = (
        value,
        fallback = "Not specified"
    ) => {
        if (
            value === undefined ||
            value === null ||
            value === "" ||
            value === "undefined" ||
            value === "null"
        ) {
            return fallback;
        }

        return String(value);
    };

    const displayArray = (
        value,
        fallback = "Not added"
    ) => {
        if (!Array.isArray(value) || value.length === 0) {
            return fallback;
        }

        return value
            .filter(
                (item) =>
                    item !== undefined &&
                    item !== null &&
                    String(item).trim() !== ""
            )
            .join(", ");
    };

    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (char) =>
                char.toUpperCase()
            )
            .replace(/Url/g, "URL")
            .replace(/Id/g, "ID");
    };

    const formatCollectionValue = (value) => {
        if (Array.isArray(value)) {
            return displayArray(value);
        }

        if (
            value !== null &&
            typeof value === "object"
        ) {
            return Object.entries(value)
                .filter(
                    ([key]) =>
                        ![
                            "_id",
                            "__v",
                            "createdAt",
                            "updatedAt",
                        ].includes(key)
                )
                .map(
                    ([key, nestedValue]) =>
                        `${formatLabel(key)}: ${
                            Array.isArray(nestedValue)
                                ? displayArray(
                                      nestedValue
                                  )
                                : displayValue(
                                      nestedValue
                                  )
                        }`
                )
                .join(" • ");
        }

        return displayValue(value);
    };

    const getInitials = () => {
        const name = student.name?.trim();

        if (!name) {
            return "?";
        }

        const parts = name.split(/\s+/);

        if (parts.length === 1) {
            return parts[0]
                .charAt(0)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };

    const renderInfoItem = (
        label,
        value,
        fullWidth = false
    ) => (
        <div
            className={`drawer-info-item ${
                fullWidth
                    ? "drawer-info-item-full"
                    : ""
            }`}
            key={label}
        >
            <span className="drawer-info-label">
                {label}
            </span>

            <strong className="drawer-info-value">
                {displayValue(value)}
            </strong>
        </div>
    );

    const renderAcademicBlock = (
        title,
        data,
        fields
    ) => {
        if (!data) {
            return null;
        }

        return (
            <div className="academic-subsection">

                <div className="academic-subsection-title">
                    {title}
                </div>

                <div className="drawer-info-grid">
                    {fields.map(
                        ({
                            key,
                            label,
                        }) =>
                            renderInfoItem(
                                label,
                                data[key]
                            )
                    )}
                </div>

            </div>
        );
    };

    const renderCollection = (
        items,
        emptyMessage,
        type
    ) => {
        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {
            return (
                <div className="drawer-no-data">
                    {emptyMessage}
                </div>
            );
        }

        return (
            <div className="drawer-collection">

                {items.map((item, index) => {

                    const visibleEntries =
                        Object.entries(item || {})
                            .filter(
                                ([key]) =>
                                    ![
                                        "_id",
                                        "__v",
                                        "createdAt",
                                        "updatedAt",
                                        "technologiesInput",
                                    ].includes(key)
                            );

                    return (
                        <div
                            className="drawer-collection-card"
                            key={
                                item._id ||
                                `${type}-${index}`
                            }
                        >

                            <div className="drawer-collection-header">

                                <span className="drawer-collection-number">
                                    {index + 1}
                                </span>

                                <strong>
                                    {getCollectionTitle(
                                        item,
                                        type,
                                        index
                                    )}
                                </strong>

                            </div>

                            <div className="drawer-collection-grid">

                                {visibleEntries.map(
                                    ([
                                        key,
                                        value,
                                    ]) => {

                                        if (
                                            key ===
                                                "projectUrl" ||
                                            key ===
                                                "githubUrl" ||
                                            key ===
                                                "credentialUrl" ||
                                            key ===
                                                "profileUrl"
                                        ) {
                                            if (
                                                !value
                                            ) {
                                                return (
                                                    <div
                                                        className="drawer-collection-field"
                                                        key={
                                                            key
                                                        }
                                                    >
                                                        <span>
                                                            {formatLabel(
                                                                key
                                                            )}
                                                        </span>

                                                        <strong>
                                                            Not added
                                                        </strong>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    className="drawer-collection-field"
                                                    key={
                                                        key
                                                    }
                                                >
                                                    <span>
                                                        {formatLabel(
                                                            key
                                                        )}
                                                    </span>

                                                    <a
                                                        href={
                                                            value
                                                        }
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="drawer-profile-link"
                                                    >
                                                        Open Link
                                                    </a>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                className="drawer-collection-field"
                                                key={
                                                    key
                                                }
                                            >
                                                <span>
                                                    {formatLabel(
                                                        key
                                                    )}
                                                </span>

                                                <strong>
                                                    {formatCollectionValue(
                                                        value
                                                    )}
                                                </strong>
                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    );
                })}

            </div>
        );
    };

    const getCollectionTitle = (
        item,
        type,
        index
    ) => {
        if (!item) {
            return `Entry ${index + 1}`;
        }

        switch (type) {
            case "internships":
                return (
                    item.company ||
                    item.role ||
                    `Experience ${index + 1}`
                );

            case "certifications":
                return (
                    item.name ||
                    `Certification ${index + 1}`
                );

            case "achievements":
                return (
                    item.title ||
                    `Achievement ${index + 1}`
                );

            case "hackathons":
                return (
                    item.name ||
                    `Hackathon ${index + 1}`
                );

            case "projects":
                return (
                    item.name ||
                    `Project ${index + 1}`
                );

            case "codingAchievements":
                return (
                    item.platform ||
                    `Coding Achievement ${
                        index + 1
                    }`
                );

            default:
                return `Entry ${index + 1}`;
        }
    };

    const initials = getInitials();

    const skills = Array.isArray(student.skills)
        ? student.skills
        : [];

    const programmingLanguages =
        Array.isArray(
            student.programmingLanguages
        )
            ? student.programmingLanguages
            : [];

    const frameworksLibraries =
        Array.isArray(
            student.frameworksLibraries
        )
            ? student.frameworksLibraries
            : [];

    const databases = Array.isArray(
        student.databases
    )
        ? student.databases
        : [];

    const cloudTools = Array.isArray(
        student.cloudTools
    )
        ? student.cloudTools
        : [];

    const developerProfiles =
        student.developerProfiles || {};

    return (
        <>
            {/* =========================================
                OVERLAY
            ========================================= */}

            <div
                className="drawer-overlay"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* =========================================
                DRAWER
            ========================================= */}

            <aside
                className="student-drawer"
                role="dialog"
                aria-modal="true"
                aria-label="Student profile"
            >

                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="drawer-header">

                    <div>
                        <span className="drawer-eyebrow">
                            STUDENT PROFILE
                        </span>

                        <h2 className="drawer-title">
                            Student Details
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="drawer-close"
                        onClick={onClose}
                        aria-label="Close student profile"
                    >
                        ×
                    </button>

                </div>

                {/* =====================================
                    PROFILE SUMMARY
                ===================================== */}

                <div className="drawer-profile">

                    <div className="drawer-avatar">
                        {initials}
                    </div>

                    <h2 className="drawer-name">
                        {displayValue(
                            student.name,
                            "Unnamed Student"
                        )}
                    </h2>

                    <p className="drawer-email">
                        {displayValue(
                            student.email,
                            "No email available"
                        )}
                    </p>

                    <span
                        className={`drawer-status ${
                            student.isVerified
                                ? "verified"
                                : "pending"
                        }`}
                    >
                        <span className="drawer-status-dot" />

                        {student.isVerified
                            ? "Verified Student"
                            : "Verification Pending"}
                    </span>

                </div>

                {/* =====================================
                    PERSONAL INFORMATION
                ===================================== */}

                <section className="drawer-section">

                    <div className="drawer-section-heading">
                        <div>
                            <span className="drawer-section-eyebrow">
                                PROFILE
                            </span>

                            <h3>
                                Personal Information
                            </h3>
                        </div>
                    </div>

                    <div className="drawer-info-grid">

                        {renderInfoItem(
                            "Name",
                            student.name
                        )}

                        {renderInfoItem(
                            "Email",
                            student.email
                        )}

                        {renderInfoItem(
                            "Phone",
                            student.phone
                        )}

                        {renderInfoItem(
                            "Gender",
                            student.gender
                        )}

                        {renderInfoItem(
                            "City",
                            student.city
                        )}

                        {renderInfoItem(
                            "Education",
                            student.education
                        )}

                        {renderInfoItem(
                            "Bio",
                            student.bio,
                            true
                        )}

                    </div>

                </section>

                {/* =====================================
                    ACADEMIC INFORMATION
                ===================================== */}

                <section className="drawer-section">

                    <div className="drawer-section-heading">
                        <div>
                            <span className="drawer-section-eyebrow">
                                EDUCATION
                            </span>

                            <h3>
                                Academic Information
                            </h3>
                        </div>
                    </div>

                    <div className="drawer-info-grid">

                        {renderInfoItem(
                            "Branch",
                            student.branch
                        )}

                        {renderInfoItem(
                            "Current CGPA",
                            student.cgpa
                        )}

                    </div>

                    {renderAcademicBlock(
                        "10th / Secondary Education",
                        student.tenth,
                        [
                            {
                                key: "schoolName",
                                label: "School",
                            },
                            {
                                key: "percentage",
                                label: "Percentage",
                            },
                            {
                                key: "board",
                                label: "Board",
                            },
                            {
                                key: "passingYear",
                                label: "Passing Year",
                            },
                        ]
                    )}

                    {renderAcademicBlock(
                        "12th / Senior Secondary Education",
                        student.twelfth,
                        [
                            {
                                key: "schoolName",
                                label: "School",
                            },
                            {
                                key: "percentage",
                                label: "Percentage",
                            },
                            {
                                key: "board",
                                label: "Board",
                            },
                            {
                                key: "stream",
                                label: "Stream",
                            },
                            {
                                key: "passingYear",
                                label: "Passing Year",
                            },
                        ]
                    )}

                    {renderAcademicBlock(
                        "Graduation",
                        student.graduation,
                        [
                            {
                                key: "college",
                                label: "College",
                            },
                            {
                                key: "degree",
                                label: "Degree",
                            },
                            {
                                key: "branch",
                                label: "Branch",
                            },
                            {
                                key: "cgpa",
                                label: "CGPA",
                            },
                            {
                                key: "graduationYear",
                                label: "Graduation Year",
                            },
                            {
                                key: "currentSemester",
                                label: "Current Semester",
                            },
                        ]
                    )}

                </section>

                {/* =====================================
                    TECHNICAL PROFILE
                ===================================== */}

                <section className="drawer-section">

                    <div className="drawer-section-heading">
                        <div>
                            <span className="drawer-section-eyebrow">
                                TECHNICAL
                            </span>

                            <h3>
                                Technical Skills
                            </h3>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="technical-group">

                        <div className="technical-group-header">
                            <span>
                                Skills
                            </span>

                            <strong>
                                {skills.length}
                            </strong>
                        </div>

                        {skills.length ? (
                            <div className="skills-list">
                                {skills.map(
                                    (
                                        skill,
                                        index
                                    ) => (
                                        <span
                                            key={`${skill}-${index}`}
                                            className="skill-chip"
                                        >
                                            {skill}
                                        </span>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="drawer-no-data">
                                No skills added.
                            </div>
                        )}

                    </div>

                    {/* Programming Languages */}
                    <div className="technical-group">

                        <div className="technical-group-header">
                            <span>
                                Programming Languages
                            </span>
                        </div>

                        {programmingLanguages.length ? (
                            <div className="skills-list">
                                {programmingLanguages.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <span
                                            key={`${item}-${index}`}
                                            className="skill-chip neutral"
                                        >
                                            {item}
                                        </span>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="drawer-no-data">
                                No programming languages added.
                            </div>
                        )}

                    </div>

                    {/* Frameworks */}
                    <div className="technical-group">

                        <div className="technical-group-header">
                            <span>
                                Frameworks & Libraries
                            </span>
                        </div>

                        {frameworksLibraries.length ? (
                            <div className="skills-list">
                                {frameworksLibraries.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <span
                                            key={`${item}-${index}`}
                                            className="skill-chip neutral"
                                        >
                                            {item}
                                        </span>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="drawer-no-data">
                                No frameworks or libraries added.
                            </div>
                        )}

                    </div>

                    {/* Databases */}
                    <div className="technical-group">

                        <div className="technical-group-header">
                            <span>
                                Databases
                            </span>
                        </div>

                        {databases.length ? (
                            <div className="skills-list">
                                {databases.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <span
                                            key={`${item}-${index}`}
                                            className="skill-chip neutral"
                                        >
                                            {item}
                                        </span>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="drawer-no-data">
                                No databases added.
                            </div>
                        )}

                    </div>

                    {/* Cloud / Tools */}
                    <div className="technical-group">

                        <div className="technical-group-header">
                            <span>
                                Cloud & Tools
                            </span>
                        </div>

                        {cloudTools.length ? (
                            <div className="skills-list">
                                {cloudTools.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <span
                                            key={`${item}-${index}`}
                                            className="skill-chip neutral"
                                        >
                                            {item}
                                        </span>
                                    )
                                )}
                            </div>
                        ) : (
                            <div className="drawer-no-data">
                                No cloud tools added.
                            </div>
                        )}

                    </div>

                </section>

                {/* =====================================
                    DEVELOPER PROFILES
                ===================================== */}

                <section className="drawer-section">

                    <div className="drawer-section-heading">
                        <div>
                            <span className="drawer-section-eyebrow">
                                LINKS
                            </span>

                            <h3>
                                Developer Profiles
                            </h3>
                        </div>
                    </div>

                    <div className="developer-links">

                        <DeveloperLink
                            label="LinkedIn"
                            value={
                                developerProfiles.linkedin
                            }
                        />

                        <DeveloperLink
                            label="GitHub"
                            value={
                                developerProfiles.github
                            }
                        />

                        <DeveloperLink
                            label="LeetCode"
                            value={
                                developerProfiles.leetcode
                            }
                        />

                        <DeveloperLink
                            label="Portfolio"
                            value={
                                developerProfiles.portfolio
                            }
                        />

                    </div>

                </section>

                {/* =====================================
                    INTERNSHIPS
                ===================================== */}

                <section className="drawer-section">

                    <SectionTitle
                        eyebrow="EXPERIENCE"
                        title="Internships & Work Experience"
                        count={
                            student.internships?.length
                        }
                    />

                    {renderCollection(
                        student.internships,
                        "No internship or work experience added.",
                        "internships"
                    )}

                </section>

                {/* =====================================
                    CERTIFICATIONS
                ===================================== */}

                <section className="drawer-section">

                    <SectionTitle
                        eyebrow="CREDENTIALS"
                        title="Certifications"
                        count={
                            student.certifications?.length
                        }
                    />

                    {renderCollection(
                        student.certifications,
                        "No certifications added.",
                        "certifications"
                    )}

                </section>

                {/* =====================================
                    ACHIEVEMENTS
                ===================================== */}

                <section className="drawer-section">

                    <SectionTitle
                        eyebrow="ACHIEVEMENTS"
                        title="Achievements & Awards"
                        count={
                            student.achievements?.length
                        }
                    />

                    {renderCollection(
                        student.achievements,
                        "No achievements added.",
                        "achievements"
                    )}

                </section>

                {/* =====================================
                    HACKATHONS
                ===================================== */}

                <section className="drawer-section">

                    <SectionTitle
                        eyebrow="COMPETITIONS"
                        title="Hackathons"
                        count={
                            student.hackathons?.length
                        }
                    />

                    {renderCollection(
                        student.hackathons,
                        "No hackathons added.",
                        "hackathons"
                    )}

                </section>

                {/* =====================================
                    PROJECTS
                ===================================== */}

                <section className="drawer-section">

                    <SectionTitle
                        eyebrow="PORTFOLIO"
                        title="Projects"
                        count={
                            student.projects?.length
                        }
                    />

                    {renderCollection(
                        student.projects,
                        "No projects added.",
                        "projects"
                    )}

                </section>

                {/* =====================================
                    CODING ACHIEVEMENTS
                ===================================== */}

                <section className="drawer-section">

                    <SectionTitle
                        eyebrow="CODING"
                        title="Coding Achievements"
                        count={
                            student.codingAchievements
                                ?.length
                        }
                    />

                    {renderCollection(
                        student.codingAchievements,
                        "No coding achievements added.",
                        "codingAchievements"
                    )}

                </section>

                {/* =====================================
                    RESUME
                ===================================== */}

                {student.resume?.filePath && (
                    <section className="drawer-resume-section">

                        <div className="drawer-resume-content">

                            <div className="drawer-resume-icon">
                                📄
                            </div>

                            <div>
                                <strong>
                                    Resume
                                </strong>

                                <span>
                                    {displayValue(
                                        student.resume
                                            ?.fileName,
                                        "PDF document available"
                                    )}
                                </span>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={viewResume}
                            className="resume-btn"
                        >
                            View Resume
                        </button>

                    </section>
                )}

                <div className="drawer-bottom-space" />

            </aside>
        </>
    );
}

/* =========================================
   SMALL COMPONENTS
========================================= */

function SectionTitle({
    eyebrow,
    title,
    count,
}) {
    return (
        <div className="drawer-section-heading">

            <div>
                <span className="drawer-section-eyebrow">
                    {eyebrow}
                </span>

                <h3>
                    {title}
                </h3>
            </div>

            {typeof count === "number" &&
                count > 0 && (
                    <span className="drawer-section-count">
                        {count}
                    </span>
                )}

        </div>
    );
}

function DeveloperLink({
    label,
    value,
}) {
    return (
        <div className="developer-link-item">

            <div className="developer-link-info">
                <span>
                    {label}
                </span>

                <strong>
                    {value || "Not added"}
                </strong>
            </div>

            {value && (
                <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="developer-open-link"
                >
                    Open
                </a>
            )}

        </div>
    );
}

export default StudentDrawer;