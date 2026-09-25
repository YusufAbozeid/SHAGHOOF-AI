import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import api from '../services/api'
import Mascot from '../components/Mascot'


export default function FeynmanChallenge() {
  const { user } = useApp()
  const [subjects, setSubjects] = useState([])
  const [topic, setTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydrate from storage
    setSubjects(user?.subjects || JSON.parse(localStorage.getItem('shaghoof_user') || '{}').subjects || [])
  }, [user?.subjects])
  const [result, setResult] = useState(null)

  const evaluate = async () => {
    if (!topic || !explanation.trim()) return
    setLoading(true)
    try {
      // Schema: { topic, student_explanation, language }
      const res = await api.evaluateFeynman({
        topic,
        student_explanation: explanation.trim(),
        language: 'en',
      })
      setResult(res)
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const { user, awardXp } = useApp()

  const rawScore = result?.simplicity_score !== undefined ? result.simplicity_score : (result?.score || result?.rating || 0)
  const isHundredScale = result?.simplicity_score !== undefined
  const displayScore = rawScore
  const scoreMax = isHundredScale ? 100 : 10

  const evaluate = async () => {
    if (!topic || !explanation.trim()) return
    setLoading(true)
    try {
      const res = await api.evaluateFeynman({
        topic,
        student_explanation: explanation.trim(),
        language: 'ar',
      })
      setResult(res)
      if (res?.xp_earned) {
        awardXp(res.xp_earned, 'Feynman Challenge')
      }
    } catch {
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Mascot size={48} animate mood={(isHundredScale ? displayScore >= 70 : displayScore >= 7) ? 'happy' : (isHundredScale ? displayScore >= 40 : displayScore >= 4) ? 'neutral' : 'sad'} className="mascot-float" />
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--brand)]" style={{ fontFamily: 'var(--font-heading)' }}>تحدي فاينمان 🧠 Feynman Challenge</h1>
          <p className="text-sm text-[var(--muted)]">اشرح الفكرة ببساطة — لو قدرت تشرحها كأنك بتعلم طفل، يبقى فهمتها صح!</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-4">
          <div className="border border-[var(--line)] rounded-lg bg-[var(--brand-light)]/20 p-4">
            <p className="text-sm text-[var(--ink)]">
              <strong>إزاي بيشتغل؟</strong> اكتب شرحك الخاص لأي موضوع كانك بتشرحه لطفل في إعدادي بدون مصطلحات معقدة. الذكاء الاصطناعي هيقيم بساطة الشرح، التشبيهات المستخدمة، واختبار الجدة!
            </p>
          </div>
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
            <label className="mb-1 block text-sm font-bold text-[var(--ink)]">الموضوع (Topic)</label>
            <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="مثال: الجاذبية الأرضية، الدوال في البرمجة..." className="w-full brand-input" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold text-[var(--ink)]">شرحك بأسلوبك (Your Explanation)</label>
            <textarea value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder="اشرح الموضوع بأبسط طريقة ممكنة مع تشبيه واقعي..." rows={6} className="w-full brand-textarea" />
            <p className="mt-1 text-xs text-[var(--muted)]">{explanation.split(/\s+/).filter(Boolean).length} كلمات</p>
          </div>
          <button onClick={evaluate} disabled={!topic || !explanation.trim() || loading} className="w-full brand-btn-primary py-3 disabled:opacity-40">
            {loading ? 'جاري تقييم الشرح بالذكاء الاصطناعي...' : 'تقييم الشرح (Evaluate)'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border border-[var(--line)] rounded-lg p-6 text-center bg-[var(--surface)]">
            <div className="mb-2 text-5xl font-black text-[var(--brand)]">{displayScore}<span className="text-lg text-[var(--muted)]">/{scoreMax}</span></div>
            <p className="text-sm font-bold text-[var(--ink)]">درجة بساطة فاينمان (Simplicity Score)</p>
            {result.verdict && (
              <div className="mt-3 inline-block px-4 py-1.5 rounded-full bg-[var(--brand-light)] text-[var(--brand)] font-extrabold text-sm border border-[var(--brand)]">
                🏆 {result.verdict}
              </div>
            )}
            {result.xp_earned && (
              <div className="mt-2 text-xs font-bold text-amber-500">
                ✨ +{result.xp_earned} XP مكتسبة!
              </div>
            )}
          </div>

          {/* Feynman Criteria Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className={`p-3 rounded-lg border text-center ${result.grandma_test_passed ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/30 dark:text-green-300' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/30 dark:text-red-300'}`}>
              <div className="text-xl">{result.grandma_test_passed ? '👵 ✅' : '👵 ❌'}</div>
              <div className="text-xs font-bold mt-1">اختبار الجدة</div>
              <div className="text-[10px] opacity-75">{result.grandma_test_passed ? 'مفهوم وبسيط' : 'يحتاج تبسيط'}</div>
            </div>

            <div className={`p-3 rounded-lg border text-center ${result.has_analogy ? 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/30 dark:text-blue-300' : 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300'}`}>
              <div className="text-xl">{result.has_analogy ? '🎯 ✅' : '🎯 ⚠️'}</div>
              <div className="text-xs font-bold mt-1">استخدام التشبيهات</div>
              <div className="text-[10px] opacity-75">{result.has_analogy ? 'تشبيه واضح' : 'يفضل إضافة تشبيه'}</div>
            </div>

            <div className="p-3 rounded-lg border text-center bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/30 dark:text-purple-300 col-span-2 sm:col-span-1">
              <div className="text-xl">📚 {result.jargon_count ?? 0}</div>
              <div className="text-xs font-bold mt-1">المصطلحات المعقدة</div>
              <div className="text-[10px] opacity-75">{result.jargon_count === 0 ? 'خالي من التعقيد' : 'مصطلحات مستخدمة'}</div>
            </div>
          </div>

          {result.feedback && (
            <div className="border border-[var(--line)] rounded-lg p-5 bg-[var(--surface)]">
              <h3 className="mb-2 text-sm font-extrabold text-[var(--brand)]" style={{ fontFamily: 'var(--font-heading)' }}>ملاحظات التقييم (Feedback)</h3>
              <p className="text-sm text-[var(--ink)] whitespace-pre-line leading-relaxed">{result.feedback}</p>
            </div>
          )}

          {result.detected_jargons && result.detected_jargons.length > 0 && (
            <div className="border border-amber-200 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">مصطلحات تقنية معقدة يُفضل استبدالها بألفاظ بسيطة:</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {result.detected_jargons.map((j, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-xs bg-amber-200 text-amber-900 font-medium">
                    {j}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.strengths && (
            <div className="border border-[var(--line)] rounded-lg bg-green-50 dark:bg-green-950/30 p-4">
              <p className="text-sm font-bold text-green-700 dark:text-green-300 mb-1">نقاط القوة</p>
              <p className="text-sm text-[var(--ink)]">{Array.isArray(result.strengths) ? result.strengths.join('. ') : result.strengths}</p>
            </div>
          )}

          {result.improvements && (
            <div className="border border-[var(--line)] rounded-lg bg-amber-50 dark:bg-amber-950/30 p-4">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-300 mb-1">فرص للتحسين</p>
              <p className="text-sm text-[var(--ink)]">{Array.isArray(result.improvements) ? result.improvements.join('. ') : result.improvements}</p>
            </div>
          )}

          <button onClick={() => { setResult(null); setExplanation('') }} className="w-full brand-btn-ghost py-3">
            تجربة شرح جديد (Try Again)
          </button>
        </div>
      )}
    </div>
  )
}
