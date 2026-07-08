import { useEffect, useState } from "react";
import api from "../../services/api";
import "./Companies.css";
import CompanyForm from "../../components/CompanyForm";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies");

            setCompanies(response.data);

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleEdit = (company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this company?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/companies/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            alert("Company deleted successfully!");

            fetchCompanies();

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
        }
    };

    return (
        <div className="companies-container">

            <h1 className="companies-title">
                Manage Companies
            </h1>

            <div className="add-company-container">
                <button
                    className="add-company-btn"
                    onClick={() => {
                        setSelectedCompany(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Add Company
                </button>
            </div>

            <br />

            {companies.length === 0 ? (
                <h3 className="no-companies">
                    No Companies Found
                </h3>
            ) : (
                <table className="companies-table">

                    <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Company</th>
                            <th>Role</th>
                            <th>Package</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {companies.map((company, index) => (

                            <tr key={company._id}>

                                <td>{index + 1}</td>

                                <td>{company.companyName}</td>

                                <td>{company.role}</td>

                                <td>₹{company.package} LPA</td>

                                <td>{company.location}</td>

                                <td>
                                    <span className="status-open">
                                        {company.status}
                                    </span>
                                </td>

                                <td>
                                    {new Date(
                                        company.applicationDeadline
                                    ).toLocaleDateString(
                                        "en-GB",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </td>

                                <td>

                                    <button
                                        className="edit-btn"
                                        onClick={() =>
                                            handleEdit(company)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() =>
                                            handleDelete(company._id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

            <CompanyForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fetchCompanies={fetchCompanies}
                selectedCompany={selectedCompany}
            />

        </div>
    );
}

export default Companies;