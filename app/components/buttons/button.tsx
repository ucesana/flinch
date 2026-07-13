interface Props extends React.ComponentProps<"button"> {
  children?: React.ReactNode;
}
export default function Button({ children, className, ...props }: Props) {
  return (
    <button
      className={`bg-gray-700 hover:bg-gray-600 text-white pt-1 pb-1 pl-4 pr-4 rounded-2xl font-bold cursor-pointer whitespace-nowrap focus-visible:outline-3 focus-visible:outline-red-500 focus-visible:rounded-lg ${className || ""}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
