// ponytail: stub — sidebar/topbar will be added when implementing app pages
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="hidden lg:flex lg:w-[230px] lg:shrink-0 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-50">
        {/* Sidebar — TODO: SidebarContent component */}
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4">
          {/* Topbar — TODO: Topbar component */}
        </header>
        <main className="flex-1 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  );
}
