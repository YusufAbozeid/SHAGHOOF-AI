import type { CourseTopic } from '../store/useStore';
import { getTopicType } from './topicContentService';

export interface WordwallGameTemplate {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  badgeAr: string;
  descriptionAr: string;
}

export const TOP_15_WORDWALL_TEMPLATES: WordwallGameTemplate[] = [
  { id: 'gameshow_quiz', nameAr: 'المسابقة التفاعلية', nameEn: 'Quiz Arena', icon: '🎯', badgeAr: 'أكثر شعبية', descriptionAr: 'اختبار خيارات متعددة مع عداد نقاط ودعم المساعدة' },
  { id: 'match_up', nameAr: 'التوصيل والمطابقة', nameEn: 'Match-up', icon: '🎮', badgeAr: 'توصيل', descriptionAr: 'ربط المصطلحات العلمية بالتعاريف الصحيحة' },
  { id: 'spin_wheel', nameAr: 'عجلة الحظ والتحدي', nameEn: 'Spin the Wheel', icon: '🎡', badgeAr: 'تحدي', descriptionAr: 'عجلة دوارة تختار أسئلة ومكافآت عشوائية' },
  { id: 'true_false', nameAr: 'صواب أم خطأ', nameEn: 'True or False', icon: '⚡', badgeAr: 'سريع', descriptionAr: 'تقييم صحة العبارات العلمية مع تصحيح الأخطاء' },
  { id: 'whack_a_mole', nameAr: 'اصطياد الإجابات', nameEn: 'Whack-a-Mole', icon: '🔨', badgeAr: 'سرعة', descriptionAr: 'اصطياد القوارض التي تحمل الإجابة الصحيحة وتفادي الخاطئة' },
  { id: 'anagram', nameAr: 'ترتيب الحروف', nameEn: 'Anagram / Unjumble', icon: '🔤', badgeAr: 'ترتيب', descriptionAr: 'إعادة ترتيب الحروف المتناثرة لتشكيل المصطلح الصحيح' },
  { id: 'missing_word', nameAr: 'الكلمة المفقودة', nameEn: 'Missing Word', icon: '📝', badgeAr: 'إكمال', descriptionAr: 'اختيار الكلمة المناسبة لإكمال فراغ الجملة' },
  { id: 'airplane_flight', nameAr: 'طائرة المفاهيم', nameEn: 'Airplane Flight', icon: '✈️', badgeAr: 'مغامرة', descriptionAr: 'توجيه الطائرة نحو السحابة ذات الإجابة الصحيحة' },
  { id: 'flashcards', nameAr: 'بطاقات المراجعة', nameEn: 'Flashcards', icon: '🎴', badgeAr: 'مراجعة', descriptionAr: 'بطاقات تكرار متباعد لمعاينة واختبار حفظك للمفاهيم' },
  { id: 'group_sort', nameAr: 'تصنيف المجموعات', nameEn: 'Group Sort', icon: '⚖️', badgeAr: 'تصنيف', descriptionAr: 'فرز المفاهيم والروابط إلى صناديقها الصحيحة' },
  { id: 'balloon_pop', nameAr: 'فرقعة البالونات', nameEn: 'Balloon Pop', icon: '🎈', badgeAr: 'سرعة', descriptionAr: 'فرقعة البالون الذي يحوي المصطلح المطابق' },
  { id: 'rank_order', nameAr: 'التدرج الترتيبي', nameEn: 'Rank Order', icon: '📊', badgeAr: 'تدرج', descriptionAr: 'ترتيب خطوات تنفيذ الخوارزمية بالتسلسل الصحيح' },
  { id: 'maze_chase', nameAr: 'مطاردة المتاهة', nameEn: 'Maze Chase', icon: '🕳️', badgeAr: 'متاهة', descriptionAr: 'توجيه الشخصية عبر المتاهة نحو الهدف الصحيح' },
  { id: 'custom_embed', nameAr: 'تضمين رابط Wordwall', nameEn: 'Custom Embed Link', icon: '🌐', badgeAr: 'رابط', descriptionAr: 'تضمين وتشغيل أي نشاط خارجي من موقع Wordwall' },
];

export interface WordwallTopicGameData {
  quizQuestions: {
    qAr: string;
    qEn: string;
    optionsAr: string[];
    optionsEn: string[];
    correct: number;
    explanationAr: string;
  }[];
  matchPairs: {
    id: string;
    term: string;
    defAr: string;
    defEn: string;
  }[];
  trueFalseStatements: {
    statementAr: string;
    statementEn: string;
    isTrue: boolean;
    explanationAr: string;
  }[];
  anagramTerm: string;
  missingWordSentence: {
    sentenceAr: string;
    wordOptionsAr: string[];
    correctWord: string;
  };
  groupSortData: {
    cat1Ar: string;
    cat1En: string;
    cat2Ar: string;
    cat2En: string;
    items: {
      textAr: string;
      textEn: string;
      cat: 1 | 2;
    }[];
  };
  rankSteps: {
    id: number;
    textAr: string;
    textEn: string;
    correctOrder: number;
  }[];
  mazeDoors: {
    label: string;
    optionAr: string;
    optionEn: string;
    isCorrect: boolean;
  }[];
}

// -------------------------------------------------------------
// 1. TRANSFORMERS & ATTENTION DATA (Session 1)
// -------------------------------------------------------------
const transformersData: WordwallTopicGameData = {
  quizQuestions: [
    {
      qAr: 'ما الآلية الرياضية الأساسية التي تسمح لنموذج Transformer بالتركيز على أجزاء مختلفة من الجملة بالتوازي؟',
      qEn: 'What fundamental mathematical mechanism allows Transformers to focus on different parts in parallel?',
      optionsAr: ['الانتباه الذاتي (Self-Attention)', 'التجمع المكاني (Max Pooling)', 'التكرار الزمني (Recurrent Loop)', 'التساقط العشوائي (Dropout)'],
      optionsEn: ['Self-Attention', 'Max Pooling', 'Recurrent Loop', 'Dropout'],
      correct: 0,
      explanationAr: 'آلية الانتباه الذاتي (Self-Attention) تتيح ربط كل كلمة بجميع كلمات الجملة وحساب الأوزان النسبية بالتوازي.'
    },
    {
      qAr: 'في معادلة Scaled Dot-Product Attention، ما الغرض من القسمة على جذر أبعاد المفتاح √d_k؟',
      qEn: 'In Scaled Dot-Product Attention, what is the purpose of dividing by √d_k?',
      optionsAr: ['منع تضخم القيم وحماية دالة Softmax من تلاشي التدرج', 'مضاعفة سرعة معالجة الرسوميات', 'تقليل عدد الرموز في المعجم', 'ضغط حجم المصفوفات للنصف'],
      optionsEn: ['Prevent large dot products & gradient vanishing in Softmax', 'Double GPU processing speed', 'Reduce vocabulary tokens', 'Halve matrix size'],
      correct: 0,
      explanationAr: 'حاصل الضرب النقطي ينمو مع زيادة البعد d_k مما يدفع Softmax لمناطق مشتقاتها قريبة من الصفر، فالقسمة تحافظ على الاستقرار.'
    },
    {
      qAr: 'لماذا تحتاج معمارية Transformer إلى التضمين الموضعي (Positional Encoding)؟',
      qEn: 'Why do Transformer models strictly require Positional Encoding?',
      optionsAr: ['لأن المعالجة المتوازية تتجاهل ترتيب الكلمات الطبيعي', 'لضغط النصوص الطويلة إلى كود ثنائي', 'لحساب نسبة الخطأ في التدريب', 'لتلوين مخرجات النصوص للمستخدم'],
      optionsEn: ['Because parallel processing is permutation invariant to word order', 'To compress long text to binary', 'To calculate training loss', 'To colorize text outputs'],
      correct: 0,
      explanationAr: 'المحول يعالج الكلمات دفعة واحدة بلا تسلسل زمني، فيتم دمج متجهات موضعية جيبية لتحديد ترتيب كل كلمة.'
    },
    {
      qAr: 'ما هي المصفوفات الثلاث التي يولدها الإسقاط الخطي لكل رمز (Token) لحساب درجات الانتباه؟',
      qEn: 'Which three projection matrices are generated for each token to compute attention?',
      optionsAr: ['الاستعلام والمفتاح والقيمة (Query, Key, Value)', 'المدخل والوسيط والمخرج (Input, Hidden, Output)', 'الوزن والتحيز والتدرج (Weight, Bias, Gradient)', 'المشفر والمفكك والمصنف (Encoder, Decoder, Classifier)'],
      optionsEn: ['Query, Key, and Value (Q, K, V)', 'Input, Hidden, Output', 'Weight, Bias, Gradient', 'Encoder, Decoder, Classifier'],
      correct: 0,
      explanationAr: 'كل رمز يُسقط خطياً إلى متجهات Q و K و V لحساب الارتباط السياقي والقيمة الموزونة.'
    }
  ],
  matchPairs: [
    { id: '1', term: 'Self-Attention', defAr: 'حساب ترابط كل كلمة مع كافة الكلمات في السياق', defEn: 'Computes contextual correlation between all words' },
    { id: '2', term: 'Positional Encoding', defAr: 'حقن معلومات ترتيب الكلمات داخل متجهات التضمين', defEn: 'Injects sequence order into token embeddings' },
    { id: '3', term: 'Multi-Head Attention', defAr: 'تقسيم الانتباه عبر فضاءات متعددة لالتقاط علاقات متنوعة', defEn: 'Splits attention into multiple representation subspaces' },
    { id: '4', term: 'Feed-Forward Sublayer', defAr: 'شبكة عصبية خطية غير خطية تطبق تحويلاً مستقلاً لكل موضع', defEn: 'Applies position-wise non-linear transformations' },
  ],
  trueFalseStatements: [
    { statementAr: 'تسمح معمارية Transformer بمعالجة الرموز بالتوازي الكامل مما يوفر تسريعاً ضخماً على معالجات GPUs مقارنة بـ RNN.', statementEn: 'Transformers allow full parallelization, offering massive GPU speedups over sequential RNNs.', isTrue: true, explanationAr: 'صحيح! إلغاء الاعتمادية الزمنية سمح بالتدريب المتوازي الفائق على وحدات GPU.' },
    { statementAr: 'في مصفوفة الانتباه، يتم ضرب الاستعلام (Query) مباشرة بالقيمة (Value) دون استخدام المفتاح (Key).', statementEn: 'In attention, Query is directly multiplied with Value without using Key.', isTrue: false, explanationAr: 'خطأ! يتم ضرب Query مع Key أولاً لقياس الشبه الدلالي، ثم ضرب النتيجة بالقيمة Value.' },
    { statementAr: 'تستخدم دالة Softmax لتحويل درجات حاصل الضرب القياسي إلى توزيع احتمالي مجموع أوزانه 1.', statementEn: 'Softmax normalizes scaled dot products into an attention probability distribution summing to 1.', isTrue: true, explanationAr: 'صحيح! Softmax تضمن أن درجات الانتباه تشكل أوزاناً نسبية موجبة مجموعها 1.' }
  ],
  anagramTerm: 'ATTENTION',
  missingWordSentence: {
    sentenceAr: 'تعتمد معمارية المحولات على ميكانيزم الـ __________ لمقارنة كل توكن بجميع عناصر السياق بالتوازي.',
    wordOptionsAr: ['Self-Attention', 'Convolution', 'Pooling', 'Backpropagation'],
    correctWord: 'Self-Attention'
  },
  groupSortData: {
    cat1Ar: '🔷 مكونات مشفر المحول (Encoder)',
    cat1En: 'Encoder Components',
    cat2Ar: '🔶 مكونات مفكك الشفرة (Decoder)',
    cat2En: 'Decoder Components',
    items: [
      { textAr: 'انتباه ذاتي قياسي (Multi-Head Self-Attention)', textEn: 'Multi-Head Self-Attention', cat: 1 },
      { textAr: 'انتباه مقنّع للرموز اللاحقة (Masked Self-Attention)', textEn: 'Masked Self-Attention', cat: 2 },
      { textAr: 'انتباه متقاطع مع مخرجات المشفر (Cross-Attention)', textEn: 'Encoder-Decoder Cross-Attention', cat: 2 },
      { textAr: 'شبكة تغذية أمامية خطية (Feed Forward Network)', textEn: 'Feed-Forward Network', cat: 1 }
    ]
  },
  rankSteps: [
    { id: 1, textAr: '1️⃣ تحويل الكلمات لمتجهات وتضمين الموضع (Token & Positional Embedding)', textEn: '1️⃣ Token & Positional Embedding', correctOrder: 1 },
    { id: 2, textAr: '2️⃣ إسقاط المتجهات خطياً لإنتاج مصفوفات Q و K و V', textEn: '2️⃣ Linear Projection to Q, K, V', correctOrder: 2 },
    { id: 3, textAr: '3️⃣ حساب أوزان الانتباه: Softmax(Q K^T / √d_k)', textEn: '3️⃣ Compute Attention Weights: Softmax(QK^T / √d_k)', correctOrder: 3 },
    { id: 4, textAr: '4️⃣ ضرب الأوزان الاحتمالية بمصفوفة القيم V لإنتاج السياق النهائي', textEn: '4️⃣ Multiply Weights by Value Matrix V', correctOrder: 4 }
  ],
  mazeDoors: [
    { label: 'الباب A', optionAr: 'Scaled Dot-Product Self-Attention (المسار الآمن 🚪✨)', optionEn: 'Scaled Dot-Product Self-Attention', isCorrect: true },
    { label: 'الباب B', optionAr: 'Max Pooling 2D Downsampling (طريق مسدود 💀)', optionEn: 'Max Pooling 2D Downsampling', isCorrect: false },
    { label: 'الباب C', optionAr: 'Vanishing Recurrent Gradient (طريق مسدود 💀)', optionEn: 'Vanishing Recurrent Gradient', isCorrect: false },
    { label: 'الباب D', optionAr: 'Greedy Fixed-Length Token Split (طريق مسدود 💀)', optionEn: 'Greedy Token Split', isCorrect: false }
  ]
};

