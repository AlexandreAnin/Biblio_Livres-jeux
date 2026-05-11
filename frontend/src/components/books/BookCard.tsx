import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Image from 'next/image'
import type { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <div className="mb-4 aspect-[2/3] overflow-hidden rounded-md bg-background">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">
            📖
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="mb-2 text-xl font-bold text-primary-light">
          {book.title}
        </h3>
        
        <p className="mb-2 text-sm text-text-muted">
          Par {book.author}
        </p>

        {book.series && (
          <p className="mb-2 text-sm text-text">
            {book.series} #{book.seriesIndex}
          </p>
        )}

        {book.description && (
          <p className="mb-4 text-sm text-text-muted line-clamp-3">
            {book.description}
          </p>
        )}
      </div>

      <Link href={`/books/${book.slug}`}>
        <Button className="w-full">Lire</Button>
      </Link>
    </Card>
  );
}