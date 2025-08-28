import { supabase } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import ClientRedirect from './client-redirect'

interface Props {
  params: { shortCode: string }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = await params

  try {
    const { data: url, error } = await supabase
      .from('urls')
      .select('long_url, click_count')
      .eq('short_code', shortCode)
      .single()

    if (error || !url) {
      notFound()
    }

    // Increment click count
    await supabase
      .from('urls')
      .update({ click_count: (url.click_count || 0) + 1 })
      .eq('short_code', shortCode)

    // Try server-side redirect first
    redirect(url.long_url)
  } catch (error) {
    // If server redirect fails, try client-side redirect
    const { data: url } = await supabase
      .from('urls')
      .select('long_url')
      .eq('short_code', shortCode)
      .single()
    
    if (url) {
      return <ClientRedirect url={url.long_url} />
    }
    
    notFound()
  }
}