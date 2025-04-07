import {React , useState} from 'react'
import "./Topbar.css"
import { Link } from 'react-router-dom'
import axios from 'axios'
const TopBar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Function to handle PDF download
  const generateReport = async () => {
    try {
      const response = await axios.get('http://localhost:3003/api/reports/generate-employee-report', { responseType: 'blob' });

      // Create a URL for the generated PDF and download it
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', 'Employee_Report.pdf');
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);

    } catch (error) {
      console.error('Error generating report:', error);
      alert('There was an error generating the report.');
    }
  };

  const generateReport2 = async () => {
    try {
      const response = await axios.get('http://localhost:3003/api/reports/project-report', { responseType: 'blob' });

      // Create a URL for the generated PDF and download it
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', 'Project_Report.pdf');
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);

    } catch (error) {
      console.error('Error generating report:', error);
      alert('There was an error generating the report.');
    }
  };

  return (
    <>
    <div className='topbar-section'>
        <div className='topbar-inner-section'>
        <ul className='topbar-list'> 
        <Link to='/'><li className='topbar-item'>Home</li></Link>
        <li className='topbar-item'>About</li>
        <li className='topbar-item'>Contact</li>
        <Link to='/signin'><li className='topbar-item'>Login</li></Link>
        </ul>
        </div>
      </div>
    </>
  )
}

export default TopBar
