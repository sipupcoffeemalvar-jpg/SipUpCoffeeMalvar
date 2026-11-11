import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import PageHeader from "../components/common/PageHeader"
import MonthlySales from "./MonthlySales";


const DailySalesPage = async () => {
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
      <MonthlySales></MonthlySales>
    </>
  );
};

export default DailySalesPage;