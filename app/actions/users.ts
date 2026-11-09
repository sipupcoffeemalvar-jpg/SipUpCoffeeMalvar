"use server"

import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "../lib/supabase/server"; 

export interface UserOption{
    id: string;
    email?: string;
    name?: string;
}

export const getUsers = async (): Promise<{
    error: string | null, 
    data: UserOption[] | null}> => 
    {
    const supabase = await createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Unauthorized access", data: null }
    }

    const supaBaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supbaseServiceKey = process.env.SUPBASE_SERVICE_ROLE_KEY;

    if(!supbaseServiceKey){
        return {
            error: 'Service Rolw Key is not cpnfigured correctly.',
            data: null
        }
    }

    const adminClient = createClient(supaBaseURL!, supbaseServiceKey,{
        auth:{
            autoRefreshToken: false,
            persistSession: false,
        },
    });


    //Get list of users in database
    const {data,error} = await adminClient.auth.admin.listUsers();

    if(error){
        return{error: error.message,data:null};
    }

    const users: UserOption[] = data.users.map((u) => ({
        id:u.id,
        email: u.email || "",
        name: u.user_metadata?.name || u.email?.split('@')[0] || "User",
    })) || [];

    return{ error: null, data: users};
}