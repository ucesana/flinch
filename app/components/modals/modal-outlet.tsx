import SignUpModal, {
  type SignUpFields,
} from "~/components/modals/signup-modal";
import LogInModal, { type LogInFields } from "~/components/modals/login-modal";
import { useModal } from "~/components/modals/modal";
import {
  createUser,
  getCurrentSession,
  getUser,
  type UserResponse,
} from "~/services/users.service";
import { login } from "~/services/auth.service";
import { useAppDispatch } from "~/store/hooks";
import { setIdentity } from "~/store/identitySlice";
import { createAccount, getMyAccounts } from "~/services/account.service";
import { createChannel, listChannels } from "~/services/channel.service";
import { setAccount, setChannels } from "~/store/accountSlice";

export type ModalType = "signup" | "login";

export default function ModalOutlet() {
  const { closeModal, openModal, isModalOpen } = useModal<ModalType>();

  const dispatch = useAppDispatch();

  function onSignUp({ email, password }: SignUpFields) {
    createUser({ email, password }).then((user: UserResponse) => {
      console.log("User created:", user);
      closeModal();
      openModal("login");
    });
  }

  async function onLogin({ email, password }: LogInFields) {
    // init identity
    const tokens = await login({ email, password });
    console.log("tokens", tokens);
    const user = await getUser();
    console.log("user", user);
    const session = await getCurrentSession();
    console.log("session", session);
    dispatch(setIdentity({ user, session }));

    // init account
    const accounts = await getMyAccounts();
    const name = user.email.substring(0, user.email.indexOf("@"));
    if (!accounts?.length) {
      console.log("No account found, creating it now.");
      const account = await createAccount({ name });
      console.log("Account created:", account);
      accounts.push(account);
    }
    const account = accounts[0]; // Assume the primary account has index 0.

    // init channels
    const channels = await listChannels(account.id);
    if (!channels?.length) {
      console.log("No channel found, creating it now.");
      const channel = await createChannel({
        accountId: account.id,
        name,
        description: `${name}'s channel!`,
      });
      console.log("Channel created:", channel);
      channels.push(channel);
    }
    dispatch(setAccount({ account }));
    dispatch(setChannels({ channels }));

    closeModal();
  }

  return (
    <>
      <SignUpModal
        isOpen={isModalOpen("signup")}
        onClose={closeModal}
        onSubmit={onSignUp}
      />
      <LogInModal
        isOpen={isModalOpen("login")}
        onClose={closeModal}
        onSubmit={onLogin}
      />
    </>
  );
}
