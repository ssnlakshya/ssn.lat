import { supabase } from '@/lib/supabase'
import { redirect, notFound } from 'next/navigation'
import ClientRedirect from './client-redirect'

interface Props {
  params: Promise<{ shortCode: string }>
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

    await supabase
      .from('urls')
      .update({ click_count: (url.click_count || 0) + 1 })
      .eq('short_code', shortCode)

    redirect(url.long_url)
  } catch (error) {
    const { data: fallback } = await supabase
      .from('urls')
      .select('long_url')
      .eq('short_code', shortCode)
      .single()

    if (fallback) {
      return <ClientRedirect url={fallback.long_url} />
    }

    notFound()
  }
}

export async function generateMetadata({ params }: { params: Promise<{ shortCode: string }> }) {
  const { shortCode } = await params
  const imageUrl = `/api/og/${shortCode}`

  return {
    title: "ssn.lat - URL Shortener",
    description: "Transform your long URLs into clean, shareable links for SSN College of Engineering Students",
    metadataBase: new URL("https://ssn.lat"), 
    openGraph: {
      type: "website",
      url: `https://ssn.lat/${shortCode}`,
      images: [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  }
}

