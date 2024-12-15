import React, { useState } from 'react';
import HashTable from './components/HashTable';

const App = () => {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [hashTableData, setHashTableData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map((row) => row.split(';'));
        setHashTableData(rows);
        setFileUploaded(true);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fffde6] text-black font-montserrat">
      {!fileUploaded ? (
        <div className="p-6 bg-[#f9e532] rounded-lg shadow-lg text-center border border-[#f7d22c]">
          <h1 className="text-3xl font-bold mb-4">Загрузите файл</h1>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="file-input w-full max-w-xs border border-[#f7d22c] text-black bg-[#faec70] hover:bg-[#f9e532] transition cursor-pointer"
          />
        </div>
      ) : (
        <HashTable data={hashTableData} />
      )}
    </div>
  );
};

export default App;
