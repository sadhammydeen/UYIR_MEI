import ClientLayout from './client-layout';
import Link from 'next/link';

export default function Home() {
  return (
    <ClientLayout>
      <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
        <div className="max-w-5xl w-full space-y-8">
          <h1 className="text-4xl font-bold text-center">
            Welcome to Uyir Mei
          </h1>
          <p className="text-xl text-center">
            A comprehensive NGO management and collaboration platform
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="px-6 py-3 rounded-md bg-blue-600 text-white text-center hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/ngo/leaderboard" 
              className="px-6 py-3 rounded-md bg-green-600 text-white text-center hover:bg-green-700 transition-colors"
            >
              Impact Leaderboard
            </Link>
          </div>
        </div>
      </main>
    </ClientLayout>
  );
} 