import Modal, { type ModalConfig } from "./modal";
import type { SubmitHandler } from "react-hook-form";

export type SignUpFields = {
  email: string;
  password: string;
};

interface SignUpModalProps<SignupFields extends Record<string, unknown>> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: SubmitHandler<SignupFields>;
}

const signupModalConfig: ModalConfig<SignUpFields> = {
  title: "Create Account",
  submitLabel: "Sign Up",
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
        minLength: { value: 8, message: "Must be at least 8 characters" },
        maxLength: { value: 64, message: "Must be at most 64 characters" },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])(?!.*\s).+$/,
          message:
            "Must include uppercase, lowercase, a digit, and a special character (! @ # $ % & *)",
        },
      },
    },
  ],
};

export default function SignUpModal({
  isOpen,
  onClose,
  onSubmit: onSignUp,
}: SignUpModalProps<SignUpFields>) {
  return (
    <Modal<SignUpFields>
      isOpen={isOpen}
      onClose={onClose}
      config={signupModalConfig}
      onSubmit={onSignUp}
    />
  );
}
