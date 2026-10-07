function ChatInput({

    input,

    setInput,

    onSend,

}) {

    return (

        <div className="chat-footer">

            <input

                value={input}

                onChange={(e) =>
                    setInput(e.target.value)
                }

                placeholder="Ask anything..."

                onKeyDown={(e) => {

                    if (e.key === "Enter") {

                        onSend();

                    }

                }}

            />

            <button

                className="send-btn"

                onClick={onSend}

            >

                ➤

            </button>

        </div>

    );

}

export default ChatInput;