import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            const response = await api.get("/students/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

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
            // If profile doesn't exist, stay in create mode
            if (error.response?.status !== 404) {
                console.log(
                    error.response?.data || error.message
                );
            }
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
                        .map((skill) => skill.trim()),
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
                        .map((skill) => skill.trim()),
                    resumeLink,
                };
            }

            if (profileExists) {
                await api.put(
                    "/students/me",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
            } else {
                await api.post(
                    "/students",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
            }

            alert(
                profileExists
                    ? "Profile updated successfully!"
                    : "Profile created successfully!"
            );

            navigate("/dashboard");

        } catch (error) {
            console.log(error.response?.status);
            console.log(error.response?.data);

            alert(
                error.response?.data?.message ||
                "Something went wrong!"
            );
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            <p>Verification Status:{" "}
                {isVerified ? "✅ Verified" : "⏳ Pending Verification"}
            </p>

            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <br />
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    disabled={isVerified}
                    onChange={(e) =>
                        setName(e.target.value)
                    }
                />

                <br /><br />

                <label>Email</label>
                <br />
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <br /><br />

                <label>Phone</label>
                <br />
                <input
                    type="tel"
                    placeholder="Enter Phone"
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                />

                <br /><br />

                <label>Branch</label>
                <br />
                <input
                    type="text"
                    placeholder="Enter Branch"
                    value={branch}
                    disabled={isVerified}
                    onChange={(e) =>
                        setBranch(e.target.value)
                    }
                />

                <br /><br />

                <label>Education</label>
                <br />
                <input
                    type="text"
                    placeholder="Enter Education"
                    value={education}
                    disabled={isVerified}
                    onChange={(e) =>
                        setEducation(e.target.value)
                    }
                />

                <br /><br />

                <label>CGPA</label>
                <br />
                <input
                    type="number"
                    step="0.01"
                    placeholder="Enter CGPA"
                    value={cgpa}
                    disabled={isVerified}
                    onChange={(e) =>
                        setCgpa(e.target.value)
                    }
                />

                <br /><br />

                <label>Skills</label>
                <br />
                <input
                    type="text"
                    placeholder="C++, DSA, MERN"
                    value={skills}
                    onChange={(e) =>
                        setSkills(e.target.value)
                    }
                />

                <br /><br />

                <label>Resume Link</label>
                <br />
                <input
                    type="url"
                    placeholder="Enter Resume Link"
                    value={resumeLink}
                    onChange={(e) =>
                        setResumeLink(e.target.value)
                    }
                />

                <br /><br />

                <button type="submit">
                    {profileExists
                        ? "Update Profile"
                        : "Create Profile"}
                </button>
            </form>
        </div>
    );
}

export default Profile;