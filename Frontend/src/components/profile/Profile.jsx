import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";


const Profile = () => {
    const navigate = useNavigate();
    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        user = null;
    }

    const [name, setName] = useState(user?.name || "");
    const [photo, setPhoto] = useState(user?.photo || "");

    // 📸 handle image upload
    const handleImage = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhoto(reader.result);
        };

        reader.readAsDataURL(file);
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`   // ✅ FIX THIS
                },
                body: JSON.stringify({ name, photo })
            });

            const data = await res.json();

            localStorage.setItem("user", JSON.stringify(data));
            // localStorage.setItem("user", JSON.stringify(data));
            navigate("/");

        } catch (err) {
            console.error(err);
            alert("Profile update failed");
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";

        const words = name.trim().split(" ");
        if (words.length === 1) return words[0][0].toUpperCase();

        return (words[0][0] + words[1][0]).toUpperCase();
    };

    return (
        <div className="profile-page">
            <div className="profile-card">

                <h2>👤 Edit Profile</h2>

                {/* Profile Image */}
                {photo ? (
                    <img
                        src={photo}
                        alt="profile"
                        className="profile-icon"
                        onClick={() => setShowMenu(!showMenu)}
                    />
                ) : (
                    <div
                        className="profile-avatar"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        {getInitials(name)}
                    </div>
                )}

                {/* Upload */}
                <input
                    type="file"
                    onChange={handleImage}
                    className="profile-upload"
                />

                {/* Name */}
                <label className="profile-label">Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                />

                {/* Email (readonly) */}
                <label className="profile-label">Email</label>
                <input value={user?.email || ""} disabled />

                {/* Farmer ID */}
                <p className="profile-info">
                    Farmer ID: <strong>{user?.farmerId || "N/A"}</strong>
                </p>

                {/* Button */}
                <button onClick={handleUpdate}>Save Changes</button>

            </div>
        </div>
    );
};

export default Profile;