import { FaRobot, FaTimes } from "react-icons/fa";

function ChatHeader({ onClose }) {

    return (

        <div className="chat-header">

            <div className="header-left">

                <FaRobot />

                <span>CIVIX AI Assistant</span>

            </div>

            <button
                className="close-btn"
                onClick={onClose}
            >
                <FaTimes />
            </button>

        </div>

    );

}

export default ChatHeader;