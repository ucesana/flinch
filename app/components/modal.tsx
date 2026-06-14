import Button from "./button";
import {
  useForm,
  type SubmitHandler,
  type RegisterOptions,
  type Path,
} from "react-hook-form";
import { useLocation, useNavigate, useSearchParams } from "react-router";

export type FieldType = "text" | "number" | "email" | "password";

export interface ModalField<TInputs extends Record<string, unknown>> {
  id: Path<TInputs>;
  type: FieldType;
  label: string;
  placeholder?: string;
  validation?: RegisterOptions<TInputs, Path<TInputs>>;
}

export interface ModalConfig<TInputs extends Record<string, unknown>> {
  title: string;
  submitLabel?: string;
  fields: ModalField<TInputs>[];
}

export interface ModalProps<TInputs extends Record<string, unknown>> {
  isOpen: boolean;
  onClose: () => void;
  config: ModalConfig<TInputs>;
  onSubmit: SubmitHandler<TInputs>;
}

export function useModal<TModalType>(): {
  openModal: (modal: TModalType) => () => void;
  closeModal: () => void;
  isModalOpen: (modal: TModalType) => boolean;
} {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const openModal = (modal: TModalType) => {
    return () => navigate(`${location.pathname}?modal=${modal}`);
  };

  const closeModal = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("modal");
    setSearchParams(next);
  };

  const isModalOpen = (modal: TModalType) => {
    return searchParams.get("modal") === modal;
  };

  return {
    openModal,
    closeModal,
    isModalOpen,
  };
}

export default function Modal<TInputs extends Record<string, unknown>>({
  isOpen,
  onClose,
  config,
  onSubmit,
}: ModalProps<TInputs>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TInputs>();

  const handleValidSubmit: SubmitHandler<TInputs> = (values) => {
    onSubmit(values);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6 shadow-xl ring-1 ring-white/10">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">{config.title}</h2>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form
            noValidate
            onSubmit={handleSubmit(handleValidSubmit)}
            className="space-y-4"
          >
            {config.fields.map((field) => {
              const fieldError = errors[field.id];

              return (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-zinc-300 mb-1"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-white flinch-focus"
                    {...register(
                      field.id as Parameters<typeof register>[0],
                      field.validation,
                    )}
                  />
                  {fieldError && (
                    <div className="flinch-error">
                      {fieldError.message as string}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-500"
              >
                {config.submitLabel ?? "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
