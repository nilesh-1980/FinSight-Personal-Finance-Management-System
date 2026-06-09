import { useEffect, useState } from "react";
import API from "../api";
import axios from "axios";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    photoUrl: ""
  });

  const [selectedFile, setSelectedFile] = useState(null);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      return;
    }

    const res = await API.get(`/profile/${email}`);
    setProfile(res.data);
  };

  const uploadPhoto = async () => {
    const email = localStorage.getItem("email");

    if (!selectedFile) {
      alert("Please select image");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await axios.post(
      `http://localhost:8080/api/profile/upload-photo/${email}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    alert("Profile photo uploaded successfully");

    setProfile({
      ...profile,
      photoUrl: res.data
    });

    setSelectedFile(null);
  };

  const changePassword = async () => {
    const email = localStorage.getItem("email");

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      alert("Please enter old and new password");
      return;
    }

    const res = await API.put("/profile/change-password", {
      email: email,
      oldPassword: passwordData.oldPassword,
      newPassword: passwordData.newPassword
    });

    alert(res.data);

    setPasswordData({
      oldPassword: "",
      newPassword: ""
    });
  };

  return (
    <div className="container">
      <h1>👤 My Profile</h1>

      <div className="profile-card">
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt="Profile"
            className="profile-photo"
          />
        ) : (
          <div className="profile-avatar">
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        <div className="profile-info">
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>

          <div className="photo-upload-box">
            <label className="upload-label">
              📷 Select Profile Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </label>

            {selectedFile && (
              <p className="file-name">
                Selected: {selectedFile.name}
              </p>
            )}

            <button onClick={uploadPhoto} className="upload-btn">
              Upload Photo
            </button>
          </div>
        </div>
      </div>

      <div className="password-box">
        <h2> Change Password</h2>

        <input
          type="password"
          placeholder="Enter Old Password"
          value={passwordData.oldPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              oldPassword: e.target.value
            })
          }
        />

        <input
          type="password"
          placeholder="Enter New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value
            })
          }
        />

        <button onClick={changePassword}>Change Password</button>
      </div>
    </div>
  );
}

export default Profile;