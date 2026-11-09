import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import ProductTable from "./ProductTable";
import PageHeader from "../components/common/PageHeader"


const ProductPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    redirect("/login");
  }


  return (
    <>
      <PageHeader></PageHeader>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-4  hidden">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/dashboard" className="hover:text-slate-900 transition flex items-center gap-1.5">

              <House className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>

            <ArrowRight className="w-4 h-4" />
            <span className="font-medium text-slate-900">Products</span>
          </nav>

          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 transition hidden">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <ProductTable></ProductTable>
      </div>
    </>
  );
};

export default ProductPage;