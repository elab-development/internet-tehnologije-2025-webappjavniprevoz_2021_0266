import { daLiJeAdmin } from "@/lib/auth"; 
import { redirect } from "next/navigation";
import AdminInterface from "./adminInterface";
import Link from "next/link";

export default async function AdminPage() {
  const isAdmin = await daLiJeAdmin(); 

  if (!isAdmin) {
    redirect("/"); 
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        

        <div className="bg-white/95 backdrop-blur-sm p-6 rounded-3xl shadow-xl flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Kontrolna Tabla</h1>
            <p className="text-indigo-600 text-sm font-bold">Ulogovani ste kao Administrator</p>
          </div>
            <Link href="/admin/api-docs" target="_blank">
            <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-2 rounded-xl font-bold border border-blue-200 transition-all flex items-center gap-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              API Dokumentacija
            </button>
</Link>
          <form action="/api/auth/logout" method="POST">
            <button className="bg-red-50 hover:bg-red-100 text-red-600 px-6 py-2 rounded-xl font-bold border border-red-200 transition-all">
              Odjavi se
            </button>
          </form>
          
         
          
        </div>

        <AdminInterface />
      </div>
    </main>
  );
}