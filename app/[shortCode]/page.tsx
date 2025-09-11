import { supabase } from '@/lib/supabase'
import ClientRedirect from './client-redirect'
import { notFound } from 'next/navigation'
import { config } from '@/lib/config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params

  
  const { data: url } = await supabase
    .from('urls')
    .select('long_url, click_count')
    .eq('short_code', shortCode)
    .single()

  if (!url) notFound()

 
  supabase
    .from('urls')
    .update({ click_count: (url.click_count || 0) + 1 })
    .eq('short_code', shortCode)

  
  return <ClientRedirect url={url.long_url} />
}


export async function generateMetadata({ params }: { params: { shortCode: string } }) {
  const { shortCode } = params

  const { data: url } = await supabase
    .from('urls')
    .select('long_url')
    .eq('short_code', shortCode)
    .single()

  if (!url) return {}

  const domain = config.getDomain()
  // Use static image instead of dynamic API
  const ogImageUrl = `${domain}/api/shorten/og-image/${shortCode}`

  return {
    metadataBase: new URL(domain),
    title: `ssn.lat - Redirecting to ${url.long_url}`,
    description: "Transform your long URLs into clean, shareable links for SSN College of Engineering Students",
    openGraph: {
      type: "website",
      url: `${domain}/${shortCode}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Lakshya URL Shortener",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogImageUrl]
    },
  }
}
