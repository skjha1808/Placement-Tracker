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

    if (!isOpen || !student) return null;

    return (
        <>
            <div
                className="drawer-overlay"
                onClick={onClose}
            />

            <div className="student-drawer">

                <div className="drawer-header">

                    <h2>
                        👤 Student Profile
                    </h2>

                    <button
                        className="drawer-close"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="drawer-avatar">

                    {student.name
                        ?.charAt(0)
                        .toUpperCase()}

                </div>

                <h2 className="drawer-name">
                    {student.name}
                </h2>

                <div className="drawer-info">

                    <p>
                        📧 <strong>Email:</strong>{" "}
                        {student.email}
                    </p>

                    <p>
                        📱 <strong>Phone:</strong>{" "}
                        {student.phone}
                    </p>

                    <p>
                        🎓 <strong>Branch:</strong>{" "}
                        {student.branch}
                    </p>

                    <p>
                        📊 <strong>CGPA:</strong>{" "}
                        {student.cgpa}
                    </p>

                    <p>
                        🎓 <strong>Education:</strong>{" "}
                        {student.education}
                    </p>

                </div>

                <div className="drawer-skills">

                    <h3>🛠 Skills</h3>

                    <div className="skills-list">

                        {student.skills?.length ? (

                            student.skills.map(
                                (skill) => (

                                    <span
                                        key={skill}
                                        className="skill-chip"
                                    >
                                        {skill}
                                    </span>

                                )
                            )
                        ) : (
                            <p>No skills added.</p>
                        )}
                    </div>
                </div>

                {student.resume?.filePath && (

                    <button
                        type="button"
                        onClick={viewResume}
                        className="resume-btn"
                    >
                        📄 View Resume
                    </button>
                )}
            </div>
        </>
    );
}

export default StudentDrawer;