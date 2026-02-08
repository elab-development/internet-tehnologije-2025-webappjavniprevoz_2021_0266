import { daLiJeAdmin } from "@/lib/auth"; 
import { redirect } from "next/navigation";
import AdminInterface from "./adminInterface";

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