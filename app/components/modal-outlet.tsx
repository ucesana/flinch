import SignUpModal, { type SignUpFields } from "~/components/signup-modal";
import LogInModal, { type LogInFields } from "~/components/login-modal";
import { useModal } from "~/components/modal";
import {
  type AccountResponse,
  getAccount,
  getCurrentSession,
  register,
} from "~/services/account.service";
import { login, type TokensResponse } from "~/services/auth.service";

export type ModalType = "signup" | "login";

export default function ModalOutlet() {
  const { closeModal, isModalOpen } = useModal<ModalType>();

  function onSignUp({ email, password }: SignUpFields) {
    register({ email, password }).then((account: AccountResponse) => {
      console.log("Registered:", account);
      closeModal();
    });
  }

  function onLogin({ email, password }: LogInFields) {
    login({ email, password }).then((token: TokensResponse) => {
      console.log("token", token);

      getAccount().then((account) => {
        console.log("account", account);
      });

      getCurrentSession().then((session) => {
        console.log("session", session);
      });
    });
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
