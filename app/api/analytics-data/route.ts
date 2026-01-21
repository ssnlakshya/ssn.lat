import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const analyticsToken = searchParams.get('token')

    if (!analyticsToken) {
      return NextResponse.json(
        { error: 'Analytics token required' },
        { status: 400 }
      )
    }

    // Find URL by analytics token
    const { data: urlData, error: urlError } = await supabase
      .from('urls')
      .select('id, short_code, long_url, click_count, created_at')
      .eq('analytics_token', analyticsToken)
      .single()

    if (urlError || !urlData) {
      return NextResponse.json(
        { error: 'Analytics not found' },
        { status: 404 }
      )
    }

    // Fetch recent clicks (last 100)
    const { data: clicks, error: clicksError } = await supabase
      .from('clicks')
      .select('id, created_at, referrer, user_agent')
      .eq('short_code', urlData.short_code)
      .order('created_at', { ascending: false })
      .limit(100)

    if (clicksError) {
      console.error('Error fetching clicks:', clicksError)
    }

    // Calculate clicks per day for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const clicksByDay: Record<string, number> = {}
    const recentClicks = (clicks || []).filter(click => {
      const clickDate = new Date(click.created_at)
      return clickDate >= thirtyDaysAgo
    })

    recentClicks.forEach(click => {
      const date = new Date(click.created_at).toISOString().split('T')[0]
      clicksByDay[date] = (clicksByDay[date] || 0) + 1
    })

    return NextResponse.json({
      shortCode: urlData.short_code,
      longUrl: urlData.long_url,
      totalClicks: urlData.click_count,
      createdAt: urlData.created_at,
      clicksByDay,
      recentClicks: recentClicks.slice(0, 20).map(click => ({
        date: click.created_at,
        referrer: click.referrer || 'Direct',
        userAgent: click.user_agent || 'Unknown'
      }))
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
