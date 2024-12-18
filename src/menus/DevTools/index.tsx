import { useState } from 'react';
import { 
  Button, 
  Card, 
  Space, 
  Typography, 
  Radio, 
  Tooltip, 
  Input, 
  message, 
  Tabs,
  Select,
  Upload,
  Row,
  Col,
  Alert
} from 'antd';
import { 
  CopyOutlined, 
  ReloadOutlined, 
  SwapOutlined,
  UploadOutlined,
  FileImageOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { v1, v4, v5, v3 } from 'uuid';

const { Title } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

// UUID Configurations
const uuidVersions = [
  {
    version: 'v1',
    generator: v1,
    description: 'Timestamp-based UUID. Generated using the current timestamp and node ID.'
  },
  {
    version: 'v4',
    generator: v4,
    description: 'Random UUID. Generated using random or pseudo-random numbers.'
  },
  {
    version: 'v3',
    generator: () => v3('example.com', v3.DNS),
    description: 'Name-based UUID using MD5 hashing.'
  },
  {
    version: 'v5',
    generator: () => v5('example.com', v5.DNS),
    description: 'Name-based UUID using SHA-1 hashing.'
  }
];

// Hash Functions
const hashFunctions = {
  md5: async (text: string) => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },
  sha1: async (text: string) => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  },
  sha256: async (text: string) => {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
};

