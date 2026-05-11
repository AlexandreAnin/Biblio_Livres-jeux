'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="border-b-2 border-primary bg-background-light">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-primary-light">
          📚 Livres-Jeux
        </Link>

        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href="/books"
                className="text-text hover:text-primary-light transition-colors"
              >
                Livres
              </Link>
              <Link
                href="/character"
                className="text-text hover:text-primary-light transition-colors"
              >
                Personnage
              </Link>
              <span className="text-text-muted">
                Bonjour, {user?.username}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Connexion
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Inscription
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
