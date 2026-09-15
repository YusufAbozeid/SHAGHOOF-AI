import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Mic, 
  MicOff,
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  BrainCircuit
} from 'lucide-react';

interface ReverseFeynmanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReverseFeynmanModal: React.FC<ReverseFeynmanModalProps> = ({ isOpen, onClose }) => {
  const { language, themeMode, addXP, activeTopicId, topics } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const currentTopic = topics.find(t => t.id === activeTopicId) || topics[0] || {
    titleAr: 'التمرير الخلفي وضبط الأوزان العصبية',
    titleEn: 'Backpropagation and Neural Weight Optimization'
  };

  const topicTitle = isAr ? currentTopic.titleAr : currentTopic.titleEn;

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isAr ? 'ar-EG' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(prev => prev + ' ' + transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isAr]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(isAr ? 'المتصفح لا يدعم ميزة التعرف على الصوت المباشر' : 'Speech recognition not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleEvaluate = () => {
    if (!inputText.trim()) return;

    setIsEvaluating(true);
    setTimeout(() => {
      const text = inputText.toLowerCase();
      const jargons = ['اشتقاق', 'تدرج جزئي', 'هايبرباراميتر', 'جاكوبيان', 'تنسور', 'backprop', 'hyperparameter', 'gradient'];
      const detected = jargons.filter(j => text.includes(j));
      const hasAnalogy = ['زي', 'كأنه', 'تخيل', 'مثل', 'like', 'imagine'].some(w => text.includes(w));

      const simplicity = Math.min(96, Math.max(35, 80 - (detected.length * 15) + (hasAnalogy ? 20 : 0)));
      const passedGrandma = simplicity >= 70 && detected.length <= 1;

      if (passedGrandma) {
        addXP(150);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else {
        addXP(40);
      }

      setResult({
        simplicityScore: simplicity,
        detectedJargons: detected,
        hasAnalogy,
        passedGrandma,
        feedback: passedGrandma 
          ? (isAr ? 'عبقري ومبهر! شرحت الفكرة بتشبيه فطري تفهمه جدتك أو طفل صغير دون أي تعقيد!' : 'Magnificent! You explained it using a natural analogy that anyone can understand!')
          : (isAr ? `بداية ممتازة، ولكنك استخدمت مصطلحات معقدة (${detected.join('، ')}). حاول استبدالها بتشبيه من الحياة اليومية!` : 'Good start, but try replacing technical jargon with everyday real-life metaphors.')
      });

      setIsEvaluating(false);
    }, 600);
  };

  const loadSample = (type: 'football' | 'archery' | 'guitar') => {
    if (type === 'football') {
      setInputText(isAr 
        ? 'تخيل إن الموديل زي فريق كورة: المهاجم شاط الكورة وطلعت برة الجول بـ 5 أمتار (ده الخطأ)، يقوم المدرب يرجع خطوة لورا ويقول لخط الوسط والمدافعين يعدلوا باصاتهم عشان الشوتة الجاية تدخل جول!'
        : 'Imagine the model is a football striker who missed the goal by 5 meters. The coach steps back, assesses the mistake, and instructs the midfielders to adjust their passing angle so the next shot hits the net!'
      );
    } else if (type === 'archery') {
      setInputText(isAr
        ? 'زي اللي بيتعلم نيشان: أول سهم جه فوق الهدف بـ 10 سم، في الرمية التانية بتنزل إيدك 10 سم لتحت عشان تظبط، وده هو بالضبط التمرير الخلفي للأخطاء!'
        : 'Like an archer aiming at a target: your first arrow lands 10cm too high, so on your second attempt you lower your bow by exactly 10cm to compensate!'
      );
    } else {
      setInputText(isAr
        ? 'زي لما بتدوزن أوتار الجيتار: بتسمع النغمة النشاز، وتفضل تلف المفتاح يمين أو شمال لحد ما الصوت يرن مظبوط تماماً.'
        : 'Like tuning a guitar string: you listen for the dissonance, and gently turn the peg left or right until the frequency matches perfection.'
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className={`w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-purple-500/10' 
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
        }`}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? '🧠 تحدي فاينمان العكسي (Reverse Feynman Challenge)' : '🧠 Reverse Feynman Challenge'}
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/30">
                  Active Recall
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'الذكاء الاصطناعي يتحدّاك: اشرح الفكرة المعقدة ببساطة تفهمها جدتك أو طفل صغير!' : 'The AI challenges you: Explain a complex concept in words simple enough for your grandma!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Challenge Box */}
        <div className={`p-6 border-b ${
          isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-purple-50/50 border-purple-100'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl select-none">👵</span>
            <div>
              <h3 className="text-sm font-extrabold text-purple-600 dark:text-purple-400 mb-1">
                {isAr ? 'تحدي اليوم للمنهج النشط:' : 'Today\'s Syllabus Challenge:'}
              </h3>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                {isAr 
                  ? `اشرح لي موضوع "${topicTitle}" بدون استخدام أي مصطلحات رياضية جافة، واستخدم تشبيهاً بسيطاً من الحياة اليومية!`
                  : `Explain "${topicTitle}" without using dry mathematical jargon. Use an everyday relatable analogy!`}
              </p>
            </div>
          </div>

          {/* Quick Pre-fill Samples */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-purple-200/50 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {isAr ? 'أمثلة تشبيه ملهمة:' : 'Inspiration analogies:'}
            </span>
            <button
              type="button"
              onClick={() => loadSample('football')}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-purple-500 transition"
            >
              ⚽ فريق كرة القدم
            </button>
            <button
              type="button"
              onClick={() => loadSample('archery')}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-purple-500 transition"
            >
              🎯 تصويب الرماية
            </button>
            <button
              type="button"
              onClick={() => loadSample('guitar')}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-purple-500 transition"
            >
              🎸 دوزنة الجيتار
            </button>
          </div>
        </div>

        {/* Input Textarea & Speech Recognition */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isAr ? 'اكتب شرحك هنا أو اضغط على أيقونة الميكروفون وتحدث بصوتك مباشرة...' : 'Type your explanation here or click the microphone to speak...'}
              className="w-full p-4 rounded-2xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />

            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-xl transition ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white'
                }`}
                title={isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {inputText && (
                <button
                  type="button"
                  onClick={() => { setInputText(''); setResult(null); }}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                  title="مسح النص"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {inputText.split(/\s+/).filter(Boolean).length} {isAr ? 'كلمة' : 'words'}
            </span>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isEvaluating || !inputText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black shadow-lg shadow-purple-500/20 disabled:opacity-50 hover:scale-105 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEvaluating ? (isAr ? 'جاري التحليل الذكي...' : 'Evaluating...') : (isAr ? 'تقييم الشرح واختبار الجدة' : 'Submit for Grandma Test')}</span>
            </button>
          </div>

          {/* Evaluation Results Card */}
          {result && (
            <div className={`p-5 rounded-2xl border space-y-4 animate-fade-in ${
              result.passedGrandma 
                ? 'bg-emerald-500/10 border-emerald-500/40' 
                : 'bg-amber-500/10 border-amber-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold ${
                    result.passedGrandma ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}>
                    {result.passedGrandma ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {result.passedGrandma ? (isAr ? 'اجتزت اختبار الجدة بنجاح! 👵🎉' : 'Passed Grandma Test! 👵🎉') : (isAr ? 'يحتاج إلى مزيد من التبسيط 🔄' : 'Needs Simplification 🔄')}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {result.passedGrandma ? '+150 XP حصلت على وسام ماستر فاينمان' : '+40 XP للمحاولة الجيدة'}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-left">
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'مؤشر البساطة' : 'Simplicity'}</span>
                  <span className="text-xl font-black text-purple-600 dark:text-purple-400">
                    {result.simplicityScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {result.feedback}
              </p>

              {result.detectedJargons.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {isAr ? 'مصطلحات معقدة تم رصدها:' : 'Jargon words detected:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.detectedJargons.map((jg: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-rose-500/10 text-rose-500 border border-rose-500/30">
                        {jg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}>
          <span className="font-bold text-purple-500">
            Feynman Pedagogical Engine
          </span>
          <span>
            {isAr ? 'إذا لم تستطع شرحها ببساطة، فأنت لم تفهمها بما يكفي — ألبرت أينشتاين' : 'If you cannot explain it simply, you do not understand it well enough'}
          </span>
        </div>
      </div>
    </div>
  );
};