// -------------------------------------------------------------
// 2. CONCURRENCY & SYNCHRONIZATION DATA (Session 2)
// -------------------------------------------------------------
const concurrencyData: WordwallTopicGameData = {
  quizQuestions: [
    {
      qAr: 'ما هو دور قفل المفسر العام (GIL - Global Interpreter Lock) في بايثون القياسية CPython؟',
      qEn: 'What is the role of the Global Interpreter Lock (GIL) in standard CPython?',
      optionsAr: ['منع خيوط متعددة من تنفيذ بايت كود بايثون بالتوازي لحماية إدارة الذاكرة', 'مضاعفة سرعة المعالج في الحسابات الرياضية', 'ضغط ملفات الكود أثناء التشغيل', 'تشفير الاتصالات الشبكية تلقائياً'],
      optionsEn: ['Prevents multiple threads from running Python bytecodes simultaneously', 'Doubles CPU math performance', 'Compresses runtime code', 'Encrypts network sockets'],
      correct: 0,
      explanationAr: 'قفل الـ GIL يمنع التشغيل المتوازي الفعلي لخيوط متعددة على عدة أنوية لحماية عداد مراجع الذاكرة (Reference Counting).'
    },
    {
      qAr: 'ما الحل الأمثل في بايثون لتنفيذ المهام الحسابية المكثفة CPU-Bound متخطياً قفل الـ GIL؟',
      qEn: 'What is the optimal Python approach for CPU-bound tasks to bypass the GIL?',
      optionsAr: ['المعالجة المتعددة (Multiprocessing) بعمليات وذاكرة مستقلة لكل نواة', 'الخيوط المتعددة القياسية (Standard Threading)', 'استخدام دوال التكرار اللانهائية', 'زيادة مساحة القرص الصلب'],
      optionsEn: ['Multiprocessing with isolated memory per core', 'Standard Multi-Threading', 'Infinite While Loops', 'Increasing Disk Space'],
      correct: 0,
      explanationAr: 'المعالجة المتعددة (Multiprocessing) تنشئ عمليات بايثون مستقلة تماماً بذاكرة منفصلة لكل نواة معالج، فتتخطى الـ GIL تماماً.'
    },
    {
      qAr: 'ما الذي يميز إطار AsyncIO عن نظام الخيوط التقليدي (Threading) في بايثون؟',
      qEn: 'What distinguishes AsyncIO from traditional Multi-Threading in Python?',
      optionsAr: ['يعتمد على خيط واحد وحلقة أحداث Event Loop وتبديل غير حاجزي بالـ Coroutines', 'يستهلك 100% من كل أنوية المعالج', 'يلغي الحاجة للمتغيرات والدوال', 'يعمل على لغة الجافا فقط'],
      optionsEn: ['Single-threaded event loop with non-blocking async/await coroutines', 'Consumes 100% of all CPU cores', 'Eliminates variables and functions', 'Only executes on Java'],
      correct: 0,
      explanationAr: 'نظام AsyncIO يعتمد على التعاون الطوعي (Cooperative Multitasking) عبر async و await داخل خيط واحد عالي الكفاءة.'
    },
    {
      qAr: 'ما الظاهرة الخطيرة التي تحدث عندما يحاول خيطان تعديل متغير مشترك في نفس اللحظة دون مزامنة؟',
      qEn: 'What dangerous hazard occurs when two threads modify a shared variable simultaneously without locks?',
      optionsAr: ['حالة التسابق وتلف البيانات (Race Condition)', 'تسارع استهلاك الكهرباء', 'التفريغ التلقائي للذاكرة', 'إغلاق الخادم المفاجئ بدون أثر'],
      optionsEn: ['Race Condition and data corruption', 'Power surge', 'Automatic memory flush', 'Silent server shutdown'],
      correct: 0,
      explanationAr: 'حالة التسابق (Race Condition) تؤدي لنتائج عشوائية وتلف المتغيرات المشتركة بسبب التداخل غير المنظم للعمليات.'
    }
  ],
  matchPairs: [
    { id: '1', term: 'Global Interpreter Lock', defAr: 'قفل مفسر يمنع التشغيل المتوازي للخيوط في CPython', defEn: 'CPython mutex preventing simultaneous thread execution' },
    { id: '2', term: 'Multiprocessing', defAr: 'إنشاء عمليات مستقلة بذاكرة منفصلة لتجاوز GIL في مهام المعالج', defEn: 'Spawns isolated processes with separate memory' },
    { id: '3', term: 'AsyncIO Event Loop', defAr: 'حلقة أحداث ذكية تدير المهام غير الحاجبة عبر Coroutines', defEn: 'Event loop managing non-blocking cooperative coroutines' },
    { id: '4', term: 'Mutex Lock (Acquire/Release)', defAr: 'آلية مزامنة تضمن حصر دخول المنطقة الحرجة لخيط واحد فقط', defEn: 'Synchronization primitive guarding critical sections' },
  ],
  trueFalseStatements: [
    { statementAr: 'تستفيد مهام قراءة الملفات وطلبات الشبكة (I/O-Bound) بشكل هائل من Multi-Threading لأن بايثون يحرر الـ GIL أثناء الانتظار.', statementEn: 'I/O-bound tasks benefit greatly from Multi-Threading because CPython releases the GIL during wait states.', isTrue: true, explanationAr: 'صحيح! أثناء انتظار الشبكة أو القرص يحرر بايثون القفل لخيط آخر.' },
    { statementAr: 'تسمح مكتبة Threading العادية بتشغيل الحسابات الرياضية المكثفة على 8 أنوية CPU بالتوازي الحقيقي في CPython.', statementEn: 'Standard Threading achieves true multi-core parallel speedup on CPU-bound math in CPython.', isTrue: false, explanationAr: 'خطأ! قفل الـ GIL يجبر الخيوط على التناوب على نواة واحدة فقط في CPython للمهام الحسابية.' },
    { statementAr: 'تساعد كائنات Semaphores في تحديد الحد الأقصى لعدد الخيوط المسموح لها بالوصول لمورد محدد في نفس الوقت.', statementEn: 'Semaphores limit the maximum number of concurrent threads accessing a resource.', isTrue: true, explanationAr: 'صحيح! كائن Semaphore يحتفظ بعداد يحدد كم خيط يستطيع الدخول بالتزامن.' }
  ],
  anagramTerm: 'CONCURRENCY',
  missingWordSentence: {
    sentenceAr: 'يمنع قفل الـ __________ في مفسر CPython التشغيل المتوازي للخيوط في العمليات المقيدة بالمعالج CPU-Bound.',
    wordOptionsAr: ['GIL', 'AsyncIO', 'ThreadPool', 'Semaphore'],
    correctWord: 'GIL'
  },
  groupSortData: {
    cat1Ar: '⚡ مهام مقيدة بالإدخال/الإخراج (I/O-Bound)',
    cat1En: 'I/O-Bound Tasks',
    cat2Ar: '🧠 مهام مقيدة بالمعالج (CPU-Bound)',
    cat2En: 'CPU-Bound Tasks',
    items: [
      { textAr: 'تحميل ملفات وتصفح صفحات الويب عبر HTTP', textEn: 'Web scraping and HTTP requests', cat: 1 },
      { textAr: 'ضرب مصفوفات وتشفير ومعالجة صور ضخمة', textEn: 'Large matrix multiplication and image processing', cat: 2 },
      { textAr: 'الاستعلام من قواعد البيانات والانتظار الشبكي', textEn: 'SQL Database queries and network socket waits', cat: 1 },
      { textAr: 'تدريب شبكات عصبية وحساب المشتقات الرياضية', textEn: 'Neural network training and gradient math', cat: 2 }
    ]
  },
  rankSteps: [
    { id: 1, textAr: '1️⃣ طلب الخيط حيازة القفل عبر lock.acquire() قبل المورد', textEn: '1️⃣ Thread requests lock via lock.acquire()', correctOrder: 1 },
    { id: 2, textAr: '2️⃣ منح القفل ودخول الخيط للمنطقة الحرجة (Critical Section)', textEn: '2️⃣ Lock granted, entering Critical Section', correctOrder: 2 },
    { id: 3, textAr: '3️⃣ تعديل البيانات المشتركة بأمان تام لمنع التسابق', textEn: '3️⃣ Safely modify shared state avoiding race conditions', correctOrder: 3 },
    { id: 4, textAr: '4️⃣ تحرير القفل عبر lock.release() للسماح للخيوط الأخرى', textEn: '4️⃣ Release lock via lock.release() for waiting threads', correctOrder: 4 }
  ],
  mazeDoors: [
    { label: 'الباب A', optionAr: 'ProcessPoolExecutor للمعالجة المتوازية (المسار الآمن 🚪✨)', optionEn: 'ProcessPoolExecutor for multi-core parallelism', isCorrect: true },
    { label: 'الباب B', optionAr: 'Race Condition تضارب الذاكرة وتلف البيانات (طريق مسدود 💀)', optionEn: 'Unprotected Race Condition Memory Corruption', isCorrect: false },
    { label: 'الباب C', optionAr: 'Deadlock التعليق الدائم للبرنامج (طريق مسدود 💀)', optionEn: 'Circular Lock Deadlock Hang', isCorrect: false },
    { label: 'الباب D', optionAr: 'Blocking Call داخل حلقة الأحداث (طريق مسدود 💀)', optionEn: 'Blocking Call in AsyncIO Event Loop', isCorrect: false }
  ]
};

