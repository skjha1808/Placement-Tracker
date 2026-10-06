import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Home.css";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });

const daysLeft = (date) =>
    Math.ceil((new Date(date) - new Date()) / 86400000);

function PublicHome() {
    return (
        <div className="landing-page">
            <section className="landing-visual-panel">
                <div className="landing-brand-lockup">
                    <strong>Placement Tracker</strong>
                </div>

                <div className="visual-card">
                    <div className="visual-card-glow visual-card-glow-one" />
                    <div className="visual-card-glow visual-card-glow-two" />

                    <div className="visual-card-top">
                        <span>PLACEMENT JOURNEY</span>
                        <span className="visual-status">ACTIVE</span>
                    </div>

                    <div className="visual-card-title">
                        From opportunity
                        <br />
                        to selection.
                    </div>

                    <div className="visual-progress">
                        <span />
                    </div>

                    <div className="visual-mini-grid">
                        <div className="visual-mini-card">
                            <span className="visual-mini-number">01</span>
                            <strong>Apply</strong>
                            <small>Find the right role</small>
                        </div>

                        <div className="visual-mini-card">
                            <span className="visual-mini-number">02</span>
                            <strong>Interview</strong>
                            <small>Prepare with confidence</small>
                        </div>

                        <div className="visual-mini-card visual-mini-card-highlight">
                            <span className="visual-mini-number">03</span>
                            <strong>Selected</strong>
                            <small>Reach your goal</small>
                        </div>
                    </div>
                </div>

                <div className="journey-line">
                    <div className="journey-step">
                        <span>01</span>
                        <strong>Opportunity</strong>
                    </div>

                    <div className="journey-connector" />

                    <div className="journey-step">
                        <span>02</span>
                        <strong>Application</strong>
                    </div>

                    <div className="journey-connector" />

                    <div className="journey-step">
                        <span>03</span>
                        <strong>Interview</strong>
                    </div>

                    <div className="journey-connector" />

                    <div className="journey-step">
                        <span>04</span>
                        <strong>Selection</strong>
                    </div>
                </div>
            </section>

            <section className="landing-content">
                <div className="landing-content-inner">
                    <span className="eyebrow">
                        PLACEMENT INTELLIGENCE WORKSPACE
                    </span>

                    <h1>
                        One place to discover, track, and improve your placement
                        journey.
                    </h1>

                    <p>
                        Placement Tracker brings opportunities, applications,
                        interviews, and AI-powered resume feedback into one
                        focused student workspace.
                    </p>

                    <div className="landing-actions">
                        <a href="/register">Get started</a>
                        <a className="secondary" href="/login">
                            Sign in
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

function Home() {
    const token = localStorage.getItem("token");

    if (!token) return <PublicHome />;

    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [profile, setProfile] = useState(null);
    const [eligibility, setEligibility] = useState({});
    const [applications, setApplications] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchData = async () => {
        setLoading(true);

        try {
            const [companiesRes, profileRes, appsRes] = await Promise.all([
                api.get("/companies"),
                api.get("/students/me"),
                api.get("/applications/my"),
            ]);

            const list = companiesRes.data.companies || [];

            setCompanies(list);
            setProfile(profileRes.data);
            setApplications(appsRes.data || []);

            const checks = {};

            await Promise.all(
                list.map(async (company) => {
                    try {
                        checks[company._id] = (
                            await api.get(`/eligibility/${company._id}`)
                        ).data;
                    } catch {
                        checks[company._id] = {
                            eligible: false,
                            reason: "Unable to check",
                        };
                    }
                })
            );

            setEligibility(checks);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Unable to load placement opportunities."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return [...companies]
            .filter(
                (c) =>
                    !q ||
                    c.companyName.toLowerCase().includes(q) ||
                    c.role.toLowerCase().includes(q) ||
                    c.location.toLowerCase().includes(q)
            )
            .filter(
                (c) =>
                    filter === "all" ||
                    (filter === "eligible" &&
                        eligibility[c._id]?.eligible) ||
                    (filter === "closing" &&
                        c.status === "Open" &&
                        daysLeft(c.applicationDeadline) <= 7)
            )
            .sort((a, b) => {
                if (filter === "closing") {
                    return (
                        new Date(a.applicationDeadline) -
                        new Date(b.applicationDeadline)
                    );
                }

                return new Date(b.createdAt) - new Date(a.createdAt);
            });
    }, [companies, eligibility, search, filter]);

    const apply = async (companyId) => {
        try {
            await api.post("/applications", {
                company: companyId,
                notes: "",
            });

            setMessage("Application submitted successfully.");
            await fetchData();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                    "Unable to submit application."
            );
        }
    };

    if (loading) {
        return (
            <div className="workspace-loading">
                Loading placement opportunities…
            </div>
        );
    }

    return (
        <div className="workspace-page home-page">
            <header className="workspace-header">
                <div>
                    <span className="eyebrow">
                        PLACEMENT OPPORTUNITIES
                    </span>

                    <h1>Find your next opportunity.</h1>

                    <p>
                        Fresh openings first. Eligibility, deadline, and
                        application state stay visible before you commit.
                    </p>
                </div>

                <div className="header-meta">
                    <strong>
                        {companies.filter((c) => c.status === "Open").length}
                    </strong>

                    <span>open roles</span>
                </div>
            </header>

            {message && (
                <div className="inline-message">
                    {message}

                    <button onClick={() => setMessage("")}>×</button>
                </div>
            )}

            <section className="opportunity-toolbar">
                <div className="search-wrap">
                    <span>⌕</span>

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search company, role, or location"
                    />
                </div>

                <div className="filter-pills">
                    {[
                        ["all", "All"],
                        ["eligible", "Eligible for me"],
                        ["closing", "Closing soon"],
                    ].map(([value, label]) => (
                        <button
                            key={value}
                            className={
                                filter === value ? "selected" : ""
                            }
                            onClick={() => setFilter(value)}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            <section className="opportunity-intro">
                <span>{filtered.length} opportunities</span>
                <span>{applications.length} already applied</span>
            </section>

            <section className="opportunity-list">
                {filtered.map((company) => {
                    const check = eligibility[company._id];

                    const applied = applications.some(
                        (a) => a.company?._id === company._id
                    );

                    const remaining = daysLeft(
                        company.applicationDeadline
                    );

                    return (
                        <article
                            className="opportunity-row"
                            key={company._id}
                        >
                            <div className="company-monogram">
                                {company.companyName.charAt(0)}
                            </div>

                            <div className="opportunity-main">
                                <div className="opportunity-title">
                                    <h2>{company.companyName}</h2>

                                    <span
                                        className={
                                            check?.eligible
                                                ? "good"
                                                : applied
                                                ? "neutral"
                                                : "muted"
                                        }
                                    >
                                        {applied
                                            ? "Applied"
                                            : check?.eligible
                                            ? "Eligible"
                                            : check?.reason || "Checking"}
                                    </span>
                                </div>

                                <p>
                                    {company.role} · {company.location} ·{" "}
                                    {company.jobType}
                                </p>

                                <div className="opportunity-tags">
                                    <span>
                                        ₹{company.package} LPA
                                    </span>

                                    <span>
                                        CGPA {company.minimumCGPA}+
                                    </span>

                                    <span>
                                        {company.eligibleBranches?.join(", ")}
                                    </span>
                                </div>
                            </div>

                            <div className="opportunity-deadline">
                                <small>Deadline</small>

                                <strong>
                                    {formatDate(
                                        company.applicationDeadline
                                    )}
                                </strong>

                                <span
                                    className={
                                        remaining <= 3 ? "urgent" : ""
                                    }
                                >
                                    {remaining < 0
                                        ? "Closed"
                                        : `${remaining} days left`}
                                </span>
                            </div>

                            <button
                                disabled={
                                    !check?.eligible ||
                                    applied ||
                                    company.status !== "Open"
                                }
                                className="opportunity-action"
                                onClick={() => apply(company._id)}
                            >
                                {applied
                                    ? "Applied"
                                    : company.status !== "Open"
                                    ? "Closed"
                                    : "Apply"}
                            </button>
                        </article>
                    );
                })}

                {!filtered.length && (
                    <div className="empty-panel">
                        <strong>
                            No opportunities match this view.
                        </strong>

                        <span>
                            Try another filter or search term.
                        </span>
                    </div>
                )}
            </section>

            <button
                className="text-link"
                onClick={() => navigate("/overview")}
            >
                Go to your placement overview →
            </button>
        </div>
    );
}

export default Home;