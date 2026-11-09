import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import ReportPage from "../Reports/ReportPage";
import PageHeader from "../components/common/PageHeader"


const Page = async () => {
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
        <ReportPage></ReportPage> 
    </>
  );
};

export default Page;