// -------------------------------------------------------------
// 3. COMPUTER VISION & CNN DATA (Session 2 Image Classification)
// -------------------------------------------------------------
const cnnData: WordwallTopicGameData = {
  quizQuestions: [
    {
      qAr: 'ما الوظيفة الرئيسية لفلتر الالتفاف (Convolution Kernel) في معالجة الصور الرقمية؟',
      qEn: 'What is the main role of a Convolution Kernel in digital image processing?',
      optionsAr: ['استخلاص الملامح المكانية كالحواف والزوايا والأنسجة من مصفوفات البكسل', 'تحويل الصورة إلى الأبيض والأسود فقط', 'حذف نصف بكسلات الصورة عشوائياً', 'طباعة أبعاد الصورة على الشاشة'],
      optionsEn: ['Extract spatial features like edges, corners, and textures', 'Convert image to grayscale only', 'Randomly delete half the pixels', 'Print image dimensions'],
      correct: 0,
      explanationAr: 'فلتر الالتفاف يتحرك عبر بكسلات الصورة لحساب الضرب النقطي واستخلاص الخرائط المميزة (Feature Maps).'
    },
    {
      qAr: 'ما فائدة تطبيق طبقة Max Pooling بعد طبقات التلافيف في شبكات تصنيف الصور؟',
      qEn: 'What is the benefit of applying Max Pooling after convolution layers in CNNs?',
      optionsAr: ['تقليل الأبعاد الفراغية وتكثيف الملامح الأبرز وتوفير استقرار موضعي', 'مضاعفة دقة الصورة وحجمها', 'زيادة عدد المعاملات والأوزان المطلوبة', 'عكس ألوان بكسلات الصورة'],
      optionsEn: ['Downsample spatial dimensions, condense salient features & translation invariance', 'Double image resolution and size', 'Increase parameter count', 'Invert pixel colors'],
      correct: 0,
      explanationAr: 'طبقة Max Pooling تقتطع القيمة القصوى في كل نافذة، مما يقلل الحسابات ويعزز مقاومة الإزاحة Translation Invariance.'
    },
    {
      qAr: 'عند تطبيق فلتر بحجم 3x3 مع Stride=1 وبدون حشو (Valid Padding)، ماذا يحدث لأبعاد الخريطة الناتجة؟',
      qEn: 'When applying a 3x3 kernel with Stride=1 and Valid Padding, what happens to output dimensions?',
      optionsAr: ['تنقص أبعاد الصورة بمقدار 2 بكسل طولاً وعرضاً', 'تتضاعف أبعاد الصورة', 'تظل الأبعاد متطابقة تماماً', 'تتحول الأبعاد إلى صفر'],
      optionsEn: ['Dimensions decrease by 2 pixels in height and width', 'Dimensions double', 'Dimensions stay exactly identical', 'Dimensions become zero'],
      correct: 0,
      explanationAr: 'وفق معادلة الخرج (W - F + 2P)/S + 1: (W - 3 + 0)/1 + 1 = W - 2، فتنقص الأبعاد بمقدار 2.'
    },
    {
      qAr: 'ما الطبقة المستخدمة لتحويل مخرجات الخرائط ثنائية وثلاثية الأبعاد إلى متجه أحادي قبل طبقات Dense؟',
      qEn: 'Which layer flattens multi-dimensional feature maps into a 1D vector before Dense layers?',
      optionsAr: ['طبقة التسطيح (Flatten Layer)', 'طبقة التنعيم (Softmax)', 'طبقة التجميد (Freeze Layer)', 'طبقة التكبير (Upsampling)'],
      optionsEn: ['Flatten Layer', 'Softmax Layer', 'Freeze Layer', 'Upsampling Layer'],
      correct: 0,
      explanationAr: 'تقوم طبقة Flatten بفرد مصفوفات الميزات ثلاثية الأبعاد إلى متجه طولي لإدخاله للطبقات الخطية Fully Connected.'
    }
  ],
  matchPairs: [
    { id: '1', term: 'Convolution Kernel', defAr: 'مصفوفة أوزان صغيرة تتحرك لاستخلاص الحواف والخصائص البصرية', defEn: 'Weight matrix sliding over pixels to extract features' },
    { id: '2', term: 'Max Pooling', defAr: 'تقليص الحجم المكاني واختيار أعلى استجابة مميزة في كل نافذة', defEn: 'Spatial downsampling taking maximum activation' },
    { id: '3', term: 'Feature Map', defAr: 'مصفوفة الاستجابة الناتجة عن تطبيق الفلتر على الصورة', defEn: 'Activation grid resulting from kernel convolution' },
    { id: '4', term: 'Flatten Layer', defAr: 'تحويل الميزات متعددة الأبعاد لمتجه أحادي للطبقة الكثيفة', defEn: 'Transforms 2D/3D maps into a 1D dense vector' },
  ],
  trueFalseStatements: [
    { statementAr: 'تعتمد الشبكات التلافيفية CNN على مبدأ مشاركة الأوزان (Weight Sharing) لتقليل عدد المعاملات مقارنة بالشبكات الكثيفة.', statementEn: 'CNNs rely on parameter sharing to drastically reduce weights compared to dense MLPs.', isTrue: true, explanationAr: 'صحيح! الفلتر نفسه يُطبق على كافة أجزاء الصورة مما يوفر كفاءة حسابية مذهلة.' },
    { statementAr: 'إضافة الحشو نفسه (Same Padding) تؤدي دائماً إلى إنقاص أبعاد الصورة إلى النصف.', statementEn: 'Same Padding always halves the spatial dimensions of an image.', isTrue: false, explanationAr: 'خطأ! Same Padding يضيف أصفاراً على الحواف للحفاظ على الأبعاد الأصلية دون نقصان.' },
    { statementAr: 'تساعد طبقة Dropout في شبكات CNN على تقليل فرط التخصيص (Overfitting) عن طريق إسقاط وحدات عشوائية أثناء التدريب.', statementEn: 'Dropout prevents overfitting in CNNs by randomly deactivating units during training.', isTrue: true, explanationAr: 'صحيح! إسقاط الوحدات عشوائياً يمنع النموذج من الاعتماد الزائد على ملامح محددة.' }
  ],
  anagramTerm: 'CONVOLUTION',
  missingWordSentence: {
    sentenceAr: 'تُستخدم طبقة الـ __________ في شبكات CNN لتقليل الأبعاد الحجمية للخرائط واستخلاص أعلى الملامح استجابة.',
    wordOptionsAr: ['Max Pooling', 'Softmax', 'Embedding', 'Backprop'],
    correctWord: 'Max Pooling'
  },
  groupSortData: {
    cat1Ar: '🖼️ طبقات استخلاص الملامح المكانية',
    cat1En: 'Feature Extraction Layers',
    cat2Ar: '🎯 طبقات التصنيف النهائي',
    cat2En: 'Classification Layers',
    items: [
      { textAr: 'طبقة الالتفاف ثنائية الأبعاد (Conv2D)', textEn: '2D Convolution (Conv2D)', cat: 1 },
      { textAr: 'الطبقة الكثيفة المتصلة بالكامل (Dense Layer)', textEn: 'Fully Connected Dense Layer', cat: 2 },
      { textAr: 'طبقة التجميع الأقصى (MaxPooling2D)', textEn: 'Max Pooling (MaxPooling2D)', cat: 1 },
      { textAr: 'طبقة التنشيط الاحتمالي للمخرجات (Softmax Output)', textEn: 'Softmax Output Probabilities', cat: 2 }
    ]
  },
  rankSteps: [
    { id: 1, textAr: '1️⃣ إدخال مصفوفة البكسلات الرقمية للصورة (Input Image Tensor)', textEn: '1️⃣ Input Image Pixel Tensor (H x W x C)', correctOrder: 1 },
    { id: 2, textAr: '2️⃣ تطبيق فلاتر الالتفاف واستخلاص خرائط الميزات (Conv2D & ReLU)', textEn: '2️⃣ Convolution & ReLU Non-Linearity', correctOrder: 2 },
    { id: 3, textAr: '3️⃣ تقليص الأبعاد وحفظ الملامح البارزة بواسطة Max Pooling', textEn: '3️⃣ Downsample Dimensions with Max Pooling', correctOrder: 3 },
    { id: 4, textAr: '4️⃣ تسطيح الميزات (Flatten) والتصنيف النهائي عبر Dense Softmax', textEn: '4️⃣ Flatten & Dense Softmax Classification', correctOrder: 4 }
  ],
  mazeDoors: [
    { label: 'الباب A', optionAr: 'Receptive Field Convolutional Feature Map (المسار الآمن 🚪✨)', optionEn: 'Receptive Field Convolutional Feature Map', isCorrect: true },
    { label: 'الباب B', optionAr: 'Unflattened Dimensional Mismatch (طريق مسدود 💀)', optionEn: 'Unflattened Dimensional Mismatch', isCorrect: false },
    { label: 'الباب C', optionAr: 'Vanishing Gradient in Deep Layers (طريق مسدود 💀)', optionEn: 'Vanishing Gradient in Deep Layers', isCorrect: false },
    { label: 'الباب D', optionAr: 'Negative Kernel Dimension (طريق مسدود 💀)', optionEn: 'Negative Kernel Dimension', isCorrect: false }
  ]
};

