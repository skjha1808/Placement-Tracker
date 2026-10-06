import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

const getStoredBoolean = (key, fallback = false) =>
    localStorage.getItem(key) === null
        ? fallback
        : localStorage.getItem(key) === "true";

function Settings() {
    const navigate = useNavigate();

    const [compact, setCompact] = useState(
        getStoredBoolean("pt_compact")
    );

    const [applicationAlerts, setApplicationAlerts] = useState(
        getStoredBoolean("pt_application_alerts", true)
    );

    const [interviewReminders, setInterviewReminders] = useState(
        getStoredBoolean("pt_interview_reminders", true)
    );

    const [opportunityAlerts, setOpportunityAlerts] = useState(
        getStoredBoolean("pt_opportunity_alerts", true)
    );

    const [saved, setSaved] = useState(false);

    useEffect(() => {
        localStorage.setItem("pt_compact", compact);
    }, [compact]);

    const save = () => {
        localStorage.setItem("pt_compact", compact);
        localStorage.setItem("pt_application_alerts", applicationAlerts);
        localStorage.setItem("pt_interview_reminders", interviewReminders);
        localStorage.setItem("pt_opportunity_alerts", opportunityAlerts);

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 1800);
    };

    return (
        <div className="settings-page">
            <header className="settings-header">
                <span className="eyebrow">WORKSPACE SETTINGS</span>

                <h1>Settings.</h1>

                <p>
                    Configure how your placement workspace looks and how
                    important placement updates are handled.
                </p>
            </header>

            <section className="settings-section">
                <div className="settings-section-info">
                    <span className="section-kicker">DISPLAY</span>

                    <h2>Interface</h2>

                    <p>
                        Control how dense the placement workspace feels on
                        your screen.
                    </p>
                </div>

                <div className="settings-options">
                    <label className="setting-toggle">
                        <input
                            type="checkbox"
                            checked={compact}
                            onChange={(e) => setCompact(e.target.checked)}
                        />

                        <span className="toggle-ui" />

                        <span className="setting-copy">
                            <strong>Compact opportunity rows</strong>
                            <small>
                                Show more opportunities with less vertical
                                spacing.
                            </small>
                        </span>
                    </label>
                </div>
            </section>

            <section className="settings-section">
                <div className="settings-section-info">
                    <span className="section-kicker">NOTIFICATIONS</span>

                    <h2>Placement alerts</h2>

                    <p>
                        Choose which placement-related updates you want your
                        workspace to prioritize.
                    </p>
                </div>

                <div className="settings-options">
                    <label className="setting-toggle">
                        <input
                            type="checkbox"
                            checked={applicationAlerts}
                            onChange={(e) =>
                                setApplicationAlerts(e.target.checked)
                            }
                        />

                        <span className="toggle-ui" />

                        <span className="setting-copy">
                            <strong>Application updates</strong>
                            <small>
                                Keep application status changes enabled.
                            </small>
                        </span>
                    </label>

                    <label className="setting-toggle">
                        <input
                            type="checkbox"
                            checked={interviewReminders}
                            onChange={(e) =>
                                setInterviewReminders(e.target.checked)
                            }
                        />

                        <span className="toggle-ui" />

                        <span className="setting-copy">
                            <strong>Interview reminders</strong>
                            <small>
                                Keep interview-related reminders enabled.
                            </small>
                        </span>
                    </label>

                    <label className="setting-toggle">
                        <input
                            type="checkbox"
                            checked={opportunityAlerts}
                            onChange={(e) =>
                                setOpportunityAlerts(e.target.checked)
                            }
                        />

                        <span className="toggle-ui" />

                        <span className="setting-copy">
                            <strong>New opportunities</strong>
                            <small>
                                Show alerts for relevant placement openings.
                            </small>
                        </span>
                    </label>
                </div>
            </section>

            <section className="settings-section">
                <div className="settings-section-info">
                    <span className="section-kicker">ACCOUNT</span>

                    <h2>Account preferences</h2>

                    <p>
                        Your personal information and resume remain managed
                        from the Profile workspace.
                    </p>
                </div>

                <div className="settings-account-grid">
                    <button
                        type="button"
                        className="setting-static setting-link"
                        onClick={() => navigate("/profile")}
                    >
                        <strong>Profile</strong>
                        <span>Update your personal information and resume.</span>
                        <b>Open Profile →</b>
                    </button>

                    <div className="setting-static">
                        <strong>Session</strong>
                        <span>
                            Use Sign out from the sidebar to end the current
                            session.
                        </span>
                    </div>
                </div>
            </section>

            <div className="settings-actions">
                <button className="settings-save" onClick={save}>
                    {saved ? "Saved ✓" : "Save preferences"}
                </button>
            </div>
        </div>
    );
}

export default Settings;