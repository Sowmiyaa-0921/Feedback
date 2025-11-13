import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [feedback, setFeedback] = useState({
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });
  const [allFeedbacks, setAllFeedbacks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback");
      setAllFeedbacks(res.data);
    } catch (err) {
      console.error("Error loading feedbacks:", err);
    }
  };

  const handleChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        await axios.put(`http://localhost:5000/api/feedback/${editIndex}`, feedback);
        alert("Feedback updated successfully!");
        setEditIndex(null);
      } else {
        await axios.post("http://localhost:5000/api/feedback", feedback);
        alert("Feedback submitted successfully!");
      }
      setFeedback({ q1: "", q2: "", q3: "", q4: "", q5: "" });
      fetchFeedbacks();
    } catch (error) {
      console.error("Error saving feedback:", error);
    }
  };

  const handleEdit = (index) => {
    const selected = allFeedbacks[index];
    setFeedback(selected);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback/${index}`);
        fetchFeedbacks();
      } catch (err) {
        console.error("Error deleting feedback:", err);
      }
    }
  };

  return (
    <div className="container">
      <h1>Feedback Form</h1>

      <form onSubmit={handleSubmit} className="feedback-form">
        <label>Name:</label>
        <input type="text" name="q1" value={feedback.q1} onChange={handleChange} required />
        <label>Department:</label>
        <input type="text" name="q2" value={feedback.q2} onChange={handleChange} required />
        <label>Session Title:</label>
        <input type="text" name="q3" value={feedback.q3} onChange={handleChange} required />
        <label>Feedback:</label>
        <input type="text" name="q4" value={feedback.q4} onChange={handleChange} required />
        <label>Suggestions:</label>
        <input type="text" name="q5" value={feedback.q5} onChange={handleChange} />

        <button type="submit">{editIndex !== null ? "Update" : "Submit"}</button>
      </form>

      <h2>All Feedbacks</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Session</th>
            <th>Feedback</th>
            <th>Suggestions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allFeedbacks.length === 0 ? (
            <tr><td colSpan="6">No feedback yet</td></tr>
          ) : (
            allFeedbacks.map((fb, index) => (
              <tr key={index}>
                <td>{fb.q1}</td>
                <td>{fb.q2}</td>
                <td>{fb.q3}</td>
                <td>{fb.q4}</td>
                <td>{fb.q5}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(index)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(index)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
