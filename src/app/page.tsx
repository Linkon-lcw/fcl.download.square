"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Home from "@/components/Home";
import Download from "@/components/download/Download";

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'download':
        return <Download />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="justify-items-center items-center gap-0 grid grid-rows-[1fr_64px] min-w-full min-h-screen font-sans">
      <Header currentPage={currentPage} onPageChange={handlePageChange} />
      <div >
        {renderPage()}
      </div>
    </div>
  );
}
