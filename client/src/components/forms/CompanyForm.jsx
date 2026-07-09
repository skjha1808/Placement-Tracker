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
            setJobType(selectedCompany.jobType);
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
            const data = {
                companyName,
                role,
                package: Number(packageOffered),
                location,
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
            console.log(
                error.response?.data || error.message
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

                    <br /><br />

                    <input
                        type="text"
                        placeholder="Role"
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                    />

                    <br /><br />

                    <input
                        type="number"
                        placeholder="Package (LPA)"
                        value={packageOffered}
                        onChange={(e) =>
                            setPackageOffered(e.target.value)
                        }
                    />

                    <br /><br />

                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) =>
                            setLocation(e.target.value)
                        }
                    />

                    <br /><br />

                    <input
                        type="text"
                        placeholder="Job Type"
                        value={jobType}
                        onChange={(e) =>
                            setJobType(e.target.value)
                        }
                    />

                    <br /><br />

                    <input
                        type="text"
                        placeholder="Eligible Branches (comma separated)"
                        value={eligibleBranches}
                        onChange={(e) =>
                            setEligibleBranches(e.target.value)
                        }
                    />

                    <br /><br />

                    <input
                        type="number"
                        placeholder="Minimum CGPA"
                        value={minimumCGPA}
                        onChange={(e) =>
                            setMinimumCGPA(e.target.value)
                        }
                    />

                    <br /><br />

                    <input
                        type="date"
                        value={applicationDeadline}
                        onChange={(e) =>
                            setApplicationDeadline(e.target.value)
                        }
                    />

                    <br /><br />

                    <button type="submit">
                        {selectedCompany
                            ? "Update Company"
                            : "Save Company"}
                    </button>

                    {" "}

                    <button
                        type="button"
                        onClick={() => {
                            clearForm();
                            onClose();
                        }}
                    >
                        Cancel
                    </button>

                </form>

            </div>
        </div>
    );
}

export default CompanyForm;