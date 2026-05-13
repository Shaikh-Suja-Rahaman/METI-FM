

type UserChatBubbleProps = {
  text: string;
  colorClass?: string;
};

const UserChatBubble = ({ text, colorClass = "bg-vibeMint text-vibeMint-foreground" }: UserChatBubbleProps) => {
  return (
    <div className="flex w-full justify-end mb-4 pr-3">
      <div className={`max-w-[80%] ${colorClass} p-3 md:p-4 rounded-xl rounded-tr-sm border-2 border-border shadow-neo-sm font-medium whitespace-pre-wrap break-words`}>
        {text}
      </div>
    </div>
  );
};

export default UserChatBubble;