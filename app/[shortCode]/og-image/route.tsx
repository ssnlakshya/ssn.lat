import React from 'react'
import { ImageResponse } from 'next/og'
import { supabase } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET(request: Request, { params }: { params: { shortCode: string } }) {
  const { shortCode } = params

  
  const { data: url } = await supabase
    .from('urls')
    .select('long_url')
    .eq('short_code', shortCode)
    .single()

  const longUrl = url?.long_url || 'https://ssn.lat'

  return new ImageResponse(
  (
   <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: '#fff',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 40,
      }}
    >
      <img
        src="https://ssn.lat/images/lakshya.png"
        width={120}
        height={120}
      />
      <div style={{ marginTop: 30, color: '#333' }}>{longUrl}</div>
    </div>
  ),
  {
    width: 1200,
    height: 630,
  }
)
}