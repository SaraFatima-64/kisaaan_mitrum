import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [chatMessages, setChatMessages] = useState(null);
  const [activityLogs, setActivityLogs] = useState(null);
  const [chatbotInput, setChatbotInput] = useState('');
  const [activityDraft, setActivityDraft] = useState('');
  const [isActivityPopupOpen, setIsActivityPopupOpen] = useState(false);

  return (
    <UserContext.Provider value={{ 
      user, setUser, 
      chatMessages, setChatMessages, 
      activityLogs, setActivityLogs,
      chatbotInput, setChatbotInput,
      activityDraft, setActivityDraft,
      isActivityPopupOpen, setIsActivityPopupOpen
    }}>
      {children}
    </UserContext.Provider>
  );
};
