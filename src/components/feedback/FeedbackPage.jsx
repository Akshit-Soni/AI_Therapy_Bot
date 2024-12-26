import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: currentUser.uid,
        rating,
        comment,
        timestamp: serverTimestamp(),
        sessionId: localStorage.getItem('lastSessionId')
      });
      navigate('/history');
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  return (
    <div className="feedback-container">
      <h2>How was your therapy session?</h2>
      <div className="rating-container">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            className={`star-btn ${star <= rating ? 'active' : ''}`}
            onClick={() => setRating(star)}
          >
            <i className="fas fa-star"></i>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Any additional feedback? (optional)"
      />
      <button className="submit-btn" onClick={handleSubmit}>
        Submit Feedback
      </button>
    </div>
  );
};

export default FeedbackPage; 