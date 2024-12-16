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
} from 'antd';
import { 
  CopyOutlined, 
  ReloadOutlined, 
  SwapOutlined,
  UploadOutlined,
  FileImageOutlined,
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
  const [imageBase64, setImageBase64] = useState<string>('');
  const [svgBase64, setSvgBase64] = useState<string>('');
  const [pngDataUrl, setPngDataUrl] = useState<string>('');

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
      setImageBase64(reader.result as string);
    };
    return false; // 阻止自动上传
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
          setPngDataUrl(canvas.toDataURL('image/png'));
        }
      };
    };
    return false; // 阻止自动上传
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
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag image to convert to Base64</p>
              </Upload.Dragger>
              {imageBase64 && (
                <Card size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <img 
                      src={imageBase64} 
                      alt="Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px' }} 
                    />
                    <TextArea 
                      rows={4} 
                      value={imageBase64} 
                      readOnly 
                    />
                    <Button 
                      icon={<CopyOutlined />} 
                      onClick={() => copyToClipboard(imageBase64)}
                    >
                      Copy Base64
                    </Button>
                  </Space>
                </Card>
              )}
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
              >
                <p className="ant-upload-drag-icon">
                  <FileImageOutlined />
                </p>
                <p className="ant-upload-text">Click or drag SVG file to convert to PNG</p>
              </Upload.Dragger>
              {pngDataUrl && (
                <Card size="small">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <img 
                      src={pngDataUrl} 
                      alt="PNG Preview" 
                      style={{ maxWidth: '200px', maxHeight: '200px' }} 
                    />
                    <Button 
                      type="primary"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = 'converted.png';
                        link.href = pngDataUrl;
                        link.click();
                      }}
                    >
                      Download PNG
                    </Button>
                  </Space>
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