// -------------------------------------------------------------
// 4. RNN, LSTM & GRU DATA (Session 3)
// -------------------------------------------------------------
const rnnData: WordwallTopicGameData = {
  quizQuestions: [
    {
      qAr: 'ما المشكلة الرياضية الجوهرية التي تعاني منها الشبكات التكرارية البسيطة (Vanilla RNN) في السلاسل النصية الطويلة؟',
      qEn: 'What core mathematical flaw plagues Vanilla RNNs when processing long sequences?',
      optionsAr: ['تلاشي وانفجار التدرج الرياضي (Vanishing/Exploding Gradient)', 'زيادة حجم الذاكرة إلى المالانهاية', 'تكرار الكلمة الأولى دائماً', 'عدم القدرة على قراءة الحروف'],
      optionsEn: ['Vanishing and Exploding Gradients', 'Infinite memory growth', 'Always repeating the first token', 'Inability to read characters'],
      correct: 0,
      explanationAr: 'عند تكرار ضرب المشتقات عبر خطوات زمنية متتالية، تؤول قيم التدرج للصفر (تلاشي) فيتعذر تعلم العلاقات البعيدة.'
    },
    {
      qAr: 'ما البوابة المسؤولة في خلايا LSTM عن تحديد مقدار المعلومات السابقة التي يجب التخلص منها من خلية الذاكرة (Cell State)؟',
      qEn: 'Which LSTM gate decides how much past context to discard from the Cell State?',
      optionsAr: ['بوابة النسيان (Forget Gate)', 'بوابة الإدخال (Input Gate)', 'بوابة الإخراج (Output Gate)', 'بوابة التحديث (Update Gate)'],
      optionsEn: ['Forget Gate', 'Input Gate', 'Output Gate', 'Update Gate'],
      correct: 0,
      explanationAr: 'بوابة النسيان (Forget Gate) تستخدم دالة Sigmoid لتوليد معاملات بين 0 و 1 تحدد ما يتم مسحه أو الإبقاء عليه.'
    },
    {
      qAr: 'ما الميزة الهيكلية لشبكات GRU مقارنة بشبكات LSTM القياسية؟',
      qEn: 'What structural optimization does GRU offer over standard LSTM architectures?',
      optionsAr: ['دمج خلايا الذاكرة والحالة واستخدام بوابتين فقط (Reset & Update) مما يقلل المعاملات ويسرع التدريب', 'زيادة عدد البوابات لأربع بوابات', 'الاعتماد الكامل على الصور ثلاثية الأبعاد', 'إلغاء دوال التنشيط تماماً'],
      optionsEn: ['Merges cell state & hidden state into 2 gates (Reset & Update) for faster training', 'Increases gate count to 4', 'Relies entirely on 3D images', 'Removes all activations'],
      correct: 0,
      explanationAr: 'تدمج GRU خلية الذاكرة بالحالة المخفية وتقتصر على بوابتي Reset و Update لتقليل الحسابات مع كفاءة منافسة لـ LSTM.'
    },
    {
      qAr: 'عند تدريب نموذج على مجموعة Amazon Polarity لتصنيف المشاعر، ما هو تنسيق المخرج النهائي المناسب؟',
      qEn: 'When classifying sentiment on the Amazon Polarity dataset, what is the proper output format?',
      optionsAr: ['تصنيف ثنائي بقيمة احتمالية تدل على إيجابي أو سلبي عبر دالة Sigmoid', 'توليد فقرة مقالية كاملة', 'خريطة ثلاثية الأبعاد للتقييمات', 'مصفوفة أرقام عشوائية'],
      optionsEn: ['Binary probability (Positive vs Negative) via Sigmoid activation', 'Generative long essay output', '3D heatmap of reviews', 'Random matrix vector'],
      correct: 0,
      explanationAr: 'مجموعة Amazon Polarity مهمة تصنيف مشاعر ثنائية (Positive vs Negative)، يناسبها مخرج ثنائي عبر Sigmoid.'
    }
  ],
  matchPairs: [
    { id: '1', term: 'LSTM Forget Gate', defAr: 'تحديد المعلومات القديمة الواجب حذفها من خلية الذاكرة عبر Sigmoid', defEn: 'Decides what past information to discard via Sigmoid' },
    { id: '2', term: 'Cell State (C_t)', defAr: 'قناة النقل الخطية السريعة لحفظ المعلومات عبر خطوات زمنية بعيدة', defEn: 'Long-term linear memory highway preserving gradient flow' },
    { id: '3', term: 'GRU Reset Gate', defAr: 'تحديد كمية دمج الحالة السابقة مع المدخل الحالي في GRU', defEn: 'Determines how to combine new input with previous memory' },
    { id: '4', term: 'Vanishing Gradient', defAr: 'تضاؤل المشتقات في الخطوات السابقة مما يمنع تعلم السياقات الطويلة', defEn: 'Exponential gradient decay preventing long-term learning' },
  ],
  trueFalseStatements: [
    { statementAr: 'تعتمد شبكات LSTM على خلية الذاكرة (Cell State) كمسار نقل فائق يسمح بانسياب التدرجات دون اضمحلال سريع.', statementEn: 'LSTM uses the Cell State as a gradient superhighway preventing exponential vanishing.', isTrue: true, explanationAr: 'صحيح! الخط المباشر لخلية الذاكرة يحافظ على انتقال المشتقات عبر مئات الخطوات.' },
    { statementAr: 'تستطيع شبكات Vanilla RNN البسيطة تذكر العلاقات النصية البعيدة لمئات الكلمات بكفاءة تفوق Transformer.', statementEn: 'Vanilla RNNs retain context over hundreds of tokens better than Transformers.', isTrue: false, explanationAr: 'خطأ! تفشل Vanilla RNNs بعد خطوات قصيرة جداً بسبب تلاشي التدرجات.' },
    { statementAr: 'تتميز شبكات GRU بامتلاكها بوابتين فقط مما يجعلها أسرع في التدريب مقارنة بـ LSTM في كثير من التطبيقات.', statementEn: 'GRUs feature only 2 gates, making them computationally lighter and faster than LSTMs.', isTrue: true, explanationAr: 'صحيح! البنيتان المدمجتان تقللان عدد المعاملات بنحو 25% مع أداء مشابه.' }
  ],
  anagramTerm: 'RECURRENT',
  missingWordSentence: {
    sentenceAr: 'تتحكم بوابة الـ __________ في شبكة LSTM في كمية المعلومات التي يجب محوها من خلية الذاكرة السابقة.',
    wordOptionsAr: ['Forget Gate', 'Input Gate', 'Output Gate', 'Convolution'],
    correctWord: 'Forget Gate'
  },
  groupSortData: {
    cat1Ar: '🚪 بوابات خلية LSTM',
    cat1En: 'LSTM Gates',
    cat2Ar: '⚡ بوابات خلية GRU',
    cat2En: 'GRU Gates',
    items: [
      { textAr: 'بوابة النسيان (Forget Gate)', textEn: 'Forget Gate', cat: 1 },
      { textAr: 'بوابة إعادة التعيين (Reset Gate)', textEn: 'Reset Gate', cat: 2 },
      { textAr: 'بوابة الإدخال (Input Gate)', textEn: 'Input Gate', cat: 1 },
      { textAr: 'بوابة التحديث (Update Gate)', textEn: 'Update Gate', cat: 2 }
    ]
  },
  rankSteps: [
    { id: 1, textAr: '1️⃣ حساب بوابة النسيان f_t = σ(W_f · [h_{t-1}, x_t] + b_f)', textEn: '1️⃣ Compute Forget Gate f_t', correctOrder: 1 },
    { id: 2, textAr: '2️⃣ حساب بوابة الإدخال والمرشح i_t و C~_t للبيانات الجديدة', textEn: '2️⃣ Compute Input Gate i_t & Candidate C~_t', correctOrder: 2 },
    { id: 3, textAr: '3️⃣ تحديث خلية الذاكرة C_t = f_t * C_{t-1} + i_t * C~_t', textEn: '3️⃣ Update Cell State C_t', correctOrder: 3 },
    { id: 4, textAr: '4️⃣ حساب بوابة الإخراج o_t وتوليد الحالة المخفية h_t = o_t * tanh(C_t)', textEn: '4️⃣ Compute Output Gate o_t & Hidden State h_t', correctOrder: 4 }
  ],
  mazeDoors: [
    { label: 'الباب A', optionAr: 'LSTM Cell State Highway Gradient Flow (المسار الآمن 🚪✨)', optionEn: 'LSTM Cell State Highway Gradient Flow', isCorrect: true },
    { label: 'الباب B', optionAr: 'Zeroed Gradient Vanishing Horizon (طريق مسدود 💀)', optionEn: 'Zeroed Gradient Vanishing Horizon', isCorrect: false },
    { label: 'الباب C', optionAr: 'Infinite Recurrent Feedback Loop (طريق مسدود 💀)', optionEn: 'Infinite Recurrent Feedback Loop', isCorrect: false },
    { label: 'الباب D', optionAr: 'Untamed Exploding Activation Spike (طريق مسدود 💀)', optionEn: 'Untamed Exploding Activation Spike', isCorrect: false }
  ]
};

