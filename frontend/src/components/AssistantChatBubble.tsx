

type AssistantChatBubbleProps = {
  text: string;
};

const AssistantChatBubble = ({ text }: AssistantChatBubbleProps) => {
  return (
    <div className="flex w-full justify-start mb-4 pl-3">
      <div className="max-w-[80%] bg-card text-card-foreground p-3 md:p-4 rounded-xl rounded-tl-sm border-2 border-border shadow-neo-sm font-medium whitespace-pre-wrap break-words">
        {text}
      </div>
    </div>
  );
};

export default AssistantChatBubble;