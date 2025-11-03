import { Header } from '@/components/header';
import { MainDashboard } from '@/components/dashboard/main-dashboard';
import { BottomNavbar } from '@/components/bottom-navbar';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <MainDashboard />
      </main>
      <BottomNavbar />
    </div>
  );
}