// -------------------------------------------------------------
// 5. LoRA, QLoRA & STREAMLIT DATA (Session 5)
// -------------------------------------------------------------
const loraStreamlitData: WordwallTopicGameData = {
  quizQuestions: [
    {
      qAr: 'ما الفكرة الرياضية الجوهرية لتقنية الضبط الدقيق منخفض الرتبة (LoRA)؟',
      qEn: 'What is the core mathematical intuition behind Low-Rank Adaptation (LoRA)?',
      optionsAr: ['تجميد أوزان النموذج الأصلية وتفكيك مصفوفة التحديث ΔW إلى حاصل ضرب مصفوفتين صغيرتين B × A برتبة منخفضة r', 'تدريب جميع أوزان النموذج الـ 7 مليار معاً من الصفر', 'حذف نصف طبقات المحول لتسريع المعالجة', 'تحويل النموذج تلقائياً للغة C++'],
      optionsEn: ['Freeze original weights & decompose ΔW into low-rank matrices B x A with rank r', 'Train all 7B parameters from scratch', 'Prune half the transformer layers', 'Convert model to C++'],
      correct: 0,
      explanationAr: 'تقوم LoRA بتجميد الأوزان الأصلية W_0 وتدريب مصفوفتين B و A برتبة r صغيرة جداً (مثل r=8)، مما يوفر 90% من استهلاك الذاكرة.'
    },
    {
      qAr: 'ما الذي تضيفه تقنية QLoRA فوق تقنية LoRA القياسية؟',
      qEn: 'What primary enhancement does QLoRA introduce over standard LoRA?',
      optionsAr: ['تكميم أوزان النموذج الأساسي بدقة 4-bit NormalFloat مع تكميم مزدوج (Double Quantization)', 'تشغيل النماذج بدون الحاجة لوحدة معالجة رسومية GPU', 'استبدال مكتبة PyTorch بجداول إكسل', 'إلغاء دوال الانتباه بالكامل'],
      optionsEn: ['Quantizes base weights to 4-bit NormalFloat (NF4) with Double Quantization', 'Runs models with zero GPU needs', 'Replaces PyTorch with Excel', 'Removes all attention functions'],
      correct: 0,
      explanationAr: 'تدمج QLoRA التكميم 4-bit NF4 مع معمارية LoRA لتسمح بضبط نماذج لغوية ضخمة على كارت شاشة استهلاكي واحد.'
    },
    {
      qAr: 'عند نشر النموذج المختار عبر واجهة Streamlit التفاعلية، ما هي الميزة التي توفرها مكتبة Streamlit للمطورين؟',
      qEn: 'When deploying a fine-tuned model via Streamlit, what advantage does it provide developers?',
      optionsAr: ['بناء واجهات ويب تفاعلية كاملة مع عناصر تحكم في ثوانٍ باستخدام كود بايثون فقط', 'استضافة مجانية لـ 100 مليون مستخدم دون خادم', 'تشفير عسكري لبيانات الطلاب', 'تحويل كود بايثون تلقائياً إلى لغة تجميع Assembly'],
      optionsEn: ['Build interactive web apps with widgets in seconds using pure Python', 'Free hosting for 100M concurrent users', 'Military grade student encryption', 'Auto-converts Python to Assembly'],
      correct: 0,
      explanationAr: 'تتيح مكتبة Streamlit إنشاء واجهات مستخدم غنية بالأزرار والشرائح التفاعلية بالاعتماد على بايثون حصراً.'
    },
    {
      qAr: 'ما هو معامل Scaling Factor المستخدم في LoRA والذي يُعبر عنه بالصيغة (α / r)؟',
      qEn: 'What does the scaling factor (α / r) in LoRA control?',
      optionsAr: ['معامل يحدد مدى قوة تأثير الأوزان الجديدة المدربة مقارنة بالأوزان الأصلية المجمدة', 'عدد أنوية المعالج المستخدمة في الحساب', 'نسبة الكلمات المحذوفة من النص', 'معدل استهلاك الطاقة للبطاقة'],
      optionsEn: ['Magnitude scaling factor tuning the strength of low-rank updates relative to base weights', 'Number of CPU cores used', 'Ratio of pruned vocabulary', 'GPU power wattage limit'],
      correct: 0,
      explanationAr: 'المعامل α/r يضبط قوة إشارة التحديث الناتجة عن مصفوفتي LoRA بالنسبة لأوزان النموذج الأساسية المجمدة.'
    }
  ],
  matchPairs: [
    { id: '1', term: 'LoRA Adapters', defAr: 'مصفوفات رتبة منخفضة B×A تدرب بينما أوزان النموذج مجمدة', defEn: 'Low-rank trainable matrices injected into frozen weights' },
    { id: '2', term: 'QLoRA 4-bit NF4', defAr: 'تكميم أوزان الأساس بدقة 4-bit مع تكميم مزدوج لتقليص الذاكرة', defEn: '4-bit NormalFloat quantization with double quantization' },
    { id: '3', term: 'Streamlit Framework', defAr: 'بناء واجهات تفاعلية سريعة لنشر تطبيقات الذكاء الاصطناعي ببايثون', defEn: 'Rapid Python UI library for interactive ML demos' },
    { id: '4', term: 'LoRA Alpha (α)', defAr: 'معامل تحجيم لتعديل قوة تحديثات مصفوفات الرتبة المنخفضة', defEn: 'Scaling factor balancing adapter update magnitude' },
  ],
  trueFalseStatements: [
    { statementAr: 'تسمح تقنية QLoRA بتشغيل وتدريب نماذج لغوية عملاقة مثل Llama على بطاقات رسومية استهلاكية صغيرة بفضل دقة 4-bit.', statementEn: 'QLoRA enables fine-tuning giant LLMs on consumer GPUs through 4-bit quantization.', isTrue: true, explanationAr: 'صحيح! خفض الدقة إلى 4-bit NF4 قلص استهلاك VRAM بأكثر من 65%.' },
    { statementAr: 'تتطلب تقنية LoRA مضاعفة استهلاك الذاكرة العشوائية VRAM مقارنة بالتدريب الكامل Full Fine-Tuning.', statementEn: 'LoRA requires double the VRAM compared to Full Fine-Tuning.', isTrue: false, explanationAr: 'خطأ! LoRA تخفض استهلاك الذاكرة بشكل دراماتيكي بتجميد أغلب الأوزان.' },
    { statementAr: 'يتميز إطار Streamlit بإعادة تنفيذ السكريبت من البداية عند كل تفاعل مع عناصر واجهة المستخدم.', statementEn: 'Streamlit reruns the whole Python script from top to bottom upon each UI interaction.', isTrue: true, explanationAr: 'صحيح! دورة تشغيل Streamlit تعيد التنفيذ عند تفاعل المستخدم مع الحفاظ على Session State.' }
  ],
  anagramTerm: 'ADAPTATION',
  missingWordSentence: {
    sentenceAr: 'تعتمد تقنية __________ على تفكيك مصفوفة تحديث الأوزان إلى حاصل ضرب مصفوفات منخفضة الرتبة لتوفير الذاكرة.',
    wordOptionsAr: ['LoRA', 'Softmax', 'Convolution', 'Tokenization'],
    correctWord: 'LoRA'
  },
  groupSortData: {
    cat1Ar: '💾 تقنيات الضبط الدقيق الفعال (PEFT)',
    cat1En: 'PEFT & Quantization',
    cat2Ar: '🚀 أدوات النشر والتجربة التفاعلية (Deployment)',
    cat2En: 'Deployment & UI',
    items: [
      { textAr: 'مصفوفات الرتبة المنخفضة LoRA Adapters', textEn: 'Low-Rank LoRA Adapters', cat: 1 },
      { textAr: 'واجهة Streamlit لعرض مخرجات النموذج', textEn: 'Streamlit Interactive Web Dashboard', cat: 2 },
      { textAr: 'تكميم الأوزان الرباعي QLoRA 4-bit NF4', textEn: '4-bit NormalFloat Quantization', cat: 1 },
      { textAr: 'خوادم FastAPI وواجهات الاستجابة السريعة', textEn: 'FastAPI High-Performance Endpoints', cat: 2 }
    ]
  },
  rankSteps: [
    { id: 1, textAr: '1️⃣ تجميد أوزان النموذج اللغوي الأساسي المجمد W_0 بالكامل', textEn: '1️⃣ Freeze pre-trained base model weights W_0', correctOrder: 1 },
    { id: 2, textAr: '2️⃣ حقن مصفوفتي الرتبة المنخفضة B و A في طبقات الانتباه', textEn: '2️⃣ Inject low-rank matrices B and A into attention layers', correctOrder: 2 },
    { id: 3, textAr: '3️⃣ تدريب وتحديث معلمات LoRA فقط باستخدام مجموعة البيانات المخصصة', textEn: '3️⃣ Train only LoRA parameters on domain dataset', correctOrder: 3 },
    { id: 4, textAr: '4️⃣ دمج الأوزان أو تحميل الـ Adapter ونشره عبر واجهة Streamlit', textEn: '4️⃣ Merge weights or deploy adapter via Streamlit UI', correctOrder: 4 }
  ],
  mazeDoors: [
    { label: 'الباب A', optionAr: 'Frozen Backbone with Low-Rank Adapters (المسار الآمن 🚪✨)', optionEn: 'Frozen Backbone with Low-Rank Adapters', isCorrect: true },
    { label: 'الباب B', optionAr: 'Full Fine-Tuning OOM Memory Crash (طريق مسدود 💀)', optionEn: 'Full Fine-Tuning Out-Of-Memory Crash', isCorrect: false },
    { label: 'الباب C', optionAr: 'Unquantized Weight Drift Explosion (طريق مسدود 💀)', optionEn: 'Unquantized Weight Drift Explosion', isCorrect: false },
    { label: 'الباب D', optionAr: 'Streamlit State Desync Hang (طريق مسدود 💀)', optionEn: 'Streamlit State Desync Hang', isCorrect: false }
  ]
};

// -------------------------------------------------------------
// 6. RAG & VECTOR DATABASES DATA (Session 8)
// -------------------------------------------------------------
const ragData: WordwallTopicGameData = {
  quizQuestions: [
    {
      qAr: 'ما هو الهدف المعماري الأساسي لتطبيق التوليد المعزز بالاسترجاع (RAG - Retrieval-Augmented Generation)؟',
      qEn: 'What is the primary architectural objective of Retrieval-Augmented Generation (RAG)?',
      optionsAr: ['تزويد النموذج اللغوي بسياق موثق من مستندات خارجية لتقليل الهلوسة دون إعادة تدريبه', 'تسريع استجابة الموديل لمليون كلمة بالثانية', 'حذف قواعد البيانات القديمة', 'تدريب نموذج أصغر حجماً من البداية'],
      optionsEn: ['Ground LLM responses with external document context to eliminate hallucinations', 'Accelerate generation to 1M words/sec', 'Delete legacy relational databases', 'Train a smaller model from scratch'],
      correct: 0,
      explanationAr: 'يقوم RAG بالبحث الدلالي في مستندات موثوقة واسترجاع الفقرات الأكثر صلة كمدخل للنموذج لمنع الهلوسة وتوفير دقة تامة.'
    },
    {
      qAr: 'لماذا نطبق تقنية التقطيع مع التداخل (Chunking with Overlap) على المستندات في منظومة RAG؟',
      qEn: 'Why is Chunking with Overlap applied to documents in a RAG pipeline?',
      optionsAr: ['لمنع انقطاع وفقدان المعنى والسياق عند حدود نهايات المقاطع النصية', 'لزيادة حجم ملفات PDF على الخادم', 'لحفظ الصور بدقة أعلى', 'لتقليل عدد التوكنز في النموذج'],
      optionsEn: ['Prevent contextual loss & semantic fractures at chunk boundaries', 'Artificially increase PDF file sizes', 'Save images in higher resolution', 'Reduce model token budget'],
      correct: 0,
      explanationAr: 'التداخل (Overlap) يضمن أن الكلمات أو الجمل الواقعة على حافة القطعة تظل متصلة دلالياً بالقطعة المجاورة.'
    },
    {
      qAr: 'ما هو المقياس الرياضي الأكثر شيوعاً لحساب درجة الشبه الدلالي بين متجه السؤال ومتجهات النصوص؟',
      qEn: 'Which mathematical metric is most commonly used to measure semantic similarity between vectors?',
      optionsAr: ['جيب تمام الزاوية (Cosine Similarity)', 'المسافة الإقليدية المطلقة العشوائية', 'جمع الأرقام الفردية للمصفوفة', 'معامل التمدد الحراري للمتجه'],
      optionsEn: ['Cosine Similarity', 'Random absolute distance', 'Sum of odd numbers', 'Thermal expansion factor'],
      correct: 0,
      explanationAr: 'يقيس Cosine Similarity جيب تمام الزاوية بين المتجهين، معبراً عن درجة التطابق الدلالي بصرف النظر عن طول المتجه.'
    },
    {
      qAr: 'أي من المنظومات التالية متخصصة في الفهرسة وتخزين المتجهات والبحث التقريبي (Vector Database)؟',
      qEn: 'Which systems are specifically engineered as Vector Databases for high-speed similarity search?',
      optionsAr: ['FAISS و Weaviate و ChromaDB', 'SQLite القياسية بدون أي ملحقات', 'محرر النصوص المفكرة Notepad', 'جداول Excel 2003'],
      optionsEn: ['FAISS, Weaviate, and ChromaDB', 'Standard bare SQLite', 'Windows Notepad', 'Excel 2003 Sheets'],
      correct: 0,
      explanationAr: 'تعتمد منظومات RAG على Vector Databases متخصصة مثل FAISS و Weaviate و ChromaDB للبحث السريع في فضاء المتجهات.'
    }
  ],
  matchPairs: [
    { id: '1', term: 'Vector Database (FAISS/Weaviate)', defAr: 'فهرسة متجهات التضمين والبحث فائق السرعة عن أقرب الجيران (ANN)', defEn: 'Indexes embeddings for sub-millisecond approximate nearest neighbor search' },
    { id: '2', term: 'Chunk Overlap', defAr: 'تداخل النصوص بين المقاطع لمنع فقدان السياق عند حواف التقطيع', defEn: 'Text overlap between chunks preserving boundary semantic context' },
    { id: '3', term: 'Cosine Similarity', defAr: 'قياس الزاوية بين متجهات التضمين لتحديد درجة الشبه الدلالي', defEn: 'Measures angle between embedding vectors for semantic similarity' },
    { id: '4', term: 'Hallucination Reduction', defAr: 'تقليص اختلاق الإجابات الخاطئة عبر تعزيز النموذج بحقائق مسترجعة', defEn: 'Eliminates fabricated responses by grounding in retrieved facts' },
  ],
  trueFalseStatements: [
    { statementAr: 'يتيح نظام RAG للنموذج اللغوي الإجابة على بيانات ومعلومات خاصة ومحدثة دون الحاجة لإعادة تدريبه كاملاً.', statementEn: 'RAG allows LLMs to answer domain-specific private questions without costly retraining.', isTrue: true, explanationAr: 'صحيح! استرجاع الحقائق في نافذة السياق يغني عن إعادة التدريب المكلفة.' },
    { statementAr: 'في معمارية RAG، يتم إرسال وثائق الـ PDF بالكامل كملف خام واحد داخل نص الـ Prompt للنموذج دون تقطيع.', statementEn: 'In RAG, entire raw PDF documents are passed into the prompt without any chunking.', isTrue: false, explanationAr: 'خطأ! المستندات يجب تقطيعها إلى قطع متناسقة واسترجاع الأكثر صلة فقط لتفادي قيود نافذة السياق والتكلفة.' },
    { statementAr: 'تستخدم خوارزمية HNSW في قواعد البيانات المتجهة لتسريع البحث عن أقرب المتجهات المتشابهة في أجزاء من الثانية.', statementEn: 'HNSW algorithm enables millisecond approximate nearest neighbor retrieval in vector databases.', isTrue: true, explanationAr: 'صحيح! خوارزمية Hierarchical Navigable Small World تنشئ رسوماً بيانية متعددة الطبقات لتسريع البحث.' }
  ],
  anagramTerm: 'RETRIEVAL',
  missingWordSentence: {
    sentenceAr: 'يقوم نظام الـ __________ بالبحث الدلالي في المستندات وتزويد النموذج بالسياق الموثق لمنع الهلوسة.',
    wordOptionsAr: ['RAG', 'Dropout', 'Pooling', 'Tokenizer'],
    correctWord: 'RAG'
  },
  groupSortData: {
    cat1Ar: '🔍 مرحلة الاسترجاع الدلالي (Retrieval)',
    cat1En: 'Retrieval Stage',
    cat2Ar: '✍️ مرحلة التوليد والصياغة (Generation)',
    cat2En: 'Generation Stage',
    items: [
      { textAr: 'تقطيع المستندات وتوليد متجهات التضمين (Embeddings)', textEn: 'Document chunking & embedding generation', cat: 1 },
      { textAr: 'حقن السياق المسترجع داخل الـ System Prompt', textEn: 'Injecting retrieved chunks into system prompt', cat: 2 },
      { textAr: 'البحث عن أقرب جيران عبر Cosine Similarity في Weaviate', textEn: 'Cosine similarity ANN search in Weaviate', cat: 1 },
      { textAr: 'صياغة الإجابة النهائية الموثقة بواسطة النموذج اللغوي', textEn: 'Synthesizing grounded answer with LLM', cat: 2 }
    ]
  },
  rankSteps: [
    { id: 1, textAr: '1️⃣ تقطيع المستندات إلى قطع متداخلة (Chunking with Overlap)', textEn: '1️⃣ Document Chunking with Overlap', correctOrder: 1 },
    { id: 2, textAr: '2️⃣ تحويل المقاطع النصية إلى متجهات تضمين دلالية (Embeddings)', textEn: '2️⃣ Convert Chunks into Vector Embeddings', correctOrder: 2 },
    { id: 3, textAr: '3️⃣ الاستعلام الدلالي والبحث عن أقرب المتجهات في Vector DB', textEn: '3️⃣ Query Embedding & Cosine Similarity Search', correctOrder: 3 },
    { id: 4, textAr: '4️⃣ حقن المقاطع المسترجعة في نافذة السياق وتوليد الإجابة بالـ LLM', textEn: '4️⃣ Inject Context into Prompt & Generate with LLM', correctOrder: 4 }
  ],
  mazeDoors: [
    { label: 'الباب A', optionAr: 'Cosine Similarity Grounded Context Retrieval (المسار الآمن 🚪✨)', optionEn: 'Cosine Similarity Grounded Context Retrieval', isCorrect: true },
    { label: 'الباب B', optionAr: 'Blind Hallucination without Context (طريق مسدود 💀)', optionEn: 'Blind Hallucination without Context', isCorrect: false },
    { label: 'الباب C', optionAr: 'Fragmented Context Loss at Chunk Seam (طريق مسدود 💀)', optionEn: 'Fragmented Context Loss at Chunk Seam', isCorrect: false },
    { label: 'الباب D', optionAr: 'Vector Index Dimension Mismatch (طريق مسدود 💀)', optionEn: 'Vector Index Dimension Mismatch', isCorrect: false }
  ]
};

