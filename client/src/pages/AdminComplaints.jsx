import { useEffect, useState } from "react";
import {
    getAllComplaints,
    updateComplaintStatus,
    adminDeleteComplaint,
} from "../services/complaintService";

function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await getAllComplaints();
            setComplaints(response.data.complaints);
        } catch (error) {
            console.log(error);
            alert("Failed to load complaints.");
        }
    };

    const handleUpdateStatus = async (id) => {

        const status = prompt(
            "Enter Status:\n\nPending\nIn Progress\nResolved"
        );

        if (!status) return;

        try {

            await updateComplaintStatus(id, status);

            alert("Complaint status updated successfully.");

            fetchComplaints();

        } catch (error) {

            console.log(error);

            alert("Failed to update complaint.");

        }

    };

    const handleDeleteComplaint = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this complaint?"
        );

        if (!confirmDelete) return;

        try {

            await adminDeleteComplaint(id);

            alert("Complaint deleted successfully.");

            fetchComplaints();

        } catch (error) {

            console.log(error);

            alert("Failed to delete complaint.");

        }

    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>📋 Complaint Management</h1>

            <br />

            <input
                type="text"
                placeholder="🔍 Search Complaint..."
                style={{
                    width: "300px",
                    padding: "10px",
                    marginRight: "20px",
                }}
            />

            <select
                style={{
                    padding: "10px",
                }}
            >
                <option>All Status</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
            </select>

            <br />
            <br />

            <table
                border="1"
                cellPadding="10"
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr>
                        <th>Citizen</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Department</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {complaints.length > 0 ? (
                        complaints.map((complaint) => (
                            <tr key={complaint._id}>
                                <td>{complaint.citizen?.name}</td>
                                <td>{complaint.title}</td>
                                <td>{complaint.category}</td>
                                <td>{complaint.priority || "N/A"}</td>
                                <td>{complaint.status}</td>
                                <td>{complaint.department || "N/A"}</td>
                                <td>
                                    <button>View</button>{" "}
                                    <button
                                        onClick={() => handleUpdateStatus(complaint._id)}
                                    >
                                        Update
                                    </button>{" "}
                                    <button
                                        onClick={() => handleDeleteComplaint(complaint._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ textAlign: "center" }}>
                                No complaints found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default AdminComplaints;