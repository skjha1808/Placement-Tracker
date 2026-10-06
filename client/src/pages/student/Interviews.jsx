import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Interviews.css";

function Interviews() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);

    /*
     * Stores checklist progress separately for:
     *
     * Application
     *    ├── Technical
     *    └── HR
     *
     * Example:
     * {
     *   "applicationId": {
     *      Technical: [0, 1],
     *      HR: [0, 2]
     *   }
     * }
     */

    const [checklistState, setChecklistState] =
        useState(() => {
            try {
                return JSON.parse(
                    localStorage.getItem(
                        "interviewChecklistV2"
                    ) || "{}"
                );
            } catch {
                return {};
            }
        });


    /*
     * Technical interview preparation.
     */
    const technicalChecklist = [
        "Review the role and company",
        "Revisit your strongest projects",
        "Practice role-relevant DSA / CS fundamentals",
        "Prepare to explain your strongest project",
    ];


    /*
     * HR interview preparation.
     */
    const hrChecklist = [
        "Prepare a concise self-introduction",
        "Review your strengths and weaknesses",
        "Prepare why this company?",
        "Prepare why should we hire you?",
        "Practice behavioral questions",
    ];


    /*
     * Fetch applications currently in Interview stage.
     */
    useEffect(() => {
        api.get("/applications/my")
            .then((r) => {
                const list = (r.data || []).filter(
                    (a) => a.status === "Interview"
                );

                setApplications(list);
                setSelected(list[0] || null);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);


    /*
     * Toggle checklist item.
     *
     * Checklist is stored separately for each:
     * Application + Interview Stage.
     */
    const toggleChecklistItem = (
        applicationId,
        stage,
        itemIndex
    ) => {
        setChecklistState((previous) => {
            const applicationState =
                previous[applicationId] || {};

            const current =
                applicationState[stage] || [];

            const updated = current.includes(itemIndex)
                ? current.filter(
                      (index) =>
                          index !== itemIndex
                  )
                : [...current, itemIndex];

            const nextState = {
                ...previous,

                [applicationId]: {
                    ...applicationState,
                    [stage]: updated,
                },
            };

            localStorage.setItem(
                "interviewChecklistV2",
                JSON.stringify(nextState)
            );

            return nextState;
        });
    };


    /*
     * Loading state.
     */
    if (loading) {
        return (
            <div className="interviews-page interview-loading">
                Loading interview workspace…
            </div>
        );
    }


    /*
     * Determine current interview stage.
     *
     * Existing Interview applications without
     * interviewStage automatically fall back
     * to Technical.
     */
    const currentStage =
        selected?.interviewStage || "Technical";


    const isTechnical =
        currentStage === "Technical";

    const isHR =
        currentStage === "HR";


    /*
     * Dynamically select checklist.
     */
    const activeChecklist = isHR
        ? hrChecklist
        : technicalChecklist;


    /*
     * Current application's checklist state.
     */
    const currentChecklist =
        selected
            ? checklistState[selected._id]?.[
                  currentStage
              ] || []
            : [];


    return (
        <div className="interviews-page">

            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <header className="interviews-header">

                <div>
                    <span className="eyebrow">
                        INTERVIEW WORKSPACE
                    </span>

                    <h1>
                        Prepare for the conversation.
                    </h1>

                    <p>
                        Prepare specifically for the
                        interview stage you are currently
                        facing.
                    </p>

                </div>

                <div className="interview-count">

                    <strong>
                        {applications.length}
                    </strong>

                    <span>
                        active interview
                        {applications.length === 1
                            ? ""
                            : "s"}
                    </span>

                </div>

            </header>

            {applications.length > 0 && (
    <div className="interview-selector">
        <div className="interview-selector-header">
            <span className="section-kicker">
                ACTIVE INTERVIEWS
            </span>

            <span>
                {applications.length} interview
                {applications.length === 1 ? "" : "s"}
            </span>
        </div>

        <div className="interview-selector-list">
            {applications.map((app) => {
                const stage =
                    app.interviewStage || "Technical";

                return (
                    <button
                        key={app._id}
                        className={
                            selected?._id === app._id
                                ? "interview-selector-item active"
                                : "interview-selector-item"
                        }
                        onClick={() => setSelected(app)}
                    >
                        <span className="interview-selector-logo">
                            {app.company?.companyName
                                ?.charAt(0)
                                ?.toUpperCase()}
                        </span>

                        <span className="interview-selector-info">
                            <strong>
                                {app.company?.companyName}
                            </strong>

                            <small>
                                {app.company?.role}
                            </small>
                        </span>

                        <span className="interview-selector-stage">
                            {stage}
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
)}


            {/* =====================================
                EMPTY STATE
            ====================================== */}

            {!applications.length ? (

                <div className="interview-empty">

                    <div className="empty-symbol">
                        ◉
                    </div>

                    <h2>
                        No interview stage yet.
                    </h2>

                    <p>
                        When an application moves to
                        Interview, its preparation
                        workspace will appear here.
                    </p>

                </div>

            ) : (

                <div className="interview-layout">

                    {/* =================================
                        CURRENT INTERVIEW WORKSPACE
                    ================================== */}

                    <section className="interview-workspace">

                        {/* =============================
                            INTERVIEW HERO
                        ============================== */}

                        <div className="interview-hero">

                            <div>
                                <span className="section-kicker">
                                    CURRENT INTERVIEW
                                </span>

                                <h2>
                                    {
                                        selected?.company
                                            ?.companyName
                                    }
                                </h2>

                                <p>
                                    {
                                        selected?.company
                                            ?.role
                                    }
                                    {" · "}
                                    {
                                        selected?.company
                                            ?.location
                                    }
                                </p>

                            </div>

                            <span className="interview-badge">
                                {currentStage}
                            </span>

                        </div>

                        {/* =============================
                            INTERVIEW STAGE PROGRESS
                        ============================== */}

                        <div className="interview-stage-progress">

                            <div
                                className={
                                    `stage-progress-item ${
                                        isTechnical
                                            ? "active"
                                            : "completed"
                                    }`
                                }
                            >

                                <span>
                                    {isTechnical
                                        ? "1"
                                        : "✓"}
                                </span>

                                <div>
                                    <strong>
                                        Technical
                                    </strong>

                                    <small>
                                        Technical interview
                                    </small>
                                </div>

                            </div>


                            <div className="stage-progress-line" />

                            <div
                                className={
                                    `stage-progress-item ${
                                        isHR
                                            ? "active"
                                            : "locked"
                                    }`
                                }
                            >
                                <span>
                                    {isHR
                                        ? "2"
                                        : "🔒"}
                                </span>

                                <div>
                                    <strong>
                                        HR
                                    </strong>

                                    <small>
                                        HR interview
                                    </small>
                                </div>

                            </div>

                        </div>

                        {/* =============================
                            MAIN CONTENT
                        ============================== */}

                        <div className="interview-grid">

                            {/* =========================
                                DYNAMIC PREPARE SECTION
                            ========================== */}

                            <div className="prep-block">

                                <span className="section-kicker">
                                    PREPARE
                                </span>


                                <h3>
                                    {isTechnical
                                        ? "Technical interview"
                                        : "HR interview"}
                                </h3>


                                <p className="prep-description">

                                    {isTechnical
                                        ? "Focus on technical depth, problem solving, projects, and CS fundamentals."
                                        : "Focus on communication, behavioral questions, motivation, and culture fit."}

                                </p>


                                {activeChecklist.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <label
                                            key={item}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={currentChecklist.includes(
                                                    index
                                                )}
                                                onChange={() =>
                                                    toggleChecklistItem(
                                                        selected._id,
                                                        currentStage,
                                                        index
                                                    )
                                                }
                                            />

                                            {item}

                                        </label>
                                    )
                                )}

                            </div>


                            {/* =========================
                                APPLICATION CONTEXT
                            ========================== */}

                            <div className="prep-block">

                                <span className="section-kicker">
                                    APPLICATION CONTEXT
                                </span>

                                <h3>
                                    What you already know
                                </h3>


                                <div className="context-line">

                                    <span>
                                        Package
                                    </span>

                                    <strong>
                                        ₹
                                        {
                                            selected
                                                ?.company
                                                ?.package
                                        }{" "}
                                        LPA
                                    </strong>

                                </div>


                                <div className="context-line">

                                    <span>
                                        Applied
                                    </span>

                                    <strong>

                                        {new Date(
                                            selected.appliedDate
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}

                                    </strong>

                                </div>


                                <div className="context-line">

                                    <span>
                                        Location
                                    </span>

                                    <strong>
                                        {
                                            selected
                                                ?.company
                                                ?.location ||
                                            "Not specified"
                                        }
                                    </strong>

                                </div>


                                <div className="context-line">

                                    <span>
                                        Notes
                                    </span>

                                    <strong>
                                        {selected.notes ||
                                            "No notes added"}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* =============================
                            AI RESUME PREP
                        ============================== */}

                        <div className="prep-note">

                            <span>
                                ✦
                            </span>

                            <div>

                                <strong>
                                    AI Resume is your next
                                    prep layer.
                                </strong>

                                <p>
                                    Run your resume through
                                    the analyzer and use the
                                    role-fit and weakness
                                    sections to decide what
                                    to revise before the
                                    conversation.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/ai-resume"
                                    )
                                }
                            >
                                Open AI Resume →
                            </button>

                        </div>

                    </section>

                </div>
            )}

        </div>
    );
}

export default Interviews;