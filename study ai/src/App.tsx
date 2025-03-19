import React, { useState, useRef } from 'react';
import { 
  Brain, 
  Menu, 
  FileText, 
  BarChart as FlowChart, 
  Car as Flashcards, 
  Calendar, 
  HelpCircle, 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  ChevronDown,
  Upload,
  X,
  MessageSquare,
  Send,
  Bot
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type Message = {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
};

function App() {
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState('notes');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const modes = [
    { id: 'notes', name: 'Smart Notes', icon: FileText },
    { id: 'flowchart', name: 'Flowchart', icon: FlowChart },
    { id: 'flashcards', name: 'Flashcards', icon: Flashcards },
    { id: 'timetable', name: 'Timetable', icon: Calendar },
    { id: 'questions', name: 'Questions', icon: HelpCircle },
    { id: 'exams', name: 'Custom Exams', icon: GraduationCap },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Check file type
      const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only .txt, .pdf, and .doc/.docx files are supported');
      }

      // Read file content
      const text = await readFileContent(file);
      setInputText(text);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result;
        resolve(text as string);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: chatInput.trim(),
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setChatInput('');
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help you with your studies! What would you like to know?",
        type: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll chat to bottom when new messages arrive
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize chat input
  React.useEffect(() => {
    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
      chatInputRef.current.style.height = `${chatInputRef.current.scrollHeight}px`;
    }
  }, [chatInput]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">StudyAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600">Premium</a>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Sign Up
              </button>
            </div>
            <div className="md:hidden">
              <Menu className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        {/* Mode Selection */}
        <div className="flex overflow-x-auto py-4 gap-2 border-b scrollbar-hide">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeMode === mode.id
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {mode.name}
              </button>
            );
          })}
        </div>

        {/* Main Editor */}
        <div className="grid md:grid-cols-2 gap-6 py-6">
          {/* Input Section */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Input Text</h2>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.pdf,.doc,.docx"
                  className="hidden"
                />
                <button 
                  onClick={handleUploadClick}
                  className="text-gray-600 hover:text-primary-600 text-sm flex items-center transition-colors"
                  disabled={isUploading}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload File
                </button>
              </div>
            </div>
            
            {uploadError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                <span className="text-red-600 text-sm">{uploadError}</span>
                <button 
                  onClick={() => setUploadError('')}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isUploading ? 'Loading file content...' : 'Paste your text here or upload a file...'}
              className="flex-grow p-4 border rounded-lg resize-none min-h-[400px] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              disabled={isUploading}
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {inputText.length} characters
              </div>
              <button
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 flex items-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => {/* Handle conversion */}}
                disabled={isUploading || !inputText.trim()}
              >
                Convert
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">AI Output</h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className={twMerge(
                    "text-gray-600 hover:text-primary-600 text-sm flex items-center transition-colors",
                    isChatOpen && "text-primary-600"
                  )}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Chat
                </button>
                <button className="text-gray-600 hover:text-primary-600 text-sm flex items-center transition-colors">
                  Copy <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            <div className="flex-grow p-4 border rounded-lg min-h-[400px] bg-white shadow-sm">
              {isChatOpen ? (
                <div className="h-full flex flex-col">
                  {/* Chat Messages */}
                  <div 
                    ref={chatContainerRef}
                    className="flex-grow overflow-y-auto mb-4 space-y-4"
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={twMerge(
                          "flex items-start gap-2 max-w-[80%]",
                          message.type === 'assistant' ? "mr-auto" : "ml-auto flex-row-reverse"
                        )}
                      >
                        {message.type === 'assistant' && (
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-5 h-5 text-primary-600" />
                          </div>
                        )}
                        <div
                          className={twMerge(
                            "rounded-lg p-3",
                            message.type === 'assistant' 
                              ? "bg-white border border-gray-200" 
                              : "bg-primary-600 text-white"
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary-600" />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-3">
                          Thinking...
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Chat Input */}
                  <div className="relative">
                    <textarea
                      ref={chatInputRef}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask me anything..."
                      className="w-full p-3 pr-12 border rounded-lg resize-none max-h-32 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                      rows={1}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isProcessing}
                      className="absolute right-2 bottom-2 p-1 text-primary-600 hover:text-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : !inputText ? (
                <div className="h-full flex items-center justify-center text-gray-500 flex-col">
                  <Sparkles className="h-12 w-12 mb-4 text-primary-600" />
                  <p>Your AI-generated content will appear here</p>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-600">Processing your input...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-primary-50/50 py-12 mt-8">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">Transform Your Study Experience</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-primary-600" />}
              title="Smart Notes"
              description="Convert any text into well-structured, concise study notes instantly."
            />
            <FeatureCard
              icon={<FlowChart className="h-6 w-6 text-primary-600" />}
              title="Visual Learning"
              description="Generate clear flowcharts and mind maps from your study material."
            />
            <FeatureCard
              icon={<HelpCircle className="h-6 w-6 text-primary-600" />}
              title="Practice Questions"
              description="Create custom practice questions and tests from your notes."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default App;