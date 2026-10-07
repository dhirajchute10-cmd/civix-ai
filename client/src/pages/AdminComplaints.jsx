import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiAlertCircle,
    FiCheckCircle,
    FiChevronDown,
    FiClock,
    FiEdit3,
    FiEye,
    FiFilter,
    FiRefreshCw,
    FiSearch,
    FiTrash2,
    FiX,
} from "react-icons/fi";
import {
    getAllComplaints,
    updateComplaintStatus,
    adminDeleteComplaint,
} from "../services/complaintService";
import "../css/AdminComplaints.css";

function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [statusModal, setStatusModal] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const navigate = useNavigate();

    const fetchComplaints = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const response = await getAllComplaints();
            const data = response?.data?.complaints || [];
            setComplaints(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
            setError("Failed to load complaints. Please check the server and try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);

    const categories = useMemo(() => {
        const uniqueCategories = complaints
            .map((complaint) => complaint.category)
            .filter(Boolean);

        return ["All", ...new Set(uniqueCategories)];
    }, [complaints]);

    const summary = useMemo(() => {
        return {
            total: complaints.length,
            pending: complaints.filter(
                (complaint) => complaint.status === "Pending"
            ).length,
            inProgress: complaints.filter(
                (complaint) => complaint.status === "In Progress"
            ).length,
            resolved: complaints.filter(
                (complaint) => complaint.status === "Resolved"
            ).length,
        };
    }, [complaints]);

    const filteredComplaints = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return complaints.filter((complaint) => {
            const citizenName =
                complaint.citizen?.fullName ||
                complaint.citizen?.name ||
                "";

            const title = complaint.title || "";
            const category = complaint.category || "";
            const location = complaint.location || "";

            const matchesSearch =
                !searchValue ||
                title.toLowerCase().includes(searchValue) ||
                category.toLowerCase().includes(searchValue) ||
                citizenName.toLowerCase().includes(searchValue) ||
                location.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusFilter === "All" ||
                complaint.status === statusFilter;

            const matchesCategory =
                categoryFilter === "All" ||
                complaint.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [complaints, search, statusFilter, categoryFilter]);

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setCategoryFilter("All");
    };

    const openStatusModal = (complaint) => {
        setStatusModal(complaint);
        setSelectedStatus(complaint.status || "Pending");
    };

    const closeStatusModal = () => {
        if (updatingStatus) return;
        setStatusModal(null);
        setSelectedStatus("");
    };

    const handleUpdateStatus = async () => {
        if (!statusModal || !selectedStatus) return;

        try {
            setUpdatingStatus(true);

            await updateComplaintStatus(
                statusModal._id,
                selectedStatus
            );

            setComplaints((current) =>
                current.map((complaint) =>
                    complaint._id === statusModal._id
                        ? { ...complaint, status: selectedStatus }
                        : complaint
                )
            );

            closeStatusModal();
        } catch (err) {
            console.log(err);
            alert("Failed to update complaint status.");
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDeleteComplaint = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this complaint?"
        );

        if (!confirmed) return;

        try {
            setDeletingId(id);

            await adminDeleteComplaint(id);

            setComplaints((current) =>
                current.filter((complaint) => complaint._id !== id)
            );
        } catch (err) {
            console.log(err);
            alert("Failed to delete complaint.");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) return "N/A";

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (status) => {
        if (status === "Resolved") return "status-resolved";
        if (status === "In Progress") return "status-progress";
        return "status-pending";
    };

    const getStatusIcon = (status) => {
        if (status === "Resolved") return <FiCheckCircle />;
        if (status === "In Progress") return <FiClock />;
        return <FiAlertCircle />;
    };

    if (loading) {
        return (
            <div className="complaints-page">
                <div className="complaints-loading">
                    <div className="complaints-spinner"></div>
                    <h3>Loading complaints...</h3>
                    <p>Please wait while we fetch the complaint records.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="complaints-page">
            <div className="complaints-header">
                <div>
                    <div className="complaints-title-row">
                        <div className="complaints-title-icon">
                            <FiAlertCircle />
                        </div>
                        <div>
                            <h1>Complaint Management</h1>
                            <p>
                                Review, track and manage citizen complaints from one place.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    className="refresh-btn"
                    onClick={() => fetchComplaints(true)}
                    disabled={refreshing}
                >
                    <FiRefreshCw className={refreshing ? "refresh-spin" : ""} />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {error && (
                <div className="complaints-error">
                    <div>
                        <strong>Unable to load complaints</strong>
                        <p>{error}</p>
                    </div>

                    <button onClick={() => fetchComplaints()}>
                        Try Again
                    </button>
                </div>
            )}

            <div className="complaints-summary">
                <div className="summary-card summary-total">
                    <div className="summary-card-icon">
                        <FiAlertCircle />
                    </div>
                    <div>
                        <span>Total Complaints</span>
                        <strong>{summary.total}</strong>
                    </div>
                </div>

                <div className="summary-card summary-pending">
                    <div className="summary-card-icon">
                        <FiClock />
                    </div>
                    <div>
                        <span>Pending</span>
                        <strong>{summary.pending}</strong>
                    </div>
                </div>

                <div className="summary-card summary-progress">
                    <div className="summary-card-icon">
                        <FiRefreshCw />
                    </div>
                    <div>
                        <span>In Progress</span>
                        <strong>{summary.inProgress}</strong>
                    </div>
                </div>

                <div className="summary-card summary-resolved">
                    <div className="summary-card-icon">
                        <FiCheckCircle />
                    </div>
                    <div>
                        <span>Resolved</span>
                        <strong>{summary.resolved}</strong>
                    </div>
                </div>
            </div>

            <div className="complaints-panel">
                <div className="panel-header">
                    <div>
                        <h2>All Complaints</h2>
                        <p>
                            Showing {filteredComplaints.length} of {complaints.length} complaints
                        </p>
                    </div>
                </div>

                <div className="complaint-filters">
                    <div className="search-box">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search title, category, citizen or location..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-box">
                        <FiFilter />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <FiChevronDown />
                    </div>

                    <div className="filter-box">
                        <FiFilter />
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category === "All"
                                        ? "All Categories"
                                        : category}
                                </option>
                            ))}
                        </select>
                        <FiChevronDown />
                    </div>

                    {(search ||
                        statusFilter !== "All" ||
                        categoryFilter !== "All") && (
                        <button
                            className="clear-filter-btn"
                            onClick={clearFilters}
                        >
                            <FiX />
                            Clear
                        </button>
                    )}
                </div>

                <div className="table-wrapper">
                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>Citizen</th>
                                <th>Complaint</th>
                                <th>Category</th>
                                <th>Priority</th>
                                <th>Status</th>
                                <th>Department</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map((complaint) => {
                                    const citizenName =
                                        complaint.citizen?.fullName ||
                                        complaint.citizen?.name ||
                                        "Unknown Citizen";

                                    return (
                                        <tr key={complaint._id}>
                                            <td>
                                                <div className="citizen-cell">
                                                    <div className="citizen-avatar">
                                                        {citizenName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div className="citizen-info">
                                                        <strong>
                                                            {citizenName}
                                                        </strong>
                                                        <span>
                                                            {complaint.citizen?.email ||
                                                                "No email"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <div className="complaint-cell">
                                                    <strong>
                                                        {complaint.title ||
                                                            "Untitled Complaint"}
                                                    </strong>
                                                    <span>
                                                        {complaint.location ||
                                                            "Location not provided"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                <span className="category-badge">
                                                    {complaint.category ||
                                                        "Others"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="priority-value">
                                                    {complaint.priority || "N/A"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        complaint.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(
                                                        complaint.status
                                                    )}
                                                    {complaint.status ||
                                                        "Pending"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="department-value">
                                                    {complaint.department ||
                                                        "Not Assigned"}
                                                </span>
                                            </td>

                                            <td>
                                                <span className="date-value">
                                                    {formatDate(
                                                        complaint.createdAt
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn view-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/complaint/${complaint._id}`
                                                            )
                                                        }
                                                        title="View complaint"
                                                    >
                                                        <FiEye />
                                                        <span>View</span>
                                                    </button>

                                                    <button
                                                        className="action-btn update-btn"
                                                        onClick={() =>
                                                            openStatusModal(
                                                                complaint
                                                            )
                                                        }
                                                        title="Update status"
                                                    >
                                                        <FiEdit3 />
                                                        <span>Update</span>
                                                    </button>

                                                    <button
                                                        className="action-btn delete-btn"
                                                        onClick={() =>
                                                            handleDeleteComplaint(
                                                                complaint._id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            complaint._id
                                                        }
                                                        title="Delete complaint"
                                                    >
                                                        <FiTrash2 />
                                                        <span>
                                                            {deletingId ===
                                                            complaint._id
                                                                ? "Deleting"
                                                                : "Delete"}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8">
                                        <div className="empty-state">
                                            <div className="empty-state-icon">
                                                <FiSearch />
                                            </div>
                                            <h3>No complaints found</h3>
                                            <p>
                                                Try changing your search or filter
                                                options.
                                            </p>
                                            <button onClick={clearFilters}>
                                                Clear Filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {statusModal && (
                <div className="modal-overlay" onClick={closeStatusModal}>
                    <div
                        className="status-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <span>Update Complaint</span>
                                <h3>{statusModal.title}</h3>
                            </div>

                            <button
                                className="modal-close"
                                onClick={closeStatusModal}
                                disabled={updatingStatus}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="modal-body">
                            <label htmlFor="complaint-status">
                                Complaint Status
                            </label>

                            <div className="modal-select">
                                <select
                                    id="complaint-status"
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(e.target.value)
                                    }
                                    disabled={updatingStatus}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">
                                        In Progress
                                    </option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                                <FiChevronDown />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="modal-cancel"
                                onClick={closeStatusModal}
                                disabled={updatingStatus}
                            >
                                Cancel
                            </button>

                            <button
                                className="modal-save"
                                onClick={handleUpdateStatus}
                                disabled={updatingStatus}
                            >
                                {updatingStatus
                                    ? "Updating..."
                                    : "Update Status"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminComplaints;