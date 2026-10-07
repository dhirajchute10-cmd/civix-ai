import { useState, useEffect, useRef } from "react";

import "../css/ChatBot.css";

import { FaRobot, FaTimes } from "react-icons/fa";

import {
    getChatReply,
    sendChatMessage
} from "../services/chatService";


function ChatBot() {

    const [open, setOpen] = useState(false);

    const [input, setInput] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "bot",
            text: "👋 Hello! Welcome to CIVIX AI.\nHow can I help you today?",
            buttons: []
        }
    ]);

    const [showOptions, setShowOptions] = useState(true);

    const chatRef = useRef(null);


    // Close chatbot when clicking outside
    useEffect(() => {

        function handleClickOutside(event) {

            if (
                open &&
                chatRef.current &&
                !chatRef.current.contains(event.target)
            ) {
                setOpen(false);
            }

        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, [open]);


    // Add message
    const addMessage = (type, text, buttons = []) => {

        setMessages(prev => [
            ...prev,
            {
                id: Date.now() + Math.random(),
                type,
                text,
                buttons
            }
        ]);

    };


    // Quick action buttons
    const handleOptionClick = async (key, label) => {

        addMessage("user", label);

        setShowOptions(false);

        const reply = getChatReply(key);

        setTimeout(() => {

            addMessage("bot", reply);

            setShowOptions(true);

        }, 500);

    };


    // Send normal AI message
    const sendMessage = async () => {

        if (!input.trim() || isLoading) return;


        const userMessage = input.trim();

        // Show user message
        addMessage("user", userMessage);

        // Clear input
        setInput("");

        // Hide quick options while AI responds
        setShowOptions(false);

        // Show loading
        setIsLoading(true);


        try {

            // Convert current messages into AI conversation history
            const history = messages
                .filter(
                    message =>
                        message.type === "user" ||
                        message.type === "bot"
                )
                .slice(-8)
                .map(message => ({
                    role:
                        message.type === "user"
                            ? "user"
                            : "assistant",

                    content: message.text
                }));


            // Call backend AI
            const reply = await sendChatMessage(
                userMessage,
                history
            );


            // Show AI reply
            addMessage("bot", reply);


        } catch (error) {

            console.error(
                "Chatbot Error:",
                error
            );


            // Fallback message
            addMessage(
                "bot",
                "⚠️ Sorry, the AI assistant is temporarily unavailable. Please try again."
            );

        } finally {

            setIsLoading(false);

            setShowOptions(true);

        }

    };


    return (

        <>

            {/* Chat Toggle Button */}

            <button
                className="chat-toggle"
                onClick={() => setOpen(!open)}
            >
                <FaRobot />
            </button>


            {open && (

                <div
                    className="chat-window"
                    ref={chatRef}
                >


                    {/* Header */}

                    <div className="chat-header">

                        <div className="header-left">

                            <FaRobot />

                            <span>
                                CIVIX AI Assistant
                            </span>

                        </div>


                        <button
                            className="close-btn"
                            onClick={() => setOpen(false)}
                        >

                            <FaTimes />

                        </button>

                    </div>


                    {/* Chat Body */}

                    <div className="chat-body">

                        {messages.map((message) => (

                            <div
                                key={message.id}
                                className={
                                    message.type === "user"
                                        ? "user-message"
                                        : "bot-message"
                                }
                            >

                                {message.text}

                            </div>

                        ))}


                        {/* AI Loading */}

                        {isLoading && (

                            <div className="bot-message">

                                🤖 Thinking...

                            </div>

                        )}


                        {/* Quick Actions */}

                        {showOptions && !isLoading && (

                            <div className="quick-actions">


                                <button
                                    onClick={() =>
                                        handleOptionClick(
                                            "complaint",
                                            "📝 Report Complaint"
                                        )
                                    }
                                >
                                    📝 Report Complaint
                                </button>


                                <button
                                    onClick={() =>
                                        handleOptionClick(
                                            "tracking",
                                            "📍 Track Complaint"
                                        )
                                    }
                                >
                                    📍 Track Complaint
                                </button>


                                <button
                                    onClick={() =>
                                        handleOptionClick(
                                            "documents",
                                            "📄 Required Documents"
                                        )
                                    }
                                >
                                    📄 Required Documents
                                </button>


                                <button
                                    onClick={() =>
                                        handleOptionClick(
                                            "services",
                                            "🏛 Government Services"
                                        )
                                    }
                                >
                                    🏛 Government Services
                                </button>


                                <button
                                    onClick={() =>
                                        handleOptionClick(
                                            "emergency",
                                            "🚨 Emergency Numbers"
                                        )
                                    }
                                >
                                    🚨 Emergency Numbers
                                </button>


                            </div>

                        )}

                    </div>


                    {/* Footer */}

                    <div className="chat-footer">

                        <input
                            value={input}

                            onChange={(e) =>
                                setInput(e.target.value)
                            }

                            placeholder="Ask anything..."

                            disabled={isLoading}

                            onKeyDown={(e) => {

                                if (e.key === "Enter") {

                                    sendMessage();

                                }

                            }}

                        />


                        <button
                            className="send-btn"
                            onClick={sendMessage}
                            disabled={isLoading}
                        >

                            ➤

                        </button>

                    </div>

                </div>

            )}

        </>

    );

}


export default ChatBot;