function DevTools() {
  // UUID States
  const [selectedVersion, setSelectedVersion] = useState<string>('v4');
  const [generatedUuid, setGeneratedUuid] = useState<string>('');

  // Base64 States
  const [base64Input, setBase64Input] = useState<string>('');
  const [base64Output, setBase64Output] = useState<string>('');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');

  // Hash States
  const [hashInput, setHashInput] = useState<string>('');
  const [hashOutput, setHashOutput] = useState<string>('');
  const [selectedHash, setSelectedHash] = useState<keyof typeof hashFunctions>('md5');

  // URL States
  const [urlInput, setUrlInput] = useState<string>('');
  const [urlOutput, setUrlOutput] = useState<string>('');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  // Image to Base64 States
  const [imageResults, setImageResults] = useState<Array<{
    fileName: string;
    base64: string;
  }>>([]);

  const [svgResults, setSvgResults] = useState<Array<{
    fileName: string;
    pngUrl: string;
  }>>([]);

  // Base64 to Image States
  const [base64ToImageInput, setBase64ToImageInput] = useState<string>('');
  const [base64ToImageResult, setBase64ToImageResult] = useState<string>('');
  const [base64ToImageError, setBase64ToImageError] = useState<string>('');

  // UUID Functions
  const generateUuid = () => {
    const version = uuidVersions.find(v => v.version === selectedVersion);
    if (version) {
      setGeneratedUuid(version.generator());
    }
  };

  // Base64 Functions
  const handleBase64Convert = () => {
    try {
      if (base64Mode === 'encode') {
        setBase64Output(btoa(base64Input));
      } else {
        setBase64Output(atob(base64Input));
      }
    } catch (error) {
      message.error('Invalid input for conversion');
    }
  };

  // Hash Functions
  const handleHash = async () => {
    try {
      const result = await hashFunctions[selectedHash](hashInput);
      setHashOutput(result);
    } catch (error) {
      message.error('Error generating hash');
    }
  };

  // URL Functions
  const handleUrlConvert = () => {
    try {
      if (urlMode === 'encode') {
        setUrlOutput(encodeURIComponent(urlInput));
      } else {
        setUrlOutput(decodeURIComponent(urlInput));
      }
    } catch (error) {
      message.error('Invalid URL for conversion');
    }
  };

  // Common copy function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success('Copied to clipboard!');
  };

  // Image to Base64 Functions
  const handleImageToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageResults(prev => [...prev, {
        fileName: file.name,
        base64: reader.result as string
      }]);
    };
    return false;
  };

  const handleSvgToPng = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setSvgResults(prev => [...prev, {
            fileName: file.name,
            pngUrl: canvas.toDataURL('image/png')
          }]);
        }
      };
    };
    return false;
  };

  // Base64 to Image Functions
  const handleBase64ToImage = () => {
    try {
      // 验证输入是否为有效的 Base64 图片字符串
      if (!base64ToImageInput.startsWith('data:image/')) {
        throw new Error('Invalid image Base64 string. It should start with "data:image/"');
      }
      
      setBase64ToImageResult(base64ToImageInput);
      setBase64ToImageError('');
    } catch (error) {
      setBase64ToImageError((error as Error).message);
      setBase64ToImageResult('');
    }
  };

  return (
    <div>
      <Title level={2}>Developer Tools</Title>
      <Tabs defaultActiveKey="uuid">
        <TabPane tab="UUID Generator" key="uuid">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4}>Select UUID Version</Title>
                <Radio.Group 
                  value={selectedVersion} 
                  onChange={(e) => setSelectedVersion(e.target.value)}
                >
                  {uuidVersions.map((version) => (
                    <Tooltip key={version.version} title={version.description}>
                      <Radio.Button value={version.version}>
                        UUID {version.version}
                      </Radio.Button>
                    </Tooltip>
                  ))}
                </Radio.Group>
              </div>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />} 
                onClick={generateUuid}
              >
                Generate UUID
              </Button>
              {generatedUuid && (
                <Card size="small">
                  <Space>
                    <Input 
                      value={generatedUuid} 
                      readOnly 
                      style={{ width: '350px' }}
                    />
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(generatedUuid)}
                    >
                      Copy
                    </Button>
                  </Space>
                </Card>
              )}
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="Base64 Converter" key="base64">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Radio.Group 
                value={base64Mode} 
                onChange={(e) => setBase64Mode(e.target.value)}
              >
                <Radio.Button value="encode">Encode</Radio.Button>
                <Radio.Button value="decode">Decode</Radio.Button>
              </Radio.Group>
              <TextArea 
                rows={4} 
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Enter text to convert"
              />
              <Button 
                type="primary" 
                icon={<SwapOutlined />} 
                onClick={handleBase64Convert}
              >
                Convert
              </Button>
              {base64Output && (
                <Card size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <TextArea rows={4} value={base64Output} readOnly />
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(base64Output)}
                    >
                      Copy Result
                    </Button>
                  </Space>
                </Card>
              )}
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="Hash Generator" key="hash">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Select 
                value={selectedHash}
                onChange={setSelectedHash}
                style={{ width: 200 }}
              >
                <Select.Option value="md5">MD5</Select.Option>
                <Select.Option value="sha1">SHA-1</Select.Option>
                <Select.Option value="sha256">SHA-256</Select.Option>
              </Select>
              <TextArea 
                rows={4} 
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Enter text to hash"
              />
              <Button 
                type="primary" 
                onClick={handleHash}
              >
                Generate Hash
              </Button>
              {hashOutput && (
                <Card size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Input value={hashOutput} readOnly />
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(hashOutput)}
                    >
                      Copy Hash
                    </Button>
                  </Space>
                </Card>
              )}
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="URL Encoder/Decoder" key="url">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Radio.Group 
                value={urlMode} 
                onChange={(e) => setUrlMode(e.target.value)}
              >
                <Radio.Button value="encode">Encode</Radio.Button>
                <Radio.Button value="decode">Decode</Radio.Button>
              </Radio.Group>
              <TextArea 
                rows={4} 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter URL to encode/decode"
              />
              <Button 
                type="primary" 
                icon={<SwapOutlined />} 
                onClick={handleUrlConvert}
              >
                Convert
              </Button>
              {urlOutput && (
                <Card size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <TextArea rows={4} value={urlOutput} readOnly />
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(urlOutput)}
                    >
                      Copy Result
                    </Button>
                  </Space>
                </Card>
              )}
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="Image to Base64" key="image">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Upload.Dragger
                accept="image/*"
                beforeUpload={handleImageToBase64}
                showUploadList={false}
                multiple={true}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag images to convert to Base64</p>
                <p className="ant-upload-hint">Support for multiple images</p>
              </Upload.Dragger>
              
              {imageResults.length > 0 && (
                <Button 
                  type="primary" 
                  danger 
                  onClick={() => setImageResults([])}
                  style={{ marginBottom: 16 }}
                >
                  Clear All Results
                </Button>
              )}

              <Row gutter={[16, 16]}>
                {imageResults.map((result, index) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={6} key={index}>
                    <Card 
                      size="small"
                      title={result.fileName}
                      extra={
                        <Button 
                          type="text" 
                          icon={<CloseOutlined />} 
                          onClick={() => {
                            setImageResults(prev => prev.filter((_, i) => i !== index));
                          }}
                        />
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ 
                          height: '200px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: '#f5f5f5',
                          borderRadius: '4px',
                          padding: '8px'
                        }}>
                          <img 
                            src={result.base64} 
                            alt={`Preview ${index + 1}`} 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%', 
                              objectFit: 'contain' 
                            }} 
                          />
                        </div>
                        <TextArea 
                          rows={3} 
                          value={result.base64} 
                          readOnly 
                        />
                        <Button 
                          icon={<CopyOutlined />} 
                          onClick={() => copyToClipboard(result.base64)}
                          block
                        >
                          Copy Base64
                        </Button>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="SVG to PNG" key="svg">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Upload.Dragger
                accept=".svg"
                beforeUpload={handleSvgToPng}
                showUploadList={false}
                multiple={true}
              >
                <p className="ant-upload-drag-icon">
                  <FileImageOutlined />
                </p>
                <p className="ant-upload-text">Click or drag SVG files to convert to PNG</p>
                <p className="ant-upload-hint">Support for multiple SVG files</p>
              </Upload.Dragger>

              {svgResults.length > 0 && (
                <Button 
                  type="primary" 
                  danger 
                  onClick={() => setSvgResults([])}
                  style={{ marginBottom: 16 }}
                >
                  Clear All Results
                </Button>
              )}

              <Row gutter={[16, 16]}>
                {svgResults.map((result, index) => (
                  <Col xs={24} sm={12} md={8} lg={8} xl={6} key={index}>
                    <Card 
                      size="small"
                      title={result.fileName}
                      extra={
                        <Button 
                          type="text" 
                          icon={<CloseOutlined />} 
                          onClick={() => {
                            setSvgResults(prev => prev.filter((_, i) => i !== index));
                          }}
                        />
                      }
                    >
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div style={{ 
                          height: '200px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: '#f5f5f5',
                          borderRadius: '4px',
                          padding: '8px'
                        }}>
                          <img 
                            src={result.pngUrl} 
                            alt={`PNG Preview ${index + 1}`} 
                            style={{ 
                              maxWidth: '100%', 
                              maxHeight: '100%', 
                              objectFit: 'contain' 
                            }} 
                          />
                        </div>
                        <Space.Compact block>
                          <Button 
                            type="primary"
                            style={{ width: '60%' }}
                            onClick={() => {
                              const link = document.createElement('a');
                              link.download = `${result.fileName.replace('.svg', '')}.png`;
                              link.href = result.pngUrl;
                              link.click();
                            }}
                          >
                            Download PNG
                          </Button>
                          <Button 
                            icon={<CopyOutlined />}
                            style={{ width: '40%' }}
                            onClick={() => copyToClipboard(result.pngUrl)}
                          >
                            Copy URL
                          </Button>
                        </Space.Compact>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="Base64 to Image" key="base64ToImage">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <TextArea 
                rows={6} 
                value={base64ToImageInput}
                onChange={(e) => {
                  setBase64ToImageInput(e.target.value);
                  setBase64ToImageError('');
                  setBase64ToImageResult('');
                }}
                placeholder="Paste Base64 image string here..."
                status={base64ToImageError ? 'error' : ''}
              />
              
              {base64ToImageError && (
                <Alert 
                  message="Error" 
                  description={base64ToImageError} 
                  type="error" 
                  showIcon 
                />
              )}

              <Space>
                <Button 
                  type="primary"
                  onClick={handleBase64ToImage}
                  disabled={!base64ToImageInput}
                >
                  Convert to Image
                </Button>
                <Button 
                  onClick={() => {
                    setBase64ToImageInput('');
                    setBase64ToImageResult('');
                    setBase64ToImageError('');
                  }}
                  disabled={!base64ToImageInput}
                >
                  Clear
                </Button>
              </Space>

              {base64ToImageResult && (
                <Card 
                  size="small"
                  title="Result"
                  extra={
                    <Button 
                      type="primary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = 'image.' + base64ToImageResult.split(';')[0].split('/')[1];
                        link.href = base64ToImageResult;
                        link.click();
                      }}
                    >
                      Download Image
                    </Button>
                  }
                >
                  <div style={{ 
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                    padding: '16px',
                    background: '#f5f5f5',
                    textAlign: 'center'
                  }}>
                    <img 
                      src={base64ToImageResult} 
                      alt="Converted" 
                      style={{ 
                        maxWidth: '100%',
                        maxHeight: '400px',
                        objectFit: 'contain'
                      }} 
                    />
                  </div>
                </Card>
              )}
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default DevTools; 