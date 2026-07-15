import "./StudentDrawer.css";

function StudentDrawer({

    isOpen,

    onClose,

    student,

}) {

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

                    <a

                        href={`http://localhost:5000/${student.resume.filePath}`}

                        target="_blank"

                        rel="noreferrer"

                        className="btn btn-primary"

                        style={{
                            width: "100%",
                            marginTop: "25px",
                        }}

                    >

                        📄 View Resume

                    </a>

                )}

            </div>

        </>

    );

}

export default StudentDrawer;