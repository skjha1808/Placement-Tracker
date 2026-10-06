// Register Validation
export const validateRegister = (formData) => {
    const errors = {};

    // Name Validation
    if (!formData.name.trim()) {
        errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
        errors.name = "Name cannot exceed 50 characters";
    }

    // Email Validation
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email";
    }

    // Password Validation
    if (!formData.password) {
        errors.password = "Password is required";
    } else if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    return errors;
};

// Login Validation
export const validateLogin = (formData) => {
    const errors = {};

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email";
    }

    if (!formData.password) {
        errors.password = "Password is required";
    }

    return errors;
};

// Phone Validation
export const validatePhone = (phone) => {
    if (!phone.trim()) {
        return "Phone number is required";
    }

    if (!/^\d+$/.test(phone)) {
        return "Phone number must contain only digits";
    }

    if (phone.length !== 10) {
        return "Phone number must be exactly 10 digits";
    }

    return "";
};

// CGPA Validation
export const validateCGPA = (cgpa) => {
    if (cgpa === "" || cgpa === null || cgpa === undefined) {
        return "CGPA is required";
    }

    const value = Number(cgpa);

    if (isNaN(value)) {
        return "CGPA must be a valid number";
    }

    if (value < 0 || value > 10) {
        return "CGPA must be between 0 and 10";
    }

    return "";
};

// Profile Validation
export const validateProfile = (formData) => {
    const errors = {};

    // Name
    if (!formData.name.trim()) {
        errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
        errors.name = "Name cannot exceed 50 characters";
    }

    // Email
    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email";
    }

    // Phone
    const phoneError = validatePhone(formData.phone);

    if (phoneError) {
        errors.phone = phoneError;
    }

    // Branch
    if (!formData.branch) {
        errors.branch = "Please select a branch";
    }

    // Education
    if (!formData.education) {
        errors.education = "Please select education";
    }

    // CGPA
    const cgpaError = validateCGPA(formData.cgpa);

    if (cgpaError) {
        errors.cgpa = cgpaError;
    }

    // Skills
    if (!formData.skills.trim()) {
        errors.skills = "Please enter at least one skill";
    }

    return errors;
};