import SidebarContent from '@/components/app/Sidebar'
import Topbar from '@/components/app/Topbar'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="hidden lg:flex lg:w-[230px] lg:shrink-0 lg:flex-col
                        lg:border-r lg:border-gray-200 lg:bg-gray-50">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-white">{children}</main>
      </div>
    </div>
  )
}
