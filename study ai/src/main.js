import './style.css';
import * as lucide from 'lucide-static';

// Initialize Lucide icons by creating them from the imported SVG strings
function createIcons(options) {
  const { icons } = options;
  Object.entries(icons).forEach(([name, icon]) => {
    const elements = document.querySelectorAll(`[data-lucide="${name.toLowerCase()}"]`);
    elements.forEach(element => {
      element.innerHTML = lucide[icon];
    });
  });
}

// Initialize Lucide icons
createIcons({
  icons: {
    brain: 'Brain',
    menu: 'Menu',
    'file-text': 'FileText',
    'bar-chart': 'BarChart',
    car: 'Car',
    calendar: 'Calendar',
    'help-circle': 'HelpCircle',
    'graduation-cap': 'GraduationCap',
    'arrow-right': 'ArrowRight',
    sparkles: 'Sparkles',
    'chevron-down': 'ChevronDown',
    upload: 'Upload',
    x: 'X',
    'message-square': 'MessageSquare',
    send: 'Send',
    bot: 'Bot',
    'message-circle': 'MessageCircle'
  }
});

// Mode configuration
const modes = [
  { id: 'notes', name: 'Smart Notes', icon: 'file-text' },
  { id: 'flowchart', name: 'Flowchart', icon: 'bar-chart' },
  { id: 'flashcards', name: 'Flashcards', icon: 'car' },
  { id: 'timetable', name: 'Timetable', icon: 'calendar' },
  { id: 'questions', name: 'Questions', icon: 'help-circle' },
  { id: 'exams', name: 'Custom Exams', icon: 'graduation-cap' },
];

// Feature configuration
const features = [
  {
    icon: 'file-text',
    title: 'Smart Notes',
    description: 'Convert any text into well-structured, concise study notes instantly.'
  },
  {
    icon: 'bar-chart',
    title: 'Visual Learning',
    description: 'Generate clear flowcharts and mind maps from your study material.'
  },
  {
    icon: 'help-circle',
    title: 'Practice Questions',
    description: 'Create custom practice questions and tests from your notes.'
  }
];

// Initialize modes
const modesContainer = document.getElementById('modes');
let activeMode = 'notes';

modes.forEach(mode => {
  const button = document.createElement('button');
  button.className = `mode-button ${mode.id === activeMode ? 'active' : ''}`;
  button.innerHTML = `
    <i data-lucide="${mode.icon}" class="mode-icon"></i>
    ${mode.name}
  `;
  button.onclick = () => setActiveMode(mode.id);
  modesContainer.appendChild(button);
});

function setActiveMode(modeId) {
  activeMode = modeId;
  document.querySelectorAll('.mode-button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(modes.find(m => m.id === modeId).name));
  });
}

// Initialize features
const featuresContainer = document.getElementById('features');
features.forEach(feature => {
  const card = document.createElement('div');
  card.className = 'feature-card';
  card.innerHTML = `
    <i data-lucide="${feature.icon}" class="feature-icon"></i>
    <h3 class="text-lg font-semibold text-gray-900 mb-2">${feature.title}</h3>
    <p class="text-gray-600 text-sm">${feature.description}</p>
  `;
  featuresContainer.appendChild(card);
});

// File upload handling
const fileInput = document.getElementById('fileInput');
const uploadButton = document.getElementById('uploadButton');
const uploadError = document.getElementById('uploadError');
const inputText = document.getElementById('inputText');
const charCount = document.getElementById('charCount');
const convertButton = document.getElementById('convertButton');

uploadButton.onclick = () => fileInput.click();

fileInput.onchange = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

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

    const text = await file.text();
    inputText.value = text;
    updateCharCount();
    fileInput.value = '';
    hideError();
  } catch (error) {
    showError(error.message);
  }
};

function showError(message) {
  uploadError.querySelector('span').textContent = message;
  uploadError.style.display = 'flex';
}

function hideError() {
  uploadError.style.display = 'none';
}

uploadError.querySelector('button').onclick = hideError;

function updateCharCount() {
  const count = inputText.value.length;
  charCount.textContent = count;
  convertButton.disabled = count === 0;
}

inputText.oninput = updateCharCount;

// Chat functionality
const chatBot = document.getElementById('chatBot');
const chatBotToggle = document.getElementById('chatBotToggle');
const chatBotWindow = document.getElementById('chatBotWindow');
const closeChatBot = document.getElementById('closeChatBot');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');

let isProcessing = false;

