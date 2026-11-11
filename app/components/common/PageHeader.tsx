import { createClient } from "../../lib/supabase/server";
import { signOut } from "../../actions/auth";
import { LogOut } from "lucide-react";
import Link from "next/link";
import Navigation from "./HeaderNavigation";

export default async function PageHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 gap-2 sm:gap-4">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <Link
              href="/dashboard"
              className="hidden lg:flex items-center gap-2 font-bold text-xl text-slate-900 group shrink-0"
            >
              <div className="w-9 h-9 bg-brand-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:bg-brand-700 transition shrink-0">
                <i className="fa-solid fa-box-open text-lg" />
              </div>

              <span className="tracking-tight whitespace-nowrap">
                Sip Up <span className="text-brand-600">Coffee</span>
              </span>
            </Link>

            <Navigation />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <i className="fa-regular fa-bell text-lg" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 sm:gap-3 pl-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-slate-200 bg-slate-100 flex items-center justify-center font-semibold text-sm text-slate-600 shrink-0">
                {user?.email?.charAt(0).toUpperCase() ?? "U"}
              </div>

              <div className="hidden lg:block text-left max-w-[180px]">
                <p className="text-xs font-semibold text-slate-900 leading-tight truncate">
                  {user?.email}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Admin Manager
                </p>
              </div>

              <form action={signOut}>
                <button
                  type="submit"
                  aria-label="Sign out"
                  className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
