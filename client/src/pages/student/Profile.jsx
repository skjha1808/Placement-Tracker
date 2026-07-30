import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import "./Profile.css";

import ProfileSection from "../../components/ui/ProfileSection";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

import { formatName, formatSkills } from "../../utils/formatters";

import {
    validateProfile,
    validatePhone,
} from "../../utils/validation";

import {
    BRANCH_OPTIONS,
    EDUCATION_OPTIONS,
} from "../../constants/options";

function Profile() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [branch, setBranch] = useState("");
    const [education, setEducation] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [skills, setSkills] = useState("");

    const [profileExists, setProfileExists] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [resumeFile, setResumeFile] = useState(null);
    const [resume, setResume] = useState(null);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

    const fetchProfile = async () => {
        try {

            const response = await api.get("/students/me");

            setName(response.data.name || "");
            setEmail(response.data.email || "");
            setPhone(response.data.phone || "");
            setBranch(response.data.branch || "");
            setEducation(response.data.education || "");
            setCgpa(response.data.cgpa || "");
            setSkills(response.data.skills?.join(", ") || "" );
            setResumeFile(null);
            setResume(response.data.resume);

            setProfileExists(true);
            setIsVerified(response.data.isVerified);

        } catch (error) {
            if (error.response?.status !== 404) {
                console.log(
                    error.response?.data || error.message
                );
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors={};

        if(isVerified){

        const phoneError=validatePhone(phone);

        if(phoneError){

        validationErrors.phone=phoneError;

        }

        if(!email.trim()){

        validationErrors.email="Email is required";

        }

        if(!skills.trim()){

        validationErrors.skills="Please enter at least one skill";

        }

        }
        else{

        validationErrors=validateProfile({

        name,
        email,
        phone,
        branch,
        education,
        cgpa,
        skills

        });
        }

        if(Object.keys(validationErrors).length){
        setErrors(validationErrors);
        return;
        }

        setErrors({});

        try{
            let data;
            if (isVerified) {
                data = {
                    email: email.trim().toLowerCase(),
                    phone: phone.trim(),
                    skills: formatSkills(skills)
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(Boolean),
                };
            } else {
                data = {
                    name: formatName(name),
                    email: email.trim().toLowerCase(),
                    phone: phone.trim(),
                    branch,
                    education,
                    cgpa,
                    skills: formatSkills(skills)
                        .split(",")
                        .map(skill => skill.trim())
                        .filter(Boolean),
                };
            }

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

            navigate("/dashboard");

        } catch (error) {
            console.log(
                error.response?.data || error.message
            );
            alert(
                error.response?.data?.message ||
                "Something went wrong!"
            );
        }
    };

    const handleResumeUpload = async () => {

    if (!resumeFile) {
        return alert("Please select a PDF.");
    }

    if (resumeFile.type !== "application/pdf") {
        return alert("Only PDF files are allowed.");
    }

    if (resumeFile.size > 2 * 1024 * 1024) {
        return alert("Resume size should be less than 2 MB.");
    }

    try {
        const formData = new FormData();

        formData.append("resume", resumeFile);

        const response = await api.post(
            "/students/upload-resume",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

        setResume(response.data.resume);
        setResumeFile(null);
        await fetchProfile();
        alert("Resume uploaded successfully!");

    } catch (error) {
        console.log(error);

        alert(
            error.response?.data?.message ||
            "Upload failed."
        );
    }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="page">

            <h1 className="page-title">
                Student Profile
            </h1>

            <div className="profile-status-container">

                <h3>
                    Verification Status
                </h3>

                <StatusBadge
                    verified={isVerified}
                />

            </div>

            <form onSubmit={handleSubmit}>

                <ProfileSection
                    title="👤 Personal Information"
                >
                    <div className="profile-grid">

                        <div className="form-group">

                            <label>
                                Name
                            </label>

                            <input
                                className="input"
                                type="text"
                                value={name}
                                disabled={isVerified}
                                placeholder="Enter Name"
                                onChange={(e)=>{
                                    setName(e.target.value);
                                    setErrors({
                                        ...errors,
                                        name:""
                                    });
                                }}
                            />

                            {
                                errors.name &&
                                <p className="error-text">
                                {errors.name}
                                </p>
                            }
                        </div>

                        <div className="form-group">

                            <label>
                                Email
                            </label>

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

                            {
                                errors.email &&
                                <p className="error-text">
                                {errors.email}
                                </p>
                            }
                        </div>

                        <div className="form-group">

                            <label>
                                Phone
                            </label>

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

                            {
                                errors.phone && (
                                    <p className="error-text">
                                        {errors.phone}
                                    </p>
                                )
                            }

                        </div>
                    </div>
                </ProfileSection>

                <ProfileSection
                    title="🎓 Academic Information"
                >

                    <div className="profile-grid">

                        <div className="form-group">

                            <label>
                                Branch
                            </label>

                            <select
                                className="input"
                                value={branch}
                                disabled={isVerified}
                                onChange={(e)=>{
                                    setBranch(e.target.value);
                                    setErrors({
                                        ...errors,
                                        branch:""
                                    });
                                }}
                            >

                            <option value="">
                            Select Branch
                            </option>

                            {
                            BRANCH_OPTIONS.map(branch=>(
                            <option
                            key={branch}
                            value={branch}
                            >
                            {branch}
                            </option>
                            ))
                            }

                            </select>

                            {
                            errors.branch &&
                            <p className="error-text">
                            {errors.branch}
                            </p>
                            }

                        </div>

                        <div className="form-group">

                            <label>
                                Education
                            </label>

                            <select
                                className="input"
                                value={education}
                                disabled={isVerified}
                                onChange={(e) => {
                                    setEducation(e.target.value);
                                    setErrors({
                                        ...errors,
                                        education: "",
                                    });
                                }}
                            >
                                <option value="">
                                    Select Education
                                </option>

                                {EDUCATION_OPTIONS.map((education) => (
                                    <option
                                        key={education}
                                        value={education}
                                    >
                                        {education}
                                    </option>
                                ))}
                            </select>

                            {
                                errors.education && (
                                    <p className="error-text">
                                        {errors.education}
                                    </p>
                                )
                            }

                        </div>

                        <div className="form-group">

                            <label>
                                CGPA
                            </label>

                            <input
                                className="input"
                                type="number" 
                                inputMode="decimal"
                                min="0"
                                max="10"
                                step="0.01"
                                value={cgpa}
                                disabled={isVerified}
                                placeholder="Enter CGPA"
                                onChange={(e)=>{
                                setCgpa(e.target.value);
                                setErrors({
                                ...errors,
                                cgpa:""
                                });
                                }}
                            />

                            {
                                errors.cgpa &&
                                <p className="error-text">
                                {errors.cgpa}
                                </p>
                            }

                        </div>

                    </div>

                </ProfileSection>

                <ProfileSection
                    title="💼 Professional Information"
                >
                    
                    <div className="profile-grid">
                        <div className="form-group">
                            <label>
                                Skills
                            </label>

                            <input
                                className="input"
                                type="text"
                                value={skills}
                                placeholder="C++, React, Node.js"
                                onChange={(e) => {
                                    setSkills(e.target.value);

                                    setErrors({
                                        ...errors,
                                        skills: "",
                                    });
                                }}
                            />

                            {
                                errors.skills &&
                                <p className="error-text">
                                {errors.skills}
                                </p>
                            }

                        </div>

                        <div className="resume-card">
                            <div className="resume-header">
                                <h3>📄 Resume</h3>
                                {
                                    resume?.fileName && (
                                        <span className="resume-badge">
                                            Uploaded
                                        </span>
                                    )
                                }
                            </div>

                            <p className="resume-name">
                                {
                                    resume?.fileName
                                        ? resume.fileName
                                        : "No resume uploaded"
                                }
                            </p>

                            {
                                resume?.fileName && (
                                    <div className="resume-actions">
                                        <a
                                            href={`${BASE_URL}${resume.filePath}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="resume-btn view-btn"
                                        >
                                            👁 View
                                        </a>

                                        <a
                                            href={`${BASE_URL}${resume.filePath}`}
                                            download
                                            className="resume-btn download-btn"
                                        >
                                            ⬇ Download
                                        </a>

                                    </div>
                                )
                            }

                            <div className="resume-upload">
                                <input
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    onChange={(e) =>
                                        setResumeFile(e.target.files?.[0] || null)
                                    }
                                />

                                <button
                                    type="button"
                                    className="upload-btn"
                                    onClick={handleResumeUpload}
                                >
                                    {
                                        resume?.fileName
                                            ? "Replace Resume"
                                            : "Upload Resume"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </ProfileSection>

                <div className="profile-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                    >
                        {profileExists
                            ? "Update Profile"
                            : "Create Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Profile;