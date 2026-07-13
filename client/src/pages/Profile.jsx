import { useEffect, useState } from "react";
import {
    getProfile,
    updateProfile,
    changePassword,
} from "../services/userService";

import "../css/Profile.css";

function Profile() {
    const [user, setUser] = useState({
        fullName: "",
        email: "",
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            setUser(res.data.user);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateProfile(user);

            localStorage.setItem("user", JSON.stringify(user));

            alert("Profile Updated Successfully");
        } catch (error) {
            console.log(error);
            alert("Update Failed");
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        try {
            await changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });

            alert("Password Changed Successfully");

            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Password Change Failed"
            );
        }
    };

    return (
        <div className="profile-page">
            <div className="profile-card">

                <h1>👤 My Profile</h1>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="fullName"
                        value={user.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />

                    <br /><br />

                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />

                    <br /><br />

                    <button type="submit">
                        Update Profile
                    </button>

                </form>

                <hr style={{ margin: "40px 0" }} />

                <h2>🔒 Change Password</h2>

                <form onSubmit={handleChangePassword}>

                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Old Password"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        required
                    />

                    <br /><br />

                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                    />

                    <br /><br />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                    />

                    <br /><br />

                    <button type="submit">
                        🔒 Change Password
                    </button>

                </form>

            </div>
        </div>
    );
}

export default Profile;