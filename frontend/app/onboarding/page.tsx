'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { savePreferences } from '@/lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faHeart, faBible, faPenToSquare, faPray } from '@fortawesome/free-solid-svg-icons'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    goal: '',
    experience: '',
    days_per_week: 5,
    minutes_per_session: 15,
    time_of_day: 'Morning',
    bible_version: 'NIV'
  })

  const goals = [
    { label: 'Build a daily reading habit', icon: faBook },
    { label: 'Grow closer to God', icon: faHeart },
    { label: 'Read through the whole Bible', icon: faBible },
    { label: 'Journal & reflect more', icon: faPenToSquare },
    { label: 'Develop a prayer life', icon: faPray },
  ]

  const experiences = [
    { label: "I'm brand new to it", sub: 'Start with the basics' },
    { label: 'A little — on and off', sub: 'Build a steady rhythm' },
    { label: 'Several years', sub: 'Go deeper' },
    { label: "Decades — it's a daily practice", sub: 'Track and reflect' },
  ]

  const bibleVersions = [
    { code: 'NIV', name: 'NIV', full: 'New International Version' },
    { code: 'ESV', name: 'ESV', full: 'English Standard Version' },
    { code: 'NLT', name: 'NLT', full: 'New Living Translation' },
    { code: 'KJV', name: 'KJV', full: 'King James Version' },
    { code: 'NASB', name: 'NASB', full: 'New American Standard' },
  ]

  function goForward(nextStep: number) {
    setDirection('forward')
    setStep(nextStep)
  }

  function goBack(prevStep: number) {
    setDirection('back')
    setStep(prevStep)
  }

  async function handleSubmit() {
    setLoading(true)
    await savePreferences(formData)
    router.push('/dashboard')
  }

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .slide-in-right { animation: slideInRight 0.3s ease; }
        .slide-in-left { animation: slideInLeft 0.3s ease; }
        input[type='range'] {
          -webkit-appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          background: #1a2e1a;
          outline: none;
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 9999px;
          background: #1a2e1a;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 1px #1a2e1a;
        }
      `}</style>

      <div style={{ backgroundColor: '#eee6d8' }} className="min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1a2e1a' }}>
            <span className="text-white text-lg">📖</span>
          </div>
          <div>
            <p className="font-semibold" style={{ color: '#1a2e1a' }}>Welcome to Scripture Tracker</p>
            <p className="text-sm" style={{ color: '#5a6b5a' }}>Let&apos;s set you up — a few quick questions to personalize your journey.</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md mb-6" style={{ height: '1px', backgroundColor: '#ddd8d0' }} />

        {/* Card */}
        <div
          key={step}
          className={`bg-[#fbf8f1] rounded-2xl shadow-sm p-8 w-full max-w-md ${direction === 'forward' ? 'slide-in-right' : 'slide-in-left'}`}
        >

          {/* Step progress dots */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {[1,2,3,4,5].map((s) => (
                <div key={s} className="h-1.5 rounded-full transition-all" style={{
                  width: s === step ? '2rem' : '0.75rem',
                  backgroundColor: s <= step ? '#1a2e1a' : '#d1d5db'
                }} />
              ))}
            </div>
            <p className="text-xs" style={{ color: '#5a6b5a' }}>Step {step} of 5</p>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <>
              <p className="text-xs font-bold tracking-widest mb-1" style={{ color: '#c1440e' }}>STEP 1</p>
              <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1a2e1a', fontFamily: 'Georgia, serif' }}>What brings you here?</h2>
              <p className="text-sm mb-6" style={{ color: '#5a6b5a' }}>Pick whatever feels true today.</p>

              <div className="flex flex-col gap-3">
                {goals.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setFormData({ ...formData, goal: option.label })}
                    className="text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between"
                    style={{
                      cursor: 'pointer',
                      borderColor: formData.goal === option.label ? '#1a2e1a' : '#e5e7eb',
                      backgroundColor: formData.goal === option.label ? '#f0f4f0' : 'white',
                      color: '#1a2e1a'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={option.icon} className="w-4 h-4" style={{ color: '#5a6b5a' }} />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    {formData.goal === option.label && <span style={{ color: '#1a2e1a' }}>✓</span>}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goForward(2)}
                disabled={!formData.goal}
                className="mt-6 w-full py-3 rounded-xl text-white font-semibold transition-all"
                style={{ backgroundColor: formData.goal ? '#1a2e1a' : '#9ca3af', cursor: formData.goal ? 'pointer' : 'not-allowed' }}
              >
                Continue
              </button>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <p className="text-xs font-bold tracking-widest mb-1" style={{ color: '#c1440e' }}>STEP 2</p>
              <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1a2e1a', fontFamily: 'Georgia, serif' }}>How long have you been reading the Bible?</h2>
              <p className="text-sm mb-6" style={{ color: '#5a6b5a' }}>No wrong answer — this helps us suggest plans.</p>

              <div className="flex flex-col gap-3">
                {experiences.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => setFormData({ ...formData, experience: option.label })}
                    className="text-left px-4 py-4 rounded-xl border transition-all"
                    style={{
                      cursor: 'pointer',
                      borderColor: formData.experience === option.label ? '#1a2e1a' : '#e5e7eb',
                      backgroundColor: formData.experience === option.label ? '#f0f4f0' : 'white',
                      color: '#1a2e1a'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{option.label}</p>
                        <p className="text-sm" style={{ color: '#5a6b5a' }}>{option.sub}</p>
                      </div>
                      {formData.experience === option.label && <span style={{ color: '#1a2e1a' }}>✓</span>}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => goBack(1)}
                  className="w-1/3 py-3 rounded-xl font-semibold border"
                  style={{ borderColor: '#1a2e1a', color: '#1a2e1a', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={() => goForward(3)}
                  disabled={!formData.experience}
                  className="w-2/3 py-3 rounded-xl text-white font-semibold"
                  style={{ backgroundColor: formData.experience ? '#1a2e1a' : '#9ca3af', cursor: formData.experience ? 'pointer' : 'not-allowed' }}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <p className="text-xs font-bold tracking-widest mb-1" style={{ color: '#c1440e' }}>STEP 3</p>
              <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1a2e1a', fontFamily: 'Georgia, serif' }}>Pick a reading rhythm</h2>
              <p className="text-sm mb-6" style={{ color: '#5a6b5a' }}>You can change this anytime.</p>

              {/* Days per week slider */}
              <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#e4dacb' }}>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium" style={{ color: '#1a2e1a' }}>Days per week</p>
                  <span className="text-lg font-bold" style={{ color: '#1a2e1a' }}>{formData.days_per_week}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={formData.days_per_week}
                  onChange={(e) => setFormData({ ...formData, days_per_week: parseInt(e.target.value) })}
                />
              </div>

              {/* Minutes per session slider */}
              <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#e4dacb' }}>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium" style={{ color: '#1a2e1a' }}>Minutes per session</p>
                  <span className="text-lg font-bold" style={{ color: '#1a2e1a' }}>{formData.minutes_per_session}</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={formData.minutes_per_session}
                  onChange={(e) => setFormData({ ...formData, minutes_per_session: parseInt(e.target.value) })}
                />
              </div>

              {/* Time of day toggle */}
              <p className="text-sm font-medium mb-3" style={{ color: '#1a2e1a' }}>Best time of day</p>
              <div className="flex gap-2">
                {['Morning', 'Midday', 'Evening'].map((time) => (
                  <button
                    key={time}
                    onClick={() => setFormData({ ...formData, time_of_day: time })}
                    className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: formData.time_of_day === time ? '#1a2e1a' : 'white',
                      color: formData.time_of_day === time ? 'white' : '#1a2e1a',
                      border: `1px solid ${formData.time_of_day === time ? '#1a2e1a' : '#e5e7eb'}`
                    }}
                  >
                    {time === 'Morning' ? '☀️' : time === 'Midday' ? '🌤️' : '🌙'} {time}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => goBack(2)}
                  className="w-1/3 py-3 rounded-xl font-semibold border"
                  style={{ borderColor: '#1a2e1a', color: '#1a2e1a', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={() => goForward(4)}
                  className="w-2/3 py-3 rounded-xl text-white font-semibold"
                  style={{ backgroundColor: '#1a2e1a', cursor: 'pointer' }}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <p className="text-xs font-bold tracking-widest mb-1" style={{ color: '#c1440e' }}>STEP 4</p>
              <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1a2e1a', fontFamily: 'Georgia, serif' }}>Which Bible version?</h2>
              <p className="text-sm mb-6" style={{ color: '#5a6b5a' }}>You can switch anytime in settings.</p>

              <div className="flex flex-col gap-3">
                {bibleVersions.map((v) => (
                  <button
                    key={v.code}
                    onClick={() => setFormData({ ...formData, bible_version: v.code })}
                    className="text-left px-4 py-4 rounded-xl border transition-all flex items-center justify-between"
                    style={{
                      cursor: 'pointer',
                      borderColor: formData.bible_version === v.code ? '#1a2e1a' : '#e5e7eb',
                      backgroundColor: formData.bible_version === v.code ? '#f0f4f0' : 'white',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: '#1a2e1a', color: 'white' }}>{v.name}</span>
                      <span className="font-medium" style={{ color: '#1a2e1a' }}>{v.full}</span>
                    </div>
                    {formData.bible_version === v.code && <span style={{ color: '#1a2e1a' }}>✓</span>}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => goBack(3)}
                  className="w-1/3 py-3 rounded-xl font-semibold border"
                  style={{ borderColor: '#1a2e1a', color: '#1a2e1a', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={() => goForward(5)}
                  className="w-2/3 py-3 rounded-xl text-white font-semibold"
                  style={{ backgroundColor: '#1a2e1a', cursor: 'pointer' }}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <>
              <p className="text-xs font-bold tracking-widest mb-1" style={{ color: '#c1440e' }}>STEP 5</p>
              <h2 className="text-2xl font-extrabold mb-1" style={{ color: '#1a2e1a', fontFamily: 'Georgia, serif' }}>You&apos;re all set!</h2>
              <p className="text-sm mb-6" style={{ color: '#5a6b5a' }}>Here&apos;s your starting plan.</p>

              <div className="rounded-xl p-4 mb-4 flex flex-col gap-2" style={{ backgroundColor: '#e4dacb' }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#1a2e1a' }}>✓</span>
                  <p className="text-sm font-medium" style={{ color: '#1a2e1a' }}>{formData.days_per_week} days a week</p>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#1a2e1a' }}>✓</span>
                  <p className="text-sm font-medium" style={{ color: '#1a2e1a' }}>{formData.minutes_per_session} min · {formData.time_of_day}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#1a2e1a' }}>✓</span>
                  <p className="text-sm font-medium" style={{ color: '#1a2e1a' }}>{formData.bible_version} translation</p>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#1a2e1a' }}>✓</span>
                  <p className="text-sm font-medium" style={{ color: '#1a2e1a' }}>{formData.goal}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => goBack(4)}
                  className="w-1/3 py-3 rounded-xl font-semibold border"
                  style={{ borderColor: '#1a2e1a', color: '#1a2e1a', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-2/3 py-3 rounded-xl text-white font-semibold"
                  style={{ backgroundColor: loading ? '#9ca3af' : '#1a2e1a', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Saving...' : 'Start your first reading'}
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  )
}
