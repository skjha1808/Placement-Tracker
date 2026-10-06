import { useState, useEffect } from "react";
import api from "../../services/api";
import "./CompanyForm.css";

function CompanyForm({
    onClose,
    fetchCompanies,
    selectedCompany,
}) {
    const [companyName, setCompanyName] = useState("");
    const [role, setRole] = useState("");
    const [packageOffered, setPackageOffered] = useState("");
    const [location, setLocation] = useState("");
    const [jobType, setJobType] = useState("");
    const [eligibleBranches, setEligibleBranches] = useState("");
    const [minimumCGPA, setMinimumCGPA] = useState("");
    const [applicationDeadline, setApplicationDeadline] =
        useState("");

    const clearForm = () => {
        setCompanyName("");
        setRole("");
        setPackageOffered("");
        setLocation("");
        setJobType("");
        setEligibleBranches("");
        setMinimumCGPA("");
        setApplicationDeadline("");
    };

    useEffect(() => {
        if (!selectedCompany) {
            clearForm();
            return;
        }

        const jobTypeMap = {
            internship: "Internship",
            "full time": "Full-time",
            "full-time": "Full-time",
            "internship + fte": "Internship + FTE",
        };

        setCompanyName(
            selectedCompany.companyName || ""
        );

        setRole(
            selectedCompany.role || ""
        );

        setPackageOffered(
            selectedCompany.package ?? ""
        );

        setLocation(
            selectedCompany.location || ""
        );

        setJobType(
            jobTypeMap[
                selectedCompany.jobType?.toLowerCase()
            ] ??
                selectedCompany.jobType ??
                ""
        );

        setEligibleBranches(
            selectedCompany.eligibleBranches?.join(", ") ||
                ""
        );

        setMinimumCGPA(
            selectedCompany.minimumCGPA ?? ""
        );

        setApplicationDeadline(
            selectedCompany.applicationDeadline
                ? new Date(
                      selectedCompany.applicationDeadline
                  )
                      .toISOString()
                      .split("T")[0]
                : ""
        );
    }, [selectedCompany]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                companyName: companyName.trim(),

                role: role.trim(),

                package: Number(
                    packageOffered
                ),

                location: location.trim(),

                jobType,

                eligibleBranches:
                    eligibleBranches
                        .split(",")
                        .map(
                            (branch) =>
                                branch.trim()
                        )
                        .filter(Boolean),

                minimumCGPA: Number(
                    minimumCGPA
                ),

                applicationDeadline,
            };

            if (selectedCompany) {
                await api.put(
                    `/companies/${selectedCompany._id}`,
                    data
                );

                alert(
                    "Company updated successfully!"
                );
            } else {
                await api.post(
                    "/companies",
                    data
                );

                alert(
                    "Company added successfully!"
                );
            }

            await fetchCompanies();

            clearForm();

            onClose();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Something went wrong."
            );
        }
    };

    const today = new Date()
        .toISOString()
        .split("T")[0];

    return (
        <div
            className="company-modal-overlay"
            onMouseDown={(e) => {
                if (
                    e.target === e.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="company-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="company-modal-title"
            >
                {/* =====================================
                    HEADER
                ===================================== */}

                <div className="company-modal-header">

                    <div>
                        <span className="company-modal-eyebrow">
                            COMPANY MANAGEMENT
                        </span>

                        <h2 id="company-modal-title">
                            {selectedCompany
                                ? "Edit Company"
                                : "Add Company"}
                        </h2>

                        <p>
                            {selectedCompany
                                ? "Update the placement drive details below."
                                : "Add a new company and placement opportunity."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="company-modal-close"
                        onClick={onClose}
                        aria-label="Close company form"
                    >
                        ×
                    </button>

                </div>

                {/* =====================================
                    FORM
                ===================================== */}

                <form
                    className="company-form"
                    onSubmit={handleSubmit}
                >

                    {/* Basic Information */}

                    <div className="company-form-section">

                        <div className="company-form-section-heading">
                            <span>
                                01
                            </span>

                            <div>
                                <h3>
                                    Company Information
                                </h3>

                                <p>
                                    Basic details about the placement opportunity.
                                </p>
                            </div>
                        </div>

                        <div className="company-form-grid">

                            <div className="company-form-field company-form-field-full">

                                <label htmlFor="company-name">
                                    Company Name
                                    <span>*</span>
                                </label>

                                <input
                                    id="company-name"
                                    type="text"
                                    placeholder="e.g. TCS"
                                    value={companyName}
                                    onChange={(e) =>
                                        setCompanyName(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            <div className="company-form-field">

                                <label htmlFor="company-role">
                                    Job Role
                                    <span>*</span>
                                </label>

                                <input
                                    id="company-role"
                                    type="text"
                                    placeholder="e.g. Software Engineer"
                                    value={role}
                                    onChange={(e) =>
                                        setRole(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            <div className="company-form-field">

                                <label htmlFor="company-location">
                                    Location
                                    <span>*</span>
                                </label>

                                <input
                                    id="company-location"
                                    type="text"
                                    placeholder="e.g. Bangalore"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>

                    </div>

                    {/* Compensation & Eligibility */}

                    <div className="company-form-section">

                        <div className="company-form-section-heading">
                            <span>
                                02
                            </span>

                            <div>
                                <h3>
                                    Compensation & Eligibility
                                </h3>

                                <p>
                                    Define package and student eligibility requirements.
                                </p>
                            </div>
                        </div>

                        <div className="company-form-grid">

                            <div className="company-form-field">

                                <label htmlFor="company-package">
                                    Package
                                    <span>*</span>
                                </label>

                                <div className="company-input-with-suffix">

                                    <input
                                        id="company-package"
                                        type="number"
                                        inputMode="decimal"
                                        placeholder="e.g. 9"
                                        value={
                                            packageOffered
                                        }
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        onChange={(e) =>
                                            setPackageOffered(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                    <span>
                                        LPA
                                    </span>

                                </div>

                            </div>

                            <div className="company-form-field">

                                <label htmlFor="company-cgpa">
                                    Minimum CGPA
                                    <span>*</span>
                                </label>

                                <input
                                    id="company-cgpa"
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="e.g. 7.5"
                                    value={
                                        minimumCGPA
                                    }
                                    min="0"
                                    max="10"
                                    step="0.01"
                                    onChange={(e) =>
                                        setMinimumCGPA(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            <div className="company-form-field company-form-field-full">

                                <label htmlFor="company-branches">
                                    Eligible Branches
                                    <span>*</span>
                                </label>

                                <input
                                    id="company-branches"
                                    type="text"
                                    placeholder="e.g. CSE, IT, ECE"
                                    value={
                                        eligibleBranches
                                    }
                                    onChange={(e) =>
                                        setEligibleBranches(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                                <small>
                                    Enter multiple branches separated by commas.
                                </small>

                            </div>

                        </div>

                    </div>

                    {/* Drive Details */}

                    <div className="company-form-section">

                        <div className="company-form-section-heading">
                            <span>
                                03
                            </span>

                            <div>
                                <h3>
                                    Drive Details
                                </h3>

                                <p>
                                    Configure the hiring type and application deadline.
                                </p>
                            </div>
                        </div>

                        <div className="company-form-grid">

                            <div className="company-form-field">

                                <label htmlFor="company-job-type">
                                    Job Type
                                    <span>*</span>
                                </label>

                                <select
                                    id="company-job-type"
                                    value={jobType}
                                    onChange={(e) =>
                                        setJobType(
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        Select Job Type
                                    </option>

                                    <option value="Full-time">
                                        Full-time
                                    </option>

                                    <option value="Internship">
                                        Internship
                                    </option>

                                    <option value="Internship + FTE">
                                        Internship + FTE
                                    </option>
                                </select>

                            </div>

                            <div className="company-form-field">

                                <label htmlFor="company-deadline">
                                    Application Deadline
                                    <span>*</span>
                                </label>

                                <input
                                    id="company-deadline"
                                    type="date"
                                    min={today}
                                    value={
                                        applicationDeadline
                                    }
                                    onChange={(e) =>
                                        setApplicationDeadline(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="company-form-footer">

                        <button
                            type="button"
                            className="company-form-cancel"
                            onClick={() => {
                                clearForm();
                                onClose();
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="company-form-submit"
                        >
                            {selectedCompany
                                ? "Update Company"
                                : "Save Company"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default CompanyForm;