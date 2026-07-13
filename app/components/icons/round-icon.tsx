export default function RoundIcon({
  children,
  backgroundColor,
}: {
  children: React.ReactNode;
  backgroundColor: string;
}) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full p-2 ${backgroundColor}`}
    >
      {children}
    </div>
  );
}
