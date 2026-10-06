import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Overview.css";

const date = d => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const days = d => Math.ceil((new Date(d) - new Date()) / 86400000);

function Overview() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.get("/students/me"), api.get("/applications/my"), api.get("/companies")])
            .then(([p, a, c]) => { setProfile(p.data); setApplications(a.data || []); setCompanies(c.data.companies || []); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const stats = useMemo(() => ({
        total: applications.length,
        active: applications.filter(a => ["Applied", "OA Cleared", "Interview"].includes(a.status)).length,
        interviews: applications.filter(a => a.status === "Interview").length,
        selected: applications.filter(a => a.status === "Selected").length,
        rejected: applications.filter(a => a.status === "Rejected").length,
    }), [applications]);

    const nextMove = applications.find(a => a.status === "Interview") || applications.find(a => a.status === "OA Cleared") || companies.find(c => c.status === "Open");
    const upcoming = [...companies].filter(c => c.status === "Open" && days(c.applicationDeadline) >= 0).sort((a,b) => new Date(a.applicationDeadline)-new Date(b.applicationDeadline)).slice(0,4);
    const recent = applications.slice(0,4);
    const profileReady = !!profile;

    if (loading) return <div className="overview-page overview-loading">Loading your placement command center…</div>;

    return (
        <div className="overview-page">
            <header className="overview-header">
                <div><span className="eyebrow">YOUR PLACEMENT JOURNEY</span><h1>Good to see you, {user?.name?.split(" ")[0] || "there"}.</h1><p>Here’s what needs your attention — without the noise.</p></div>
                <button className="primary-action" onClick={() => navigate("/home")}>Explore opportunities →</button>
            </header>

            <section className="journey-panel">
                <div className="journey-copy"><span className="section-kicker">PLACEMENT RADAR</span><h2>{stats.total ? `${stats.active} active application${stats.active === 1 ? "" : "s"}` : "Your placement journey starts here"}</h2><p>{stats.selected ? `${stats.selected} selection${stats.selected === 1 ? "" : "s"} recorded.` : stats.interviews ? "You have an interview stage to prepare for." : "Build momentum by finding a strong-fit opportunity and applying."}</p></div>
                <div className="journey-track">
                    {["Discover", "Apply", "Assessment", "Interview", "Offer"].map((label, i) => {
                        const reached = stats.total > 0 && i < (stats.selected ? 5 : stats.interviews ? 4 : stats.total ? 2 : 1);
                        return <div key={label} className={`journey-node ${reached ? "reached" : ""}`}><span>{reached ? "✓" : i + 1}</span><small>{label}</small></div>;
                    })}
                </div>
            </section>

            <div className="overview-grid">
                <section className="attention-panel">
                    <div className="section-head"><div><span className="section-kicker">YOUR NEXT MOVE</span><h2>What should you do now?</h2></div></div>
                    {nextMove ? (
                        <div className="next-move">
                            <div className="move-index">01</div>
                            <div><strong>{nextMove.companyName || nextMove.company?.companyName}</strong><p>{nextMove.role || nextMove.company?.role}</p><span>{nextMove.status === "Interview" ? "Prepare for your interview" : nextMove.status === "OA Cleared" ? "Move to interview preparation" : `Apply before ${date(nextMove.applicationDeadline)}`}</span></div>
                            <button onClick={() => navigate(nextMove.status ? "/interviews" : "/home")}>{nextMove.status === "Interview" ? "Open interview" : "View role"} →</button>
                        </div>
                    ) : <div className="empty-inline">No urgent action yet. Explore the latest opportunities.</div>}
                    <div className="quick-stats"><div><strong>{stats.total}</strong><span>Applications</span></div><div><strong>{stats.interviews}</strong><span>Interviews</span></div><div><strong>{stats.selected}</strong><span>Selected</span></div><div><strong>{stats.rejected}</strong><span>Rejected</span></div></div>
                </section>

                <section className="profile-panel">
                    <span className="section-kicker">READINESS</span><h2>Profile readiness</h2>
                    <div className="readiness-line"><div className={`readiness-dot ${profileReady ? "ready" : "pending"}`} /><strong>{profileReady ? "Profile available" : "Profile incomplete"}</strong></div>
                    <p>{profileReady ? `${profile.branch || "Branch not set"} · CGPA ${profile.cgpa ?? "—"} · ${profile.skills?.length || 0} skills` : "Complete your profile before applying to roles."}</p>
                    <button className="outline-action" onClick={() => navigate("/profile")}>{profileReady ? "Review profile" : "Complete profile"} →</button>
                </section>
            </div>

            <section className="overview-section"><div className="section-head"><div><span className="section-kicker">RECENT ACTIVITY</span><h2>Latest application movement</h2></div><button onClick={() => navigate("/applications")}>View all →</button></div>
                {recent.length ? <div className="activity-table">{recent.map(app => <div className="activity-row" key={app._id}><div className="activity-company"><span>{app.company?.companyName?.charAt(0)}</span><div><strong>{app.company?.companyName}</strong><small>{app.company?.role}</small></div></div><span className={`status-text status-${app.status.toLowerCase().replaceAll(" ", "-")}`}>{app.status}</span><small>{date(app.appliedDate)}</small></div>)}</div> : <div className="empty-inline">Applications you submit will appear here.</div>}
            </section>

            <section className="overview-section"><div className="section-head"><div><span className="section-kicker">DEADLINE RADAR</span><h2>Openings closing soon</h2></div><button onClick={() => navigate("/home")}>See all opportunities →</button></div>
                <div className="deadline-strip">{upcoming.map(company => <button key={company._id} onClick={() => navigate("/home")}><div><strong>{company.companyName}</strong><small>{company.role}</small></div><span>{days(company.applicationDeadline)}d</span></button>)}{!upcoming.length && <div className="empty-inline">No open deadlines found.</div>}</div>
            </section>
        </div>
    );
}
export default Overview;
