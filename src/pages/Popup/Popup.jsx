import React from 'react';
import './Popup.css';

const Popup = () => {
  return (
    <div className="popup-container">
      <header className="popup-header">
        <h1>Welcome to Coursera Helper</h1>
      </header>
      
      <main className="popup-content">
        <section className="feature-section">
          <h2>Quick Features:</h2>
          <ul>
            <li>
              <strong>Quick Extract</strong> - Look for the extract button next to "Save note"
            </li>
            <li>
              <strong>Sidebar Tools</strong> - Click the tab on the right edge of your screen
            </li>
            <li>
              <strong>Batch Extract</strong> - Extract all transcripts from a course section at once
            </li>
          </ul>
        </section>

        <section className="getting-started">
          <h2>Getting Started</h2>
          <p>Navigate to any Coursera course and look for the sidebar toggle on the right edge of your screen.</p>
        </section>
      </main>

      <footer className="popup-footer">
        <p>Happy Learning! 📚</p>
      </footer>
    </div>
  );
};

export default Popup;
