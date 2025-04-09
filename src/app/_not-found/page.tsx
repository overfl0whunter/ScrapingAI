import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        La pagina che stai cercando non esiste.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Torna alla home</Link>
      </Button>
    </div>
  )
} 