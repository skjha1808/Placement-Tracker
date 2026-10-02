import { useEffect, useState } from "react";
import api from "../../services/api";
import EmptyState from "../../components/ui/EmptyState";
import CompanyForm from "../../components/forms/CompanyForm";

import "./Companies.css";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies");
            setCompanies(response.data.companies || []);

        } catch (error) {
            console.log(error.response?.data || error.message);
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
        if (!window.confirm("Delete this company?")) return;

        try {
            await api.delete(`/companies/${id}`);

            alert("Company deleted successfully!");
            await fetchCompanies();

        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    const keyword = search.toLowerCase();
    const filteredCompanies = companies.filter((company) => (
        (company.companyName || "")
            .toLowerCase()
            .includes(keyword) ||

        (company.role || "")
            .toLowerCase()
            .includes(keyword) ||

        (company.location || "")
            .toLowerCase()
            .includes(keyword)
    ));

    return (
        <div className="page">
            <h1 className="page-title">Manage Companies</h1>

            <div className="companies-toolbar">
                <input
                    className="input search-input"
                    type="text"
                    placeholder="🔍 Search company..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setSelectedCompany(null);
                        setIsModalOpen(true);
                    }}
                >
                    + Add Company
                </button>
            </div>

            {filteredCompanies.length === 0 ? (
                <EmptyState message="No Companies Found" />
            ) : (
                <div className="table-container">
                    <table className="companies-table">
                        <thead>
                            <tr>
                                <th>#</th>
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
                            {filteredCompanies.map((company, index) => (
                                <tr key={company._id}>
                                    <td>{index + 1}</td>

                                    <td>{company.companyName}</td>

                                    <td>{company.role}</td>

                                    <td>₹ {company.package} LPA</td>

                                    <td>{company.location}</td>

                                    <td>
                                        <span
                                            className={
                                                company.status === "Open"
                                                    ? "badge badge-success"
                                                    : "badge badge-danger"
                                            }
                                        >
                                            {company.status}
                                        </span>
                                    </td>

                                    <td>
                                        {new Date(
                                            company.applicationDeadline
                                        ).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </td>

                                    <td className="action-buttons">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() =>
                                                handleEdit(company)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger"
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
                </div>
            )}

            {isModalOpen && (
                <CompanyForm
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedCompany(null);
                    }}
                    fetchCompanies={fetchCompanies}
                    selectedCompany={selectedCompany}
                />
            )}
        </div>
    );
}

export default Companies;