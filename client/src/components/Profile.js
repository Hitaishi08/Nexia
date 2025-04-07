import React, { useState } from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';
import './Profile.css';
import cross from '../assets/cross.png'

const Profile = () => {
  const [isProfessional, setIsProfessional] = useState(true); // Role state to toggle Professional/Student
  const [skills, setSkills] = useState([]); // Skills array to store entered skills
  const [skillInput, setSkillInput] = useState(""); // Track skill input
  const [userData, setUserData] = useState({
    username: "John Doe",
    email: "johndoe@gmail.com",
    github: "github.com/johndoe",
    linkedin: "linkedin.com/in/johndoe",
    bio: "This is a sample bio.",
    address: "New York, USA",
    jobTitle: "Software Developer",
    company: "XYZ Corp.",
    experience: "5 years",
    university: "ABC University",
    course: "Computer Science",
    yearOfStudy: "3rd Year",
  });

  const [profileImage, setProfileImage] = useState(null); // State to store the profile image
  const [editMode, setEditMode] = useState(false); // Toggle for enabling/disabling editing

  const handleRoleChange = (e) => {
    setIsProfessional(e.target.value === 'Professional');
  };

  const handleSkillAdd = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput]);
      setSkillInput(""); // Clear the skill input after adding
    }
  };

  const handleSkillRemove = (skill) => {
    setSkills(skills.filter((item) => item !== skill));
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setUserData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Store the image preview in state
      };
      reader.readAsDataURL(file); // Convert the file to a data URL
    }
  };

  return (
    <>
      <div className="container">
        <div className="side-nav-section">
          <NavBar />
        </div>
        <div className="main-section">
          <TopBar />
          <div className="component-section">
            <div className="profile-section">
              <h1 className="headname">#Profile</h1>
              <button
                className="edit-button"
                onClick={() => {
                  if (editMode) {
                    handleSaveChanges();
                  } else {
                    setEditMode(true);
                  }
                }}
              >
                {editMode ? "Save" : "Edit All"}
              </button>
              <div className="profile-sec-1">
                <div className="main-container">
                  {/* Left Section */}
                  <div className="left-sec">
                    <div className="profile-img">
                      {editMode ? (
                        <div className='edit-image-container'>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            id="image-upload"
                            className='image-upload'
                          />
                          {profileImage && <img className='editmode-img' src={profileImage} alt="Profile" />}
                        </div>
                      ) : (
                        <img
                          src={profileImage || '/default-avatar.png'} // Fallback image if no image is uploaded
                          alt="Profile"
                          className="profile-img-display"
                        />
                      )}
                    </div>
                    <div className="profile-bio">
                      <div className="editable-field">
                        <label className="bio-label">Username</label><br />
                        {editMode ? (
                          <input
                            className="bio-input"
                            value={userData.username}
                            onChange={(e) => handleInputChange(e, 'username')}
                          />
                        ) : (
                          <span>{userData.username}</span>
                        )}
                      </div>

                      <div className="editable-field">
                        <label className="bio-label">Email</label><br />
                        {editMode ? (
                          <input
                            className="bio-input"
                            value={userData.email}
                            onChange={(e) => handleInputChange(e, 'email')}
                          />
                        ) : (
                          <span>{userData.email}</span>
                        )}
                      </div>

                      <div className="editable-field">
                        <label className="bio-label">GitHub</label><br />
                        {editMode ? (
                          <input
                            className="bio-input"
                            value={userData.github}
                            onChange={(e) => handleInputChange(e, 'github')}
                          />
                        ) : (
                          <span>{userData.github}</span>
                        )}
                      </div>

                      <div className="editable-field">
                        <label className="bio-label">LinkedIn</label><br />
                        {editMode ? (
                          <input
                            className="bio-input"
                            value={userData.linkedin}
                            onChange={(e) => handleInputChange(e, 'linkedin')}
                          />
                        ) : (
                          <span>{userData.linkedin}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="right-sec">
                    <div className="editable-field">
                      <label className="bio-label2">Bio</label>
                      {editMode ? (
                        <textarea
                          className="text-area"
                          value={userData.bio}
                          onChange={(e) => handleInputChange(e, 'bio')}
                        />
                      ) : (
                        <div className='bio-area'><p className='bio-data'>{userData.bio}</p></div>
                      )}
                    </div>

                    <div className="editable-field">
                      <label className="bio-label2">Address</label>
                      <div className="address-section">
                        {editMode ? (
                          <>
                            <input
                              className="address-input"
                              placeholder="City"
                              value={userData.address.split(",")[0]}
                              onChange={(e) =>
                                handleInputChange(e, 'address')
                              }
                            />
                            <input
                              className="address-input"
                              placeholder="Country"
                              value={userData.address.split(",")[1]}
                              onChange={(e) =>
                                handleInputChange(e, 'address')
                              }
                            />
                          </>
                        ) : (
                          <span className="address-text">{userData.address}</span>
                        )}
                      </div>
                    </div>

                    <div className="editable-field">
                      <label className="bio-label2">Role</label>
                      {editMode ? (
                        <select
                          className="bio-input"
                          value={isProfessional ? "Professional" : "Student"}
                          onChange={handleRoleChange}
                        >
                          <option value="Professional">Professional</option>
                          <option value="Student">Student</option>
                        </select>
                      ) : (
                        <span>{isProfessional ? "Professional" : "Student"}</span>
                      )}
                    </div>

                    {/* Additional sections based on role */}
                    {isProfessional ? (
                      <div>
                        <div className="editable-field">
                          <label className="bio-label">Job Title</label>
                          {editMode ? (
                            <input
                              className="bio-input"
                              value={userData.jobTitle}
                              onChange={(e) => handleInputChange(e, 'jobTitle')}
                            />
                          ) : (
                            <span>{userData.jobTitle}</span>
                          )}
                        </div>

                        <div className="editable-field">
                          <label className="bio-label">Company</label>
                          {editMode ? (
                            <input
                              className="bio-input"
                              value={userData.company}
                              onChange={(e) => handleInputChange(e, 'company')}
                            />
                          ) : (
                            <span>{userData.company}</span>
                          )}
                        </div>

                        <div className="editable-field">
                          <label className="bio-label">Years of Experience</label>
                          {editMode ? (
                            <input
                              className="bio-input"
                              value={userData.experience}
                              onChange={(e) => handleInputChange(e, 'experience')}
                            />
                          ) : (
                            <span>{userData.experience}</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="editable-field">
                          <label className="bio-label">University</label>
                          {editMode ? (
                            <input
                              className="bio-input"
                              value={userData.university}
                              onChange={(e) => handleInputChange(e, 'university')}
                            />
                          ) : (
                            <span>{userData.university}</span>
                          )}
                        </div>

                        <div className="editable-field">
                          <label className="bio-label">Course</label>
                          {editMode ? (
                            <input
                              className="bio-input"
                              value={userData.course}
                              onChange={(e) => handleInputChange(e, 'course')}
                            />
                          ) : (
                            <span>{userData.course}</span>
                          )}
                        </div>

                        <div className="editable-field">
                          <label className="bio-label">Year of Study</label>
                          {editMode ? (
                            <input
                              className="bio-input"
                              value={userData.yearOfStudy}
                              onChange={(e) => handleInputChange(e, 'yearOfStudy')}
                            />
                          ) : (
                            <span>{userData.yearOfStudy}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Skills Section */}
                    <div className="editable-field">
                      <label className="bio-label">Skills</label>
                      {editMode ? (
                        <>
                          <input
                            className="bio-input"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                          />
                          <button onClick={handleSkillAdd}>Add Skill</button>
                        </>
                      ) : (
                        <div className="skills-list">
                          {skills.map((skill, index) => (
                            <div
                              className="skill-item"
                              key={index}
                              style={{ backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` }}
                              onClick={() => handleSkillRemove(skill)}
                            >
                              {skill}
                              {/* <img src = {cross} onClick={() => handleSkillRemove(skill)} className='remove-skill'></img> */}
                              {/* <button onClick={() => handleSkillRemove(skill)}>Remove</button> */}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
