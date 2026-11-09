export const getStatusBadgetColor = (pCategory: string) => {
    switch(pCategory){
        case "IC":
            return "bg-blue-50 text-blue-500";
        case "NC":
            return "bg-[#EAD2B8] text-[#865D3B]";
        case "FR":
            return "bg-[whitesmoke] text-[gray]";
        case "MT":
            return "bg-emerald-50 text-emerald-600";
        case "P":
            return "bg-[#DDE5D6] text-[#64785A]";
        default:
            return "bg-blue-50 text-blue-600";
    }
}

export const PieCategoryColors = (category: string) => {
    switch(category){
        case "Iced Coffee":
            return "#856548";
        case "Matcha":
            return "#A78B70";
        case "Frappe":
            return "#C5A989";
        case "Non-Coffee":
            return "#DCCBB7";
        case "Pastry":
            return "#E9DED1";
        default:
            return "bg-blue-50 text-blue-600";
    }
}