// Predefined responses for demo
const responses = [
  "I can help you understand complex topics, create study materials, or answer specific questions. What would you like to focus on?",
  "That's an interesting topic! Would you like me to break it down into smaller, more manageable concepts?",
  "I can create flashcards, summaries, or practice questions based on your study material. Which would be most helpful?",
  "Let me analyze that for you. Is there a specific aspect you'd like me to explain in more detail?",
  "I can help you organize your study schedule or create a structured learning plan. Would you like that?",
  "Great question! Let me provide a detailed explanation with some examples to help you understand better."
];

let conversationContext = [];

chatBotToggle.onclick = () => {
  chatBotWindow.classList.toggle('hidden');
  if (!chatMessages.children.length) {
    // Add welcome message when chat is opened for the first time
    addMessage("👋 Hi! I'm your StudyAI assistant. I can help you with:", 'assistant');
    addMessage("• Creating study notes\n• Understanding complex topics\n• Generating practice questions\n• Making flashcards\n• Planning study schedules\n\nWhat would you like help with?", 'assistant');
  }
};

closeChatBot.onclick = () => {
  chatBotWindow.classList.add('hidden');
};

function addMessage(content, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${type}`;
  
  if (type === 'assistant') {
    messageDiv.innerHTML = `
      <div class="chat-avatar">
        <i data-lucide="bot" class="w-5 h-5 text-primary-600"></i>
      </div>
    `;
  }
  
  const formattedContent = content.replace(/\n/g, '<br>');
  messageDiv.innerHTML += `
    <div class="chat-bubble ${type}">
      ${formattedContent}
    </div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Reinitialize icons for new messages
  createIcons({
    icons: {
      bot: 'Bot'
    }
  });
}

function addTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chat-message assistant';
  typingDiv.id = 'typingIndicator';
  typingDiv.innerHTML = `
    <div class="chat-avatar">
      <i data-lucide="bot" class="w-5 h-5 text-primary-600"></i>
    </div>
    <div class="chat-bubble assistant">
      <div class="flex space-x-2">
        <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
    </div>
  `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Reinitialize icons for typing indicator
  createIcons({
    icons: {
      bot: 'Bot'
    }
  });
}

function removeTypingIndicator() {
  const typingIndicator = document.getElementById('typingIndicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function getAIResponse(userMessage) {
  // Add message to context
  conversationContext.push({ role: 'user', content: userMessage });
  
  // Simple keyword-based response system
  const keywords = {
    'study': ['schedule', 'plan', 'organize', 'learn'],
    'explain': ['how', 'what', 'why', 'when', 'where'],
    'help': ['assist', 'support', 'guide'],
    'question': ['ask', 'query', 'problem'],
    'note': ['summary', 'notes', 'write'],
    'test': ['exam', 'quiz', 'practice']
  };

  // Find matching keywords
  const messageWords = userMessage.toLowerCase().split(' ');
  const matchedCategories = new Set();
  
  messageWords.forEach(word => {
    for (const [category, keywords] of Object.entries(keywords)) {
      if (keywords.includes(word) || word.includes(category)) {
        matchedCategories.add(category);
      }
    }
  });

  // Get a response based on matched categories
  if (matchedCategories.size > 0) {
    const category = Array.from(matchedCategories)[Math.floor(Math.random() * matchedCategories.size)];
    switch (category) {
      case 'study':
        return "I can help you create a personalized study plan. Would you like to focus on daily schedules or long-term planning?";
      case 'explain':
        return "I'll break this down step by step. Which part would you like me to explain first?";
      case 'help':
        return "I'm here to help! Would you like assistance with creating study materials, understanding concepts, or practicing?";
      case 'question':
        return "I can help you with that question. Let me analyze it and provide a detailed explanation.";
      case 'note':
        return "I can help you create comprehensive study notes. Would you like them in bullet points, summaries, or detailed explanations?";
      case 'test':
        return "I can help you prepare for tests by creating practice questions and reviewing key concepts. Where would you like to start?";
    }
  }

  // Default to a random response if no keywords match
  return responses[Math.floor(Math.random() * responses.length)];
}

async function handleSendMessage() {
  const message = chatInput.value.trim();
  if (!message || isProcessing) return;

  chatInput.value = '';
  chatInput.style.height = 'auto';
  
  addMessage(message, 'user');
  isProcessing = true;
  addTypingIndicator();

  // Simulate AI processing time
  setTimeout(() => {
    removeTypingIndicator();
    const response = getAIResponse(message);
    addMessage(response, 'assistant');
    isProcessing = false;
  }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
}

sendMessage.onclick = handleSendMessage;

chatInput.onkeypress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};

// Auto-resize chat input
chatInput.oninput = () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = `${chatInput.scrollHeight}px`;
};