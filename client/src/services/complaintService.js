import axios from "axios";

const API = "http://localhost:5000/api/complaints";

// =========================================================
// CREATE COMPLAINT
// =========================================================

export const createComplaint = async (formData) => {
    const token = localStorage.getItem("token");

    return await axios.post(
        API,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// GET MY COMPLAINTS
// =========================================================

export const getMyComplaints = async () => {
    const token = localStorage.getItem("token");

    return await axios.get(
        `${API}/my`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// GET COMPLAINT STATS
// =========================================================

export const getComplaintStats = async () => {
    const token = localStorage.getItem("token");

    return await axios.get(
        `${API}/stats`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// GET COMPLAINT BY ID
// =========================================================

export const getComplaintById = async (id) => {
    const token = localStorage.getItem("token");

    return await axios.get(
        `${API}/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// GET RECENT COMPLAINTS
// =========================================================

export const getRecentComplaints = async () => {
    const token = localStorage.getItem("token");

    return await axios.get(
        `${API}/recent`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// UPDATE COMPLAINT
// =========================================================

export const updateComplaint = async (
    id,
    data
) => {
    const token = localStorage.getItem("token");

    return await axios.put(
        `${API}/${id}`,
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// DELETE COMPLAINT
// =========================================================

export const deleteComplaint = async (id) => {
    const token = localStorage.getItem("token");

    return await axios.delete(
        `${API}/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// ADMIN - GET ALL COMPLAINTS
// =========================================================

export const getAllComplaints = async () => {
    const token = localStorage.getItem("token");

    return await axios.get(
        `${API}/admin/all`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// ADMIN - UPDATE COMPLAINT STATUS
// =========================================================

export const updateComplaintStatus = async (
    id,
    status
) => {
    const token = localStorage.getItem("token");

    return await axios.put(
        `${API}/admin/status/${id}`,
        { status },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// ADMIN - DELETE COMPLAINT
// =========================================================

export const adminDeleteComplaint = async (
    id
) => {
    const token = localStorage.getItem("token");

    return await axios.delete(
        `${API}/admin/delete/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// ADMIN - GENERAL STATISTICS
// =========================================================

export const getAdminStats = async () => {
    const token = localStorage.getItem("token");

    return await axios.get(
        `${API}/admin/stats`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};

// =========================================================
// ADMIN - CATEGORY STATISTICS
// =========================================================

export const getCategoryStats = async () => {
    const token = localStorage.getItem("token");

    return await axios.get(
        `${API}/admin/category-stats`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};