// -------------------------------------------------------------
// 7. CAPSTONE PROJECT & FINAL DEFENSE DATA (Sessions 7 & 9)
// -------------------------------------------------------------
const capstoneData: WordwallTopicGameData = {
  quizQuestions: [
    {
      qAr: 'ما هو المقياس الأكثر شمولاً وتوازناً لتقييم أداء نموذج تصنيف يعاني من عدم توازن البيانات (Imbalanced Data)؟',
      qEn: 'What is the most robust metric for evaluating classification models on heavily imbalanced datasets?',
      optionsAr: ['معيار F1-Score (المتوسط التوافقي بين Precision و Recall)', 'نسبة الدقة البسيطة (Accuracy) فقط', 'سرعة المعالج بالـ GHz', 'حجم ملف الكود بالبايت'],
      optionsEn: ['F1-Score (harmonic mean of precision and recall)', 'Raw accuracy only', 'CPU clock speed', 'Code file size'],
      correct: 0,
      explanationAr: 'في البيانات غير المتوازنة تكون نسبة الدقة مضللة، بينما F1-Score يحقق التوازن الرياضي بين الدقة والاسترجاع.'
    },
    {
      qAr: 'ما الممارسة الهندسية الأهم لضمان عدم تسريب البيانات (Data Leakage) أثناء بناء خط الأنابيب (ML Pipeline)؟',
      qEn: 'What crucial engineering practice prevents Data Leakage during ML pipeline construction?',
      optionsAr: ['عزل مجموعة بيانات الاختبار بالكامل وتطبيق المعالجة المسبقة بناءً على إحصائيات بيانات التدريب فقط', 'خلط جميع البيانات معاً قبل التقسيم', 'حذف بيانات التدريب بعد انتهاء النموذج', 'استخدام بيانات الاختبار لملء القيم المفقودة'],
      optionsEn: ['Strictly isolate test data & fit preprocessors only on training fold statistics', 'Mix all data before splitting', 'Delete training data post-training', 'Impute missing values using test split'],
      correct: 0,
      explanationAr: 'تسريب بيانات الاختبار أثناء المعالجة المسبقة أو التضمين يؤدي إلى دقة وهمية وانهيار النموذج في الإنتاج.'
    },
    {
      qAr: 'خلال المناقشة الشفوية والعرض التقديمي (Final Presentation & Zoom Defense)، ما الذي يبرز تميز المشروع؟',
      qEn: 'During the live Zoom defense and presentation, what demonstrates true project engineering excellence?',
      optionsAr: ['المنهجية الهندسية، معالجة التحديات، مقارنة النماذج والنتائج، وعرض تطبيقي مباشر وشغال', 'قراءة شرائح العرض كلمة بكلمة', 'تجنب الإجابة على أسئلة لجنة التحكيم', 'التركيز فقط على طول الكود المكتوب'],
      optionsEn: ['Sound methodology, benchmark comparisons, design justifications & a working live demo', 'Reading slides verbatim', 'Avoiding examiner questions', 'Bragging about lines of code'],
      correct: 0,
      explanationAr: 'التقييم يركز على الفهم العميق، القرارات المعمارية المبررة، ومنهجية القياس، والـ Live Demo الناجح.'
    },
    {
      qAr: 'ما المبدأ الأساسي في تقسيم المهام بين أعضاء الفريق (5 أو 6 أعضاء) في مشاريع التخرج؟',
      qEn: 'What is the core principle for dividing tasks among team members (5/6 students)?',
      optionsAr: ['توزيع تخصصي متكامل: هندسة البيانات، النماذج، بناء واجهة المستخدم، والاختبار والتوثيق', 'عمل جميع الأعضاء على نفس الملف السطري في نفس اللحظة', 'اعتماد شخص واحد لإنجاز كامل المشروع بمفرده', 'تأجيل كتابة التقرير لما بعد المناقشة'],
      optionsEn: ['Modular specialization: data engineering, modeling, fullstack UI, testing & documentation', 'All members editing the same file concurrently', 'Single student doing everything', 'Postponing report until defense ends'],
      correct: 0,
      explanationAr: 'الفرق الناجحة توزع الأدوار بوضوح (Data Engineering, Modeling, Fullstack Deployment, Testing & Documentation).'
    }
  ],
  matchPairs: [
    { id: '1', term: 'F1-Score Metric', defAr: 'المتوسط التوافقي للدقة والاسترجاع لتقييم النماذج في البيانات غير المتوازنة', defEn: 'Harmonic mean of precision & recall for imbalanced datasets' },
    { id: '2', term: 'Data Leakage Prevention', defAr: 'عزل بيانات التقييم بالكامل لمنع التقييمات الوهمية المضللة', defEn: 'Strict separation of test set to prevent spurious test optimism' },
    { id: '3', term: 'Live Demo Deployment', defAr: 'تشغيل النظام المكتمل بواجهة تفاعلية حية خلال جلسة المناقشة', defEn: 'Live working interactive system demonstrated during defense' },
    { id: '4', term: 'Cross-Validation (k-fold)', defAr: 'تقسيم متكرر للبيانات للتحقق من ثبات وقدرة النموذج على التعميم', defEn: 'k-fold data splitting validating generalization stability' },
  ],
  trueFalseStatements: [
    { statementAr: 'يعتبر العرض التوضيحي المباشر (Live Demo) للمشروع ركناً أساسياً في التقييم النهائي لإثبات جاهزية النظام للعمل الفعلي.', statementEn: 'A working live demo is essential in final defense to prove end-to-end production readiness.', isTrue: true, explanationAr: 'صحيح! الـ Live Demo يبرهن على نجاح تكامل الواجهة والخادم والنماذج عملياً.' },
    { statementAr: 'تعتبر نسبة الدقة البسيطة (Accuracy) مقياساً كافياً ومثالياً دائماً لتقييم نماذج كشف الاحتيال أو الحالات النادرة.', statementEn: 'Accuracy is always an ideal and sufficient metric for rare anomaly detection.', isTrue: false, explanationAr: 'خطأ! إذا كانت الفئة النادرة 1%، فنموذج يتوقع دوماً 0 يحصل على 99% دقة دون أن يتعلم شيئاً.' },
    { statementAr: 'يساعد كتابة تقرير تقني مفصل يحتوي على قرارات التصميم والنتائج المقارنة في رفع درجة توثيق المشروع النهائي.', statementEn: 'A detailed technical report with architectural rationale maximizes final documentation marks.', isTrue: true, explanationAr: 'صحيح! التوثيق الهندسي والمبررات المعمارية تعكس النضج التقني للفريق.' }
  ],
  anagramTerm: 'EVALUATION',
  missingWordSentence: {
    sentenceAr: 'يُعد مقياس الـ __________ المعيار الأفضل لتقييم نماذج التصنيف عندما تكون فئات البيانات غير متكافئة العدد.',
    wordOptionsAr: ['F1-Score', 'Learning Rate', 'Batch Size', 'Dropout Rate'],
    correctWord: 'F1-Score'
  },
  groupSortData: {
    cat1Ar: '⚙️ مرحلة التطوير والتدريب',
    cat1En: 'Development & Training',
    cat2Ar: '🎯 مرحلة التقييم والمناقشة',
    cat2En: 'Evaluation & Defense',
    items: [
      { textAr: 'تنظيف البيانات وضبط المعاملات الفائقة (Hyperparameters)', textEn: 'Data cleaning and hyperparameter tuning', cat: 1 },
      { textAr: 'تحليل مصفوفة الالتباس (Confusion Matrix) ومقياس ROC-AUC', textEn: 'Confusion matrix & ROC-AUC curve analysis', cat: 2 },
      { textAr: 'تدريب النماذج ومقارنة المعماريات الأساسية', textEn: 'Baseline model training & architecture comparisons', cat: 1 },
      { textAr: 'عرض الـ Demo التفاعلي والإجابة على أسئلة لجنة التحكيم', textEn: 'Interactive live demo presentation & defense Q&A', cat: 2 }
    ]
  },
  rankSteps: [
    { id: 1, textAr: '1️⃣ تحديد المشكلة، جمع وتنظيف البيانات، وتوزيع الأدوار بين أعضاء الفريق', textEn: '1️⃣ Problem definition, data collection & role allocation', correctOrder: 1 },
    { id: 2, textAr: '2️⃣ بناء خط أنابيب المعالجة واستكشاف النماذج المختلفة وتدريبها', textEn: '2️⃣ Pipeline engineering, baseline modeling & training', correctOrder: 2 },
    { id: 3, textAr: '3️⃣ التحقق المتقاطع وضبط المعاملات وتحليل الأخطاء عبر F1-Score', textEn: '3️⃣ Cross-validation, tuning & error analysis via F1-Score', correctOrder: 3 },
    { id: 4, textAr: '4️⃣ بناء واجهة النشر التفاعلية، وتجهيز العرض التقديمي للمناقشة', textEn: '4️⃣ Fullstack UI deployment & presentation slides defense', correctOrder: 4 }
  ],
  mazeDoors: [
    { label: 'الباب A', optionAr: 'Rigorous Cross-Validation & Live Working Demo (المسار الآمن 🚪✨)', optionEn: 'Rigorous Cross-Validation & Live Working Demo', isCorrect: true },
    { label: 'الباب B', optionAr: 'Silent Data Leakage between Train and Test (طريق مسدود 💀)', optionEn: 'Silent Data Leakage between Train and Test', isCorrect: false },
    { label: 'الباب C', optionAr: 'Overfitting Memorization on Training Set (طريق مسدود 💀)', optionEn: 'Overfitting Memorization on Training Set', isCorrect: false },
    { label: 'الباب D', optionAr: 'Untested Deployment Crash during Defense (طريق مسدود 💀)', optionEn: 'Untested Deployment Crash during Defense', isCorrect: false }
  ]
};

