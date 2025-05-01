
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

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