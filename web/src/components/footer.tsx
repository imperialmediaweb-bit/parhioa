export function Footer() {
  return (
    <footer className="bg-stone-100 border-t mt-12">
      <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-stone-600 flex justify-between flex-wrap gap-2">
        <span>© {new Date().getFullYear()} Parohia Sf. Teodora de la Sihla</span>
        <span>Doamne Iisuse Hristoase, miluiește-ne</span>
      </div>
    </footer>
  );
}
