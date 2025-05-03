

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Navbar } from "@/components/shared/header/Navbar";

export default async function HomeLayout({children}:{children: React.ReactNode}){
    return(
        <div className=" ">
            <Navbar />
             <Header/>
             <main className="">
                {children}
             </main>
             <Footer/>
        </div>
    )
}