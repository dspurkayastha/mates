"use client";

export function GlobalStyles() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap");

      .font-inter {
        font-family: "Inter", sans-serif;
      }

      html {
        scroll-behavior: smooth;
      }

      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
      }

      ::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      ::-webkit-scrollbar-thumb {
        background: linear-gradient(to bottom, #9333ea, #db2777);
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(to bottom, #7c3aed, #be185d);
      }
    `}</style>
  );
}
