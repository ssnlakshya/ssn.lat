import { supabase } from '@/lib/supabase'
import ClientRedirect from './client-redirect'
import { notFound } from 'next/navigation'
import { config } from '@/lib/config'
import { headers } from 'next/headers'
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface Props {
  params: Promise<{ shortCode: string }>
}


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

 if (!url) return {};

  const hdrs = await headers();
  let domain: string;
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_SITE_URL) {
    domain = process.env.NEXT_PUBLIC_SITE_URL.startsWith("http")
      ? process.env.NEXT_PUBLIC_SITE_URL
      : `https://${process.env.NEXT_PUBLIC_SITE_URL}`;
  } else {
    const host = hdrs.get('x-forwarded-host') || hdrs.get('host') || config.getDomain().replace(/^https?:\/\//, '')
    const proto = hdrs.get('x-forwarded-proto') || 'https'
    domain = `${proto}://${host}`
  }

  
  const ogImageUrl = `${domain}/api/og-image/${shortCode}`;

  const fallbackImageUrl = `${domain}/lakshya.png`

  return {
    metadataBase: new URL(domain),
    title: url?.long_url
      ? `ssn.lat - Redirecting to ${url.long_url}`
      : `ssn.lat - URL Shortener`,
    description: "Transform your long URLs into clean, shareable links for SSN College of Engineering Students",
    openGraph: {
      type: "website",
      url: `${domain}/${shortCode}`,
      images: [
        {
          url: url ? ogImageUrl : fallbackImageUrl,
          width: 1200,
          height: 630,
          alt: "Lakshya URL Shortener",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [url ? ogImageUrl : fallbackImageUrl]
    },
  }
}
