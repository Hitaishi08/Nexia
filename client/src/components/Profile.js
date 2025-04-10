import React, { useState, useEffect } from "react";
import axios from "axios";
import TopBar from './TopBar';
import NavBar from './NavBar';
import './Profile.css';
import cross from '../assets/cross.png';

const API_URL = "http://localhost:3000"; // Replace with your backend URL

const Profile = () => {
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    github: "",
    linkedin: "",
    bio: "",
    address: "",
    jobTitle: "",
    company: "",
    experience: "",
    university: "",
    course: "",
    yearOfStudy: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [isProfessional, setIsProfessional] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile/getprofile`, {
        withCredentials: true,
      });
      const data = response.data;
      console.log(response.data);
      setUserData({
        username: data.username || "",
        email: data.email || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        bio: data.bio || "",
        address: data.address || "",
        jobTitle: data.jobTitle || "",
        company: data.company || "",
        experience: data.experience || "",
        university: data.university || "",
        course: data.course || "",
        yearOfStudy: data.yearOfStudy || "",
      });

      setSkills(data.skills || []);
      setIsProfessional(!!data.jobTitle);
      fetchProfileImage();
      setLoading(false);
      console.log("profile : ",profileImage);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setLoading(false);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const res = await axios.get(`${API_URL}/profile/profilepicture`, {
        withCredentials: true,
      });
      console.log("image data:", res.data)
      setProfileImage(res.data.imageUrl); // directly use the URL
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };
  

  const toggleEditMode = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append('skills', skills.join(','));

      if (profileImage && profileImage.startsWith("data:")) {
        const blob = await fetch(profileImage).then((res) => res.blob());
        formData.append("profilePicture", blob, "profile.jpg");
      }

      await axios.post(`${API_URL}/profile/upsert`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Profile created/updated successfully.");
    } catch (err) {
      console.error("❌ Failed to create/update profile:", err);
    }

    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim()) && skills.length < 10) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter((item) => item !== skill));
  };

  if (loading) return <div className="profile-wrapper">Loading profile...</div>;

  return (
    <div className="profile-wrapper">
      <NavBar />
      <main className="profile-main">
        <TopBar />
        <div className="profile-content">
          <div className="profile-header">
            <h1>User Profile</h1>
            <button 
              className={`edit-btn ${editMode ? 'save' : ''}`}
              onClick={toggleEditMode}
            >
              {editMode ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="profile-layout">
            <section className="profile-avatar-section">
              <div className="avatar-wrapper">
                {editMode ? (
                  <label className="avatar-upload">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                    />
                    <div className="avatar-overlay">
                      {profileImage ? (
                        <img src={profileImage} alt="Preview" />
                      ) : (
                        <span>Change Photo</span>
                      )}
                    </div>
                  </label>
                ) : (
                  <img
                    src={profileImage || '/default-avatar.png'}
                    alt="Profile"
                    className="avatar-img"
                  />
                )}
              </div>

              <div className="contact-info">
                {[
                  { label: 'Email', key: 'email', type: 'email' },
                  { label: 'GitHub', key: 'github', type: 'url' },
                  { label: 'LinkedIn', key: 'linkedin', type: 'url' },
                ].map(({ label, key, type }) => (
                  <div key={key} className="info-item">
                    <span className="info-label">{label}</span>
                    {editMode ? (
                      <input
                        type={type}
                        name={key}
                        value={userData[key]}
                        onChange={handleInputChange}
                        className="info-input"
                      />
                    ) : (
                      <span className="info-value">{userData[key]}</span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section className="profile-details">
              <div className="info-group">
                <div className="info-item">
                  <span className="info-label">Username</span>
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      className="info-input"
                    />
                  ) : (
                    <span className="info-value">{userData.username}</span>
                  )}
                </div>
              </div>

              <div className="info-group">
                <div className="info-item">
                  <span className="info-label">Bio</span>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      className="bio-input"
                      rows={3}
                    />
                  ) : (
                    <p className="info-value bio">{userData.bio}</p>
                  )}
                </div>
                <div className="info-item">
                  <span className="info-label">Address</span>
                  {editMode ? (
                    <input
                      type="text"
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      className="info-input"
                    />
                  ) : (
                    <span className="info-value">{userData.address}</span>
                  )}
                </div>
              </div>

              <div className="info-group">
                <div className="info-item">
                  <span className="info-label">Role</span>
                  {editMode ? (
                    <select
                      value={isProfessional ? 'Professional' : 'Student'}
                      onChange={(e) => setIsProfessional(e.target.value === 'Professional')}
                      className="role-select"
                    >
                      <option value="Professional">Professional</option>
                      <option value="Student">Student</option>
                    </select>
                  ) : (
                    <span className="info-value">
                      {isProfessional ? 'Professional' : 'Student'}
                    </span>
                  )}
                </div>
              </div>

              <div className="info-group">
                {isProfessional ? (
                  <>
                    {[
                      { label: 'Job Title', key: 'jobTitle' },
                      { label: 'Company', key: 'company' },
                      { label: 'Experience', key: 'experience' },
                    ].map(({ label, key }) => (
                      <div key={key} className="info-item">
                        <span className="info-label">{label}</span>
                        {editMode ? (
                          <input
                            type="text"
                            name={key}
                            value={userData[key]}
                            onChange={handleInputChange}
                            className="info-input"
                          />
                        ) : (
                          <span className="info-value">{userData[key]}</span>
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { label: 'University', key: 'university' },
                      { label: 'Course', key: 'course' },
                      { label: 'Year of Study', key: 'yearOfStudy' },
                    ].map(({ label, key }) => (
                      <div key={key} className="info-item">
                        <span className="info-label">{label}</span>
                        {editMode ? (
                          <input
                            type="text"
                            name={key}
                            value={userData[key]}
                            onChange={handleInputChange}
                            className="info-input"
                          />
                        ) : (
                          <span className="info-value">{userData[key]}</span>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>

              <div className="info-group skills-group">
                <span className="info-label">Skills</span>
                {editMode && (
                  <form onSubmit={handleAddSkill} className="skill-add">
                    <input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add skill..."
                      className="info-input skill-input"
                      maxLength={25}
                    />
                    <button type="submit" className="skill-add-btn">+</button>
                  </form>
                )}
                <div className="skills-list">
                  {skills.map((skill, index) => (
                    <div key={index} className="skill-chip">
                      <span>{skill}</span>
                      {editMode && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="skill-remove"
                        >
                          <img src={cross} alt="Remove" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
