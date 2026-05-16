'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDown,
  faBell,
  faBookmark,
  faBook,
  faBookBible,
  faBookOpen,
  faCalendarCheck,
  faCalendarDays,
  faChartLine,
  faClock,
  faClockRotateLeft,
  faEllipsis,
  faFire,
  faGear,
  faLayerGroup,
  faMountain,
  faNoteSticky,
  faSquarePollHorizontal,
  faSun,
  faTableCells,
} from '@fortawesome/free-solid-svg-icons'
import {
  getDashboardStats,
  getMe,
  getPreferences,
  getReadings,
  logReading,
} from '@/lib/api'

type User = {
  id: number
  email: string
  name: string
}

type Preferences = {
  goal: string
  experience: string
  days_per_week: number
  minutes_per_day: number
  bible_version: string
  time_of_day: string
}

type Reading = {
  id: number
  passage: string
  date_read: string
  notes?: string | null
}

type ActivityWeek = {
  week: string
  count: number
}

type DashboardStats = {
  streak: { streak: number }
  count: { count: number }
  week: { days_read: number; total_days: number }
  month: { count: number }
  longest: { longest_streak: number }
  activity: ActivityWeek[]
}

const heroImage =
  'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1400&q=85'

const quickPassages = ['John 3:16-21', 'Psalm 23', 'Philippians 4:6-7', 'Romans 8']

