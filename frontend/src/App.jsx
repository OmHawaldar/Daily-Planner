import React, { useState, useEffect } from 'react';
import '../index.css';
import { backend } from 'declarations/backend';

const App = () => {
  const [donorName, setDonorName] = useState('');
  const [donorBloodGroup, setDonorBloodGroup] = useState('');
  const [donorAge, setDonorAge] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donorMedicalHistory, setDonorMedicalHistory] = useState('');
  const [donorMessage, setDonorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [donors, setDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllDonors();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      fetchAllDonors();
    }
  }, [searchQuery]);

  const fetchAllDonors = async () => {
    setLoading(true);
    try {
      const donorList = await backend.getAllDonors();
      setDonors(donorList);
    } catch (error) {
      console.error('Error fetching donors:', error);
    }
    setLoading(false);
  };

  const handleAddDonor = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      await backend.addDonor(
        donorName,
        donorBloodGroup,
        parseInt(donorAge),
        donorPhone,
        donorMedicalHistory
      );
      clearForm();
      setDonorMessage('Donor added successfully');
      await fetchAllDonors();
    } catch (error) {
      setDonorMessage(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const validateFields = () => {
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    if (donorName.length < 3) {
      setDonorMessage('Name must be at least 3 characters');
      return false;
    }
    if (!validBloodGroups.includes(donorBloodGroup)) {
      setDonorMessage('Invalid blood group');
      return false;
    }
    if (parseInt(donorAge) < 18 || parseInt(donorAge) > 65) {
      setDonorMessage('Age must be between 18-65');
      return false;
    }
    if (!/^\d{10}$/.test(donorPhone)) {
      setDonorMessage('Phone must be 10 digits');
      return false;
    }
    return true;
  };

  const clearForm = () => {
    setDonorName('');
    setDonorBloodGroup('');
    setDonorAge('');
    setDonorPhone('');
    setDonorMedicalHistory('');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await backend.searchDonorsByText(searchQuery);
      setDonors(results);
    } catch (error) {
      console.error('Search failed:', error);
      setDonors([]);
    }
    setLoading(false);
  };

  return (
    <div id="root">
      <h1>Blood Donor Registry</h1>

      <div className="donor-form">
        <h2>Register New Donor</h2>
        <input
          type="text"
          placeholder="Full Name"
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
        />
        <select
          value={donorBloodGroup}
          onChange={(e) => setDonorBloodGroup(e.target.value)}
        >
          <option value="">Select Blood Group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
        <input
          type="number"
          placeholder="Age"
          min="18"
          max="65"
          value={donorAge}
          onChange={(e) => setDonorAge(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone Number (10 digits)"
          pattern="[0-9]{10}"
          value={donorPhone}
          onChange={(e) => setDonorPhone(e.target.value)}
        />
        <textarea
          placeholder="Medical History"
          value={donorMedicalHistory}
          onChange={(e) => setDonorMedicalHistory(e.target.value)}
        />
        <button onClick={handleAddDonor}>Register Donor</button>
        {donorMessage && <div className="message">{donorMessage}</div>}
      </div>

      <div className="search-section">
        <h2>Search Donors</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button 
            onClick={() => setSearchQuery('')}
            className="clear-btn"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="donor-list">
        <h2>Donor Records ({donors.length})</h2>
        {donors.length === 0 ? (
          <p>No donors found{searchQuery && ` for "${searchQuery}"`}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Blood Group</th>
                <th>Age</th>
                <th>Phone</th>
                <th>Medical History</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr key={index}>
                  <td>{donor.name}</td>
                  <td>{donor.bloodGroup}</td>
                  <td>{donor.age}</td>
                  <td>{donor.phone}</td>
                  <td>{donor.medicalHistory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {loading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default App;
