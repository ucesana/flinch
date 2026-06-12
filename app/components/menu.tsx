export default function Menu({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col *:hover:text-red-500 leading-8 w-40">
      {children}
    </div>
  );
}
