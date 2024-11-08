import React, { useState, useEffect } from 'react';
import { Button, Space, Typography, Card } from 'antd';
import { FileTextOutlined, FilePdfOutlined, FileExcelOutlined, FileWordOutlined } from '@ant-design/icons';
import Viewer from 'some_doc_viewers';
import 'some_doc_viewers/dist/index.css';

const { Title } = Typography;

function FileViewerDemo() {
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
      }
    };
    input.click();
  };

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  return (
    <div>
      <Title level={2}>File Viewer Demo</Title>
      <Card>
        <Space size="middle">
          <Button icon={<FileExcelOutlined />} onClick={() => handleFileUpload('xlsx')}>
            Upload XLSX
          </Button>
          <Button icon={<FileTextOutlined />} onClick={() => handleFileUpload('pptx')}>
            Upload PPTX
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={() => handleFileUpload('pdf')}>
            Upload PDF
          </Button>
          <Button icon={<FileWordOutlined />} onClick={() => handleFileUpload('docx')}>
            Upload DOCX
          </Button>
        </Space>
      </Card>

      {selectedFile && (
        <Card style={{ marginTop: 16 }}>
          <Typography.Text>Selected file: {selectedFile.name}</Typography.Text>
          {fileUrl && fileType && (
            <div style={{ marginTop: 16 }}>
              <Viewer fileUrl={fileUrl} fileType={fileType} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default FileViewerDemo; 