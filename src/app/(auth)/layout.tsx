import SidebarContent from '@/components/app/Sidebar'
import Topbar from '@/components/app/Topbar'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark-app flex h-screen overflow-hidden"
         style={{ backgroundColor: 'rgb(8,9,10)' }}>
      <aside className="hidden lg:flex lg:w-[240px] lg:shrink-0 lg:flex-col"
             style={{ backgroundColor: 'rgb(11,12,13)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <SidebarContent />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'rgb(8,9,10)' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
