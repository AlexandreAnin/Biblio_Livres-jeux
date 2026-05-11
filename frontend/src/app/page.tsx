import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-primary-light">
          📚 Livres-Jeux
        </h1>
        <p className="mb-8 text-xl text-text">
          Vivez des aventures épiques dans des univers fantastiques
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg">Commencer l&apos;aventure</Button>
          </Link>
          <Link href="/books">
            <Button variant="secondary" size="lg">
              Parcourir les livres
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="rounded-lg border-2 border-primary bg-background-light p-6">
            <div className="mb-2 text-4xl">⚔️</div>
            <h3 className="mb-2 text-xl font-bold text-primary-light">
              Combat
            </h3>
            <p className="text-text-muted">
              Affrontez des ennemis redoutables avec un système de combat stratégique
            </p>
          </div>

          <div className="rounded-lg border-2 border-primary bg-background-light p-6">
            <div className="mb-2 text-4xl">🎒</div>
            <h3 className="mb-2 text-xl font-bold text-primary-light">
              Inventaire
            </h3>
            <p className="text-text-muted">
              Gérez vos objets, armes et équipement pour survivre
            </p>
          </div>

          <div className="rounded-lg border-2 border-primary bg-background-light p-6">
            <div className="mb-2 text-4xl">🌟</div>
            <h3 className="mb-2 text-xl font-bold text-primary-light">
              Progression
            </h3>
            <p className="text-text-muted">
              Développez votre personnage et débloquez de nouvelles capacités
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}