// -------------------------------------------------------------
// 8. NEURAL NETWORKS & DEEP LEARNING (Classic Foundation)
// -------------------------------------------------------------
const neuralNetsData: WordwallTopicGameData = {
  quizQuestions: [
    {
      qAr: 'ما الخوارزمية المسؤولة عن تعديل أوزان الروابط العصبية بعكس اتجاه الإشارة بناءً على مشتقة دالة الخطأ؟',
      qEn: 'Which algorithm updates neural connection weights in the reverse direction using loss gradients?',
      optionsAr: ['التمرير الخلفي (Backpropagation)', 'التجمع المكاني (Max Pooling)', 'التنعيم المنهجي (Smoothing)', 'الترميز اللغوي (Tokenization)'],
      optionsEn: ['Backpropagation', 'Max Pooling', 'Smoothing', 'Tokenization'],
      correct: 0,
      explanationAr: 'التمرير الخلفي (Backpropagation) يحسب المشتقة الجزئية للخطأ وفق قاعدة السلسلة ويقوم بتحديث الأوزان.'
    },
    {
      qAr: 'ماذا تفعل دالة التنشيط ReLU عندما تتلقى قيمة مدخلات سالبة؟',
      qEn: 'What does the ReLU activation function do when receiving negative input values?',
      optionsAr: ['تحول القيمة السالبة لـ 0 مباشرة وتمرر القيم الموجبة كما هي', 'تضاعف القيمة السالبة', 'تقسم القيمة على 2', 'تزيد القيمة لـ +100'],
      optionsEn: ['Converts negative value to 0 and passes positive as-is', 'Doubles negative value', 'Divides value by 2', 'Increases to +100'],
      correct: 0,
      explanationAr: 'دالة ReLU تجعل أي قيمة أقل من صفر مساوية لـ 0، وتمرر القيم الموجبة خطياً دون تعديل.'
    },
    {
      qAr: 'ما هي الطبقة المحصورة بين المدخلات والمخرجات والمسؤولة عن استخلاص الأنماط والملامح غير الخطية؟',
      qEn: 'Which layer situated between inputs and outputs extracts non-linear representations?',
      optionsAr: ['الطبقة الخفية (Hidden Layer)', 'طبقة المدخلات الصريحة (Input Layer)', 'طبقة التجميد (Freeze Layer)', 'طبقة المخرجات فقط (Output Layer)'],
      optionsEn: ['Hidden Layer', 'Input Layer', 'Freeze Layer', 'Output Layer'],
      correct: 0,
      explanationAr: 'الطبقة الخفية (Hidden Layer) تتولى معالجة الملامح والتحويلات غير الخطية لاستخلاص العلاقات المعقدة.'
    },
    {
      qAr: 'ماذا يمثل مصطلح الـ Epoch في دورة تدريب الشبكات العصبية؟',
      qEn: 'What does an Epoch represent during neural network training?',
      optionsAr: ['دورة تدريب وتمرير كاملة لجميع عينات مجموعة البيانات في النموذج', 'حجم خطوة التعلم ومعدل التحديث', 'عدد الطبقات الخفية في الشبكة', 'نسبة دقة التوقع فقط'],
      optionsEn: ['A complete pass of the entire training dataset through the network', 'Learning step size', 'Number of hidden layers', 'Accuracy percentage'],
      correct: 0,
      explanationAr: 'الـ Epoch هو إتمام قراءة وتدريب جميع عينات مجموعة البيانات دفعة واحدة عبر الشبكة.'
    }
  ],
  matchPairs: [
    { id: '1', term: 'Backpropagation', defAr: 'تعديل الأوزان بناءً على مشتقة الخطأ المحسوبة بقاعدة السلسلة', defEn: 'Updates weights using error gradients via chain rule' },
    { id: '2', term: 'Hidden Layer', defAr: 'استخلاص الملامح والأنماط المعقدة غير الخطية بين الطبقات', defEn: 'Extracts non-linear feature representations' },
    { id: '3', term: 'ReLU Function', defAr: 'دالة تنشيط تحول القيم السالبة إلى 0 وتمرر الموجبة', defEn: 'Activation function clipping negative inputs to zero' },
    { id: '4', term: 'Epochs Count', defAr: 'عدد دورات المرور الكاملة على مجموعة بيانات التدريب', defEn: 'Total full passes over the entire training dataset' },
  ],
  trueFalseStatements: [
    { statementAr: 'تستعمل خوارزمية Backpropagation مشتقة الخطأ لحساب مقدار تعديل كل وزن في الشبكة.', statementEn: 'Backpropagation uses error gradients to calculate weight adjustment increments.', isTrue: true, explanationAr: 'صحيح! التمرير الخلفي يحسب ميل دالة الخسارة بالنسبة لكل وزن.' },
    { statementAr: 'تقوم دالة التنشيط ReLU بتحويل الأرقام الموجبة إلى صفر وإبقاء السالبة.', statementEn: 'ReLU converts positive numbers to zero and keeps negative values.', isTrue: false, explanationAr: 'خطأ! دالة ReLU تلغي السالب فقط وتجعله صفراً، وتترك الأرقام الموجبة دون أي تغيير.' },
    { statementAr: 'يساعد معدل التعلم (Learning Rate) الصغير جداً على منع تذبذب دالة الخسارة لكنه قد يبطئ التقارب.', statementEn: 'A very small learning rate prevents loss oscillations but can slow convergence.', isTrue: true, explanationAr: 'صحيح! معدل التعلم الصغير يجعل الخطوات دقيقة لكنها تستغرق وقتاً أطول.' }
  ],
  anagramTerm: 'BACKPROP',
  missingWordSentence: {
    sentenceAr: 'تقوم دالة التنشيط __________ بتحويل جميع المدخلات السالبة إلى صفر وتمرير الموجبة.',
    wordOptionsAr: ['ReLU', 'Sigmoid', 'Softmax', 'Tanh'],
    correctWord: 'ReLU'
  },
  groupSortData: {
    cat1Ar: '📈 دوال تنشيط غير خطية (Activations)',
    cat1En: 'Activation Functions',
    cat2Ar: '⚙️ خوارزميات تحسين وتدرج (Optimizers)',
    cat2En: 'Optimization Algorithms',
    items: [
      { textAr: 'دالة الوحدة الخطية المصححة (ReLU)', textEn: 'Rectified Linear Unit (ReLU)', cat: 1 },
      { textAr: 'خوارزمية التدرج اللحظي التكيفي (Adam)', textEn: 'Adaptive Moment Estimation (Adam)', cat: 2 },
      { textAr: 'دالة التنشيط السينوسية (Sigmoid)', textEn: 'Sigmoid Probability Function', cat: 1 },
      { textAr: 'الانحدار العشوائي للتدرج (SGD)', textEn: 'Stochastic Gradient Descent (SGD)', cat: 2 }
    ]
  },
  rankSteps: [
    { id: 1, textAr: '1️⃣ التمرير الأمامي وحساب التوقع (Forward Pass Prediction)', textEn: '1️⃣ Forward Pass Prediction', correctOrder: 1 },
    { id: 2, textAr: '2️⃣ قياس قيمة دالة الخطأ بين التوقع والحقيقة (Compute Loss)', textEn: '2️⃣ Compute Loss against Ground Truth', correctOrder: 2 },
    { id: 3, textAr: '3️⃣ حساب المشتقات الجزئية للتدرج عبر التمرير الخلفي (Backpropagation)', textEn: '3️⃣ Compute Gradients via Backpropagation', correctOrder: 3 },
    { id: 4, textAr: '4️⃣ تحديث أوزان الروابط العصبية عبر المحسن (Optimizer Weight Update)', textEn: '4️⃣ Update Weights using Optimizer', correctOrder: 4 }
  ],
  mazeDoors: [
    { label: 'الباب A', optionAr: 'Gradient Descent Optimization Path (المسار الآمن 🚪✨)', optionEn: 'Gradient Descent Optimization Path', isCorrect: true },
    { label: 'الباب B', optionAr: 'Exploding Gradient Loss NaN (طريق مسدود 💀)', optionEn: 'Exploding Gradient Loss NaN', isCorrect: false },
    { label: 'الباب C', optionAr: 'Dead Neurons Zero Activation Trap (طريق مسدود 💀)', optionEn: 'Dead Neurons Zero Activation Trap', isCorrect: false },
    { label: 'الباب D', optionAr: 'Untrained Random Weights Output (طريق مسدود 💀)', optionEn: 'Untrained Random Weights Output', isCorrect: false }
  ]
};

