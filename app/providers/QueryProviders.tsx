"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"    
import React, { useState } from "react"

export const QueryProvider = ({children}: {children:React.ReactNode}) => {

    const [queryClient] = useState(
        () =>
        new QueryClient({
            defaultOptions:{
                queries:{
                    staleTime: 60 * 1000, //Every 1 minute data will refresh
                    refetchOnWindowFocus:false, // if the focus of window (change tab or window) this will not fetch the data
                },
            },
        })
    );

    return<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}