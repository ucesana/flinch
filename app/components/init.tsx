import { useAppDispatch } from "~/store/hooks";
import { useEffect } from "react";
import { getUser, getCurrentSession } from "~/services/users.service";
import { removeIdentity, setIdentity } from "~/store/identitySlice";

export default function Init() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function bootstrap() {
      try {
        const session = await getCurrentSession();

        if (!session) return;

        const user = await getUser();
        dispatch(setIdentity({ user, session }));
      } catch (e) {
        dispatch(removeIdentity());
      }
    }

    bootstrap();
  }, []);

  return <></>;
}
