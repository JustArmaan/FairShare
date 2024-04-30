export const ErrorAlert = ({
  messages,
  type = "error",
}: {
  messages: string[];
  type?: "error" | "success";
}) => {
  if (messages.length === 0) {
    return null;
  }

  const baseStyles =
    "px-4 py-3 rounded relative text-xs flex flex-row mb-1 mt-2";
  const successStyles = "bg-green-100 text-green-700 border border-green-400";
  const errorStyles = "bg-red-100 text-red-700 border border-red-400";
  const combinedStyles = `${baseStyles} ${
    type === "error" ? errorStyles : successStyles
  }`;

  return (
    <div class={combinedStyles} role="alert">
      <strong class="font-bold flex justify-center pr-1">
        {type === "error" ? "Error!" : "Success!"}
      </strong>
      <div>
        {messages.map((message, index) => (
          <span class="block sm:inline">{message}</span>
        ))}
      </div>
    </div>
  );
};
