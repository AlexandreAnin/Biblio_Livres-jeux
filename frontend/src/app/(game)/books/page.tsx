'use client';

import { useEffect, useState } from 'react';
import { booksApi } from '@/lib/api';
import BookCard from '@/components/books/BookCard';
import Spinner from '@/components/ui/Spinner';
import type { Book } from '@/types/book';
import toast from 'react-hot-toast';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await booksApi.getAll();
        if (response.success && response.data) {
          setBooks(response.data);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        toast.error('Erreur lors du chargement des livres');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 text-4xl font-bold text-primary-light">
          📚 Bibliothèque
        </h1>

        {books.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-text-muted">
              Aucun livre disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}