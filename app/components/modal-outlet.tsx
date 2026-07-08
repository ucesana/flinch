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
