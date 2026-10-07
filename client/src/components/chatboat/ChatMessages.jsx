function ChatMessages({ messages }) {

    return (

        <div className="chat-body">

            {messages.map((message, index) => (

                <div

                    key={index}

                    className={
                        message.type === "user"
                            ? "user-message"
                            : "bot-message"
                    }

                >

                    {message.text}

                </div>

            ))}

        </div>

    );

}

export default ChatMessages;