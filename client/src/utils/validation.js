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
        errors.password =
            "Password must be at least 6 characters";
    }

    return errors;
};

export const validateLogin = (formData) => {
    const errors = {};

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
    }

    return errors;
};