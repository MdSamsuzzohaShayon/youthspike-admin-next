'use client'
import React from "react";
import { useRouter } from "next/navigation";
import DirectorAdd from "@/components/director/DirectorAdd";

function HomePage() {
  const router = useRouter();

  const handleLogout = (e: React.SyntheticEvent) => {
    // e.preventDefault();
    document.cookie = `token=;`;
    document.cookie = `user=;`;
    router.push('/login');    
  }
  return (
    <main className="main">
      <div className="container mx-auto px-2">
        <button className="bg-red-700 text-red-100 font-bold p-2" onClick={handleLogout}>Logout</button>
        <DirectorAdd />
      </div>
    </main>
  )
}

export default HomePage;
