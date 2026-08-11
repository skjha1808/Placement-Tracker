import api from "./api";

export const analyzeResume = async (formData) => {
    const response = await api.post(
        "/ai/analyze-resume",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};