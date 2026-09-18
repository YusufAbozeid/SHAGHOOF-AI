import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Gamepad2, X, Sparkles, Trophy, CheckCircle2, Link, Disc, 
  AlertCircle, Heart, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  TOP_15_WORDWALL_TEMPLATES,
  getWordwallGameData,
  type WordwallGameTemplate
} from '../../services/wordwallDataService';

export type { WordwallGameTemplate };

interface WordwallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordwallModal: React.FC<WordwallModalProps> = ({ isOpen, onClose }) => {
  const { activeTopicId, topics, addXP, language } = useStore();
  const isAr = language === 'ar';
  
  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const currentData = useMemo(() => getWordwallGameData(activeTopic), [activeTopic]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('gameshow_quiz');
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Common Gameplay State
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Match-up State
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  // Wheel State
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Flashcards State
  const [cardRevealed, setCardRevealed] = useState<boolean>(false);

  // Anagram State
  const [anagramBuilt, setAnagramBuilt] = useState<string[]>([]);

  // Group Sort State
  const [placedGroupItems, setPlacedGroupItems] = useState<Record<number, 1 | 2>>({});

  // Rank Order State
  const [userRankSteps, setUserRankSteps] = useState<{ id: number; textAr: string; textEn: string; correctOrder: number }[]>([]);
  const [rankValidated, setRankValidated] = useState<boolean>(false);

  // Balloon Pop State
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);

  // Maze Chase State
  const [mazeSelectedDoor, setMazeSelectedDoor] = useState<number | null>(null);

  const currentTemplate = TOP_15_WORDWALL_TEMPLATES.find(t => t.id === selectedTemplateId) || TOP_15_WORDWALL_TEMPLATES[0];

  // Reset gameplay state when template or topic changes
  useEffect(() => {
    setScore(0);
    setLives(3);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setMatchedPairs([]);
    setSelectedTerm(null);
    setWheelRotation(0);
    setIsSpinning(false);
    setCardRevealed(false);
    setAnagramBuilt([]);
    setPlacedGroupItems({});
    setUserRankSteps([...currentData.rankSteps].sort(() => Math.random() - 0.5));
    setRankValidated(false);
    setPoppedBalloons([]);
    setMazeSelectedDoor(null);
    setGameCompleted(false);
    setFeedbackMsg(null);
  }, [selectedTemplateId, activeTopicId, currentData]);

  const handleClaimXP = () => {
    if (!gameCompleted) {
      setGameCompleted(true);
      addXP(50);
    }
  };

  const handleLoadCustomUrl = (urlToLoad?: string) => {
    const raw = urlToLoad || inputUrl;
    if (!raw.trim()) return;
    let cleanEmbed = raw.trim();
    if (cleanEmbed.includes('wordwall.net/resource/')) {
      cleanEmbed = cleanEmbed.replace('/resource/', '/embed/');
    } else if (cleanEmbed.includes('wordwall.net/play/')) {
      cleanEmbed = cleanEmbed.replace('/play/', '/embed/');
    }
    setGameUrl(cleanEmbed);
  };

