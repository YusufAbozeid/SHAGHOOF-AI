import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import api from '../services/api'
import Mascot from '../components/Mascot'

export default function PodcastPlayer() {
  const { user } = useApp()
  const [subjects, setSubjects] = useState([])
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState('short')
  const [language, setLanguage] = useState('ar')
  const [loading, setLoading] = useState(false)
  const [podcast, setPodcast] = useState(null)
  const [ttsLoading, setTtsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const audioRef = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubjects(user?.subjects || JSON.parse(localStorage.getItem('shaghoof_user') || '{}').subjects || [])
  }, [user?.subjects])

  const generate = async () => {
    const finalTopic = topic.trim() || subject
    if (!finalTopic) return
    setLoading(true)
    setAudioUrl(null)
    try {
      const res = await api.generatePodcast({
        topic: finalTopic,
        language: language,
        dialect: language === 'ar',
      })
      setPodcast(res)
    } catch {
      setPodcast(null)
      alert('Failed to generate podcast. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const synthesize = async () => {
    if (!podcast) return
    setTtsLoading(true)
    try {
      let fullText = ''
      if (Array.isArray(podcast.dialogue) && podcast.dialogue.length > 0) {
        fullText = podcast.dialogue.map(d => `${d.speakerName || d.speaker}: ${d.text}`).join('\n\n')
      } else {
        fullText = podcast.script || podcast.content || podcast.text || podcast.topic || topic
      }

      const engine = localStorage.getItem('shaghoof_tts_engine') || 'elevenlabs'
      const elevenKey = localStorage.getItem('shaghoof_eleven_key') || ''
      const blob = await api.synthesizeTTS({
        text: fullText,
        language: language,
        dialect: language === 'ar',
        engine,
        api_key: engine === 'elevenlabs' ? (elevenKey || undefined) : undefined,
      })
      if (blob && blob.size > 0) setAudioUrl(URL.createObjectURL(blob))
    } catch {
      alert('TTS generation is unavailable. You can read the script below.')
    } finally {
      setTtsLoading(false)
    }
  }

  const getFullScriptText = () => {
    if (!podcast) return ''
    if (Array.isArray(podcast.dialogue) && podcast.dialogue.length > 0) {
      return podcast.dialogue.map(d => `${d.speakerName || d.speaker}: ${d.text}`).join('\n\n')
    }
    return podcast.script || podcast.content || podcast.text || ''
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Mascot size={48} animate mood="happy" className="mascot-float" />
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--brand)]" style={{ fontFamily: 'var(--font-heading)' }}>
            بودكاست شغوف التعليمي 🎙️ Learning Podcast
          </h1>
          <p className="text-sm text-[var(--muted)]">حوار تفاعلي شيق بين خبيرين تعليميين يشرح أي مفهوم في دقائق</p>
        </div>
      </div>

      {!podcast ? (
        <div className="space-y-4 border border-[var(--line)] rounded-xl p-6 bg-[var(--surface)]">
          <div>
            <label className="mb-1 block text-sm font-bold text-[var(--ink)]">المادة (Subject)</label>
            {subjects.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">لا توجد مواد مضافة بعد. أضفها من الإعدادات.</p>
            ) : (
              <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full brand-input">
                <option value="">اختر مادة...</option>
                {subjects.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[var(--ink)]">موضوع الحلقة (Topic)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: الثقوب السوداء، الخوارزميات، الانقسام الميتوزي..."
              className="w-full brand-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--muted)]">اللغة واللهجة</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage('ar')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    language === 'ar' ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'border-[var(--line)] text-[var(--ink)]'
                  }`}
                >
                  🇪🇬 عامية مصرية
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    language === 'en' ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'border-[var(--line)] text-[var(--ink)]'
                  }`}
                >
                  🇬🇧 English
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[var(--muted)]">مدة الحلقة</label>
              <div className="flex gap-2">
                {[
                  { v: 'short', l: '2 دقيقة' },
                  { v: 'medium', l: '5 دقائق' },
                ].map((d) => (
                  <button
                    key={d.v}
                    type="button"
                    onClick={() => setDuration(d.v)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      duration === d.v ? 'bg-[var(--brand)] text-white border-[var(--brand)]' : 'border-[var(--line)] text-[var(--ink)]'
                    }`}
                  >
                    {d.l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={generate}
            disabled={(!topic.trim() && !subject) || loading}
            className="w-full brand-btn-primary py-3 disabled:opacity-40 mt-2"
          >
            {loading ? 'جاري تأليف حوار البودكاست بالذكاء الاصطناعي...' : '🎙️ توليد حلقة البودكاست'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-[var(--line)] rounded-xl p-6 bg-[var(--surface)] shadow-sm">
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-[var(--line)]">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--brand)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {podcast.title || podcast.topic || topic}
                </h2>
                {podcast.duration && (
                  <span className="text-xs font-semibold text-[var(--muted)] mt-0.5 inline-block">
                    ⏱️ المدة التقديرية: {podcast.duration}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(getFullScriptText())
                  alert('تم نسخ سيناريو الحوار بنجاح!')
                }}
                className="brand-btn-secondary text-xs px-3 py-1.5"
              >
                📋 نسخ السيناريو
              </button>
            </div>

            {/* Hosts badges */}
            {podcast.hosts && podcast.hosts.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 p-3 rounded-lg bg-[var(--brand-light)]/30 border border-[var(--brand)]/20">
                <span className="text-xs font-bold text-[var(--muted)] self-center ml-2">مقدمو الحلقة:</span>
                {podcast.hosts.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-[var(--line)] text-xs font-bold shadow-xs">
                    <span>{h.avatar || '🎙️'}</span>
                    <span className="text-[var(--ink)]">{h.name}</span>
                    {h.role && <span className="text-[10px] text-[var(--muted)] font-normal">({h.role})</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Structured dialogue speech bubbles */}
            {Array.isArray(podcast.dialogue) && podcast.dialogue.length > 0 ? (
              <div className="space-y-3 my-4">
                {podcast.dialogue.map((turn, i) => {
                  const isHost1 = turn.speaker === 'host1' || i % 2 === 0
                  return (
                    <div
                      key={i}
                      className={`flex gap-3 items-start p-3.5 rounded-xl border transition-all ${
                        isHost1
                          ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40'
                          : 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40'
                      }`}
                    >
                      <div className="text-2xl flex-shrink-0 pt-0.5">
                        {turn.avatar || (isHost1 ? '👨‍🏫' : '👩‍🔬')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-extrabold ${isHost1 ? 'text-blue-700 dark:text-blue-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                            {turn.speakerName || turn.speaker || (isHost1 ? 'د. يوسف' : 'مريم')}
                            {turn.role && <span className="text-[10px] font-normal text-[var(--muted)] ml-2">({turn.role})</span>}
                          </span>
                          {turn.timestamp && (
                            <span className="text-[10px] text-[var(--muted)] font-mono">{turn.timestamp}</span>
                          )}
                        </div>
                        <p className="text-sm text-[var(--ink)] leading-relaxed">
                          {turn.text}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              /* Fallback single script view */
              (podcast.script || podcast.content || podcast.text) && (
                <div className="mb-4 brand-tag bg-blue-50 p-4 dark:bg-blue-900/20">
                  <p className="text-xs font-bold text-blue-500 mb-2">النص</p>
                  <div className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                    {podcast.script || podcast.content || podcast.text}
                  </div>
                </div>
              )
            )}
          </div>

          {audioUrl && (
            <div className="border border-[var(--line)] rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
              <audio ref={audioRef} controls src={audioUrl} className="w-full" autoPlay />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={synthesize}
              disabled={ttsLoading}
              className="flex-1 brand-btn-primary py-3 disabled:opacity-40"
            >
              {ttsLoading ? 'جاري تحويل الحوار إلى صوت...' : '🔊 تحويل لصوت (TTS Audio)'}
            </button>
            <button
              onClick={() => { setPodcast(null); setAudioUrl(null) }}
              className="brand-btn-ghost px-6 py-3"
            >
              حلقة جديدة
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
