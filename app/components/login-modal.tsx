import Modal, { type ModalConfig } from "./modal";
import type { SubmitHandler } from "react-hook-form";

export type LogInFields = {
  email: string;
  password: string;
};

interface LogInModalProps<SignupFields extends Record<string, unknown>> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<SignupFields>;
}

const loginModalConfig: ModalConfig<LogInFields> = {
  title: "Log In",
  submitLabel: "Log In",
  fields: [
    {
      id: "email",
      type: "email",
      label: "Email Address",
      placeholder: "Email",
      validation: {
        required: "Please enter an email",
        pattern: {
          value: /\S+@\S+\.\S+/,
          message: "Email format is invalid",
        },
      },
    },
    {
      id: "password",
      type: "password",
      label: "Password",
      placeholder: "Password",
      validation: {
        required: "Please enter a password",
      },
    },
  ],
};

export default function LogInModal({
  isOpen,
  onClose,
  onSubmit: onSignUp,
}: LogInModalProps<LogInFields>) {
  return (
    <Modal<LogInFields>
      isOpen={isOpen}
      onClose={onClose}
      config={loginModalConfig}
      onSubmit={onSignUp}
    />
  );
}
