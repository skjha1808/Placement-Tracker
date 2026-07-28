import { useState, useEffect } from "react";
import api from "../../services/api";
import "./CompanyForm.css";

function CompanyForm({
    isOpen,
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
    const [applicationDeadline, setApplicationDeadline] = useState("");

    useEffect(() => {
        if (selectedCompany) {
            setCompanyName(selectedCompany.companyName);
            setRole(selectedCompany.role);
            setPackageOffered(selectedCompany.package);
            setLocation(selectedCompany.location);
            const jobTypeMap = {
                "internship": "Internship",
                "full time": "Full-time",
                "full-time": "Full-time",
                "internship + fte": "Internship + FTE",
            };

            setJobType(
                jobTypeMap[selectedCompany.jobType.toLowerCase()] ||
                selectedCompany.jobType
            );

            setEligibleBranches(
                selectedCompany.eligibleBranches.join(", ")
            );
            setMinimumCGPA(selectedCompany.minimumCGPA);
            setApplicationDeadline(
                selectedCompany.applicationDeadline.slice(0, 10)
            );
        } else {
            clearForm();
        }
    }, [selectedCompany]);

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

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log({
                jobType,
                applicationDeadline,
            });
            const data = {
                companyName: companyName.trim(),
                role: role.trim(),
                package: Number(packageOffered),
                location: location.trim(),
                jobType,
                eligibleBranches: eligibleBranches
                    .split(",")
                    .map((branch) => branch.trim()),
                minimumCGPA: Number(minimumCGPA),
                applicationDeadline,
            };

            if (selectedCompany) {
                await api.put(
                    `/companies/${selectedCompany._id}`,
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                alert("Company updated successfully!");
            } else {
                await api.post(
                    "/companies",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                alert("Company added successfully!");
            }

            fetchCompanies();
            clearForm();
            onClose();

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong."
            );
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h2>
                    {selectedCompany
                        ? "Edit Company"
                        : "Add Company"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) =>
                            setCompanyName(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="Role"
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        placeholder="Package (LPA)"
                        value={packageOffered}
                        min="0"
                        max="100"
                        step="0.1"
                        onChange={(e) =>
                            setPackageOffered(e.target.value)
                        }
                    />

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) =>
                            setLocation(e.target.value)
                        }
                    />

                    <select
                        value={jobType}
                        onChange={(e) =>
                            setJobType(e.target.value)
                        }
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

                    <input
                        type="text"
                        placeholder="Eligible Branches (comma separated)"
                        value={eligibleBranches}
                        onChange={(e) =>
                            setEligibleBranches(e.target.value)
                        }
                    />

                    <input
                        type="number"
                        placeholder="Minimum CGPA"
                        value={minimumCGPA}
                        min="0"
                        max="10"
                        step="0.01"
                        onChange={(e) =>
                            setMinimumCGPA(e.target.value)
                        }
                    />

                    <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={applicationDeadline}
                        onChange={(e) =>
                            setApplicationDeadline(e.target.value)
                        }
                    />

                    <div className="modal-buttons">

                        <button type="button"
                            onClick={() => {
                                clearForm();
                                onClose();
                            }}
                        >
                            Cancel
                        </button>

                        <button type="submit">
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