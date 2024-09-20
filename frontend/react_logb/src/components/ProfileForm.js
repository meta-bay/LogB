import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/ProfileForm.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        setProfile(response.data);

        // Update the form fields with fetched data
        setProfileForm({
          username: response.data.username,
          email: response.data.email,
          profileImage: null,
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError("Error fetching user profile.");
        console.error("Error fetching user profile:", error);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Handle file input differently
    if (name === "profileImage") {
      setProfileForm({
        ...profileForm,
        profileImage: files[0],
      });
    } else {
      setProfileForm({
        ...profileForm,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", profileForm.username);
    formData.append("email", profileForm.email);

    // Only append the image if there is one
    if (profileForm.profileImage instanceof File) {
      formData.append(
        "image",
        profileForm.profileImage,
        profileForm.profileImage.name,
      );
    }

    try {
      setLoading(true);
      await updateUserProfile(formData);
      // Re-fetch the profile to update the UI after successful update
      const response = await getUserProfile();
      setProfile(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      setLoading(false);
      setError("Error updating profile.");
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div>Please log in to view your profile.</div>;
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  // Ensure profile data exists before rendering
  if (!profile) return <div>Loading profile data...</div>;

  return (
    <div className="profile">
      <div className="profile-header">
        <img
          className="profile-image"
          src={`${process.env.REACT_APP_API_URL}${profile.profile.image}`}
          alt="Profile"
        />
        <div className="profile-info">
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
        </div>
      </div>

      {/* Profile Update Form */}
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="profile-form"
      >
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={profileForm.username}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={profileForm.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="profileImage">Profile Picture:</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            className="form-file-input"
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
