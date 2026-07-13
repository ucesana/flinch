import ButtonIcon from "../buttons/button-icon";

type Props = {
  href?: string;
  label: string;
  icon: React.ReactNode;
};

export default function LinkResponsive({ href = "/", label, icon }: Props) {
  return (
    <>
      <div className="hidden sm:inline hover:text-red-500 flinch-has-focus">
        <a className="flex rounded-l-lg focus:outline-none" href={href}>
          {label}
        </a>
      </div>
      <a className="block: sm:hidden h-full" href={href}>
        <ButtonIcon title={label} icon={icon}></ButtonIcon>
      </a>
    </>
  );
}
