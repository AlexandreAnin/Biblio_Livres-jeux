import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative flex h-[calc(100vh-78px)] items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{backgroundImage: "url('/images/backgrounds/HomeBackground.png')"}}>
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/30" />

      {/* Contenu */}
      <div className="relative text-center">
        <div className="text-center">
          {/* Titre principal */}
          <h1 className="library-title mb-8">
            La bibliothèque d&apos;Alexandre
          </h1>

          {/* Texte de bienvenue */}
          <p className="library-text mb-4">
            Venez découvrir ma collection de Livres Dont Vous Êtes le Héros.
          </p>
          <p className="library-text mb-4">
            Prenez un livre et installez-vous confortablement.
          </p>

          {/* Texte nouveaux venus */}
          <p className="library-text mb-10">
            Nouveaux venus, venez vous inscrire sur le registre.
          </p>

          {/* Boutons */}
          <div className="flex items-center justify-center">
            <Link href="/login">
              <button className="library-button">
                Prenez un livre
              </button>
            </Link>
            <Link href="/register">
              <button className="library-button library-button-secondary">
                S&apos;inscrire
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}