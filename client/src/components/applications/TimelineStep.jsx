function TimelineStep({

    label,

    active,

    completed,

}) {

    return (

        <div className="timeline-step">

            <div
                className={`timeline-circle 
                    ${completed ? "completed" : ""}
                    ${active ? "active" : ""}`}
            >
                {completed ? "✓" : ""}
            </div>

            <span className="timeline-label">

                {label}

            </span>

        </div>

    );

}

export default TimelineStep;