import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { useEffect } from "react";
import { loadChannels } from "~/store/accountSlice";
import { User } from "lucide-react";
import RoundIcon from "~/components/icons/round-icon";
import Stream from "./stream";

export default function Channel() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(loadChannels());
  }, [dispatch]);

  const accountState = useAppSelector((state) => state.account);
  const channels = accountState?.channels?.channels;
  const channel = channels?.length ? channels[0] : null;

  return (
    <div className="p-4 h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2 pb-4 shrink-0">
        <RoundIcon backgroundColor="bg-red-600">
          <User className="text-white size-8" />
        </RoundIcon>
        {channel && <h1>{channel?.name ?? ""}</h1>}
      </div>
      <Stream></Stream>
    </div>
  );
}