const sidebarItems = [
  { label: 'Dashboard', icon: faTableCells, active: true },
  { label: 'Readings', icon: faBookOpen },
  { label: 'Plans', icon: faCalendarCheck },
  { label: 'Insights', icon: faChartLine },
  { label: 'Journal', icon: faNoteSticky },
  { label: 'Library', icon: faLayerGroup },
  { label: 'Bookmarks', icon: faBookmark },
  { label: 'History', icon: faClockRotateLeft },
  { label: 'Settings', icon: faGear },
]

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function localDate(value: string) {
  return new Date(`${value}T00:00:00`)
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(localDate(value))
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function mondayFor(date: Date) {
  const next = new Date(date)
  const day = next.getDay()
  next.setDate(next.getDate() - (day === 0 ? 6 : day - 1))
  next.setHours(0, 0, 0, 0)
  return next
}

function sameWeek(dateValue: string, weekStart: Date) {
  const date = localDate(dateValue)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  return date >= weekStart && date <= weekEnd
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [preferences, setPreferences] = useState<Preferences | null>(null)
  const [readings, setReadings] = useState<Reading[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [passage, setPassage] = useState('John 3:16-21')
  const [dateRead, setDateRead] = useState(todayISO())
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadDashboard() {
    setError('')
    const [me, prefs, readingList, statSet] = await Promise.all([
      getMe(),
      getPreferences().catch(() => null),
      getReadings(),
      getDashboardStats(),
    ])

    setUser(me)
    setPreferences(prefs)
    setReadings(readingList)
    setStats(statSet)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard()
      .catch(() => {
        router.push('/')
      })
      .finally(() => setLoading(false))
  }, [router])

  const recentReadings = useMemo(
    () =>
      [...readings]
        .sort((a, b) => b.date_read.localeCompare(a.date_read))
        .slice(0, 5),
    [readings]
  )

  const activityRows = useMemo(() => {
    const thisMonday = mondayFor(new Date())
    return (stats?.activity ?? []).map((item, index, all) => {
      const weekStart = new Date(thisMonday)
      weekStart.setDate(thisMonday.getDate() - (all.length - 1 - index) * 7)
      return {
        ...item,
        readings: readings.filter((reading) => sameWeek(reading.date_read, weekStart)),
      }
    })
  }, [readings, stats?.activity])

  const weekProgress = stats ? Math.round((stats.week.days_read / stats.week.total_days) * 100) : 0
  const maxActivity = Math.max(1, ...activityRows.map((item) => item.count))
  const firstName = user?.name?.split(' ')[0] ?? 'Reader'
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? 'RT'
  const readingGoal = preferences ? `${preferences.days_per_week}/7` : `${stats?.week.days_read ?? 0}/7`
  const minutes = preferences?.minutes_per_day ?? 30

  async function handleLogReading() {
    if (!passage.trim()) return

    setSaving(true)
    setError('')

    try {
      await logReading({
        passage: passage.trim(),
        date_read: dateRead,
        notes: notes.trim() || undefined,
      })
      setNotes('')
      await loadDashboard()
    } catch {
      setError('Could not save that reading. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#eee6d8] px-6 py-8 text-[#203027]">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center">
          <div className="rounded-lg border border-[#ded0bd] bg-[#fbf8f1] px-6 py-4 text-sm font-semibold shadow-sm">
            Loading your dashboard...
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#eee6d8] text-[#203027]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[244px] shrink-0 border-r border-[#ded0bd] bg-[#f3ecdf] px-4 py-7 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2d513f] text-[#f6efe3]">
              <FontAwesomeIcon icon={faBookBible} className="h-4 w-4" />
            </div>
            <div>
              <p className="font-serif text-xl font-bold leading-5 text-[#24372c]">Scripture</p>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a8379]">
                Reading Tracker
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-[15px] font-bold transition ${
                  item.active
                    ? 'bg-[#e8eee7] text-[#244636]'
                    : 'text-[#48564d] hover:bg-[#ebe3d5] hover:text-[#244636]'
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`h-4 w-4 ${item.active ? 'text-[#d1785b]' : 'text-[#66716a]'}`}
                />
                {item.label}
              </button>
            ))}
          </nav>

          <blockquote className="mt-auto rounded-lg border border-[#ded0bd] bg-[#fbf8f1] p-4">
            <p className="font-serif text-sm italic leading-5 text-[#24372c]">
              &quot;Your word is a lamp to my feet and a light to my path.&quot;
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[#d1785b]">
              Psalm 119:105
            </p>
          </blockquote>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border-b border-[#ded0bd] bg-[#f7f2e9]/80 px-4 py-3 lg:hidden">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2d513f] text-[#f6efe3]">
                <FontAwesomeIcon icon={faBookBible} className="h-4 w-4" />
              </div>
              <div>
                <p className="font-serif text-xl font-bold leading-5 text-[#24372c]">Scripture</p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a8379]">
                  Reading Tracker
                </p>
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto pb-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`inline-flex min-w-max items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${
                    item.active ? 'bg-[#e8eee7] text-[#244636]' : 'text-[#48564d]'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mx-auto max-w-[1360px] px-5 py-7 lg:px-8">
            <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl font-bold tracking-normal text-[#1e2c23] md:text-4xl">
                  {getGreeting()}, {firstName}
                </h1>
                <p className="mt-1 text-base font-semibold text-[#778177]">
                  Let&apos;s grow your faith together today.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#ded0bd] bg-[#fbf8f1] text-[#3d4d43] shadow-sm"
                >
                  <FontAwesomeIcon icon={faBell} className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-3 rounded-full border border-[#ded0bd] bg-[#fbf8f1] py-1.5 pl-1.5 pr-4 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#aa825c] text-sm font-bold text-white">
                    {initials}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold leading-4 text-[#203027]">{user?.name ?? 'Reader'}</p>
                    <p className="text-xs font-semibold text-[#7a8379]">{preferences?.bible_version ?? 'Free Plan'}</p>
                  </div>
                  <FontAwesomeIcon icon={faAngleDown} className="hidden h-3 w-3 text-[#7a8379] sm:block" />
                </div>
              </div>
            </header>

            <section className="grid gap-4 xl:grid-cols-4">
              <div className="rounded-xl bg-[#2d513f] p-6 text-[#f8f2e7] shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#c4d0c5]">This week</p>
                  <FontAwesomeIcon icon={faCalendarDays} className="h-4 w-4 text-[#c4d0c5]" />
                </div>
                <p className="font-serif text-5xl font-bold leading-none">
                  {stats?.week.days_read ?? 0}
                  <span className="text-3xl text-[#b9c6bb]">/7</span>
                </p>
                <p className="mt-2 text-sm font-semibold text-[#c4d0c5]">Days</p>
                <div className="mt-5 h-1.5 rounded-full bg-[#55705f]">
                  <div className="h-1.5 rounded-full bg-[#e39a78]" style={{ width: `${weekProgress}%` }} />
                </div>
                <p className="mt-4 text-sm font-semibold text-[#dce5dd]">Keep it up — you&apos;re on a great streak.</p>
              </div>

              {[
                {
                  label: 'This month',
                  value: stats?.month.count ?? 0,
                  sub: 'Readings',
                  icon: faChartLine,
                  accent: '#2d513f',
                },
                {
                  label: 'Longest streak',
                  value: stats?.longest.longest_streak ?? 0,
                  sub: 'Days',
                  icon: faFire,
                  accent: '#cf795c',
                },
                {
                  label: 'Total readings',
                  value: stats?.count.count ?? 0,
                  sub: 'All time',
                  icon: faBook,
                  accent: '#203027',
                },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-[#ded0bd] bg-[#fbf8f1] p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#7a8379]">{item.label}</p>
                    <FontAwesomeIcon icon={item.icon} className="h-4 w-4 text-[#526158]" />
                  </div>
                  <p className="font-serif text-5xl font-bold leading-none" style={{ color: item.accent }}>
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#7a8379]">{item.sub}</p>
                  <div className="mt-5 flex gap-1">
                    {Array.from({ length: 18 }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-2 w-2 rounded-sm ${index < Math.min(18, item.value) ? 'bg-[#2d513f]' : 'bg-[#ebe3d5]'}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_0.95fr]">
              <div className="overflow-hidden rounded-xl border border-[#ded0bd] bg-[#fbf8f1] shadow-sm">
                <div className="grid min-h-[420px] md:grid-cols-[1.15fr_0.85fr]">
                  <div className="p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#eee6d8] text-[#2d513f]">
                        <FontAwesomeIcon icon={faBookBible} className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="font-serif text-2xl font-bold text-[#203027]">Log a reading</h2>
                        <p className="text-sm font-semibold text-[#778177]">Track your daily time in God&apos;s Word.</p>
                      </div>
                    </div>

                    {error && (
                      <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <label className="mb-2 block text-sm font-semibold text-[#778177]">Date</label>
                    <input
                      type="date"
                      value={dateRead}
                      onChange={(event) => setDateRead(event.target.value)}
                      className="mb-4 h-12 w-full rounded-lg border border-[#ded0bd] bg-[#fffdf8] px-4 text-sm font-semibold text-[#203027] outline-none focus:border-[#2d513f]"
                    />

                    <label className="mb-2 block text-sm font-semibold text-[#778177]">Scripture</label>
                    <input
                      value={passage}
                      onChange={(event) => setPassage(event.target.value)}
                      className="mb-3 h-12 w-full rounded-lg border border-[#ded0bd] bg-[#fffdf8] px-4 text-sm font-semibold text-[#203027] outline-none focus:border-[#2d513f]"
                      placeholder="John 3:16-21"
                    />

                    <div className="mb-4 flex flex-wrap gap-2">
                      {quickPassages.map((item) => (
                        <button
                          key={item}
                          onClick={() => setPassage(item)}
                          type="button"
                          className="rounded-lg border border-[#ded0bd] px-3 py-1.5 text-xs font-bold text-[#66716a] transition hover:border-[#d1785b] hover:text-[#203027]"
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    <label className="mb-2 block text-sm font-semibold text-[#778177]">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      className="mb-5 min-h-20 w-full resize-none rounded-lg border border-[#ded0bd] bg-[#fffdf8] px-4 py-3 text-sm font-semibold text-[#203027] outline-none focus:border-[#2d513f]"
                      placeholder="What stood out to you?"
                    />

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={handleLogReading}
                        disabled={saving || !passage.trim()}
                        type="button"
                        className="text-sm font-bold text-[#203027] transition hover:text-[#d1785b] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save reading'}
                      </button>
                      <button
                        onClick={handleLogReading}
                        disabled={saving || !notes.trim()}
                        type="button"
                        className="text-sm font-bold text-[#203027] transition hover:text-[#d1785b] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Add notes only
                      </button>
                    </div>
                  </div>

                  <div className="relative min-h-[280px] overflow-hidden bg-[#ead8b8]">
                    <Image
                      src={heroImage}
                      alt="Open Bible in warm natural light"
                      fill
                      sizes="(min-width: 1280px) 25vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[#b8915f]/20" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#ded0bd] bg-[#fbf8f1] p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold text-[#203027]">Recent readings</h2>
                  <button type="button" className="text-sm font-bold text-[#203027]">View all</button>
                </div>

                <div className="space-y-3">
                  {recentReadings.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#ded0bd] p-5 text-sm font-semibold text-[#778177]">
                      Your first saved reading will appear here.
                    </div>
                  ) : (
                    recentReadings.map((reading, index) => (
                      <div
                        key={reading.id}
                        className="flex gap-4 rounded-lg border border-[#eadfce] bg-[#fffdf8] p-4"
                      >
                        <div
                          className={`flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-lg text-white ${
                            index % 3 === 0 ? 'bg-[#2d513f]' : index % 3 === 1 ? 'bg-[#d1785b]' : 'bg-[#b29367]'
                          }`}
                        >
                          <FontAwesomeIcon icon={index % 3 === 1 ? faMountain : faSun} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#778177]">{formatDate(reading.date_read)}</p>
                              <h3 className="font-serif text-xl font-bold text-[#203027]">{reading.passage}</h3>
                            </div>
                            <FontAwesomeIcon icon={faEllipsis} className="mt-1 h-4 w-4 text-[#778177]" />
                          </div>
                          <p className="mt-1 text-sm font-semibold text-[#778177]">
                            <FontAwesomeIcon icon={faClock} className="mr-1 h-3 w-3" />
                            {minutes} min
                          </p>
                          {reading.notes && (
                            <p className="mt-2 truncate font-serif text-sm italic text-[#3f4b43]">
                              &quot;{reading.notes}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="mt-5 grid gap-5 xl:grid-cols-[1fr_0.8fr]">
              <div className="rounded-xl border border-[#ded0bd] bg-[#fbf8f1] p-6 shadow-sm">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#d1785b]">Reading activity</p>
                    <h2 className="mt-1 font-serif text-2xl font-bold text-[#203027]">Logged readings by week</h2>
                  </div>
                  <p className="rounded-lg bg-[#eee6d8] px-3 py-2 text-sm font-bold text-[#48564d]">
                    Goal {readingGoal}
                  </p>
                </div>

                <div className="flex h-56 items-end gap-3 border-b border-[#eadfce] pb-5">
                  {activityRows.map((item) => (
                    <div key={item.week} className="group relative flex h-full flex-1 flex-col justify-end gap-2">
                      <div
                        className="rounded-t-lg bg-[#2d513f] transition group-hover:bg-[#d1785b]"
                        style={{ height: `${Math.max(10, (item.count / maxActivity) * 100)}%` }}
                      />
                      <div className="pointer-events-none absolute bottom-[calc(100%+0.75rem)] left-1/2 z-10 hidden w-56 -translate-x-1/2 rounded-lg border border-[#ded0bd] bg-[#fffdf8] p-3 text-left shadow-lg group-hover:block">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#d1785b]">
                          {item.week}
                        </p>
                        {item.readings.length > 0 ? (
                          <div className="space-y-1.5">
                            {item.readings.slice(0, 4).map((reading) => (
                              <p key={reading.id} className="truncate text-sm font-bold text-[#203027]">
                                {formatDate(reading.date_read)} · {reading.passage}
                              </p>
                            ))}
                            {item.readings.length > 4 && (
                              <p className="text-xs font-semibold text-[#778177]">
                                +{item.readings.length - 4} more
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-[#778177]">No readings logged.</p>
                        )}
                      </div>
                      <p className="truncate text-center text-[11px] font-bold text-[#778177]">{item.week}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#ded0bd] bg-[#fbf8f1] shadow-sm">
                <div className="grid h-full min-h-48 grid-cols-[1fr_0.42fr]">
                  <div className="flex items-center gap-5 p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eee6d8] text-[#2d513f]">
                      <FontAwesomeIcon icon={faSquarePollHorizontal} className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#203027]">Consistency builds depth.</h2>
                      <p className="mt-2 text-sm font-semibold text-[#778177]">
                        Keep showing up, even on the hard days. God honors faithfulness.
                      </p>
                    </div>
                  </div>
                  <div className="relative min-h-48">
                    <Image
                      src={heroImage}
                      alt="Warm open Bible detail"
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[#d5b98f]/35" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
