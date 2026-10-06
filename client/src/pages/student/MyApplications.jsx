import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./MyApplications.css";

const stages = ["Applied", "OA Cleared", "Interview", "Selected"];

const formatDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

function ApplicationProgress({ status, rejectedAtStage }) {
    if (status === "Rejected") {
        return (
            <div className="mini-rejected">
                Rejected at {rejectedAtStage || "an earlier"} stage
            </div>
        );
    }

    const active = stages.indexOf(status);

    return (
        <div className="mini-timeline">
            {stages.map((stage, i) => (
                <div
                    className={`mini-stage ${i <= active ? "done" : ""} ${
                        i === active ? "current" : ""
                    }`}
                    key={stage}
                >
                    <span>{i < active ? "✓" : i + 1}</span>
                    <small>{stage}</small>
                </div>
            ))}
        </div>
    );
}

function MyApplications() {
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [status, setStatus] = useState("All");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/applications/my")
            .then((r) => setApplications(r.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const visible = useMemo(
        () =>
            status === "All"
                ? applications
                : applications.filter((a) => a.status === status),
        [applications, status]
    );

    const counts = useMemo(
        () =>
            Object.fromEntries(
                ["Applied", "OA Cleared", "Interview", "Selected", "Rejected"].map(
                    (s) => [
                        s,
                        applications.filter((a) => a.status === s).length,
                    ]
                )
            ),
        [applications]
    );

    if (loading) {
        return (
            <div className="applications-page app-loading">
                Loading applications…
            </div>
        );
    }

    return (
        <div className="applications-page">
            <header className="applications-header">
                <div>
                    <span className="eyebrow">APPLICATION CONTROL</span>

                    <h1>Your applications.</h1>

                    <p>
                        Every application, its current stage, and the next
                        meaningful step.
                    </p>
                </div>

                <button onClick={() => navigate("/home")}>
                    + Find opportunities
                </button>
            </header>

            <div className="application-summary">
                <div>
                    <strong>{applications.length}</strong>
                    <span>Total</span>
                </div>

                <div>
                    <strong>{counts.Interview}</strong>
                    <span>Interviews</span>
                </div>

                <div>
                    <strong>{counts.Selected}</strong>
                    <span>Selected</span>
                </div>

                <div>
                    <strong>{counts.Rejected}</strong>
                    <span>Rejected</span>
                </div>
            </div>

            <div className="application-filters">
                {["All", ...Object.keys(counts)].map((s) => (
                    <button
                        key={s}
                        className={status === s ? "active" : ""}
                        onClick={() => setStatus(s)}
                    >
                        {s}

                        <span>
                            {s === "All" ? applications.length : counts[s]}
                        </span>
                    </button>
                ))}
            </div>

            <section className="application-list">
                {visible.map((app) => (
                    <article
                        className="application-row"
                        key={app._id}
                    >
                        <div className="application-company">
                            <div className="application-logo">
                                {app.company?.companyName?.charAt(0)}
                            </div>

                            <div>
                                <h2>{app.company?.companyName}</h2>

                                <p>{app.company?.role}</p>

                                <small>
                                    Applied {formatDate(app.appliedDate)}
                                </small>
                            </div>
                        </div>

                        <div className="application-facts">
                            <span>
                                ₹{app.company?.package} LPA
                            </span>

                            <span>
                                {app.company?.location}
                            </span>
                        </div>

                        <div className="application-stage">
                            <strong
                                className={`stage-${app.status
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}`}
                            >
                                {app.status}
                            </strong>

                            <ApplicationProgress
                                status={app.status}
                                rejectedAtStage={app.rejectedAtStage}
                            />
                        </div>

                        <button
                            className="application-open"
                            onClick={() =>
                                app.status === "Interview"
                                    ? navigate("/interviews")
                                    : navigate(
                                          `/company/${app.company?._id}`
                                      )
                            }
                        >
                            {app.status === "Interview"
                                ? "Prepare →"
                                : "View role →"}
                        </button>
                    </article>
                ))}

                {!visible.length && (
                    <div className="empty-application">
                        <strong>No applications in this stage.</strong>

                        <span>
                            Choose another status or discover a new
                            opportunity.
                        </span>
                    </div>
                )}
            </section>
        </div>
    );
}

export default MyApplications;