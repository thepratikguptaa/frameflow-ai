'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, Upload, LogOut, LogIn } from 'lucide-react';
import { useNotification } from './Notification';

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      showNotification('Signed out successfully', 'success');
    } catch {
      showNotification('Failed to sign out', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              FrameFlow AI
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {session ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <User className="h-full w-full p-1.5" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="p-2 font-medium">
                  <p>{session.user?.email}</p>
                </li>
                <div className="divider my-0" />
                <li>
                  <Link href="/upload">
                    <Upload className="h-4 w-4" />
                    Video Upload
                  </Link>
                </li>
                <li>
                  <button onClick={handleSignOut} className="text-error">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary btn-sm h-9 rounded-md px-4 font-semibold"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

