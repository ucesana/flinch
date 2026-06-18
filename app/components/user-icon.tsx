import { User } from "lucide-react";

export default function UserIcon({ active }: { active: boolean }) {
  return (
    <div className={active ? "text-red-500" : ""}>
      <User />
    </div>
  );
}
