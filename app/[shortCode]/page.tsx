import { supabase } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import ClientRedirect from './client-redirect'

interface Props {
  params: { shortCode: string }
}

export default async function RedirectPage({ params }: Props) {
  const { shortCode } = params

  try {
    const { data: url, error } = await supabase
      .from('urls')
      .select('long_url, click_count')
      .eq('short_code', shortCode)
      .single()

    if (error || !url) {
      notFound()
    }

    await supabase
      .from('urls')
      .update({ click_count: (url.click_count || 0) + 1 })
      .eq('short_code', shortCode)

    redirect(url.long_url)
  } catch (error) {
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

export async function generateMetadata({ params }: { params: { shortCode: string } }) {
  const imageUrl = `https://ssn.lat/${params.shortCode}/og-image`
  return {
    title: "Your Page Title",
    description: "A short description for social previews",
    openGraph: {
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  }
}