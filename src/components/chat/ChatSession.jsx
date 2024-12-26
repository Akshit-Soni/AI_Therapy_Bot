import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { useAuth } from '../../contexts/AuthContext';
import mistralService from '../../services/mistralService';
import './ChatSession.css';
import { isSessionExpired } from '../../utils/sessionUtils';
import voiceService from '../../services/voiceService';
import { formatTime } from '../../utils/dateUtils';
import { startNewSession } from '../../services/chatService';

const ChatSession = () => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [error, setError] = useState(null);
  const [initError, setInitError] = useState(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const [sessionExpired, setSessionExpired] = useState(false);
  
  const { currentUser } = useAuth();
  const { 
    currentSessionId, 
    setCurrentSessionId,
    endSession, 
    addMessageToSession,
    sessions,
    loading: sessionsLoading 
  } = useSession();

  const currentSession = currentSessionId 
    ? sessions.find(s => s.id === currentSessionId)
    : null;
  const messages = currentSession?.messages || [];

  // Initialize chat when component mounts
  useEffect(() => {
    let mounted = true;
    let sessionCreationAttempted = false;

    const initChat = async () => {
        if (isCreatingSession || sessionCreationAttempted) {
        return;
        }

        try {
        if (!currentUser) {
          throw new Error('Please log in to start a chat session');
        }

        if (sessionsLoading) {
          return;
        }

        const activeSession = sessions.find(s => s.status === 'active' && s.userId === currentUser.uid);
        if (activeSession) {
          if (mounted) {
          setCurrentSessionId(activeSession.id);
          setIsInitializing(false);
          }
          return;
        }

        if (!currentSessionId && mounted) {
          setIsCreatingSession(true);
          sessionCreationAttempted = true;

          try {
          const newSessionId = await startNewSession(currentUser.uid);
          if (!newSessionId) {
            throw new Error('Failed to create new session');
          }
          
          if (mounted) {
            setCurrentSessionId(newSessionId);
            
            const initialMessage = await mistralService.initializeChat();
            await addMessageToSession(newSessionId, {
            text: initialMessage,
            sender: 'ai',
            timestamp: new Date().toISOString(),
            status: 'received'
            });
          }

          } catch (error) {
            console.error('Error in session creation:', error);
            if (mounted) {
              setInitError('Failed to create new session. Please try again.');
            }
          } finally {
            if (mounted) {
              setIsCreatingSession(false);
            }
          }
        }
      } catch (error) {
        console.error('Error in chat initialization:', error);
        if (mounted) {
          setInitError(error.message || 'Failed to initialize chat. Please try again.');
        }
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    };

    if (currentUser && !sessionsLoading && !isCreatingSession) {
      initChat();
    }

    return () => {
      mounted = false;
      sessionCreationAttempted = true;
    };
  }, [currentUser, currentSessionId, sessionsLoading, sessions, isCreatingSession, setCurrentSessionId, addMessageToSession]);

    // Auto-scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (currentSession && isSessionExpired(currentSession)) {
      setSessionExpired(true);
      handleEndSession('expired');
    }
  }, [currentSession]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isSending || !currentSessionId) {
      return;
    }
    
    setIsSending(true);
    setIsLoading(true);

    const messageText = inputText;
    setInputText('');

    try {
      const userMessage = {
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sent'
      };
      await addMessageToSession(currentSessionId, userMessage);

      const aiResponse = await mistralService.sendMessage(messageText);
      
      const aiMessage = {
      text: aiResponse,
      sender: 'ai',
      timestamp: new Date().toISOString(),
      status: 'received'
      };
      await addMessageToSession(currentSessionId, aiMessage);


    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = {
        text: "I apologize, but I'm having trouble responding right now. Please try again.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
        isError: true,
        status: 'error'
      };
      await addMessageToSession(currentSessionId, errorMessage);
    } finally {
      setIsSending(false);
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    try {
      await mistralService.endChat();
      await endSession(currentSessionId);
      navigate('/feedback');
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      voiceService.startListening(
        (transcript) => {
          setInputText(transcript);
          setIsRecording(false);
          handleSendMessage(transcript);
        },
        (error) => {
          console.error('Voice input error:', error);
          setIsRecording(false);
        }
      );
    } else {
      setIsRecording(false);
      voiceService.stopListening();
    }
  };

  // Add voice output for AI responses
  const handleAIResponse = async (response) => {
    voiceService.speak(response);
  };

  if (error || initError) {
    return (
      <div className="chat-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <h3>Chat Error</h3>
          <p>{error || initError}</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()}>
              <i className="fas fa-sync"></i>
              Try Again
            </button>
            <button onClick={() => navigate('/')}>
              <i className="fas fa-home"></i>
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="chat-container">
        <div className="chat-loading">
          <div className="loading-spinner"></div>
          <p>Initializing chat session...</p>
        </div>
      </div>
    );
  }

  if (sessionExpired) {
    return (
      <div className="chat-container">
        <div className="session-expired">
          <i className="fas fa-clock"></i>
          <h3>Session Expired</h3>
          <p>This chat session has expired due to inactivity.</p>
          <button onClick={() => navigate('/chat')}>Start New Session</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="session-info">
          <i className="fas fa-comments"></i>
          <h3>Session #{currentSession?.sessionNumber || 'N/A'}</h3>
        </div>
        <button 
          className="end-session-btn"
          onClick={() => setShowEndDialog(true)}
        >
          <i className="fas fa-times"></i>
          <span>End Session</span>
        </button>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div 
            key={`${message.timestamp}-${index}`}
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-icon">
              <i className={`fas ${message.sender === 'user' ? 'fa-user' : 'fa-robot'}`}></i>
            </div>
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-timestamp">
                {formatTime(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message loading">
            <div className="message-icon">
              <i className="fas fa-robot"></i>
            </div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <button 
          className={`action-btn emoji-btn`}
          title="Choose emoji"
        >
          <i className="far fa-smile"></i>
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          className={`action-btn voice-btn ${isRecording ? 'recording' : ''}`}
          onClick={handleVoiceInput}
          title={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <i className="fas fa-microphone"></i>
        </button>
        <button 
          className="action-btn send-btn" 
          onClick={handleSendMessage}
          disabled={!inputText.trim() || isLoading}
          title="Send message"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>

      {showEndDialog && (
        <div className="end-session-dialog">
          <div className="dialog-content">
            <i className="fas fa-exclamation-circle"></i>
            <h4>End Session?</h4>
            <p>Are you sure you want to end this session?</p>
            <div className="dialog-buttons">
              <button onClick={handleEndSession}>
                <i className="fas fa-check"></i>
                Yes, End Session
              </button>
              <button onClick={() => setShowEndDialog(false)}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSession; 