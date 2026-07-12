import { useState, useEffect } from "react";
import api from "../../services/api";
import "./Companies.css";

import LoadingSpinner from "../../components/ui/LoadingSpinner";
import EmptyState from "../../components/ui/EmptyState";

import SearchBar from "../../components/filters/SearchBar";
import FilterDropdown from "../../components/filters/FilterDropdown";
import SortDropdown from "../../components/filters/SortDropdown";

import CompanyCard from "../../components/company/CompanyCard";

function Companies() {

    const [companies, setCompanies] = useState([]);
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);

    const [eligibility, setEligibility] = useState({});

    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("All");
    const [packageFilter, setPackageFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("default");

    const fetchEligibility = async (companiesList) => {

        const result = {};

        await Promise.all(

            companiesList.map(async (company) => {

                try {

                    const response =
                        await api.get(
                            `/eligibility/${company._id}`
                        );

                    result[company._id] =
                        response.data;

                } catch (error) {

                    result[company._id] = {
                        eligible: false,
                        reason: "Unable to check",
                    };

                }

            })

        );

        setEligibility(result);

    };

    const fetchData = async () => {

        setLoading(true);

        try {

            const [

                companiesRes,

                profileRes,

            ] = await Promise.all([

                api.get("/companies"),

                api.get("/students/me"),

            ]);

            setCompanies(
                companiesRes.data
            );

            setProfile(
                profileRes.data
            );

            await fetchEligibility(
                companiesRes.data
            );

        } catch (error) {

            console.log(
                error.response?.data ||
                error.message
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchData();
    }, []);

    const locations = [

        "All",

        ...new Set(

            companies.map(

                company => company.location

            )

        ),

    ];

    const packageOptions = [

        "All",

        "5+ LPA",

        "10+ LPA",

        "15+ LPA",

        "20+ LPA",

    ];

    const statusOptions = [

        "All",

        "Open",

        "Closed",

    ];

    const handleApply = async (companyId) => {

        try {

            await api.post(

                "/applications",

                {
                    company: companyId,
                    notes: "",
                }

            );

            alert(
                "Applied Successfully!"
            );

            fetchData();

        } catch (error) {

            console.log(

                error.response?.data ||

                error.message

            );

            alert(

                error.response?.data?.message ||

                "Failed to apply."

            );

        }

    };

    if (loading) {

        return <LoadingSpinner />;

    }

    const filteredCompanies = [...companies]

        .filter((company) => {

            const matchesSearch =

                company.companyName

                    .toLowerCase()

                    .includes(

                        search.toLowerCase()

                    ) ||

                company.role

                    .toLowerCase()

                    .includes(

                        search.toLowerCase()

                    );

            const matchesLocation =

                locationFilter === "All" ||

                company.location === locationFilter;

            const matchesPackage =

                packageFilter === "All" ||

                (packageFilter === "5+ LPA" &&
                    company.package >= 5) ||

                (packageFilter === "10+ LPA" &&
                    company.package >= 10) ||

                (packageFilter === "15+ LPA" &&
                    company.package >= 15) ||

                (packageFilter === "20+ LPA" &&
                    company.package >= 20);

            const matchesStatus =

                statusFilter === "All" ||

                company.status === statusFilter;

            return (

                matchesSearch &&

                matchesLocation &&

                matchesPackage &&

                matchesStatus

            );

        });

    switch (sortBy) {

        case "packageHigh":

            filteredCompanies.sort(

                (a, b) =>

                    b.package - a.package

            );

            break;

        case "packageLow":

            filteredCompanies.sort(

                (a, b) =>

                    a.package - b.package

            );

            break;

        case "deadline":

            filteredCompanies.sort(

                (a, b) =>

                    new Date(
                        a.applicationDeadline
                    ) -

                    new Date(
                        b.applicationDeadline
                    )

            );

            break;

        case "az":

            filteredCompanies.sort(

                (a, b) =>

                    a.companyName.localeCompare(

                        b.companyName

                    )

            );

            break;

        default:

            break;

    }

    return (
        <div className="page">

            <h1 className="page-title">
                Available Companies
            </h1>

            <div className="companies-toolbar">

                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search company or role..."
                />

                <FilterDropdown
                    value={locationFilter}
                    onChange={setLocationFilter}
                    options={locations}
                />

                <FilterDropdown
                    value={packageFilter}
                    onChange={setPackageFilter}
                    options={packageOptions}
                />

                <FilterDropdown
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                />

                <SortDropdown
                    value={sortBy}
                    onChange={setSortBy}
                />

                <button
                    className="btn btn-secondary"
                    onClick={() => {

                        setSearch("");
                        setLocationFilter("All");
                        setPackageFilter("All");
                        setStatusFilter("All");
                        setSortBy("default");

                    }}
                >
                    Reset Filters
                </button>

            </div>

            {filteredCompanies.length === 0 ? (

                <EmptyState
                    message="No Companies Found"
                />

            ) : (

                <div className="companies-grid">

                    {filteredCompanies.map((company) => (

                        <CompanyCard
                            key={company._id}
                            company={company}
                            profile={profile}
                            eligibility={
                                eligibility[
                                    company._id
                                ]
                            }
                            onApply={handleApply}
                        />

                    ))}

                </div>

            )}

        </div>

    );

}

export default Companies;