
import { redirect } from "next/navigation";
import { createClient } from "../app/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import ExpensePage from "../app/Expense/ExpensePage";
import PageHeader from "../app/components/common/PageHeader"


const Home = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();


  if (!user) {
    redirect("/login");
  }else{
    redirect("/dashboard");
  }
  return (
        <>
            <PageHeader></PageHeader>
        </>
    );
};

export default Home;

// export default function Home() {
//     return (
//         <>
//             <PageHeader></PageHeader>
//         </>
//     );
// }