import React, { useEffect, useState } from 'react'
import TopBar from './TopBar'
import NavBar from './NavBar'
import './Dashboard.css'
import checkmark from '../assets/check-mark.png'
import rise from '../assets/rise.png'
import loading from '../assets/loading.png'
import all from '../assets/select-all.png'
import axios from 'axios'
import { Link } from 'react-router-dom'
import cross from '../assets/cross.png'

const Dashboard = () => {
  const date = new Date();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();

  const currentDate = `${month},${year}`;


  const [username, setusername] = useState(null);
  const [id, setid] = useState(null);

  const [members, setmember] = useState([{
    username: '',
    role: 'developer',
  }])

  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [role, setRole] = useState('developer');
  const [cliked, setClicked] = useState(false);

  const addmember = () => {
    setmember([...members, { username: '', role: 'developer' }])
  }

  const removeMember = (index) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setmember(newMembers);
  };

  const handleMemberChange = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setmember(updatedMembers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = {
      projectname: projectName,
      projectdescription: projectDescription,
      startDate,
      DueDate: dueDate,
      role,
      members,
    };
    // Now you can send this data to your backend
    setClicked(true);
    createProject();
    console.log(projectData);
  };

  async function createProject() {
    try {
      const projectData = {
        projectname: projectName,
        projectdescription: projectDescription,
        startDate,
        DueDate: dueDate,
        role,
        members,
      };
      const response = await axios.post('http://localhost:3003/project', projectData, { withCredentials: true }); // Axios POST request
      alert("Project created successfully");
      setClicked(false);
      setmember([{ username: '', role: 'developer' }]);
      setProjectName('');
      setProjectDescription('');
      setStartDate('');
      setDueDate('');
      setRole('developer');
    } catch (error) {
      console.log('There was a problem with the axios request:', error);
    }
  }

  async function fetchcookie() {
    try {
      const response = await axios.get('http://localhost:3000/cookie-parse', { withCredentials: true }); // Axios GET request
      setusername(response.data.decoded.userData.username);
      setid(response.data.decoded.userData.id);
      // console.log(response.data.decoded.userData); 
    } catch (error) {
      console.log('There was a problem with the axios request:', error);
    }
  }
  useEffect(() => {
    fetchcookie(); // Fetch cookie data when the component mounts
  }, []);


  // Function to fetch data from the backend
  const [Data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  useEffect(() => {
    if (id === null) return;
    const apiUrl = `http://localhost:3003/project/${id}`;
    let isMounted = true;
    setLoadingData(true);
    async function fetchData() {
      try {
        const response = await axios.get(apiUrl, { withCredentials: true }); // Axios GET request
        if (response.status === 200) {
          alert("Data fetched successfully");

          if (isMounted) {
            const projectData = Object.values(response.data);
            setData(projectData);
          }
          
        }
        else {
          alert("No projects found");
        }
      } catch (error) {
        console.log('There was a problem with the axios request:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (Array.isArray(Data)) {
    console.log('Data is an array');
  } else {
    console.log('Data is not an array');
  }
  const [completed, setcomplete] = useState(0);
  const [ongoing, setongoing] = useState(0);
  const [pending, setpending] = useState(0);

  useEffect(() => {
    if (Data) {
      const completedProjects = Data.filter((p) => {
        return p.projectStatus === 'completed';
      })
      const ongoingProjects = Data.filter((p) => {
        return p.projectStatus === 'ongoing';
      })
      const pendingProjects = Data.filter((p) => {
        return p.projectStatus === 'pending';
      })
      setcomplete(completedProjects.length);
      setongoing(ongoingProjects.length);
      setpending(pendingProjects.length);
    }
  }, [Data]);

  const length = Data ? Data.length : 0;

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  }

  const closeform = () => {
    setIsVisible(!isVisible);
  }

  const [statusfilter, setstatusfilter] = useState('completed');
  const [filterproject, setFilterProject] = useState([]);

  useEffect(() => {
    const handleStatusFilter = () => {
      if (statusfilter === 'all') {
        setFilterProject(Data);
      }
      else if (Data) {
        const filterproject = Data.filter((p) => {
          return p.projectStatus === statusfilter;
        })
        setFilterProject(filterproject);
      }
    }
    handleStatusFilter();
  }, [statusfilter, Data]);

  console.log(filterproject);

  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  // Load tasks from localStorage when the component mounts
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    console.log('Loaded tasks from localStorage:', storedTasks);
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks)); // Parse the stored tasks and set the state
    }
  }, []);

  // Save tasks to localStorage whenever the tasks array changes
  useEffect(() => {
    if (tasks.length > 0) {
      console.log('Saving tasks to localStorage:', tasks);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]); // Only save when the tasks array changes

  // Add a new task
  const addTask = () => {
    if (task.trim()) {
      const newTask = {
        id: Date.now(),
        text: task,
        done: false,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      setTask(''); // Clear the input field
    }
  };

  // Toggle task completion
  const toggleTaskDone = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  };

  // Remove a task
  const removeTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <>
      <div className="container">
        <div className='side-nav-section'>
          <NavBar />
        </div>
        <div className='main-section'>
          <TopBar />
          <div className='component-section'>
            <div className='Dashboard-section'>
              <div className='dash-first-sec'>
                <div className='dash-first-main'>
                  <div>
                    <h1 className='dash-heading'>Welcome {username}</h1>
                    <p className='dash-para'>Here is your dashboard.</p>
                  </div>
                  <div><button className='p-btn' onClick={toggleVisibility}>Create Project</button></div>
                </div>
                <div className='dash-project-div'>
                  <h1 className='dash-heading2'>Projects {currentDate}</h1>
                  <div className='dash-project-prog'>
                    <div className='completed'>
                      <h1 className='project-count'>{completed}</h1>
                      <div className='inner-p-div'>
                        <p className='project-tag'>Completed</p>
                        <span><img src={checkmark} alt='complete' className='check-icon'></img></span>
                      </div>
                    </div>
                    <div className='ongoing'>
                      <h1 className='project-count'>{ongoing}</h1>
                      <div className='inner-p-div'>
                        <p className='project-tag'>Ongoing</p>
                        <span><img src={rise} alt='complete' className='check-icon'></img></span>
                      </div>
                    </div>
                    <div className='pending'>
                      <h1 className='project-count'>{pending}</h1>
                      <div className='inner-p-div'>
                        <p className='project-tag'>Pending</p>
                        <span><img src={loading} alt='complete' className='check-icon'></img></span>
                      </div>
                    </div>
                    <div className='total'>
                      <h1 className='project-count'>{length}</h1>
                      <div className='inner-p-div'>
                        <p className='project-tag'>Total Projects</p>
                        <span><img src={all} alt='complete' className='check-icon'></img></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='filter-div'>
                  <button className='filter-btn-1' onClick={() => setstatusfilter('completed')}>Complete</button>
                  <button className='filter-div-btn' onClick={() => setstatusfilter('ongoing')}>Ongoing</button>
                  <button className='filter-div-btn' onClick={() => setstatusfilter('pending')}>Pending</button>
                  <button className='filter-div-btn' onClick={() => setstatusfilter('all')}>All</button>
                  <input type='search' placeholder='search' className='filter-div-search'></input>
                </div>
                <div className='all-project-list-div'>
                  {loadingData && filterproject ? (
                    // Show loading message while data is being fetched
                    <p className='statusofproject'>Loading projects...</p>) : (
                    filterproject.map((proj, index) => {
                      const colors = ['#ffcbf9', '#d7abff', '#adf8d7', '#96a0ff', '#bdfcc3', '#fff5ba', '#dcf3fa', '#f3b0a2', '#8fb9a2', '#f5c09b', '#d4e8db']
                      const randomColor = colors[index % colors.length];
                      return (
                        <div key={proj._id} className="project-item" style={{ backgroundColor: randomColor }}>
                          <h2 className='p-title'>{proj.projectname}</h2>
                          <p className='p-desc'>Description</p>
                          <p className='p-desc-2'>{proj.projectdescription}</p>
                          <p className='p-role'>Your Role : {proj.role}</p>
                          <p className='p-members'>Members : {(proj.members) ? proj.members.length : 0}</p>
                          <Link to=''><p className='p-see-more'>see project</p></Link>
                        </div>
                      )
                    })
                  )}
                </div>
                <div className='create-project-sec' style={{ visibility: isVisible ? 'visible' : 'hidden' }} >
                  <img src={cross} className='close-form-icon' onClick={closeform}></img>
                  <h1 className='create-project-heading'>Create New Project</h1>
                  <form className='create-project-form' onSubmit={handleSubmit}>
                    <label className='project-form-lable'>Project Name</label><br />
                    <input type='text' placeholder='Project Name' className='create-project-input' value={projectName} onChange={(e) => setProjectName(e.target.value)}></input><br />
                    <label className='project-form-lable'>Project Discription</label><br />
                    <input type='text' placeholder='Project Description' className='create-project-input' value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}></input><br />
                    <label className='project-form-lable'>Your Role</label><br />
                    <select className='create-project-input' value={role} onChange={(e) => setRole(e.target.value)}>
                      <option className='create-project-option' value='projectManager'>Project Manager</option>
                      <option className='create-project-option' value='developer'>Developer</option>
                    </select><br />
                    <label className='project-form-lable'>Members: </label><br />
                    {members.map((member, index) => (
                      <div key={index}>
                        <input
                          type="text"
                          placeholder="Username"
                          value={member.username}
                          className='create-project-input'
                          onChange={(e) =>
                            handleMemberChange(index, 'username', e.target.value)
                          }
                          required
                        /><br />
                        <select
                          className='create-project-input'
                          value={member.role}
                          onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                        >
                          <option value="projectManager" className='create-project-option'>Project Manager</option>
                          <option value="developer" className='create-project-option'>Developer</option>
                        </select>
                        <div className='members-btn'>
                          <button type="button" className='create-project-btn1' onClick={() => removeMember(index)}>
                            Remove Member
                          </button>
                          <button type="button" className='create-project-btn1' onClick={addmember}>
                            Add Member
                          </button>
                        </div>
                      </div>
                    ))}
                    <label className='project-form-lable'>start Date</label><br />
                    <input type="date" className='create-project-input' value={startDate} onChange={(e) => setStartDate(e.target.value)}></input><br />
                    <label className='project-form-lable'>End Date</label><br />
                    <input type="date" className='create-project-input' value={dueDate} onChange={(e) => setDueDate(e.target.value)}></input><br />
                    <button className='create-project-btn' type="submit">Create Project</button>
                  </form>
                </div>
              </div>
              <div className='dash-second-sec'>
                <input
                  className="add-task"
                  placeholder="Add task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                />
                <button className="add-task-btn" onClick={addTask}>Add Task</button>

                <div className="to-do-tasks-div">
                  {tasks.map((task) => (
                    <div key={task.id} className="inside-task-div">
                      <span style={{ textDecoration: task.done ? 'line-through' : 'none', color: 'black' }}>
                        {task.text}
                      </span>
                      <div className="tasks-btns">
                        <button className="task-done-btn" onClick={() => toggleTaskDone(task.id)}>
                          {task.done ? 'Undo' : 'Done'}
                        </button>
                        <button className="task-delete-btn" onClick={() => removeTask(task.id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
