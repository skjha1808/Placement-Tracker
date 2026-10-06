import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./Profile.css";

import ProfileSection from "../../components/ui/ProfileSection";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import {
    formatName,
    formatSkills,
} from "../../utils/formatters";

import {
    validateProfile,
    validatePhone,
} from "../../utils/validation";

import {
    BRANCH_OPTIONS,
    EDUCATION_OPTIONS,
} from "../../constants/options";


function Profile() {

    const navigate = useNavigate();

    // =====================================================
    // PERSONAL INFORMATION
    // =====================================================

    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [bio, setBio] = useState("");


    // =====================================================
    // EXISTING / GRADUATION ACADEMIC FIELDS
    // =====================================================

    const [branch, setBranch] = useState("");
    const [education, setEducation] = useState("");
    const [cgpa, setCgpa] = useState("");


    // =====================================================
    // 10TH
    // =====================================================

    const [tenth, setTenth] = useState({
        schoolName: "",
        percentage: "",
        board: "",
        passingYear: "",
    });


    // =====================================================
    // 12TH
    // =====================================================

    const [twelfth, setTwelfth] = useState({
        schoolName: "",
        percentage: "",
        board: "",
        stream: "",
        passingYear: "",
    });


    // =====================================================
    // GRADUATION
    // =====================================================

    const [graduation, setGraduation] = useState({
        college: "",
        degree: "",
        branch: "",
        cgpa: "",
        graduationYear: "",
        currentSemester: "",
    });


    // =====================================================
    // PROFESSIONAL / TECHNICAL
    // =====================================================

    const [skills, setSkills] = useState("");
    const [programmingLanguages, setProgrammingLanguages] =
        useState("");
    const [frameworksLibraries, setFrameworksLibraries] =
        useState("");
    const [databases, setDatabases] = useState("");
    const [cloudTools, setCloudTools] = useState("");


    // =====================================================
    // DEVELOPER PROFILES
    // =====================================================

    const [developerProfiles, setDeveloperProfiles] =
        useState({
            linkedin: "",
            github: "",
            leetcode: "",
            portfolio: "",
        });


    // =====================================================
    // EXPERIENCE & ACHIEVEMENTS
    // =====================================================

    const [internships, setInternships] = useState([]);

    const [certifications, setCertifications] = useState([]);

    const [achievements, setAchievements] = useState([]);

    const [hackathons, setHackathons] = useState([]);

    const [projects, setProjects] = useState([]);

    const [codingAchievements, setCodingAchievements] =
        useState([]);


    // =====================================================
    // PROFILE / RESUME STATE
    // =====================================================

const [profileExists, setProfileExists] = useState(false);
const [isVerified, setIsVerified] = useState(false);

const [profileEditAccess, setProfileEditAccess] = useState({
    enabled: false,
    expiresAt: null,
    approvedBy: null,
});

const [profileUpdateRequests, setProfileUpdateRequests] = useState([]);

const [editRequestReason, setEditRequestReason] = useState("");

const [showEditRequestModal, setShowEditRequestModal] =
    useState(false);

const [requestSubmitting, setRequestSubmitting] =
    useState(false);

const [currentTime, setCurrentTime] = useState(Date.now());

const [loading, setLoading] = useState(true);

const [resumeFile, setResumeFile] = useState(null);
const [resume, setResume] = useState(null);

const [errors, setErrors] = useState({});

const [editingSection, setEditingSection] = useState(null);
const [sectionSnapshots, setSectionSnapshots] = useState({});
const [editingEntries, setEditingEntries] = useState({
    internships: null,
    certifications: null,
    achievements: null,
    hackathons: null,
    projects: null,
    codingAchievements: null,
});
const [entrySnapshots, setEntrySnapshots] = useState({});


    // =====================================================
    // HELPERS
    // =====================================================

    const splitList = (value) => {
        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    };


    const joinList = (value) => {
        return Array.isArray(value)
            ? value.join(", ")
            : "";
    };


    const beginSectionEdit = (section) => {
        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }
        if (section === "personal") {
            setSectionSnapshots((p) => ({
                ...p,
                personal: {
                    name,
                    email,
                    phone,
                    gender,
                    city,
                    bio,
                },
            }));
        }

        if (section === "academic") {
            setSectionSnapshots((p) => ({
                ...p,
                academic: {
                    branch,
                    education,
                    cgpa,
                    tenth: { ...tenth },
                    twelfth: { ...twelfth },
                    graduation: { ...graduation },
                },
            }));
        }

        if (section === "technical") {
            setSectionSnapshots((p) => ({
                ...p,
                technical: {
                    skills,
                    programmingLanguages,
                    frameworksLibraries,
                    databases,
                    cloudTools,
                },
            }));
        }

        if (section === "developer") {
            setSectionSnapshots((p) => ({
                ...p,
                developer: {
                    ...developerProfiles,
                },
            }));
        }

        setEditingSection(section);
    };

    const cancelSectionEdit = (section) => {
        const s = sectionSnapshots[section];

        if (section === "personal" && s) {
            setName(s.name);
            setEmail(s.email);
            setPhone(s.phone);
            setGender(s.gender);
            setCity(s.city);
            setBio(s.bio);
        }

        if (section === "academic" && s) {
            setBranch(s.branch);
            setEducation(s.education);
            setCgpa(s.cgpa);
            setTenth({ ...s.tenth });
            setTwelfth({ ...s.twelfth });
            setGraduation({ ...s.graduation });
        }

        if (section === "technical" && s) {
            setSkills(s.skills);
            setProgrammingLanguages(s.programmingLanguages);
            setFrameworksLibraries(s.frameworksLibraries);
            setDatabases(s.databases);
            setCloudTools(s.cloudTools);
        }

        if (section === "developer" && s) {
            setDeveloperProfiles({ ...s.developer });
        }

        setEditingSection(null);

        setSectionSnapshots((p) => {
            const next = { ...p };
            delete next[section];
            return next;
        });
    };
    const saveSectionEdit = (section) => {
        setEditingSection(null);

        setSectionSnapshots((p) => {
            const next = { ...p };
            delete next[section];
            return next;
        });
    };
    const getEntryList = (section) => ({ internships, certifications, achievements, hackathons, projects, codingAchievements }[section] || []);
    const setEntryList = (section, updater) => ({ internships: setInternships, certifications: setCertifications, achievements: setAchievements, hackathons: setHackathons, projects: setProjects, codingAchievements: setCodingAchievements }[section]?.(updater));
    const beginEntryEdit = (section, index, isNew = false) => {
        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }
        const item = getEntryList(section)[index];
        setEntrySnapshots((p) => ({ ...p, [`${section}-${index}`]: { item: item ? { ...item } : null, isNew } }));
        setEditingEntries((p) => ({ ...p, [section]: index }));
    };
    const cancelEntryEdit = (section, index) => {
        const key = `${section}-${index}`;
        const s = entrySnapshots[key];
        if (s?.isNew) setEntryList(section, (p) => p.filter((_, i) => i !== index));
        else if (s?.item) setEntryList(section, (p) => p.map((item, i) => i === index ? { ...s.item } : item));
        setEditingEntries((p) => ({ ...p, [section]: null }));
        setEntrySnapshots((p) => { const n = { ...p }; delete n[key]; return n; });
    };
    const saveEntryEdit = (section) => setEditingEntries((p) => ({ ...p, [section]: null }));
    const renderViewValue = (value, emptyText = "Not added") => value === null || value === undefined || String(value).trim() === "" ? emptyText : String(value);

    const canEditProfile =
        !isVerified ||
        (
            profileEditAccess.enabled &&
            profileEditAccess.expiresAt &&
            new Date(profileEditAccess.expiresAt).getTime() > currentTime
        );

    // =====================================================
    // RESUME - VIEW
    // =====================================================

    const openResume = async () => {
        try {

            const response = await api.get(
                "/students/me/resume",
                {
                    responseType: "blob",
                }
            );

            const fileURL = URL.createObjectURL(
                new Blob([response.data], {
                    type: "application/pdf",
                })
            );

            window.open(fileURL, "_blank");

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 60000);

        } catch (error) {

            console.error(
                error.response?.data || error.message
            );

        }
    };


    // =====================================================
    // RESUME - DOWNLOAD
    // =====================================================

    const downloadResume = async () => {
        try {

            const response = await api.get(
                "/students/me/resume",
                {
                    responseType: "blob",
                }
            );

            const fileURL = URL.createObjectURL(
                new Blob([response.data], {
                    type: "application/pdf",
                })
            );

            const link = document.createElement("a");

            link.href = fileURL;

            link.download =
                resume?.fileName || "resume.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            setTimeout(() => {
                URL.revokeObjectURL(fileURL);
            }, 60000);

        } catch (error) {

            console.error(
                error.response?.data || error.message
            );

        }
    };


    // =====================================================
    // FETCH PROFILE
    // =====================================================

    const fetchProfile = async () => {

        try {

            const response = await api.get(
                "/students/me"
            );

            const data = response.data;


            // =================================================
            // PERSONAL
            // =================================================

            setName(data.name || "");

            setGender(data.gender || "");

            setEmail(data.email || "");

            setPhone(data.phone || "");

            setCity(data.city || "");

            setBio(data.bio || "");


            // =================================================
            // EXISTING ACADEMIC FIELDS
            // =================================================

            setBranch(data.branch || "");

            setEducation(data.education || "");

            setCgpa(
                data.cgpa !== undefined &&
                data.cgpa !== null
                    ? String(data.cgpa)
                    : ""
            );


            // =================================================
            // 10TH
            // =================================================

            setTenth({
                schoolName:
                    data.tenth?.schoolName || "",

                percentage:
                    data.tenth?.percentage !== null &&
                    data.tenth?.percentage !== undefined
                        ? String(data.tenth.percentage)
                        : "",

                board:
                    data.tenth?.board || "",

                passingYear:
                    data.tenth?.passingYear !== null &&
                    data.tenth?.passingYear !== undefined
                        ? String(data.tenth.passingYear)
                        : "",
            });


            // =================================================
            // 12TH
            // =================================================

            setTwelfth({
                schoolName:
                    data.twelfth?.schoolName || "",

                percentage:
                    data.twelfth?.percentage !== null &&
                    data.twelfth?.percentage !== undefined
                        ? String(data.twelfth.percentage)
                        : "",

                board:
                    data.twelfth?.board || "",

                stream:
                    data.twelfth?.stream || "",

                passingYear:
                    data.twelfth?.passingYear !== null &&
                    data.twelfth?.passingYear !== undefined
                        ? String(data.twelfth.passingYear)
                        : "",
            });


            // =================================================
            // GRADUATION
            // =================================================

            setGraduation({
                college:
                    data.graduation?.college || "",

                degree:
                    data.graduation?.degree || "",

                branch:
                    data.graduation?.branch ||
                    data.branch ||
                    "",

                cgpa:
                    data.graduation?.cgpa !== null &&
                    data.graduation?.cgpa !== undefined
                        ? String(data.graduation.cgpa)
                        : data.cgpa !== undefined &&
                          data.cgpa !== null
                            ? String(data.cgpa)
                            : "",

                graduationYear:
                    data.graduation?.graduationYear !== null &&
                    data.graduation?.graduationYear !== undefined
                        ? String(
                              data.graduation.graduationYear
                          )
                        : "",

                currentSemester:
                    data.graduation?.currentSemester !== null &&
                    data.graduation?.currentSemester !== undefined
                        ? String(
                              data.graduation.currentSemester
                          )
                        : "",
            });


            // =================================================
            // TECHNICAL
            // =================================================

            setSkills(joinList(data.skills));

            setProgrammingLanguages(
                joinList(data.programmingLanguages)
            );

            setFrameworksLibraries(
                joinList(data.frameworksLibraries)
            );

            setDatabases(
                joinList(data.databases)
            );

            setCloudTools(
                joinList(data.cloudTools)
            );


            // =================================================
            // DEVELOPER PROFILES
            // =================================================

            setDeveloperProfiles({
                linkedin:
                    data.developerProfiles?.linkedin || "",

                github:
                    data.developerProfiles?.github || "",

                leetcode:
                    data.developerProfiles?.leetcode || "",

                portfolio:
                    data.developerProfiles?.portfolio || "",
            });


            // =================================================
            // EXPERIENCE & ACHIEVEMENTS
            // =================================================

            setInternships(
                Array.isArray(data.internships)
                    ? data.internships
                    : []
            );

            setCertifications(
                Array.isArray(data.certifications)
                    ? data.certifications
                    : []
            );

            setAchievements(
                Array.isArray(data.achievements)
                    ? data.achievements
                    : []
            );

            setHackathons(
                Array.isArray(data.hackathons)
                    ? data.hackathons
                    : []
            );

            setProjects(
                Array.isArray(data.projects)
                    ? data.projects
                    : []
            );

            setCodingAchievements(
                Array.isArray(data.codingAchievements)
                    ? data.codingAchievements
                    : []
            );


            // =================================================
            // RESUME
            // =================================================

            setResumeFile(null);

            setResume(data.resume || null);


            setProfileExists(true);

            setIsVerified(
                Boolean(data.isVerified)
            );

            setProfileEditAccess({
                enabled: Boolean(data.profileEditAccess?.enabled),
                expiresAt: data.profileEditAccess?.expiresAt || null,
                approvedBy: data.profileEditAccess?.approvedBy || null,
            });

        } catch (error) {

            if (error.response?.status !== 404) {

                console.log(
                    error.response?.data ||
                    error.message
                );

            }

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!isVerified) return undefined;

        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, [isVerified]);

    useEffect(() => {
        if (!isVerified) return;

        const fetchProfileUpdateRequests = async () => {
            try {
                const response = await api.get(
                    "/students/profile-update-requests/me"
                );

                const requests =
                    response.data?.requests ||
                    response.data?.data ||
                    (Array.isArray(response.data) ? response.data : []);

                setProfileUpdateRequests(requests);
            } catch (error) {
                console.log(
                    error.response?.data ||
                    error.message
                );
            }
        };

        fetchProfileUpdateRequests();
    }, [isVerified, profileEditAccess.enabled]);


    // =====================================================
    // PROFILE EDIT ACCESS REQUEST
    // =====================================================

    const submitProfileUpdateRequest = async () => {
        const reason = editRequestReason.trim();

        if (!reason) {
            return alert("Please enter a reason for requesting edit access.");
        }

        setRequestSubmitting(true);

        try {
            const response = await api.post(
                "/students/profile-update-requests",
                { reason }
            );

            const request =
                response.data?.request ||
                response.data?.data ||
                response.data;

            if (request?._id) {
                setProfileUpdateRequests((prev) => [request, ...prev]);
            }

            setEditRequestReason("");
            setShowEditRequestModal(false);

            alert(
                response.data?.message ||
                "Profile edit request submitted successfully."
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to submit profile edit request."
            );
        } finally {
            setRequestSubmitting(false);
        }
    };

    const latestRequest = profileUpdateRequests[0];

    const accessExpiresAt = profileEditAccess.expiresAt
        ? new Date(profileEditAccess.expiresAt)
        : null;

    const accessRemainingMs = accessExpiresAt
        ? Math.max(0, accessExpiresAt.getTime() - currentTime)
        : 0;

    const accessRemainingMinutes = Math.floor(
        accessRemainingMs / 60000
    );

    const accessRemainingSeconds = Math.floor(
        (accessRemainingMs % 60000) / 1000
    );

    const accessTimeLabel =
        `${String(accessRemainingMinutes).padStart(2, "0")}:${String(
            accessRemainingSeconds
        ).padStart(2, "0")}`;

    // =====================================================
    // UPDATE SINGLE OBJECT FIELD
    // =====================================================

    const updateTenth = (field, value) => {
        setTenth((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const updateTwelfth = (field, value) => {
        setTwelfth((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const updateGraduation = (field, value) => {
        setGraduation((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    const updateDeveloperProfile = (
        field,
        value
    ) => {
        setDeveloperProfiles((prev) => ({
            ...prev,
            [field]: value,
        }));
    };


    // =====================================================
    // INTERNSHIP HELPERS
    // =====================================================

    const addInternship = () => {
        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }
        setInternships((prev) => [
            ...prev,
            {
                company: "",
                role: "",
                duration: "",
                description: "",
            },
        ]);
        setEditingEntries((prev) => ({ ...prev, internships: internships.length }));
        setEntrySnapshots((prev) => ({
            ...prev,
            [`internships-${internships.length}`]: {
                item: null,
                isNew: true,
            },
        }));
    };


    const updateInternship = (
        index,
        field,
        value
    ) => {

        setInternships((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };


    const removeInternship = (index) => {

        setInternships((prev) =>
            prev.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };


    // =====================================================
    // CERTIFICATION HELPERS
    // =====================================================

    const addCertification = () => {
        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }
        setCertifications((prev) => [
            ...prev,
            {
                name: "",
                issuer: "",
                year: "",
                credentialUrl: "",
            },
        ]);
        setEditingEntries((prev) => ({ ...prev, certifications: certifications.length }));
        setEntrySnapshots((prev) => ({
            ...prev,
            [`certifications-${certifications.length}`]: { item: null, isNew: true },
        }));
    };


    const updateCertification = (
        index,
        field,
        value
    ) => {

        setCertifications((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };


    const removeCertification = (index) => {

        setCertifications((prev) =>
            prev.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };


    // =====================================================
    // ACHIEVEMENT HELPERS
    // =====================================================

    const addAchievement = () => {
        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }
        setAchievements((prev) => [
            ...prev,
            {
                title: "",
                description: "",
                year: "",
            },
        ]);
        setEditingEntries((prev) => ({ ...prev, achievements: achievements.length }));
        setEntrySnapshots((prev) => ({
            ...prev,
            [`achievements-${achievements.length}`]: { item: null, isNew: true },
        }));
    };


    const updateAchievement = (
        index,
        field,
        value
    ) => {

        setAchievements((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };


    const removeAchievement = (index) => {

        setAchievements((prev) =>
            prev.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };


    // =====================================================
    // HACKATHON HELPERS
    // =====================================================

    const addHackathon = () => {
        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }
        setHackathons((prev) => [
            ...prev,
            {
                name: "",
                position: "",
                description: "",
                year: "",
            },
        ]);
        setEditingEntries((prev) => ({ ...prev, hackathons: hackathons.length }));
        setEntrySnapshots((prev) => ({
            ...prev,
            [`hackathons-${hackathons.length}`]: { item: null, isNew: true },
        }));
    };


    const updateHackathon = (
        index,
        field,
        value
    ) => {

        setHackathons((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };


    const removeHackathon = (index) => {

        setHackathons((prev) =>
            prev.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };


    // =====================================================
    // PROJECT HELPERS
    // =====================================================

    const addProject = () => {
        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }
        setProjects((prev) => [
            ...prev,
            {
                name: "",
                description: "",
                technologies: [],
                projectUrl: "",
                githubUrl: "",
                technologiesInput: "",
            },
        ]);
        setEditingEntries((prev) => ({ ...prev, projects: projects.length }));
        setEntrySnapshots((prev) => ({
            ...prev,
            [`projects-${projects.length}`]: { item: null, isNew: true },
        }));
    };


    const updateProject = (
        index,
        field,
        value
    ) => {

        setProjects((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };


    const removeProject = (index) => {

        setProjects((prev) =>
            prev.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };


    // =====================================================
    // CODING ACHIEVEMENT HELPERS
    // =====================================================

    const addCodingAchievement = () => {
        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }
        setCodingAchievements((prev) => [
            ...prev,
            {
                platform: "",
                achievement: "",
                count: "",
                profileUrl: "",
            },
        ]);
        setEditingEntries((prev) => ({ ...prev, codingAchievements: codingAchievements.length }));
        setEntrySnapshots((prev) => ({
            ...prev,
            [`codingAchievements-${codingAchievements.length}`]: { item: null, isNew: true },
        }));
    };


    const updateCodingAchievement = (
        index,
        field,
        value
    ) => {

        setCodingAchievements((prev) =>
            prev.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };


    const removeCodingAchievement = (
        index
    ) => {

        setCodingAchievements((prev) =>
            prev.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };


    // =====================================================
    // SUBMIT PROFILE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (profileExists && !canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }

        let validationErrors = {};


        // =================================================
        // VERIFIED PROFILE
        // =================================================

        if (isVerified) {

            const phoneError =
                validatePhone(phone);

            if (phoneError) {
                validationErrors.phone =
                    phoneError;
            }

            if (!email.trim()) {
                validationErrors.email =
                    "Email is required";
            }

            if (!skills.trim()) {
                validationErrors.skills =
                    "Please enter at least one skill";
            }

        }

        // =================================================
        // NEW PROFILE
        // =================================================

        else {

            validationErrors = validateProfile({
                name,
                email,
                phone,
                branch,
                education,
                cgpa,
                skills,
            });

        }


        if (
            Object.keys(validationErrors).length
        ) {

            setErrors(validationErrors);

            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            return;
        }


        setErrors({});


        try {

            // =================================================
            // CLEAN EXPERIENCE DATA
            // =================================================

            const cleanedInternships =
                internships.map(
                    ({
                        company,
                        role,
                        duration,
                        description,
                    }) => ({
                        company:
                            company?.trim() || "",
                        role:
                            role?.trim() || "",
                        duration:
                            duration?.trim() || "",
                        description:
                            description?.trim() || "",
                    })
                );


            const cleanedCertifications =
                certifications.map(
                    ({
                        name,
                        issuer,
                        year,
                        credentialUrl,
                    }) => ({
                        name:
                            name?.trim() || "",
                        issuer:
                            issuer?.trim() || "",
                        year:
                            year
                                ? Number(year)
                                : null,
                        credentialUrl:
                            credentialUrl?.trim() ||
                            "",
                    })
                );


            const cleanedAchievements =
                achievements.map(
                    ({
                        title,
                        description,
                        year,
                    }) => ({
                        title:
                            title?.trim() || "",
                        description:
                            description?.trim() ||
                            "",
                        year:
                            year
                                ? Number(year)
                                : null,
                    })
                );


            const cleanedHackathons =
                hackathons.map(
                    ({
                        name,
                        position,
                        description,
                        year,
                    }) => ({
                        name:
                            name?.trim() || "",
                        position:
                            position?.trim() ||
                            "",
                        description:
                            description?.trim() ||
                            "",
                        year:
                            year
                                ? Number(year)
                                : null,
                    })
                );


            const cleanedProjects =
                projects.map(
                    ({
                        name,
                        description,
                        technologies,
                        technologiesInput,
                        projectUrl,
                        githubUrl,
                    }) => ({
                        name:
                            name?.trim() || "",
                        description:
                            description?.trim() ||
                            "",
                        technologies:
                            technologiesInput !==
                            undefined
                                ? splitList(
                                      technologiesInput
                                  )
                                : Array.isArray(
                                      technologies
                                  )
                                ? technologies
                                : [],
                        projectUrl:
                            projectUrl?.trim() ||
                            "",
                        githubUrl:
                            githubUrl?.trim() || "",
                    })
                );


            const cleanedCodingAchievements =
                codingAchievements.map(
                    ({
                        platform,
                        achievement,
                        count,
                        profileUrl,
                    }) => ({
                        platform:
                            platform?.trim() || "",
                        achievement:
                            achievement?.trim() ||
                            "",
                        count:
                            count
                                ? Number(count)
                                : null,
                        profileUrl:
                            profileUrl?.trim() ||
                            "",
                    })
                );


            // =================================================
            // REQUEST DATA
            // =================================================

            let data;


            if (isVerified) {

                // Verified users can update
                // personal/contact + technical
                // information.

                data = {

                    gender,

                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    phone:
                        phone.trim(),

                    city:
                        city.trim(),

                    bio:
                        bio.trim(),

                    skills:
                        splitList(
                            formatSkills(skills)
                        ),

                    programmingLanguages:
                        splitList(
                            programmingLanguages
                        ),

                    frameworksLibraries:
                        splitList(
                            frameworksLibraries
                        ),

                    databases:
                        splitList(
                            databases
                        ),

                    cloudTools:
                        splitList(
                            cloudTools
                        ),

                    developerProfiles: {
                        linkedin:
                            developerProfiles.linkedin.trim(),

                        github:
                            developerProfiles.github.trim(),

                        leetcode:
                            developerProfiles.leetcode.trim(),

                        portfolio:
                            developerProfiles.portfolio.trim(),
                    },

                    internships:
                        cleanedInternships,

                    certifications:
                        cleanedCertifications,

                    achievements:
                        cleanedAchievements,

                    hackathons:
                        cleanedHackathons,

                    projects:
                        cleanedProjects,

                    codingAchievements:
                        cleanedCodingAchievements,
                };

            } else {

                data = {

                    // =========================
                    // PERSONAL
                    // =========================

                    name:
                        formatName(name),

                    gender,

                    email:
                        email
                            .trim()
                            .toLowerCase(),

                    phone:
                        phone.trim(),

                    city:
                        city.trim(),

                    bio:
                        bio.trim(),


                    // =========================
                    // EXISTING ACADEMIC
                    // =========================

                    branch,

                    education,

                    cgpa,


                    // =========================
                    // ACADEMIC
                    // =========================

                    tenth: {
                        schoolName:
                            tenth.schoolName.trim(),

                        percentage:
                            tenth.percentage
                                ? Number(
                                      tenth.percentage
                                  )
                                : null,

                        board:
                            tenth.board.trim(),

                        passingYear:
                            tenth.passingYear
                                ? Number(
                                      tenth.passingYear
                                  )
                                : null,
                    },

                    twelfth: {
                        schoolName:
                            twelfth.schoolName.trim(),

                        percentage:
                            twelfth.percentage
                                ? Number(
                                      twelfth.percentage
                                  )
                                : null,

                        board:
                            twelfth.board.trim(),

                        stream:
                            twelfth.stream.trim(),

                        passingYear:
                            twelfth.passingYear
                                ? Number(
                                      twelfth.passingYear
                                  )
                                : null,
                    },

                    graduation: {
                        college:
                            graduation.college.trim(),

                        degree:
                            graduation.degree.trim(),

                        branch:
                            graduation.branch ||
                            branch,

                        cgpa:
                            graduation.cgpa
                                ? Number(
                                      graduation.cgpa
                                  )
                                : cgpa
                                ? Number(cgpa)
                                : null,

                        graduationYear:
                            graduation.graduationYear
                                ? Number(
                                      graduation.graduationYear
                                  )
                                : null,

                        currentSemester:
                            graduation.currentSemester
                                ? Number(
                                      graduation.currentSemester
                                  )
                                : null,
                    },


                    // =========================
                    // TECHNICAL
                    // =========================

                    skills:
                        splitList(
                            formatSkills(skills)
                        ),

                    programmingLanguages:
                        splitList(
                            programmingLanguages
                        ),

                    frameworksLibraries:
                        splitList(
                            frameworksLibraries
                        ),

                    databases:
                        splitList(
                            databases
                        ),

                    cloudTools:
                        splitList(
                            cloudTools
                        ),


                    // =========================
                    // DEVELOPER PROFILES
                    // =========================

                    developerProfiles: {
                        linkedin:
                            developerProfiles.linkedin.trim(),

                        github:
                            developerProfiles.github.trim(),

                        leetcode:
                            developerProfiles.leetcode.trim(),

                        portfolio:
                            developerProfiles.portfolio.trim(),
                    },


                    // =========================
                    // EXPERIENCE
                    // =========================

                    internships:
                        cleanedInternships,

                    certifications:
                        cleanedCertifications,

                    achievements:
                        cleanedAchievements,

                    hackathons:
                        cleanedHackathons,

                    projects:
                        cleanedProjects,

                    codingAchievements:
                        cleanedCodingAchievements,
                };
            }


            // =================================================
            // CREATE / UPDATE
            // =================================================

            if (profileExists) {

                await api.put(
                    "/students/me",
                    data
                );

            } else {

                await api.post(
                    "/students",
                    data
                );
            }


            alert(
                profileExists
                    ? "Profile updated successfully!"
                    : "Profile created successfully!"
            );


            await fetchProfile();


            navigate("/overview");

        } catch (error) {

            console.log(
                error.response?.data ||
                error.message
            );

            alert(
                error.response?.data?.message ||
                "Something went wrong!"
            );
        }
    };


    // =====================================================
    // RESUME UPLOAD
    // =====================================================

    const handleResumeUpload = async () => {

        if (!canEditProfile) {
            setShowEditRequestModal(true);
            return;
        }

        if (!resumeFile) {
            return alert(
                "Please select a PDF."
            );
        }


        if (
            resumeFile.type !==
            "application/pdf"
        ) {
            return alert(
                "Only PDF files are allowed."
            );
        }


        if (
            resumeFile.size >
            2 * 1024 * 1024
        ) {
            return alert(
                "Resume size should be less than 2 MB."
            );
        }


        try {

            const formData =
                new FormData();

            formData.append(
                "resume",
                resumeFile
            );


            const response =
                await api.post(
                    "/students/upload-resume",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data",
                        },
                    }
                );


            setResume(
                response.data.resume
            );

            setResumeFile(null);

            await fetchProfile();

            alert(
                "Resume uploaded successfully!"
            );

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Upload failed."
            );
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return <LoadingSpinner />;
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="page">

            <h1 className="page-title">
                Student Profile
            </h1>


            {/* =================================================
                VERIFICATION STATUS
            ================================================= */}

            <div className="profile-status-container">

                <h3>
                    Verification Status
                </h3>

                <StatusBadge
                    verified={isVerified}
                />

            </div>

            {isVerified && (
                <div className={`profile-access-banner ${canEditProfile ? "profile-access-active" : "profile-access-locked"}`}>
                    {canEditProfile ? (
                        <>
                            <div>
                                <strong>🔓 Temporary edit access is active</strong>
                                <span>You can update your profile until access expires.</span>
                            </div>
                            <strong>{accessTimeLabel}</strong>
                        </>
                    ) : (
                        <>
                            <div>
                                <strong>🔒 Profile is frozen</strong>
                                <span>Your verified profile cannot be edited without temporary admin approval.</span>
                            </div>
                            <button
                                type="button"
                                className="section-btn primary"
                                onClick={() => setShowEditRequestModal(true)}
                            >
                                Request Edit Access
                            </button>
                        </>
                    )}
                </div>
            )}

            {isVerified && latestRequest?.status === "Pending" && !canEditProfile && (
                <div className="profile-access-request-status">
                    <strong>⏳ Edit request pending</strong>
                    <span>Your request is waiting for placement-cell approval.</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <ProfileSection
                    title="👤 Personal Information"
                >

                    <div className="section-toolbar">
                        {editingSection === "personal" ? (
                            <div className="section-actions">
                                <button
                                    type="button"
                                    className="section-btn secondary"
                                    onClick={() => cancelSectionEdit("personal")}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="section-btn primary"
                                    onClick={() => saveSectionEdit("personal")}
                                >
                                    Save Changes
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="section-btn"
                                onClick={() => beginSectionEdit("personal")}
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    {editingSection === "personal" ? (
                        <div className="profile-grid">

                            {/* NAME */}
                            <div className="form-group">
                                <label>Name</label>

                                <input
                                    className="input"
                                    type="text"
                                    value={name}
                                    disabled={!canEditProfile}
                                    placeholder="Enter Name"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrors({
                                            ...errors,
                                            name: "",
                                        });
                                    }}
                                />

                                {errors.name && (
                                    <p className="error-text">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* GENDER */}
                            <div className="form-group">
                                <label>Gender</label>

                                <select
                                    className="input"
                                    value={gender}
                                    onChange={(e) =>
                                        setGender(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Select Gender
                                    </option>
                                    <option value="Male">
                                        Male
                                    </option>
                                    <option value="Female">
                                        Female
                                    </option>
                                    <option value="Other">
                                        Other
                                    </option>
                                    <option value="Prefer not to say">
                                        Prefer not to say
                                    </option>
                                </select>
                            </div>

                            {/* EMAIL */}
                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    className="input"
                                    type="email"
                                    value={email}
                                    placeholder="Enter Email"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors({
                                            ...errors,
                                            email: "",
                                        });
                                    }}
                                />

                                {errors.email && (
                                    <p className="error-text">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* PHONE */}
                            <div className="form-group">
                                <label>Phone</label>

                                <input
                                    className="input"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={phone}
                                    placeholder="Enter Phone"
                                    onChange={(e) => {
                                        setPhone(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 10)
                                        );

                                        setErrors({
                                            ...errors,
                                            phone: "",
                                        });
                                    }}
                                />

                                {errors.phone && (
                                    <p className="error-text">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* CITY */}
                            <div className="form-group">
                                <label>City / Location</label>

                                <input
                                    className="input"
                                    type="text"
                                    value={city}
                                    placeholder="e.g. Jaipur"
                                    onChange={(e) =>
                                        setCity(e.target.value)
                                    }
                                />
                            </div>

                            {/* BIO */}
                            <div className="form-group full-width">
                                <label>Bio</label>

                                <textarea
                                    className="input"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell recruiters briefly about yourself..."
                                    maxLength={500}
                                />
                            </div>

                        </div>
                    ) : (
                        <div className="profile-view-grid">

                            <div>
                                <span>Name</span>
                                <strong>{renderViewValue(name)}</strong>
                            </div>

                            <div>
                                <span>Gender</span>
                                <strong>{renderViewValue(gender)}</strong>
                            </div>

                            <div>
                                <span>Email</span>
                                <strong>{renderViewValue(email)}</strong>
                            </div>

                            <div>
                                <span>Phone</span>
                                <strong>{renderViewValue(phone)}</strong>
                            </div>

                            <div>
                                <span>City / Location</span>
                                <strong>{renderViewValue(city)}</strong>
                            </div>

                            <div className="full-width">
                                <span>Bio</span>
                                <strong>{renderViewValue(bio)}</strong>
                            </div>

                        </div>
                    )}

                </ProfileSection>



                {/* =================================================
                    ACADEMIC INFORMATION
                ================================================= */}

                <ProfileSection title="🎓 Academic Information">
                    <div className="section-toolbar">
                        {!canEditProfile && isVerified ? (
                            <span className="section-locked">Verified information</span>
                        ) : editingSection === "academic" ? (
                            <div className="section-actions">
                                <button type="button" className="section-btn secondary" onClick={() => cancelSectionEdit("academic")}>Cancel</button>
                                <button type="button" className="section-btn primary" onClick={() => saveSectionEdit("academic")}>Save Changes</button>
                            </div>
                        ) : (
                            <button type="button" className="section-btn" onClick={() => beginSectionEdit("academic")}>Edit</button>
                        )}
                    </div>

                    <h3>10th Standard:</h3>
                    {editingSection === "academic" ? (
                        <div className="profile-grid">
                            <div className="form-group"><label>School Name</label><input className="input" type="text" value={tenth.schoolName} disabled={!canEditProfile} placeholder="Enter school name" onChange={(e) => updateTenth("schoolName", e.target.value)} /></div>
                            <div className="form-group"><label>Percentage</label><input className="input" type="number" min="0" max="100" step="0.01" value={tenth.percentage} disabled={!canEditProfile} placeholder="e.g. 85.5" onChange={(e) => updateTenth("percentage", e.target.value)} /></div>
                            <div className="form-group"><label>Board</label><input className="input" type="text" value={tenth.board} disabled={!canEditProfile} placeholder="e.g. CBSE" onChange={(e) => updateTenth("board", e.target.value)} /></div>
                            <div className="form-group"><label>Passing Year</label><input className="input" type="number" min="1900" max="2100" value={tenth.passingYear} disabled={!canEditProfile} placeholder="e.g. 2020" onChange={(e) => updateTenth("passingYear", e.target.value)} /></div>
                        </div>
                    ) : (
                        <div className="profile-view-grid">
                            <div><span>School Name</span><strong>{renderViewValue(tenth.schoolName)}</strong></div>
                            <div><span>Percentage</span><strong>{tenth.percentage ? `${tenth.percentage}%` : "—"}</strong></div>
                            <div><span>Board</span><strong>{renderViewValue(tenth.board)}</strong></div>
                            <div><span>Passing Year</span><strong>{renderViewValue(tenth.passingYear, "—")}</strong></div>
                        </div>
                    )}

                    <h3>12th Standard:</h3>
                    {editingSection === "academic" ? (
                        <div className="profile-grid">
                            <div className="form-group"><label>School Name</label><input className="input" type="text" value={twelfth.schoolName} disabled={!canEditProfile} placeholder="Enter school name" onChange={(e) => updateTwelfth("schoolName", e.target.value)} /></div>
                            <div className="form-group"><label>Percentage</label><input className="input" type="number" min="0" max="100" step="0.01" value={twelfth.percentage} disabled={!canEditProfile} placeholder="e.g. 82.5" onChange={(e) => updateTwelfth("percentage", e.target.value)} /></div>
                            <div className="form-group"><label>Board</label><input className="input" type="text" value={twelfth.board} disabled={!canEditProfile} placeholder="e.g. CBSE" onChange={(e) => updateTwelfth("board", e.target.value)} /></div>
                            <div className="form-group"><label>Stream</label><input className="input" type="text" value={twelfth.stream} disabled={!canEditProfile} placeholder="e.g. PCM" onChange={(e) => updateTwelfth("stream", e.target.value)} /></div>
                            <div className="form-group"><label>Passing Year</label><input className="input" type="number" min="1900" max="2100" value={twelfth.passingYear} disabled={!canEditProfile} placeholder="e.g. 2022" onChange={(e) => updateTwelfth("passingYear", e.target.value)} /></div>
                        </div>
                    ) : (
                        <div className="profile-view-grid">
                            <div><span>School Name</span><strong>{renderViewValue(twelfth.schoolName)}</strong></div>
                            <div><span>Percentage</span><strong>{twelfth.percentage ? `${twelfth.percentage}%` : "—"}</strong></div>
                            <div><span>Board</span><strong>{renderViewValue(twelfth.board)}</strong></div>
                            <div><span>Stream</span><strong>{renderViewValue(twelfth.stream)}</strong></div>
                            <div><span>Passing Year</span><strong>{renderViewValue(twelfth.passingYear, "—")}</strong></div>
                        </div>
                    )}

                    <h3>Under Graduation (UG):</h3>
                    {editingSection === "academic" ? (
                        <div className="profile-grid">
                            <div className="form-group"><label>College / University</label><input className="input" type="text" value={graduation.college} disabled={!canEditProfile} placeholder="Enter college / university" onChange={(e) => updateGraduation("college", e.target.value)} /></div>
                            <div className="form-group"><label>Degree</label><input className="input" type="text" value={graduation.degree} disabled={!canEditProfile} placeholder="e.g. B.Tech" onChange={(e) => updateGraduation("degree", e.target.value)} /></div>
                            <div className="form-group">
                                <label>Branch</label>
                                <select className="input" value={branch} disabled={!canEditProfile} onChange={(e) => { setBranch(e.target.value); updateGraduation("branch", e.target.value); setErrors({ ...errors, branch: "" }); }}>
                                    <option value="">Select Branch</option>
                                    {BRANCH_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                                </select>
                                {errors.branch && <p className="error-text">{errors.branch}</p>}
                            </div>
                            <div className="form-group">
                                <label>CGPA</label>
                                <input className="input" type="number" min="0" max="10" step="0.01" value={cgpa} disabled={!canEditProfile} placeholder="Enter CGPA" onChange={(e) => { setCgpa(e.target.value); updateGraduation("cgpa", e.target.value); setErrors({ ...errors, cgpa: "" }); }} />
                                {errors.cgpa && <p className="error-text">{errors.cgpa}</p>}
                            </div>
                            <div className="form-group"><label>Current Semester</label><input className="input" type="number" min="1" max="20" value={graduation.currentSemester} disabled={!canEditProfile} placeholder="e.g. 7" onChange={(e) => updateGraduation("currentSemester", e.target.value)} /></div>
                            <div className="form-group"><label>Graduation Year</label><input className="input" type="number" min="1900" max="2100" value={graduation.graduationYear} disabled={!canEditProfile} placeholder="e.g. 2027" onChange={(e) => updateGraduation("graduationYear", e.target.value)} /></div>
                        </div>
                    ) : (
                        <div className="profile-view-grid">
                            <div><span>College / University</span><strong>{renderViewValue(graduation.college)}</strong></div>
                            <div><span>Degree</span><strong>{renderViewValue(graduation.degree)}</strong></div>
                            <div><span>Branch</span><strong>{renderViewValue(branch)}</strong></div>
                            <div><span>CGPA</span><strong>{renderViewValue(cgpa, "—")}</strong></div>
                            <div><span>Current Semester</span><strong>{renderViewValue(graduation.currentSemester, "—")}</strong></div>
                            <div><span>Graduation Year</span><strong>{renderViewValue(graduation.graduationYear, "—")}</strong></div>
                        </div>
                    )}
                </ProfileSection>

                {/* =================================================
                    PROFESSIONAL / TECHNICAL
                ================================================= */}

                <ProfileSection title="💻 Professional / Technical Information">
                    <div className="section-toolbar">
                        {editingSection === "technical" ? (
                            <div className="section-actions">
                                <button type="button" className="section-btn secondary" onClick={() => cancelSectionEdit("technical")}>Cancel</button>
                                <button type="button" className="section-btn primary" onClick={() => saveSectionEdit("technical")}>Save Changes</button>
                            </div>
                        ) : (
                            <button type="button" className="section-btn" onClick={() => beginSectionEdit("technical")}>Edit</button>
                        )}
                    </div>

                    {editingSection === "technical" ? (
                        <>
                            <div className="profile-grid">
                                <div className="form-group"><label>Skills</label><input className="input" type="text" value={skills} placeholder="C++, DSA, REST APIs, Problem Solving" onChange={(e) => { setSkills(e.target.value); setErrors({ ...errors, skills: "" }); }} />{errors.skills && <p className="error-text">{errors.skills}</p>}</div>
                                <div className="form-group"><label>Programming Languages</label><input className="input" type="text" value={programmingLanguages} placeholder="C++, JavaScript, Python" onChange={(e) => setProgrammingLanguages(e.target.value)} /></div>
                                <div className="form-group"><label>Frameworks / Libraries</label><input className="input" type="text" value={frameworksLibraries} placeholder="React, Express, Mongoose, EJS" onChange={(e) => setFrameworksLibraries(e.target.value)} /></div>
                                <div className="form-group"><label>Databases</label><input className="input" type="text" value={databases} placeholder="MongoDB, MySQL" onChange={(e) => setDatabases(e.target.value)} /></div>
                                <div className="form-group"><label>Cloud / Tools</label><input className="input" type="text" value={cloudTools} placeholder="AWS, Git, GitHub, Postman" onChange={(e) => setCloudTools(e.target.value)} /></div>
                            </div>
                            <small>Separate multiple items with commas.</small>
                        </>
                    ) : (
                        <div className="profile-view-grid">
                            <div><span>Skills</span><strong>{renderViewValue(skills)}</strong></div>
                            <div><span>Programming Languages</span><strong>{renderViewValue(programmingLanguages)}</strong></div>
                            <div><span>Frameworks / Libraries</span><strong>{renderViewValue(frameworksLibraries)}</strong></div>
                            <div><span>Databases</span><strong>{renderViewValue(databases)}</strong></div>
                            <div><span>Cloud / Tools</span><strong>{renderViewValue(cloudTools)}</strong></div>
                        </div>
                    )}
                </ProfileSection>

                {/* =================================================
                    DEVELOPER PROFILES
                ================================================= */}

                <ProfileSection title="🔗 Developer Profiles">
                    <div className="section-toolbar">
                        {editingSection === "developer" ? (
                            <div className="section-actions">
                                <button type="button" className="section-btn secondary" onClick={() => cancelSectionEdit("developer")}>Cancel</button>
                                <button type="button" className="section-btn primary" onClick={() => saveSectionEdit("developer")}>Save Changes</button>
                            </div>
                        ) : (
                            <button type="button" className="section-btn" onClick={() => beginSectionEdit("developer")}>Edit</button>
                        )}
                    </div>

                    {editingSection === "developer" ? (
                        <div className="profile-grid">
                            <div className="form-group"><label>LinkedIn</label><input className="input" type="url" value={developerProfiles.linkedin} placeholder="https://linkedin.com/in/..." onChange={(e) => updateDeveloperProfile("linkedin", e.target.value)} /></div>
                            <div className="form-group"><label>GitHub</label><input className="input" type="url" value={developerProfiles.github} placeholder="https://github.com/..." onChange={(e) => updateDeveloperProfile("github", e.target.value)} /></div>
                            <div className="form-group"><label>LeetCode</label><input className="input" type="url" value={developerProfiles.leetcode} placeholder="https://leetcode.com/u/..." onChange={(e) => updateDeveloperProfile("leetcode", e.target.value)} /></div>
                            <div className="form-group"><label>Portfolio Website</label><input className="input" type="url" value={developerProfiles.portfolio} placeholder="https://yourportfolio.com" onChange={(e) => updateDeveloperProfile("portfolio", e.target.value)} /></div>
                        </div>
                    ) : (
                        <div className="profile-view-grid">
                            <div><span>LinkedIn</span><strong>{renderViewValue(developerProfiles.linkedin)}</strong></div>
                            <div><span>GitHub</span><strong>{renderViewValue(developerProfiles.github)}</strong></div>
                            <div><span>LeetCode</span><strong>{renderViewValue(developerProfiles.leetcode)}</strong></div>
                            <div><span>Portfolio Website</span><strong>{renderViewValue(developerProfiles.portfolio)}</strong></div>
                        </div>
                    )}
                </ProfileSection>

                {/* =================================================
                    EXPERIENCE & ACHIEVEMENTS
                ================================================= */}                {/* =================================================
                    INTERNSHIPS
                ================================================= */}

                <ProfileSection title="💼 Internships / Work Experience">
                    {internships.map((internship, index) => {
                        const isEditing = editingEntries.internships === index;

                        return (
                            <div className={`profile-card ${isEditing ? "editing" : ""}`} key={index}>
                                {isEditing ? (
                                    <>
                                        <div className="profile-grid">
                                            <div className="form-group"><label>Company</label><input className="input" type="text" value={internship.company} placeholder="Enter company name" onChange={(e) => updateInternship(index, "company", e.target.value)} /></div>
                                            <div className="form-group"><label>Role</label><input className="input" type="text" value={internship.role} placeholder="Enter role" onChange={(e) => updateInternship(index, "role", e.target.value)} /></div>
                                            <div className="form-group"><label>Duration</label><input className="input" type="text" value={internship.duration} placeholder="e.g. 3 months" onChange={(e) => updateInternship(index, "duration", e.target.value)} /></div>
                                            <div className="form-group"><label>Description</label><textarea className="input" rows={4} value={internship.description} placeholder="Describe your work" onChange={(e) => updateInternship(index, "description", e.target.value)} /></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn secondary" onClick={() => cancelEntryEdit("internships", index)}>Cancel</button>
                                            <button type="button" className="section-btn primary" onClick={() => saveEntryEdit("internships")}>Save Changes</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="profile-view-grid">
                                            <div><span>Company</span><strong>{renderViewValue(internship.company, "Not added")}</strong></div>
                                            <div><span>Role</span><strong>{renderViewValue(internship.role, "Not added")}</strong></div>
                                            <div><span>Duration</span><strong>{renderViewValue(internship.duration, "Not added")}</strong></div>
                                            <div><span>Description</span><strong>{renderViewValue(internship.description, "Not added")}</strong></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn" onClick={() => beginEntryEdit("internships", index)}>Edit</button>
                                            <button type="button" className="remove-btn" onClick={() => removeInternship(index)}>Remove</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <button type="button" className="add-btn" onClick={addInternship}>
                        + Add Internship / Experience
                    </button>
                </ProfileSection>                {/* =================================================
                    CERTIFICATIONS
                ================================================= */}

                <ProfileSection title="📜 Certifications">
                    {certifications.map((certification, index) => {
                        const isEditing = editingEntries.certifications === index;

                        return (
                            <div className={`profile-card ${isEditing ? "editing" : ""}`} key={index}>
                                {isEditing ? (
                                    <>
                                        <div className="profile-grid">
                                            <div className="form-group"><label>Certification Name</label><input className="input" type="text" value={certification.name} placeholder="Enter certification" onChange={(e) => updateCertification(index, "name", e.target.value)} /></div>
                                            <div className="form-group"><label>Issuer</label><input className="input" type="text" value={certification.issuer} placeholder="Issuing organization" onChange={(e) => updateCertification(index, "issuer", e.target.value)} /></div>
                                            <div className="form-group"><label>Year</label><input className="input" type="number" value={certification.year} placeholder="e.g. 2025" onChange={(e) => updateCertification(index, "year", e.target.value)} /></div>
                                            <div className="form-group"><label>Credential URL</label><input className="input" type="url" value={certification.credentialUrl} placeholder="https://..." onChange={(e) => updateCertification(index, "credentialUrl", e.target.value)} /></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn secondary" onClick={() => cancelEntryEdit("certifications", index)}>Cancel</button>
                                            <button type="button" className="section-btn primary" onClick={() => saveEntryEdit("certifications")}>Save Changes</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="profile-view-grid">
                                            <div><span>Certification Name</span><strong>{renderViewValue(certification.name, "Not added")}</strong></div>
                                            <div><span>Issuer</span><strong>{renderViewValue(certification.issuer, "Not added")}</strong></div>
                                            <div><span>Year</span><strong>{renderViewValue(certification.year, "Not added")}</strong></div>
                                            <div><span>Credential URL</span><strong>{renderViewValue(certification.credentialUrl, "Not added")}</strong></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn" onClick={() => beginEntryEdit("certifications", index)}>Edit</button>
                                            <button type="button" className="remove-btn" onClick={() => removeCertification(index)}>Remove</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <button type="button" className="add-btn" onClick={addCertification}>
                        + Add Certification
                    </button>
                </ProfileSection>                {/* =================================================
                    ACHIEVEMENTS
                ================================================= */}

                <ProfileSection title="🏆 Achievements / Awards">
                    {achievements.map((achievement, index) => {
                        const isEditing = editingEntries.achievements === index;

                        return (
                            <div className={`profile-card ${isEditing ? "editing" : ""}`} key={index}>
                                {isEditing ? (
                                    <>
                                        <div className="profile-grid">
                                            <div className="form-group"><label>Title</label><input className="input" type="text" value={achievement.title} placeholder="Achievement title" onChange={(e) => updateAchievement(index, "title", e.target.value)} /></div>
                                            <div className="form-group"><label>Year</label><input className="input" type="number" value={achievement.year} placeholder="e.g. 2025" onChange={(e) => updateAchievement(index, "year", e.target.value)} /></div>
                                            <div className="form-group"><label>Description</label><textarea className="input" rows={4} value={achievement.description} placeholder="Describe the achievement" onChange={(e) => updateAchievement(index, "description", e.target.value)} /></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn secondary" onClick={() => cancelEntryEdit("achievements", index)}>Cancel</button>
                                            <button type="button" className="section-btn primary" onClick={() => saveEntryEdit("achievements")}>Save Changes</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="profile-view-grid">
                                            <div><span>Title</span><strong>{renderViewValue(achievement.title, "Not added")}</strong></div>
                                            <div><span>Year</span><strong>{renderViewValue(achievement.year, "Not added")}</strong></div>
                                            <div><span>Description</span><strong>{renderViewValue(achievement.description, "Not added")}</strong></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn" onClick={() => beginEntryEdit("achievements", index)}>Edit</button>
                                            <button type="button" className="remove-btn" onClick={() => removeAchievement(index)}>Remove</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <button type="button" className="add-btn" onClick={addAchievement}>
                        + Add Achievement
                    </button>
                </ProfileSection>                {/* =================================================
                    HACKATHONS
                ================================================= */}

                <ProfileSection title="🚀 Hackathons">
                    {hackathons.map((hackathon, index) => {
                        const isEditing = editingEntries.hackathons === index;

                        return (
                            <div className={`profile-card ${isEditing ? "editing" : ""}`} key={index}>
                                {isEditing ? (
                                    <>
                                        <div className="profile-grid">
                                            <div className="form-group"><label>Hackathon Name</label><input className="input" type="text" value={hackathon.name} placeholder="Enter hackathon name" onChange={(e) => updateHackathon(index, "name", e.target.value)} /></div>
                                            <div className="form-group"><label>Position / Result</label><input className="input" type="text" value={hackathon.position} placeholder="e.g. Finalist" onChange={(e) => updateHackathon(index, "position", e.target.value)} /></div>
                                            <div className="form-group"><label>Year</label><input className="input" type="number" value={hackathon.year} placeholder="e.g. 2025" onChange={(e) => updateHackathon(index, "year", e.target.value)} /></div>
                                            <div className="form-group"><label>Description</label><textarea className="input" rows={4} value={hackathon.description} placeholder="Describe your participation" onChange={(e) => updateHackathon(index, "description", e.target.value)} /></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn secondary" onClick={() => cancelEntryEdit("hackathons", index)}>Cancel</button>
                                            <button type="button" className="section-btn primary" onClick={() => saveEntryEdit("hackathons")}>Save Changes</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="profile-view-grid">
                                            <div><span>Hackathon Name</span><strong>{renderViewValue(hackathon.name, "Not added")}</strong></div>
                                            <div><span>Position / Result</span><strong>{renderViewValue(hackathon.position, "Not added")}</strong></div>
                                            <div><span>Year</span><strong>{renderViewValue(hackathon.year, "Not added")}</strong></div>
                                            <div><span>Description</span><strong>{renderViewValue(hackathon.description, "Not added")}</strong></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn" onClick={() => beginEntryEdit("hackathons", index)}>Edit</button>
                                            <button type="button" className="remove-btn" onClick={() => removeHackathon(index)}>Remove</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <button type="button" className="add-btn" onClick={addHackathon}>
                        + Add Hackathon
                    </button>
                </ProfileSection>                {/* =================================================
                    PROJECTS
                ================================================= */}

                <ProfileSection title="🛠️ Projects">
                    {projects.map((project, index) => {
                        const isEditing = editingEntries.projects === index;

                        return (
                            <div className={`profile-card ${isEditing ? "editing" : ""}`} key={index}>
                                {isEditing ? (
                                    <>
                                        <div className="profile-grid">
                                            <div className="form-group"><label>Project Name</label><input className="input" type="text" value={project.name} placeholder="Enter project name" onChange={(e) => updateProject(index, "name", e.target.value)} /></div>
                                            <div className="form-group"><label>Technologies</label><input className="input" type="text" value={project.technologiesInput ?? (Array.isArray(project.technologies) ? project.technologies.join(", ") : "")} placeholder="React, Node.js, MongoDB" onChange={(e) => updateProject(index, "technologiesInput", e.target.value)} /></div>
                                            <div className="form-group"><label>Project URL</label><input className="input" type="url" value={project.projectUrl} placeholder="https://..." onChange={(e) => updateProject(index, "projectUrl", e.target.value)} /></div>
                                            <div className="form-group"><label>GitHub URL</label><input className="input" type="url" value={project.githubUrl} placeholder="https://github.com/..." onChange={(e) => updateProject(index, "githubUrl", e.target.value)} /></div>
                                            <div className="form-group"><label>Description</label><textarea className="input" rows={4} value={project.description} placeholder="Describe the project" onChange={(e) => updateProject(index, "description", e.target.value)} /></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn secondary" onClick={() => cancelEntryEdit("projects", index)}>Cancel</button>
                                            <button type="button" className="section-btn primary" onClick={() => saveEntryEdit("projects")}>Save Changes</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="profile-view-grid">
                                            <div><span>Project Name</span><strong>{renderViewValue(project.name, "Not added")}</strong></div>
                                            <div><span>Technologies</span><strong>{renderViewValue(project.technologiesInput || (Array.isArray(project.technologies) ? project.technologies.join(", ") : ""), "Not added")}</strong></div>
                                            <div><span>Project URL</span><strong>{renderViewValue(project.projectUrl, "Not added")}</strong></div>
                                            <div><span>GitHub URL</span><strong>{renderViewValue(project.githubUrl, "Not added")}</strong></div>
                                            <div><span>Description</span><strong>{renderViewValue(project.description, "Not added")}</strong></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn" onClick={() => beginEntryEdit("projects", index)}>Edit</button>
                                            <button type="button" className="remove-btn" onClick={() => removeProject(index)}>Remove</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <button type="button" className="add-btn" onClick={addProject}>
                        + Add Project
                    </button>
                </ProfileSection>                {/* =================================================
                    CODING ACHIEVEMENTS
                ================================================= */}

                <ProfileSection title="💡 Coding / Competitive Programming">
                    {codingAchievements.map((codingAchievement, index) => {
                        const isEditing = editingEntries.codingAchievements === index;

                        return (
                            <div className={`profile-card ${isEditing ? "editing" : ""}`} key={index}>
                                {isEditing ? (
                                    <>
                                        <div className="profile-grid">
                                            <div className="form-group"><label>Platform</label><input className="input" type="text" value={codingAchievement.platform} placeholder="LeetCode, CodeChef..." onChange={(e) => updateCodingAchievement(index, "platform", e.target.value)} /></div>
                                            <div className="form-group"><label>Achievement</label><input className="input" type="text" value={codingAchievement.achievement} placeholder="Problems Solved / Rating / Rank" onChange={(e) => updateCodingAchievement(index, "achievement", e.target.value)} /></div>
                                            <div className="form-group"><label>Count</label><input className="input" type="number" value={codingAchievement.count} placeholder="e.g. 400" onChange={(e) => updateCodingAchievement(index, "count", e.target.value)} /></div>
                                            <div className="form-group"><label>Profile URL</label><input className="input" type="url" value={codingAchievement.profileUrl} placeholder="https://..." onChange={(e) => updateCodingAchievement(index, "profileUrl", e.target.value)} /></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn secondary" onClick={() => cancelEntryEdit("codingAchievements", index)}>Cancel</button>
                                            <button type="button" className="section-btn primary" onClick={() => saveEntryEdit("codingAchievements")}>Save Changes</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="profile-view-grid">
                                            <div><span>Platform</span><strong>{renderViewValue(codingAchievement.platform, "Not added")}</strong></div>
                                            <div><span>Achievement</span><strong>{renderViewValue(codingAchievement.achievement, "Not added")}</strong></div>
                                            <div><span>Count</span><strong>{renderViewValue(codingAchievement.count, "Not added")}</strong></div>
                                            <div><span>Profile URL</span><strong>{renderViewValue(codingAchievement.profileUrl, "Not added")}</strong></div>
                                        </div>
                                        <div className="entry-actions">
                                            <button type="button" className="section-btn" onClick={() => beginEntryEdit("codingAchievements", index)}>Edit</button>
                                            <button type="button" className="remove-btn" onClick={() => removeCodingAchievement(index)}>Remove</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}

                    <button type="button" className="add-btn" onClick={addCodingAchievement}>
                        + Add Coding Achievement
                    </button>
                </ProfileSection>                {/* =================================================
                    RESUME
                ================================================= */}

                <ProfileSection
                    title="📄 Resume"
                >

                    <div className="resume-card">

                        <div className="resume-header">

                            <h3>
                                Resume
                            </h3>

                            {resume?.fileName && (
                                <span className="resume-badge">
                                    Uploaded
                                </span>
                            )}

                        </div>


                        <p className="resume-name">

                            {resume?.fileName
                                ? resume.fileName
                                : "No resume uploaded"}

                        </p>


                        {resume?.fileName && (

                            <div className="resume-actions">

                                <button
                                    type="button"
                                    onClick={
                                        openResume
                                    }
                                    className="resume-btn view-btn"
                                >
                                    👁 View
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        downloadResume
                                    }
                                    className="resume-btn download-btn"
                                >
                                    ⬇ Download
                                </button>

                            </div>

                        )}


                        <div className="resume-upload">

                            <input
                                type="file"
                                accept="application/pdf,.pdf"
                                disabled={!canEditProfile}
                                onChange={(e) =>
                                    setResumeFile(
                                        e.target.files?.[0] ||
                                        null
                                    )
                                }
                            />


                            <button
                                type="button"
                                className="upload-btn"
                                disabled={!canEditProfile}
                                onClick={
                                    handleResumeUpload
                                }
                            >
                                {resume?.fileName
                                    ? "Replace Resume"
                                    : "Upload Resume"}
                            </button>

                        </div>

                    </div>

                </ProfileSection>


                {/* =================================================
                    SAVE
                ================================================= */}

                <div className="profile-actions">

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={profileExists && !canEditProfile}
                    >
                        {profileExists
                            ? "Update Profile"
                            : "Create Profile"}
                    </button>

                </div>

            </form>

            {showEditRequestModal && (
                <div className="profile-request-modal-overlay">
                    <div className="profile-request-modal">
                        <div className="profile-request-modal-header">
                            <div>
                                <h2>Request Profile Edit Access</h2>
                                <p>
                                    Your profile is verified and currently frozen.
                                    Request temporary access from the placement cell.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="profile-request-close"
                                onClick={() => setShowEditRequestModal(false)}
                                disabled={requestSubmitting}
                            >
                                ×
                            </button>
                        </div>

                        <div className="form-group">
                            <label>Reason</label>
                            <textarea
                                className="input"
                                rows={5}
                                maxLength={500}
                                value={editRequestReason}
                                placeholder="Explain why you need to update your profile..."
                                onChange={(e) => setEditRequestReason(e.target.value)}
                                disabled={requestSubmitting}
                            />
                            <small>{editRequestReason.length}/500</small>
                        </div>

                        <div className="profile-request-modal-actions">
                            <button
                                type="button"
                                className="section-btn secondary"
                                onClick={() => setShowEditRequestModal(false)}
                                disabled={requestSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="section-btn primary"
                                onClick={submitProfileUpdateRequest}
                                disabled={requestSubmitting}
                            >
                                {requestSubmitting ? "Submitting..." : "Submit Request"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Profile;