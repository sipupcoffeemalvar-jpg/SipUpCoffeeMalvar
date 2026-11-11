"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Products", href: "/Product" },
  { label: "POS", href: "/POS" },
  { label: "Expense", href: "/Expense" },
  { label: "Monthly Sales", href: "/MonthlyReports" },
  { label: "Receipts", href: "/Receipts" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`px-3 py-2 text-sm rounded-lg transition ${
              isActive
                ? "font-semibold text-brand-600 bg-brand-50"
                : "font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}