// -------------------------------------------------------------
// 9. DYNAMIC TOPIC GENERATOR (Custom Uploaded PDFs / New Topics)
// -------------------------------------------------------------
function generateDynamicGameData(topic: CourseTopic): WordwallTopicGameData {
  const title = topic.titleAr || topic.titleEn || 'المحتوى التعليمي';
  const desc = topic.descriptionAr || topic.descriptionEn || 'المفاهيم المتقدمة في الوحدة';
  
  // Extract terms or derive meaningful defaults
  const words = `${title} ${desc}`.replace(/[^\w\s\u0600-\u06FF]/g, '').split(/\s+/).filter(w => w.length > 3);
  const keyword1 = words[0] || 'الخوارزمية';
  const keyword2 = words[1] || 'النموذج';
  const keyword3 = words[2] || 'البيانات';
  const keyword4 = words[3] || 'التقييم';

  // Determine a safe uppercase English anagram word (default: KNOWLEDGE or 6-8 chars)
  const enWords = (topic.titleEn || 'STUDY CONCEPT').toUpperCase().replace(/[^A-Z]/g, '');
  const anagramCandidate = enWords.length >= 4 && enWords.length <= 10 ? enWords.slice(0, 8) : 'ANALYSIS';

  return {
    quizQuestions: [
      {
        qAr: `ما الهدف الأساسي لدراسة موضوع "${title}"؟`,
        qEn: `What is the core objective of studying "${topic.titleEn || title}"?`,
        optionsAr: [
          `فهم وتطبيق ${keyword1} وتحسين كفاءة ${keyword2} عملياً`,
          'حفظ الأرقام العشوائية بدون تطبيق هندسي',
          'إلغاء مراحل التحقق والاختبار في المشاريع',
          'الاعتماد فقط على التخمين غير المبرر'
        ],
        optionsEn: [
          `Understanding & applying ${keyword1} to optimize ${keyword2} workflows`,
          'Memorizing raw numbers without design rationale',
          'Skipping validation and testing phases',
          'Relying purely on unvalidated guessing'
        ],
        correct: 0,
        explanationAr: `يهدف هذا الموضوع إلى استيعاب ${keyword1} وتوظيفها بشكل منهجي لبناء حلول فعالة وموثوقة.`
      },
      {
        qAr: `كيف تساهم دراسة "${keyword2}" في حل التحديات العملية؟`,
        qEn: `How does mastering "${keyword2}" solve real-world problems?`,
        optionsAr: [
          `توفير أسس علمية دقيقة لتحليل ومعالجة ${keyword3}`,
          'زيادة نسبة الخطأ في مخرجات النظام',
          'إيقاف خط الإنتاج عند حدوث أي استفسار',
          'تجاهل معايير الجودة والأداء'
        ],
        optionsEn: [
          `Provides rigorous scientific principles to analyze and process ${keyword3}`,
          'Increases system error rates',
          'Halts production on any query',
          'Disregards quality and performance benchmarks'
        ],
        correct: 0,
        explanationAr: `المفاهيم المتقدمة في ${keyword2} تركز على التحليل المنهجي الدقيق وتجاوز معوقات التنفيذ.`
      },
      {
        qAr: `ما الممارسة الهندسية الفضلى الموصى بها عند تنفيذ مهام "${title}"؟`,
        qEn: `What is the recommended engineering best practice for "${topic.titleEn || title}"?`,
        optionsAr: [
          `التنفيذ التدريجي، والتحقق المستمر من النتائج عبر ${keyword4}`,
          'البدء في بيئة الإنتاج مباشرة دون اختبار',
          'حذف سجلات الأخطاء والملاحظات التوثيقية',
          'الاعتماد على إعدادات افتراضية غير مدروسة'
        ],
        optionsEn: [
          `Iterative execution with continuous validation using ${keyword4}`,
          'Deploying straight to production without tests',
          'Deleting error logs and documentation',
          'Relying on unverified default configs'
        ],
        correct: 0,
        explanationAr: `المنهجية السليمة تتطلب التحقق الدوري والقياس المستمر عبر ${keyword4} لضمان الجودة.`
      },
      {
        qAr: `ما الأثر الإيجابي لتطبيق هذه الوحدة على أداء النظام البرمجي؟`,
        qEn: `What is the positive impact of this module on software performance?`,
        optionsAr: [
          'رفع الكفاءة التشغيلية وتقليل زمن المعالجة واستهلاك الموارد',
          'إبطاء سرعة الاستجابة بأضعاف مضاعفة',
          'مضاعفة استهلاك الذاكرة بدون فائدة',
          'توليد أخطاء عشوائية غير مفسرة'
        ],
        optionsEn: [
          'Boosting operational throughput while minimizing latency and resource waste',
          'Drastically slowing system response times',
          'Doubling memory consumption needlessly',
          'Generating unexplained random errors'
        ],
        correct: 0,
        explanationAr: 'التطبيق الأمثل للمفاهيم يرفع كفاءة المعالجة ويضمن استقرار الموارد البرمجية.'
      }
    ],
    matchPairs: [
      { id: '1', term: keyword1, defAr: `المفهوم المحوري في دراسة "${title}"`, defEn: `Core concept in "${topic.titleEn || title}"` },
      { id: '2', term: keyword2, defAr: `الركيزة التطبيقية لمعالجة مهام هذه الوحدة`, defEn: `Applied pillar for managing this module tasks` },
      { id: '3', term: keyword3, defAr: `المدخلات الأساسية المستهدفة بالتحليل والتحسين`, defEn: `Primary target inputs analyzed and enhanced` },
      { id: '4', term: keyword4, defAr: `معيار القياس والتحقق من جودة النتائج النهائية`, defEn: `Benchmark standard verifying output quality` }
    ],
    trueFalseStatements: [
      {
        statementAr: `يتطلب موضوع "${title}" الفهم المتكامل لخطوات التنفيذ ومراعاة معايير الكفاءة.`,
        statementEn: `"${topic.titleEn || title}" requires holistic understanding of execution steps and efficiency.`,
        isTrue: true,
        explanationAr: 'صحيح! الفهم المتكامل يضمن تطبيق الحلول البرمجية بأعلى كفاءة وجودة.'
      },
      {
        statementAr: `يمكن الاستغناء عن مرحلة التحقق والاختبار عند التعامل مع "${keyword2}".`,
        statementEn: `Testing and verification can be completely skipped when dealing with "${keyword2}".`,
        isTrue: false,
        explanationAr: 'خطأ! الاختبار والتحقق مرحلة حاسمة لضمان موثوقية وأمان أي تطبيق عملي.'
      },
      {
        statementAr: `يساعد التوثيق الواضح لخطوات ${keyword1} في تسهيل صيانة وتطوير النظام مستقبلاً.`,
        statementEn: `Clear documentation of ${keyword1} simplifies future system maintenance and expansion.`,
        isTrue: true,
        explanationAr: 'صحيح! التوثيق السليم هو أساس الصيانة واستدامة المشاريع البرمجية.'
      }
    ],
    anagramTerm: anagramCandidate,
    missingWordSentence: {
      sentenceAr: `يُعد استيعاب مبادئ __________ حجر الزاوية في إتقان هذا الموضوع التعليمي بنجاح.`,
      wordOptionsAr: [keyword1, 'التخمين العشوائي', 'تجاهل الأخطاء', 'إيقاف النظام'],
      correctWord: keyword1
    },
    groupSortData: {
      cat1Ar: `📘 الأسس النظرية والمفاهيمية (${keyword1})`,
      cat1En: 'Theoretical Principles',
      cat2Ar: `🛠️ التطبيقات العملية والأدوات (${keyword2})`,
      cat2En: 'Practical Applications',
      items: [
        { textAr: `تحليل العلاقات الرياضية والهيكلية لـ ${keyword1}`, textEn: `Mathematical & structural analysis of ${keyword1}`, cat: 1 },
        { textAr: `تنفيذ واختبار خوارزميات ${keyword2} في الكود`, textEn: `Implementing & executing ${keyword2} in code`, cat: 2 },
        { textAr: `دراسة المفاهيم المعيارية لـ ${keyword3}`, textEn: `Standard conceptual study of ${keyword3}`, cat: 1 },
        { textAr: `بناء وتفعيل أدوات قياس ${keyword4}`, textEn: `Building & running ${keyword4} evaluation tooling`, cat: 2 }
      ]
    },
    rankSteps: [
      { id: 1, textAr: `1️⃣ استيعاب المتطلبات وتحليل مدخلات ${keyword1}`, textEn: `1️⃣ Requirements analysis for ${keyword1}`, correctOrder: 1 },
      { id: 2, textAr: `2️⃣ تصميم وتطبيق المنهجية المناسبة لـ ${keyword2}`, textEn: `2️⃣ Architecture & implementation for ${keyword2}`, correctOrder: 2 },
      { id: 3, textAr: `3️⃣ معالجة وفحص جودة ${keyword3}`, textEn: `3️⃣ Quality inspection for ${keyword3}`, correctOrder: 3 },
      { id: 4, textAr: `4️⃣ التحقق النهائي والتقييم عبر معايير ${keyword4}`, textEn: `4️⃣ Final validation via ${keyword4}`, correctOrder: 4 }
    ],
    mazeDoors: [
      { label: 'الباب A', optionAr: `المنهجية العلمية والتحقق التجريبي (المسار الآمن 🚪✨)`, optionEn: 'Scientific Methodology & Rigorous Validation', isCorrect: true },
      { label: 'الباب B', optionAr: 'تجاهل الفحص الوقوع في أخطاء التنفيذ (طريق مسدود 💀)', optionEn: 'Skipping Verification & Runtime Failure', isCorrect: false },
      { label: 'الباب C', optionAr: 'تضارب الإعدادات وتعطيل الخدمات (طريق مسدود 💀)', optionEn: 'Configuration Drift & System Hang', isCorrect: false },
      { label: 'الباب D', optionAr: 'الاعتماد على بيانات غير موثوقة (طريق مسدود 💀)', optionEn: 'Unverified Corrupted Data Input', isCorrect: false }
    ]
  };
}

// -------------------------------------------------------------
// 10. MAIN SELECTOR & TOPIC RESOLVER ENGINE
// -------------------------------------------------------------
export function getWordwallGameData(topic?: CourseTopic): WordwallTopicGameData {
  if (!topic) return neuralNetsData;

  const topicId = topic.id?.toLowerCase() || '';

  // 1. Direct Topic ID match
  if (topicId === 'su26_session1') return transformersData;
  if (topicId === 'su26_session2') return concurrencyData;
  if (topicId === 'su26_session3') return rnnData;
  if (topicId === 'su26_session5') return loraStreamlitData;
  if (topicId === 'su26_session7' || topicId === 'su26_session9') return capstoneData;
  if (topicId === 'su26_session8') return ragData;

  // 2. Semantic Topic Type match from topicContentService
  const type = getTopicType(topic);
  if (type === 'concurrency') return concurrencyData;
  if (type === 'rag') return ragData;
  if (type === 'transformers') return transformersData;
  if (type === 'cnn') return cnnData;
  if (type === 'rnn') return rnnData;

  // 3. Fallback for custom PDFs or uploaded materials: Generate contextual dynamic data
  if (type === 'generic_pdf' || topicId.startsWith('moodle_pdf_')) {
    return generateDynamicGameData(topic);
  }

  // 4. Default: Neural Networks foundation
  return neuralNetsData;
}
