import FlinchLogo from "../branding/flinch-logo";
import { BookHeart, BookSearch, EllipsisVertical } from "lucide-react";
import Button from "../buttons/button";
import ButtonIcon from "../buttons/button-icon";
import ResponsiveSearchInput from "../forms/search-input.responsive";
import LinkResponsive from "../links/link.responsive";
import Menu from "./menu";
import { useModal } from "~/components/modals/modal";
import type { ModalType } from "~/components/modals/modal-outlet";
import { logout } from "~/services/auth.service";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import { removeIdentity } from "~/store/identitySlice";
import { toast } from "sonner";
import UserIcon from "~/components/icons/user-icon";

export default function Navigation() {
  const { openModal } = useModal<ModalType>();

  const dispatch = useAppDispatch();
  const identity = useAppSelector((state) => state.session.identity);

  const handleLogOut = () => {
    logout().then((_) => {
      console.log("logged out");
      toast.info("You are logged out.");
      dispatch(removeIdentity());
    });
  };

  return (
    <nav className="flex dark:text-white p-2 shadow-lg shadow-gray-950">
      <div className="flex gap-x-2 items-center">
        <FlinchLogo />

        <LinkResponsive label="Browse" icon={<BookSearch />} href="/" />
        {identity && (
          <LinkResponsive
            label="Following"
            icon={<BookHeart />}
            href="/following"
          />
        )}

        <ButtonIcon title="Options" icon={<EllipsisVertical />}>
          <Menu>
            <a href="/about">About</a>
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
          </Menu>
        </ButtonIcon>
      </div>

      <div className="grow">
        <ResponsiveSearchInput />
      </div>

      <div className="flex justify-end items-center pl-2 gap-x-2 cursor-pointer">
        {!identity && (
          <>
            <Button aria-description="Log In" onClick={openModal("login")}>
              Log In
            </Button>

            <Button
              area-description="Sign Up"
              className="bg-red-600 hover:bg-red-500"
              onClick={openModal("signup")}
            >
              Sign Up
            </Button>
          </>
        )}
        <ButtonIcon
          title="Account"
          icon={<UserIcon active={!!identity} />}
          align="right"
        >
          <Menu>
            <a href="channel">Channel</a>
            <a href="settings">Settings</a>
            {!identity && <p onClick={openModal("login")}>Log In</p>}
            {identity && <p onClick={handleLogOut}>Log Out</p>}
          </Menu>
        </ButtonIcon>
      </div>
    </nav>
  );
}
