import { useEffect, useState } from "react";
import api from "../services/api";
import "./ApplicationForm.css";

function ApplicationForm({
    isOpen,
    onClose,
    selectedApplication,
    fetchApplications,
}) {
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (selectedApplication) {
            setStatus(selectedApplication.status);
        }
    }, [selectedApplication]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/applications/${selectedApplication._id}`, {
                status,
            });

            fetchApplications();
            onClose();
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Update Application Status</h2>

                <form onSubmit={handleSubmit}>
                    <label>Status</label>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="Applied">Applied</option>
                        <option value="OA Cleared">OA Cleared</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                    </select>

                    <div className="modal-buttons">
                        <button type="submit">
                            Update
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ApplicationForm;