import { useAppDispatch } from "~/store/hooks";
import { useEffect } from "react";
import { getAccount, getCurrentSession } from "~/services/account.service";
import { removeIdentity, setIdentity } from "~/store/identitySlice";

export default function Init() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function bootstrap() {
      try {
        const session = await getCurrentSession();

        if (!session) return;

        const account = await getAccount();
        dispatch(setIdentity({ account, session }));
      } catch (e) {
        dispatch(removeIdentity());
      }
    }

    bootstrap();
  }, []);

  return <></>;
}
