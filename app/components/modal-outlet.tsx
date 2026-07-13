import SignUpModal, { type SignUpFields } from "~/components/signup-modal";
import LogInModal, { type LogInFields } from "~/components/login-modal";
import { useModal } from "~/components/modal";
import {
  getUser,
  getCurrentSession,
  createUser,
  type UserResponse,
} from "~/services/users.service";
import { login, type TokensResponse } from "~/services/auth.service";
import { useAppDispatch } from "~/store/hooks";
import { setIdentity } from "~/store/identitySlice";
import {
  createAccount,
  getAccount,
  getMyAccounts,
} from "~/services/account.service";
import { createChannel } from "~/services/channel.service";

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
    const tokens = await login({ email, password });
    console.log("tokens", tokens);
    const user = await getUser();
    console.log("user", user);
    const session = await getCurrentSession();
    console.log("session", session);
    const accounts = await getMyAccounts();
    if (!accounts?.length) {
      console.log("No account found, creating it now.");
      const name = user.email.substring(0, user.email.indexOf("@"));
      const account = await createAccount({ name });
      console.log("Account created:", account);
      const channel = await createChannel({
        accountId: account.id,
        name,
        description: `${name}'s channel!`,
      });
      console.log("Channel created:", channel);
    }

    dispatch(setIdentity({ user: user, session }));

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
