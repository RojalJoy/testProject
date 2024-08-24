import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import './ResumePage.css';

const ResumePage = () => {
  const [candidateDetails, setCandidateDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [jobLink, setJobLink] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith('.pdf')) {
        setErrorMessage('Please upload a PDF document.');
        return;
      }

      setErrorMessage('');
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
        const text = await extractTextFromPDF(pdfDoc);
        extractDetails(text);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const extractTextFromPDF = async (pdfDoc) => {
    let text = '';
    for (let i = 0; i < pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i + 1);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      text += pageText + ' ';
    }
    return text;
  };

  const extractDetails = (text) => {
    const lines = text.split('\n').map(line => line.trim());

    let name = 'N/A';
    for (let line of lines) {
      if (/^[A-Z][a-z]*\s[A-Z][a-z]*$/.test(line)) {
        name = line;
        break;
      }
    }

    const qualificationMatch = text.match(/(Bachelor|Master|B\.Sc|M\.Sc|B\.Tech|M\.Tech|PhD|Doctor of Philosophy) [\w\s]+/);
    const qualification = qualificationMatch ? qualificationMatch[0] : 'N/A';

    const skillsetMatch = text.match(/Skills:?([\s\S]*?)(?=\n|\.)/i);
    const skillset = skillsetMatch ? skillsetMatch[1].trim().replace(/\n/g, ', ') : 'N/A';

    const experienceMatch = text.match(/(\d+ years of experience|Experience in [\w\s,]+)/i);
    const experience = experienceMatch ? experienceMatch[0].trim() : 'N/A';

    setCandidateDetails({
      name,
      qualification,
      skillset,
      experience,
    });

    const suggestedJobRoles = getSuggestedJobRoles(qualification, skillset);
    setJobRoles(suggestedJobRoles);
  };

  const getSuggestedJobRoles = (qualification, skillset) => {
    const roles = [];

    if (qualification.includes('Computer') && skillset.includes('Programming')) {
      roles.push('Software Engineer', 'Web Developer', 'Backend Developer', 'Frontend Developer', 'Full Stack Developer');
    }
    if (qualification.includes('Engineering') && skillset.includes('Project Management')) {
      roles.push('Project Manager', 'Technical Lead', 'Engineering Manager');
    }
    if (skillset.includes('Data')) {
      roles.push('Data Analyst', 'Data Scientist', 'Machine Learning Engineer', 'Data Engineer');
    }
    if (skillset.includes('Cloud')) {
      roles.push('Cloud Architect', 'Cloud Engineer', 'DevOps Engineer');
    }

    return [...new Set(roles)];
  };

  const handleRoleChange = (e) => {
    const selected = e.target.value;
    setSelectedRole(selected);

    // Generate a link based on the selected job role
    let link = '';
    switch (selected) {
      case 'Software Engineer':
      case 'Backend Developer':
      case 'Full Stack Developer':
        link = 'https://github.com';
        break;
      case 'Data Scientist':
      case 'Machine Learning Engineer':
        link = 'https://www.kaggle.com';
        break;
      case 'Cloud Engineer':
      case 'DevOps Engineer':
        link = 'https://aws.amazon.com';
        break;
      default:
        link = 'https://www.linkedin.com';
        break;
    }

    setJobLink(link);
  };

  return (
    <div className="resume-container">
      <h1>Resume Upload</h1>
      <div className="upload-section">
        <input type="file" id="resume-upload" onChange={handleFileUpload} accept="application/pdf" />
        <button className="submit-button">Submit</button>
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {candidateDetails && (
        <div className="candidate-details">
          <h3>Candidate Details:</h3>
          <table>
            <tbody>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{candidateDetails.name}</td>
              </tr>
              <tr>
                <td><strong>Qualification:</strong></td>
                <td>{candidateDetails.qualification}</td>
              </tr>
              <tr>
                <td><strong>Skillset:</strong></td>
                <td>{candidateDetails.skillset}</td>
              </tr>
              <tr>
                <td><strong>Experience:</strong></td>
                <td>{candidateDetails.experience}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="job-role-section">
        <label htmlFor="job-role">Select Job Role:</label>
        <select id="job-role" onChange={handleRoleChange}>
          {jobRoles.map((role, index) => (
            <option key={index} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {jobLink && (
        <div className="job-link-section">
          <a href={jobLink} target="_blank" rel="noopener noreferrer">
            Go to {selectedRole} Resources
          </a>
        </div>
      )}
    </div>
  );
};

export default ResumePage;
