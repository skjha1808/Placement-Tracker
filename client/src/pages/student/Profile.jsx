import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import "./Profile.css";

import ProfileSection from "../../components/ui/ProfileSection";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

function Profile() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [branch, setBranch] = useState("");
    const [education, setEducation] = useState("");
    const [cgpa, setCgpa] = useState("");
    const [skills, setSkills] = useState("");
    const [resumeLink, setResumeLink] = useState("");

    const [profileExists, setProfileExists] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {

            const response = await api.get("/students/me");

            setName(response.data.name);
            setEmail(response.data.email);
            setPhone(response.data.phone);
            setBranch(response.data.branch);
            setEducation(response.data.education);
            setCgpa(response.data.cgpa);
            setSkills(response.data.skills.join(", "));
            setResumeLink(response.data.resumeLink);

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

        try {

            let data;

            if (isVerified) {

                data = {

                    email,

                    phone,

                    skills: skills
                        .split(",")
                        .map(skill => skill.trim()),

                    resumeLink,

                };

            } else {

                data = {

                    name,

                    email,

                    phone,

                    branch,

                    education,

                    cgpa,

                    skills: skills
                        .split(",")
                        .map(skill => skill.trim()),

                    resumeLink,

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
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />

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
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Phone
                            </label>

                            <input
                                className="input"
                                type="tel"
                                value={phone}
                                placeholder="Enter Phone"
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                            />

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

                            <input
                                className="input"
                                type="text"
                                value={branch}
                                disabled={isVerified}
                                placeholder="Enter Branch"
                                onChange={(e) =>
                                    setBranch(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Education
                            </label>

                            <input
                                className="input"
                                type="text"
                                value={education}
                                disabled={isVerified}
                                placeholder="Enter Education"
                                onChange={(e) =>
                                    setEducation(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                CGPA
                            </label>

                            <input
                                className="input"
                                type="number"
                                step="0.01"
                                value={cgpa}
                                disabled={isVerified}
                                placeholder="Enter CGPA"
                                onChange={(e) =>
                                    setCgpa(e.target.value)
                                }
                            />

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
                                onChange={(e) =>
                                    setSkills(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Resume Link
                            </label>

                            <input
                                className="input"
                                type="url"
                                value={resumeLink}
                                placeholder="https://drive.google.com/..."
                                onChange={(e) =>
                                    setResumeLink(e.target.value)
                                }
                            />

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