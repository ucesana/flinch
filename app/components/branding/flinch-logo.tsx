import LogoSVG from "../../assets/logo.svg";

export default function FlinchLogo() {
  return (
    <div className="w-10 flinch-has-focus">
      <a
        href="http://localhost:5173/"
        className="focus:outline-none focus-visible:outline-none"
      >
        <img
          src={LogoSVG}
          alt="Flinch logo"
          aria-description="Flinch logo"
          className="w-10 cursor-pointer hover:animate-pulsate"
        />
      </a>
    </div>
  );
}
