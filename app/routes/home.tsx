import type { Route } from "./+types/home";
import Navigation from "~/components/navigation";
import { Outlet } from "react-router";
import SideBar from "~/components/sidebar";
import RecommendedList from "~/components/recommended-list";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Flinch" },
    { name: "description", content: "Welcome to Flinch Streaming!" },
  ];
}

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="shrink-0">
        <Navigation />
      </header>

      <div className="flex grow overflow-hidden bg-gray-900">
        <aside className="shrink-0 overflow-y-auto">
          <SideBar title="Recommended">
            <RecommendedList />
          </SideBar>
        </aside>

        <section className="grow overflow-y-auto">
          <Outlet />
        </section>
      </div>

      <footer className="bg-red-500 text-white p-4 shrink-0"></footer>
    </div>
  );
}
