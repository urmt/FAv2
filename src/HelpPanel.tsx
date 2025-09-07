import React from 'react';

const HelpPanel: React.FC = () => {
  const handleGetHelp = () => {
    console.log("Get Help button clicked");
    // Add your help logic here (e.g., show a modal or fetch data)
    alert("Help is on the way!"); // Temporary placeholder
  };

  return (
    <div className="p-4 fixed bottom-4 right-4 bg-gray-200 rounded-lg shadow-lg">
    <button onClick={handleGetHelp} className="bg-blue-500 text-white p-2 rounded">
    Get Help
    </button>
    </div>
  );
};

export default HelpPanel;
