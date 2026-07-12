import TimelineStep from "./TimelineStep";

function ApplicationTimeline({ status }) {

    const steps = [
        "Applied",
        "OA Cleared",
        "Interview",
        "Selected",
    ];

    const currentIndex = steps.indexOf(status);

    return (

        <div className="timeline">

            {steps.map((step, index) => (

                <div
                    key={step}
                    className="timeline-wrapper"
                >

                    <TimelineStep
                        label={step}
                        completed={currentIndex > index}
                        active={currentIndex === index}
                    />

                    {index !== steps.length - 1 && (

                        <div
                            className={
                                currentIndex > index
                                    ? "timeline-line completed"
                                    : "timeline-line"
                            }
                        />

                    )}

                </div>

            ))}

        </div>

    );

}

export default ApplicationTimeline;