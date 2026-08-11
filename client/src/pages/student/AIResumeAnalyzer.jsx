import { useState } from "react";
import "./AIResumeAnalyzer.css";

import ResumeUpload from "../../components/ai/ResumeUpload";
import ResumeScore from "../../components/ai/ResumeScore";
import OverallVerdict from "../../components/ai/OverallVerdict";
import ScoreBreakdown from "../../components/ai/ScoreBreakdown";
import RoleFit from "../../components/ai/RoleFit";
import StrengthsWeaknesses from "../../components/ai/StrengthsWeaknesses";
import ATSKeywords from "../../components/ai/ATSKeywords";
import Suggestions from "../../components/ai/Suggestions";
import Summary from "../../components/ai/Summary";

function AIResumeAnalyzer() {

    const [analysis, setAnalysis] = useState(null);

    if (analysis) {
        console.log("Score Breakdown:", analysis.scoreBreakdown);
        console.log("Overall Verdict:", analysis.overallVerdict);
    }

    return (
        <div className="ai-resume-page">

            <div className="ai-page-header">

                <h2>🤖 AI Resume Analyzer</h2>

                <p>
                    Upload your resume to receive an AI-powered evaluation,
                    ATS analysis, role recommendations, strengths,
                    weaknesses, and personalized improvement suggestions.
                </p>

            </div>

            <ResumeUpload
                onAnalysisComplete={setAnalysis}
            />

            {analysis && (
                <>
                    <div className="ai-top-section">
                        <ResumeScore
                            analysis={analysis}
                        />

                        <OverallVerdict
                            analysis={analysis}
                        />
                    </div>

                    <div className="ai-section">
                        <ScoreBreakdown
                            analysis={analysis}
                        />
                    </div>

                    <div className="ai-section">
                        <RoleFit
                            analysis={analysis}
                        />
                    </div>

                    <div className="ai-section">
                        <StrengthsWeaknesses
                            analysis={analysis}
                        />
                    </div>

                    <div className="ai-section">
                        <ATSKeywords
                            analysis={analysis}
                        />
                    </div>

                    <div className="ai-section">
                        <Suggestions
                            analysis={analysis}
                        />
                    </div>

                    <div className="ai-section">
                        <Summary
                            analysis={analysis}
                        />
                    </div>
                </>
            )}

        </div>
    );
}

export default AIResumeAnalyzer;