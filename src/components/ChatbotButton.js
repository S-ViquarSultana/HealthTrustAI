import React from "react";

const ChatbotButton = () => {

  const openChatbot = () => {
    window.open("https://your-chatbot-link.com", "_blank");
  };

  return (
    <div>

      {/* Bubble Text */}
      <div className="fixed bottom-24 right-6 bg-teal-500 text-white px-4 py-2 rounded-full shadow-xl animate-bounce z-50">
        Your Wellness Assistant 💙
      </div>

      {/* Floating Button */}
      <button
        onClick={openChatbot}
        className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 z-50"
      >
        💬
      </button>

    </div>
  );
};

export default ChatbotButton;