import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NotFound() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">404 - Pagina non trovata</h1>
      <p className="text-muted-foreground">La pagina che stai cercando non esiste.</p>
      <Button asChild>
        <Link href={session ? '/dashboard' : '/'}>
          {session ? 'Torna alla dashboard' : 'Torna alla home'}
        </Link>
      </Button>
    </div>
  )
} 