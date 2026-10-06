import { useEffect, useState } from "react";
import api from "../../services/api";
import EmptyState from "../../components/ui/EmptyState";
import CompanyForm from "../../components/forms/CompanyForm";

import "./Companies.css";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const fetchCompanies = async () => {
        try {
            const response = await api.get("/companies");

            setCompanies(
                response.data.companies || []
            );
        } catch (error) {
            console.log(
                error.response?.data ||
                error.message
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
        if (!window.confirm("Delete this company?")) {
            return;
        }

        try {
            await api.delete(`/companies/${id}`);

            alert("Company deleted successfully!");

            await fetchCompanies();
        } catch (error) {
            console.log(
                error.response?.data ||
                error.message
            );
        }
    };

    const handleAddCompany = () => {
        setSelectedCompany(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const isClosingSoon = (company) => {
        if (company.status !== "Open") {
            return false;
        }

        if (!company.applicationDeadline) {
            return false;
        }

        const deadline = new Date(
            company.applicationDeadline
        );

        if (Number.isNaN(deadline.getTime())) {
            return false;
        }

        const now = new Date();

        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(
            sevenDaysFromNow.getDate() + 7
        );

        return (
            deadline >= now &&
            deadline <= sevenDaysFromNow
        );
    };

    const searchText = search.trim().toLowerCase();

    const filteredCompanies = companies.filter(
        (company) => {
            const companyName = (
                company.companyName || ""
            ).toLowerCase();

            const role = (
                company.role || ""
            ).toLowerCase();

            const location = (
                company.location || ""
            ).toLowerCase();

            const matchesSearch =
                companyName.includes(searchText) ||
                role.includes(searchText) ||
                location.includes(searchText);

            if (!matchesSearch) {
                return false;
            }

            if (statusFilter === "all") {
                return true;
            }

            if (statusFilter === "open") {
                return company.status === "Open";
            }

            if (statusFilter === "closing-soon") {
                return isClosingSoon(company);
            }

            if (statusFilter === "closed") {
                return company.status !== "Open";
            }

            return true;
        }
    );

    const openCompanies = companies.filter(
        (company) =>
            company.status === "Open"
    ).length;

    const closedCompanies = companies.filter(
        (company) =>
            company.status !== "Open"
    ).length;

    const formatDeadline = (deadline) => {
        if (!deadline) {
            return "—";
        }

        const date = new Date(deadline);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    return (
        <div className="companies-page">

            {/* =====================================
                PAGE HEADER
            ===================================== */}

            <div className="companies-page-header">

                <div>

                    <span className="companies-eyebrow">
                        COMPANY MANAGEMENT
                    </span>

                    <h1 className="companies-page-title">
                        Companies
                    </h1>

                    <p className="companies-page-subtitle">
                        Manage placement companies,
                        job roles, packages, and
                        application deadlines.
                    </p>

                </div>

                <div className="companies-summary">

                    <div className="company-summary-item">
                        <span>
                            Total
                        </span>

                        <strong>
                            {companies.length}
                        </strong>
                    </div>

                    <div className="company-summary-divider" />

                    <div className="company-summary-item">
                        <span>
                            Open
                        </span>

                        <strong className="summary-open">
                            {openCompanies}
                        </strong>
                    </div>

                    <div className="company-summary-divider" />

                    <div className="company-summary-item">
                        <span>
                            Closed
                        </span>

                        <strong className="summary-closed">
                            {closedCompanies}
                        </strong>
                    </div>

                </div>

            </div>

            {/* =====================================
                TOOLBAR
            ===================================== */}

            <div className="companies-toolbar">

                {/* SEARCH */}

                <div className="companies-search-wrapper">

                    <span
                        className="companies-search-icon"
                        aria-hidden="true"
                    >
                        🔍
                    </span>

                    <input
                        className="companies-search-input"
                        type="text"
                        placeholder="Search company, role, or location..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            className="companies-search-clear"
                            onClick={() =>
                                setSearch("")
                            }
                            aria-label="Clear search"
                        >
                            ×
                        </button>
                    )}

                </div>

                {/* FILTER + COUNT + ADD */}

                <div className="companies-toolbar-right">

                    <select
                        className="companies-status-filter"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                        aria-label="Filter companies"
                    >
                        <option value="all">
                            All Companies
                        </option>

                        <option value="open">
                            Open
                        </option>

                        <option value="closing-soon">
                            Closing Soon
                        </option>

                        <option value="closed">
                            Closed
                        </option>
                    </select>

                    <span className="companies-result-count">
                        {filteredCompanies.length}{" "}
                        {filteredCompanies.length === 1
                            ? "company"
                            : "companies"}
                    </span>

                    <button
                        type="button"
                        className="companies-add-btn"
                        onClick={handleAddCompany}
                    >
                        <span className="companies-add-icon">
                            +
                        </span>

                        Add Company
                    </button>

                </div>

            </div>

            {/* =====================================
                COMPANY TABLE
            ===================================== */}

            {filteredCompanies.length === 0 ? (

                <div className="companies-empty-card">
                    <EmptyState
                        message="No Companies Found"
                    />
                </div>

            ) : (

                <div className="companies-table-card">

                    <div className="companies-table-wrapper">

                        <table className="companies-table">

                            <thead>
                                <tr>

                                    <th className="company-index-column">
                                        #
                                    </th>

                                    <th>
                                        Company
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Package
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Deadline
                                    </th>

                                    <th className="company-actions-column">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredCompanies.map(
                                    (
                                        company,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                company._id
                                            }
                                        >

                                            <td className="company-index">
                                                {index + 1}
                                            </td>

                                            <td>
                                                <div className="company-name-cell">

                                                    <div className="company-logo-placeholder">
                                                        {(
                                                            company.companyName ||
                                                            "?"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div className="company-name-details">

                                                        <strong>
                                                            {company.companyName ||
                                                                "Unnamed Company"}
                                                        </strong>

                                                        <span>
                                                            Placement Drive
                                                        </span>

                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <span className="company-role">
                                                    {company.role ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="company-package">
                                                    ₹{" "}
                                                    {company.package ||
                                                        "—"}

                                                    {company.package && (
                                                        <small>
                                                            LPA
                                                        </small>
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="company-location">
                                                    {company.location ||
                                                        "—"}
                                                </span>
                                            </td>

                                            <td>

                                                <span
                                                    className={`company-status-badge ${
                                                        company.status ===
                                                        "Open"
                                                            ? "open"
                                                            : "closed"
                                                    }`}
                                                >

                                                    <span className="company-status-dot" />

                                                    {company.status ||
                                                        "Closed"}

                                                </span>

                                            </td>

                                            <td>
                                                <span className="company-deadline">
                                                    {formatDeadline(
                                                        company.applicationDeadline
                                                    )}
                                                </span>
                                            </td>

                                            <td>

                                                <div className="company-actions">

                                                    <button
                                                        type="button"
                                                        className="company-action-btn company-edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                company
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="company-action-btn company-delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                company._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

            {/* =====================================
                COMPANY FORM
            ===================================== */}

            {isModalOpen && (
                <CompanyForm
                    onClose={handleCloseModal}
                    fetchCompanies={fetchCompanies}
                    selectedCompany={
                        selectedCompany
                    }
                />
            )}

        </div>
    );
}

export default Companies;