  const moveRankStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= userRankSteps.length) return;
    const updated = [...userRankSteps];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setUserRankSteps(updated);
    setRankValidated(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="w-full max-w-5xl bg-card border border-accent-purple/50 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-accent-purple via-sky-500 to-accent-cyan flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Gamepad2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {isAr ? 'أشهر ألعاب Wordwall التفاعلية (Wordwall Games Suite)' : 'Wordwall Games Suite'}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-sky-300 font-bold border border-purple-500/40">
                  🎯 {isAr ? `الموضوع النشط: ${activeTopic.titleAr}` : `Active Topic: ${activeTopic.titleEn}`}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? 'تم ضبط محركات اللعب وإتاحة الإجابات الصحيحة والخاطئة مع حساب النقاط والقلوب فورياً' : 'All Wordwall templates are fully tuned with score tracking, hearts system, and real answer validation'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wordwall Game Templates Selector Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
              {isAr ? '📋 اختر لعبة تفاعلية من القائمة:' : '📋 Select Game from Wordwall Suite:'}
            </span>
            <span className="text-[11px] text-amber-300 font-bold">
              {isAr ? `النشاط المفعل: ${currentTemplate.icon} ${currentTemplate.nameAr}` : `Active: ${currentTemplate.icon} ${currentTemplate.nameEn}`}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 max-h-36 overflow-y-auto">
            {TOP_15_WORDWALL_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  title={isAr ? tmpl.descriptionAr : tmpl.nameEn}
                  className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-b from-purple-600/40 to-cyan-600/40 border-sky-400 text-white shadow-lg scale-[1.03]'
                      : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-base leading-none">{tmpl.icon}</span>
                  <span className="text-[10px] font-bold truncate w-full">{isAr ? tmpl.nameAr : tmpl.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Feedback Toast Alert */}
        {feedbackMsg && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
              : 'bg-rose-500/20 border border-rose-400 text-rose-300'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* GAMEPLAY STAGE RENDERER */}
        <div className="w-full h-[410px] rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between relative overflow-hidden">
          
          {/* TEMPLATE 1: QUIZ ARENA (المسابقة التفاعلية) */}
          {selectedTemplateId === 'gameshow_quiz' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2 text-xs font-bold">
                <span className="text-purple-400">🎯 {isAr ? 'المسابقة التفاعلية متعددة الخيارات' : 'Interactive Quiz Arena'}</span>
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current" /> {lives}</span>
                  <span className="text-emerald-400">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
                  <span className="text-slate-400">{currentQIndex + 1} / {currentData.quizQuestions.length}</span>
                </div>
              </div>

              <div className="my-auto space-y-4 max-w-lg w-full">
                <h4 className="text-xs font-extrabold text-white bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
                  {isAr ? currentData.quizQuestions[currentQIndex].qAr : currentData.quizQuestions[currentQIndex].qEn}
                </h4>

                <div className="grid grid-cols-2 gap-2.5">
                  {(isAr ? currentData.quizQuestions[currentQIndex].optionsAr : currentData.quizQuestions[currentQIndex].optionsEn).map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === currentData.quizQuestions[currentQIndex].correct;
                    return (
                      <button 
                        key={i} 
                        onClick={() => {
                          setSelectedOption(i);
                          if (isCorrect) {
                            setScore(prev => prev + 25);
                            setFeedbackMsg({ text: isAr ? 'إجابة صحيحة! أحسنت 🎯 (+25 نقطة)' : 'Correct answer! (+25 pts)', type: 'success' });
                            handleClaimXP();
                          } else {
                            setLives(prev => Math.max(0, prev - 1));
                            setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! السبب: ${currentData.quizQuestions[currentQIndex].explanationAr}` : 'Incorrect answer!', type: 'error' });
                          }
                        }} 
                        className={`p-3 rounded-xl border text-xs font-bold text-right transition ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-rose-500/20 border-rose-400 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 2: MATCH-UP (التوصيل والمطابقة) */}
          {selectedTemplateId === 'match_up' && (
            <div className="w-full h-full flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'اختر المصطلح باليمين ثم انقر على التعريف المطابق باليسار:' : 'Select term on the right, then match with definition:'}</span>
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {matchedPairs.length} / {currentData.matchPairs.length} {isAr ? 'أزواج مكتملة' : 'matched'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                <div className="space-y-2">
                  {currentData.matchPairs.map(t => (
                    <button
                      key={t.id}
                      disabled={matchedPairs.includes(t.id)}
                      onClick={() => setSelectedTerm(t.id)}
                      className={`w-full p-2.5 rounded-xl border text-xs font-bold text-right transition flex items-center justify-between ${
                        matchedPairs.includes(t.id) 
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 opacity-60' 
                          : selectedTerm === t.id 
                          ? 'bg-purple-600/30 border-sky-400 text-sky-300' 
                          : 'bg-card border-slate-800 text-white'
                      }`}
                    >
                      <span>{t.term}</span>
                      {matchedPairs.includes(t.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {[...currentData.matchPairs].sort((a,b) => a.defAr.localeCompare(b.defAr)).map(d => (
                    <button
                      key={d.id}
                      disabled={matchedPairs.includes(d.id)}
                      onClick={() => {
                        if (!selectedTerm) return;
                        if (selectedTerm === d.id) {
                          const next = [...matchedPairs, d.id];
                          setMatchedPairs(next);
                          setSelectedTerm(null);
                          setFeedbackMsg({ text: isAr ? 'اقتران صحيح! أحسنت 🎯' : 'Correct match!', type: 'success' });
                          if (next.length === currentData.matchPairs.length) { handleClaimXP(); }
                        } else {
                          setSelectedTerm(null);
                          setFeedbackMsg({ text: isAr ? 'إجابة غير متطابقة، حاول ثانية ❌' : 'Incorrect match, try again', type: 'error' });
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-right transition flex items-center justify-between ${
                        matchedPairs.includes(d.id) 
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 opacity-60' 
                          : 'bg-card border-slate-800 text-slate-200 hover:border-purple-500'
                      }`}
                    >
                      <span>{isAr ? d.defAr : d.defEn}</span>
                      {matchedPairs.includes(d.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: SPIN THE WHEEL */}
          {selectedTemplateId === 'spin_wheel' && (
            <div className="w-full h-full flex flex-col items-center justify-between">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Disc className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'أدر العجلة ليتم اختيار سؤال التحدي:' : 'Spin the wheel for topic questions:'}</span>
                </span>
                <span className="text-xs font-bold text-emerald-400">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 my-auto w-full justify-center">
                <div className="text-center space-y-3 shrink-0">
                  <div 
                    className="w-36 h-36 rounded-full border-4 border-amber-400 bg-gradient-to-tr from-purple-600 via-sky-600 to-amber-500 flex items-center justify-center transition-all duration-3000 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                    style={{ transform: `rotate(${wheelRotation}deg)` }}
                  >
                    <Disc className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <button 
                    disabled={isSpinning}
                    onClick={() => {
                      if (isSpinning) return;
                      setIsSpinning(true);
                      setFeedbackMsg(null);
                      const extra = 1440 + Math.floor(Math.random() * 360);
                      setWheelRotation(prev => prev + extra);
                      setTimeout(() => {
                        setIsSpinning(false);
                        const qIdx = Math.floor(Math.random() * currentData.quizQuestions.length);
                        setCurrentQIndex(qIdx);
                      }, 3000);
                    }} 
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 text-slate-950 font-extrabold text-xs shadow-lg disabled:opacity-50"
                  >
                    {isSpinning ? (isAr ? 'جاري اللف...' : 'Spinning...') : (isAr ? '🎡 اَدر العجلة!' : 'Spin!')}
                  </button>
                </div>

                {currentQIndex !== null && (
                  <div className="flex-1 bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 w-full">
                    <h4 className="text-xs font-bold text-white mb-2">
                      {isAr ? currentData.quizQuestions[currentQIndex].qAr : currentData.quizQuestions[currentQIndex].qEn}
                    </h4>
                    <div className="space-y-2">
                      {(isAr ? currentData.quizQuestions[currentQIndex].optionsAr : currentData.quizQuestions[currentQIndex].optionsEn).map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedOption(idx);
                            if (idx === currentData.quizQuestions[currentQIndex].correct) {
                              setScore(prev => prev + 20);
                              setFeedbackMsg({ text: isAr ? 'إجابة صحيحة! أحسنت 🎉' : 'Correct answer!', type: 'success' });
                              handleClaimXP();
                            } else {
                              setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! ${currentData.quizQuestions[currentQIndex].explanationAr}` : 'Incorrect answer!', type: 'error' });
                            }
                          }}
                          className={`w-full p-2.5 rounded-xl border text-xs font-bold text-right transition ${
                            selectedOption === idx
                              ? idx === currentData.quizQuestions[currentQIndex].correct
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                : 'bg-rose-500/20 border-rose-400 text-rose-300'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-purple-500'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEMPLATE 4: TRUE OR FALSE */}
          {selectedTemplateId === 'true_false' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400">⚡ {isAr ? 'حدد صحة أو خطأ العبارة التالية:' : 'Evaluate True or False:'}</span>
                <span className="text-xs text-slate-400 font-bold">{currentQIndex + 1} / {currentData.trueFalseStatements.length}</span>
              </div>

              <div className="my-auto space-y-4 max-w-lg w-full bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <p className="text-sm font-extrabold text-white leading-relaxed">
                  "{isAr ? currentData.trueFalseStatements[currentQIndex].statementAr : currentData.trueFalseStatements[currentQIndex].statementEn}"
                </p>

                <div className="flex justify-center gap-4 pt-2">
                  <button 
                    onClick={() => {
                      const stmt = currentData.trueFalseStatements[currentQIndex];
                      if (stmt.isTrue === true) {
                        setScore(prev => prev + 15);
                        setFeedbackMsg({ text: isAr ? `صحيح! 🎯 ${stmt.explanationAr}` : 'Correct!', type: 'success' });
                        handleClaimXP();
                      } else {
                        setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! ${stmt.explanationAr}` : 'Incorrect!', type: 'error' });
                      }
                      setCurrentQIndex((prev) => (prev + 1) % currentData.trueFalseStatements.length);
                    }} 
                    className="px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-sm hover:scale-105 transition"
                  >
                    ✅ {isAr ? 'صواب (True)' : 'True'}
                  </button>

                  <button 
                    onClick={() => {
                      const stmt = currentData.trueFalseStatements[currentQIndex];
                      if (stmt.isTrue === false) {
                        setScore(prev => prev + 15);
                        setFeedbackMsg({ text: isAr ? `صحيح! 🎯 ${stmt.explanationAr}` : 'Correct!', type: 'success' });
                        handleClaimXP();
                      } else {
                        setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! ${stmt.explanationAr}` : 'Incorrect!', type: 'error' });
                      }
                      setCurrentQIndex((prev) => (prev + 1) % currentData.trueFalseStatements.length);
                    }} 
                    className="px-6 py-3 rounded-2xl bg-rose-500/20 border border-rose-400 text-rose-300 font-extrabold text-sm hover:scale-105 transition"
                  >
                    ❌ {isAr ? 'خطأ (False)' : 'False'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 5: WHACK A MOLE */}
          {selectedTemplateId === 'whack_a_mole' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-rose-400">🔨 {isAr ? 'اصطد القوارض التي تحمل الإجابة الصحيحة فقط:' : 'Whack only the mole with the correct answer!'}</span>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-400 flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current" /> {lives}</span>
                  <span className="text-emerald-400">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
                </div>
              </div>

              <div className="my-auto space-y-4 w-full max-w-lg">
                <h4 className="text-xs font-bold text-white bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-md">
                  {isAr ? currentData.quizQuestions[0].qAr : currentData.quizQuestions[0].qEn}
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {(isAr ? currentData.quizQuestions[0].optionsAr : currentData.quizQuestions[0].optionsEn).map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (idx === currentData.quizQuestions[0].correct) {
                          setScore(prev => prev + 20);
                          setFeedbackMsg({ text: isAr ? 'ضربة صائبة! تم اصطياد الإجابة الصحيحة 🔨🎯' : 'Correct Whack!', type: 'success' });
                          handleClaimXP();
                        } else {
                          setLives(prev => Math.max(0, prev - 1));
                          setFeedbackMsg({ text: isAr ? 'اصطياد خاطئ! خسرت محاولة ❌' : 'Wrong Mole!', type: 'error' });
                        }
                      }}
                      className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-extrabold text-white transition transform active:scale-95 flex items-center justify-between shadow-lg"
                    >
                      <span className="text-xl">🐹</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 6: ANAGRAM */}
          {selectedTemplateId === 'anagram' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="border-b border-slate-800 pb-2 text-xs font-bold text-teal-400 w-full text-right">
                🔤 {isAr ? 'انقر الأحرف بالتسلسل الصحيح لتجميع المصطلح العلمي:' : 'Click letters in order to spell the target term:'}
              </div>
              <div className="my-auto space-y-4">
                <span className="text-xs text-slate-400 block">{isAr ? 'المصطلح المكتشف:' : 'Target Term:'}</span>
                <div className="flex justify-center gap-2">
                  {currentData.anagramTerm.split('').map((char, i) => {
                    const isSelected = anagramBuilt.includes(`${char}_${i}`);
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (isSelected) return;
                          const next = [...anagramBuilt, `${char}_${i}`];
                          setAnagramBuilt(next);
                          if (next.length === currentData.anagramTerm.length) {
                            const formed = next.map(s => s.split('_')[0]).join('');
                            if (formed === currentData.anagramTerm) {
                              setFeedbackMsg({ text: isAr ? 'تجميع صحيح للمصطلح! +50 XP 🎯' : 'Correct Spelled Term!', type: 'success' });
                              handleClaimXP();
                            } else {
                              setFeedbackMsg({ text: isAr ? 'ترتيب غير صحيح ❌! تم إعادة الضبط' : 'Incorrect order!', type: 'error' });
                              setAnagramBuilt([]);
                            }
                          }
                        }}
                        className={`w-10 h-12 rounded-xl border flex items-center justify-center font-extrabold text-sm transition ${
                          isSelected ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-slate-800 text-sky-300 hover:border-purple-500'
                        }`}
                      >
                        {char}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 7: MISSING WORD */}
          {selectedTemplateId === 'missing_word' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="border-b border-slate-800 pb-2 text-xs font-bold text-amber-400 w-full text-right">
                📝 {isAr ? 'أكمل الكلمة المفقودة في الجملة العلمية التالية:' : 'Fill in the missing word:'}
              </div>
              <div className="my-auto space-y-4 max-w-md w-full bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold text-white leading-relaxed">
                  {currentData.missingWordSentence.sentenceAr}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {currentData.missingWordSentence.wordOptionsAr.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (w === currentData.missingWordSentence.correctWord) {
                          setFeedbackMsg({ text: isAr ? 'إكمال صحيح للجملة! +50 XP 🎯' : 'Correct missing word!', type: 'success' });
                          handleClaimXP();
                        } else {
                          setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! الكلمة الصحيحة هي: ${currentData.missingWordSentence.correctWord}` : 'Incorrect word!', type: 'error' });
                        }
                      }}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-sky-300 hover:border-purple-500 transition"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 8: AIRPLANE FLIGHT */}
          {selectedTemplateId === 'airplane_flight' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="border-b border-slate-800 pb-2 text-xs font-bold text-sky-400 w-full text-right">
                ✈️ {isAr ? 'وجه الطائرة نحو السحابة ذات الإجابة الصحيحة فقط:' : 'Fly through the correct answer cloud!'}
              </div>
              <div className="my-auto space-y-4 max-w-lg w-full">
                <span className="text-4xl animate-bounce block">✈️ ☁️</span>
                <h4 className="text-xs font-bold text-white bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {isAr ? currentData.quizQuestions[0].qAr : currentData.quizQuestions[0].qEn}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {(isAr ? currentData.quizQuestions[0].optionsAr : currentData.quizQuestions[0].optionsEn).map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => {
                        if (i === currentData.quizQuestions[0].correct) {
                          setFeedbackMsg({ text: isAr ? 'طيران ناجح عبر السحابة الصحيحة! ✈️✨' : 'Successful Flight!', type: 'success' });
                          handleClaimXP();
                        } else {
                          setFeedbackMsg({ text: isAr ? 'اصطدام بسحابة خاطئة 💥! حاول مجدداً' : 'Cloud Collision!', type: 'error' });
                        }
                      }} 
                      className="p-3 rounded-xl bg-sky-500/15 border border-sky-400/40 text-sky-300 font-bold text-xs hover:scale-105 transition"
                    >
                      ☁️ {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 9: FLASHCARDS */}
          {selectedTemplateId === 'flashcards' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="border-b border-slate-800 pb-2 text-xs font-bold text-amber-400 w-full text-right">
                🎴 {isAr ? 'اقلب بطاقة المراجعة لمعاينة الشرح والمفهوم:' : 'Flip flashcard for concept breakdown:'}
              </div>
              <div 
                onClick={() => setCardRevealed(!cardRevealed)}
                className="w-full max-w-md h-44 my-auto rounded-3xl bg-gradient-to-br from-slate-900 to-purple-950 border-2 border-purple-500/40 p-6 flex flex-col items-center justify-center cursor-pointer transition shadow-2xl hover:scale-105"
              >
                <span className="text-[10px] text-sky-400 font-bold uppercase mb-1">{isAr ? 'انقر لقلب البطاقة' : 'Click to flip'}</span>
                <h4 className="text-base font-extrabold text-white mb-2">{currentData.matchPairs[0].term}</h4>
                {cardRevealed && (
                  <p className="text-xs text-amber-300 font-semibold animate-fade-in">{isAr ? currentData.matchPairs[0].defAr : currentData.matchPairs[0].defEn}</p>
                )}
              </div>
            </div>
          )}

          {/* TEMPLATE 10: GROUP SORT (تصنيف المجموعات) */}
          {selectedTemplateId === 'group_sort' && (
            <div className="w-full h-full flex flex-col justify-between">
              <div className="border-b border-slate-800 pb-2 text-xs font-bold text-sky-400 flex items-center justify-between">
                <span>⚖️ {isAr ? 'انقر على العنصر ثم اختر التصنيف الصحيح لإدراجه في الصندوق:' : 'Select item and place into correct bucket:'}</span>
                <span className="text-emerald-400 text-xs">{Object.keys(placedGroupItems).length} / {currentData.groupSortData.items.length} {isAr ? 'مُصنّف' : 'sorted'}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1 items-stretch my-2">
                {/* Category Bucket 1 */}
                <div className="bg-slate-900/90 border-2 border-purple-500/40 rounded-2xl p-3 flex flex-col justify-between">
                  <h5 className="text-xs font-extrabold text-purple-300 border-b border-slate-800 pb-1.5 text-center">
                    {isAr ? currentData.groupSortData.cat1Ar : currentData.groupSortData.cat1En}
                  </h5>
                  <div className="space-y-1.5 my-auto max-h-36 overflow-y-auto">
                    {currentData.groupSortData.items.map((item, idx) => {
                      if (placedGroupItems[idx] !== 1) return null;
                      return (
                        <div key={idx} className="bg-purple-500/20 border border-purple-400 text-purple-200 text-[11px] font-bold p-1.5 rounded-lg flex items-center justify-between">
                          <span>{isAr ? item.textAr : item.textEn}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category Bucket 2 */}
                <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-2xl p-3 flex flex-col justify-between">
                  <h5 className="text-xs font-extrabold text-cyan-300 border-b border-slate-800 pb-1.5 text-center">
                    {isAr ? currentData.groupSortData.cat2Ar : currentData.groupSortData.cat2En}
                  </h5>
                  <div className="space-y-1.5 my-auto max-h-36 overflow-y-auto">
                    {currentData.groupSortData.items.map((item, idx) => {
                      if (placedGroupItems[idx] !== 2) return null;
                      return (
                        <div key={idx} className="bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-[11px] font-bold p-1.5 rounded-lg flex items-center justify-between">
                          <span>{isAr ? item.textAr : item.textEn}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Unsorted Items Bar */}
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
                <span className="text-[11px] font-bold text-slate-400 shrink-0">{isAr ? 'المفاهيم:' : 'Items:'}</span>
                {currentData.groupSortData.items.map((item, idx) => {
                  if (placedGroupItems[idx] !== undefined) return null;
                  return (
                    <div key={idx} className="flex items-center gap-1 bg-slate-950 border border-slate-700 px-2 py-1 rounded-lg text-[11px] font-bold text-white shrink-0">
                      <span>{isAr ? item.textAr : item.textEn}</span>
                      <button
                        onClick={() => {
                          if (item.cat === 1) {
                            setPlacedGroupItems(prev => ({ ...prev, [idx]: 1 }));
                            setScore(prev => prev + 10);
                            setFeedbackMsg({ text: isAr ? 'تصنيف صحيح في الصندوق الأول! 🎯' : 'Correct Bucket 1!', type: 'success' });
                          } else {
                            setLives(prev => Math.max(0, prev - 1));
                            setFeedbackMsg({ text: isAr ? 'تصنيف خاطئ! المكان الصحيح في الصندوق الآخر ❌' : 'Wrong Bucket!', type: 'error' });
                          }
                        }}
                        className="px-1.5 py-0.5 rounded bg-purple-600/40 text-purple-300 text-[10px] hover:bg-purple-600"
                      >
                        1
                      </button>
                      <button
                        onClick={() => {
                          if (item.cat === 2) {
                            setPlacedGroupItems(prev => ({ ...prev, [idx]: 2 }));
                            setScore(prev => prev + 10);
                            setFeedbackMsg({ text: isAr ? 'تصنيف صحيح في الصندوق الثاني! 🎯' : 'Correct Bucket 2!', type: 'success' });
                          } else {
                            setLives(prev => Math.max(0, prev - 1));
                            setFeedbackMsg({ text: isAr ? 'تصنيف خاطئ! المكان الصحيح في الصندوق الأول ❌' : 'Wrong Bucket!', type: 'error' });
                          }
                        }}
                        className="px-1.5 py-0.5 rounded bg-cyan-600/40 text-cyan-300 text-[10px] hover:bg-cyan-600"
                      >
                        2
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TEMPLATE 11: BALLOON POP (فرقعة البالونات) */}
          {selectedTemplateId === 'balloon_pop' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400">🎈 {isAr ? 'انقر لفرقعة البالون الذي يحوي الإجابة الصحيحة:' : 'Pop the balloon with the correct answer!'}</span>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-400 flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current" /> {lives}</span>
                  <span className="text-emerald-400">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
                </div>
              </div>

              <div className="my-auto space-y-4 w-full max-w-lg">
                <h4 className="text-xs font-bold text-white bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-md">
                  {isAr ? currentData.quizQuestions[0].qAr : currentData.quizQuestions[0].qEn}
                </h4>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {(isAr ? currentData.quizQuestions[0].optionsAr : currentData.quizQuestions[0].optionsEn).map((opt, i) => {
                    const isPopped = poppedBalloons.includes(i);
                    const colors = ['from-pink-500 to-purple-600', 'from-sky-400 to-blue-600', 'from-amber-400 to-orange-500', 'from-emerald-400 to-teal-600'];
                    return (
                      <button
                        key={i}
                        disabled={isPopped}
                        onClick={() => {
                          setPoppedBalloons(prev => [...prev, i]);
                          if (i === currentData.quizQuestions[0].correct) {
                            setScore(prev => prev + 25);
                            setFeedbackMsg({ text: isAr ? 'فرقعة صائبة! تم تدمير البالون الصحيح 🎈💥 (+25 نقطة)' : 'Correct Balloon Popped!', type: 'success' });
                            handleClaimXP();
                          } else {
                            setLives(prev => Math.max(0, prev - 1));
                            setFeedbackMsg({ text: isAr ? 'فرقعة خاطئة! خسرت محاولة ❌' : 'Wrong Balloon Popped!', type: 'error' });
                          }
                        }}
                        className={`h-24 rounded-3xl border border-white/20 flex flex-col items-center justify-center p-2 text-xs font-extrabold text-white transition transform hover:scale-105 shadow-xl ${
                          isPopped ? 'opacity-20 scale-90 border-slate-800 bg-slate-900' : `bg-gradient-to-b ${colors[i % colors.length]} animate-bounce`
                        }`}
                      >
                        <span className="text-lg">🎈</span>
                        <span className="truncate w-full">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 12: RANK ORDER (التدرج الترتيبي) */}
          {selectedTemplateId === 'rank_order' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-sky-400">📊 {isAr ? 'استخدم أسهم الترتيب لضبط الخطوات المتسلسلة ثم تحقق:' : 'Order steps correctly using arrows then verify:'}</span>
                <button
                  onClick={() => {
                    const isCorrectOrder = userRankSteps.every((step, idx) => step.correctOrder === idx + 1);
                    setRankValidated(true);
                    if (isCorrectOrder) {
                      setScore(prev => prev + 40);
                      setFeedbackMsg({ text: isAr ? 'تسلسل صحيـح 100%! تم إكمال خوارزمية التدرج 🎯 (+50 XP)' : 'Sequence 100% Correct!', type: 'success' });
                      handleClaimXP();
                    } else {
                      setLives(prev => Math.max(0, prev - 1));
                      setFeedbackMsg({ text: isAr ? 'تسلسل غير دقيق ❌، اعد ترتيب الخطوات وحاول مجدداً' : 'Incorrect sequence order!', type: 'error' });
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-xs hover:bg-emerald-500/30"
                >
                  🔍 {isAr ? 'تحقق من الترتيب' : 'Verify Order'}
                </button>
              </div>

              <div className="my-auto space-y-2 w-full max-w-md">
                {userRankSteps.map((step, idx) => (
                  <div 
                    key={step.id} 
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold text-white transition ${
                      rankValidated
                        ? step.correctOrder === idx + 1
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <span>{isAr ? step.textAr : step.textEn}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveRankStep(idx, idx - 1)} disabled={idx === 0} className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30">
                        <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
                      </button>
                      <button onClick={() => moveRankStep(idx, idx + 1)} disabled={idx === userRankSteps.length - 1} className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30">
                        <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEMPLATE 13: MAZE CHASE (مطاردة المتاهة) */}
          {selectedTemplateId === 'maze_chase' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-purple-400">🕳️ {isAr ? 'اختر بوابة المتاهة الآمنة التي تعبر منها الشخصية للهدف:' : 'Choose the safe maze gate to reach the target:'}</span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current" /> {lives}</span>
              </div>

              <div className="my-auto space-y-4 w-full max-w-lg">
                <div className="flex items-center justify-center gap-3 text-3xl">
                  <span className="animate-pulse">🏃‍♂️</span>
                  <span className="text-xs font-bold text-slate-400">➡️ 🚪 ➡️</span>
                  <span>🏆</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {currentData.mazeDoors.map((door, idx) => {
                    const isSelected = mazeSelectedDoor === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setMazeSelectedDoor(idx);
                          if (door.isCorrect) {
                            setScore(prev => prev + 30);
                            setFeedbackMsg({ text: isAr ? 'عبرت الباب الآمن بنجاح ووصلت للكأس! 🏆✨ (+50 XP)' : 'Reached Trophy safely!', type: 'success' });
                            handleClaimXP();
                          } else {
                            setLives(prev => Math.max(0, prev - 1));
                            setFeedbackMsg({ text: isAr ? 'وقعت في فخ المتاهة 💀! حاول عبر باب آخر' : 'Trapped in Maze!', type: 'error' });
                          }
                        }}
                        className={`p-3.5 rounded-2xl border text-xs font-bold text-right transition flex items-center justify-between ${
                          isSelected
                            ? door.isCorrect
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-rose-500/20 border-rose-400 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-white hover:border-purple-500'
                        }`}
                      >
                        <span className="text-sky-400 font-extrabold">{door.label}</span>
                        <span>{isAr ? door.optionAr : door.optionEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CUSTOM WORDWALL EMBED */}
          {selectedTemplateId === 'custom_embed' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="w-full flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder={isAr ? "ضع رابط لعبة Wordwall هنا..." : "Paste Wordwall link here..."}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-purple flex-1"
                />
                <button onClick={() => handleLoadCustomUrl()} className="px-4 py-1.5 rounded-xl bg-accent-cyan text-slate-950 font-bold text-xs hover:bg-cyan-300 shrink-0">
                  {isAr ? 'تضمين اللعبة' : 'Embed Link'}
                </button>
              </div>

              {gameUrl ? (
                <iframe src={gameUrl} className="w-full flex-1 border-0 rounded-xl bg-white" allowFullScreen title="Wordwall Embed" />
              ) : (
                <div className="my-auto space-y-3">
                  <Link className="w-8 h-8 text-sky-400 mx-auto" />
                  <p className="text-xs text-slate-400">{isAr ? 'ضع رابط أي نشاط Wordwall عام لتشغيله مباشرة.' : 'Paste your Wordwall URL above.'}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'كسب +50 XP عند إجابة أي نشاط بشكل صحيح!' : 'Earn +50 XP upon completing any game activity correctly!'}</span>
          </div>

          <button
            onClick={handleClaimXP}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              gameCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-gradient-to-r from-accent-purple to-accent-cyan text-slate-950 hover:scale-105'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{gameCompleted ? (isAr ? 'تم كسب +50 XP 🎉' : '+50 XP Claimed! 🎉') : (isAr ? 'تأكيد إكمال اللعبة (+50 XP)' : 'Claim Game Completion (+50 XP)')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
