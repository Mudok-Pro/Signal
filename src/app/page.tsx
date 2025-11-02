import { Header } from '@/components/header';
import { MainDashboard } from '@/components/dashboard/main-dashboard';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1">
        <MainDashboard />
      </main>
    </div>
  );
}
