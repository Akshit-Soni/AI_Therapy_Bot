import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const FeedbackStats = () => {
  const [feedbackStats, setFeedbackStats] = useState({
    averageRating: 0,
    totalFeedback: 0,
    ratingDistribution: [],
    recentFeedback: []
  });

  useEffect(() => {
    const fetchFeedbackStats = async () => {
      try {
        const feedbackRef = collection(db, 'feedback');
        const feedbackSnapshot = await getDocs(feedbackRef);
        
        let totalRating = 0;
        const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        const recent = [];

        feedbackSnapshot.forEach(doc => {
          const feedback = doc.data();
          totalRating += feedback.rating;
          ratings[feedback.rating] = (ratings[feedback.rating] || 0) + 1;
          
          recent.push({
            id: doc.id,
            ...feedback,
            timestamp: feedback.timestamp?.toDate()
          });
        });

        const total = feedbackSnapshot.size;
        const average = total > 0 ? totalRating / total : 0;

        setFeedbackStats({
          averageRating: average.toFixed(1),
          totalFeedback: total,
          ratingDistribution: Object.entries(ratings).map(([rating, count]) => ({
            rating: Number(rating),
            count
          })),
          recentFeedback: recent.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5)
        });

      } catch (error) {
        console.error('Error fetching feedback stats:', error);
      }
    };

    fetchFeedbackStats();
  }, []);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Feedback Analytics</h2>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{feedbackStats.averageRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{feedbackStats.totalFeedback}</div>
          <div className="stat-label">Total Feedback</div>
        </div>
      </div>

      <div className="stats-charts">
        <div className="chart-container">
          <h3>Rating Distribution</h3>
          <BarChart width={600} height={300} data={feedbackStats.ratingDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rating" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Number of Ratings" />
          </BarChart>
        </div>
      </div>

      <div className="recent-feedback">
        <h3>Recent Feedback</h3>
        <div className="feedback-list">
          {feedbackStats.recentFeedback.map(feedback => (
            <div key={feedback.id} className="feedback-item">
              <div className="feedback-header">
                <div className="rating">{'★'.repeat(feedback.rating)}{'☆'.repeat(5-feedback.rating)}</div>
                <div className="timestamp">{feedback.timestamp?.toLocaleDateString()}</div>
              </div>
              {feedback.comment && (
                <div className="comment">{feedback.comment}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackStats; 