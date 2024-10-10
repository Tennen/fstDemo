import React, { useState, useEffect } from 'react';
import Viewer from 'some_doc_viewers';
import 'some_doc_viewers/dist/index.css';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const handleFileUpload = (fileType: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = `.${fileType}`;
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        setFileType(fileType);
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        console.log(`Selected ${fileType.toUpperCase()} file:`, file.name);
        console.log('File URL:', url);
      }
    };
    input.click();
  };

  useEffect(() => {
    // Clean up the object URL when the component unmounts or when a new file is selected
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <div className="App">
      <h1>File Upload Buttons</h1>
      <div className="button-container">
        <button onClick={() => handleFileUpload('xlsx')}>Upload XLSX</button>
        <button onClick={() => handleFileUpload('pptx')}>Upload PPTX</button>
        <button onClick={() => handleFileUpload('pdf')}>Upload PDF</button>
        <button onClick={() => handleFileUpload('docx')}>Upload DOCX</button>
      </div>
      {selectedFile && (
        <div>
          <p>Selected file: {selectedFile.name}</p>
          {fileUrl && fileType && (
            <Viewer fileUrl={fileUrl} fileType={fileType} />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
