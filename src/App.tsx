import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  Info, 
  Filter, 
  Trophy,
  BookOpen,
  GraduationCap,
  Lightbulb,
  AlertCircle,
  LogIn,
  User,
  Lock,
  Smile
} from "lucide-react";
import { Question, Difficulty, GrammarPoint } from "./types";
import { QUESTIONS } from "./questions";

const EncouragingMessages = [
  "太棒了！你真是语法大师！ 🌟",
  "做得好！继续保持！ 👍",
  "很棒的尝试！熟能生巧。 💪",
  "不要放弃！每一次错误都是学习的机会。 ✨",
];

// Error Boundary Fallback
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-rose-100">
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-rose-500" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">出错了</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-rose-500 text-white px-8 py-3 rounded-full font-bold hover:bg-rose-600 transition-all"
        >
          重启应用
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | "All">("All");
  const [filterCategory, setFilterCategory] = useState<GrammarPoint | "All">("All");
  const [hasError, setHasError] = useState<Error | null>(null);

  // Filter logic
  const filteredQuestions = useMemo(() => {
    try {
      return QUESTIONS.filter(q => {
        const diffMatch = filterDifficulty === "All" || q.difficulty === filterDifficulty;
        const catMatch = filterCategory === "All" || q.category === filterCategory;
        return diffMatch && catMatch;
      });
    } catch (e) {
      console.error("Filtering error:", e);
      return [];
    }
  }, [filterDifficulty, filterCategory]);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Reset state when filters change
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setQuizFinished(false);
  }, [filterDifficulty, filterCategory]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.length >= 6) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("请输入用户名并确保密码至少6位");
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    
    setIsSubmitted(true);
    if (selectedOptionId === currentQuestion.correctOptionId) {
      setScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setScore(0);
    setShowExplanation(false);
    setQuizFinished(false);
  };

  const getEncouragement = () => {
    if (filteredQuestions.length === 0) return "";
    const percentage = (score / filteredQuestions.length) * 100;
    if (percentage === 100) return EncouragingMessages[0];
    if (percentage >= 80) return EncouragingMessages[1];
    if (percentage >= 50) return EncouragingMessages[2];
    return EncouragingMessages[3];
  };

  if (hasError) return <ErrorFallback error={hasError} />;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[3rem] shadow-2xl max-w-md w-full border border-gray-100"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-100">
              <GraduationCap className="text-white w-10 h-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">GrammarMaster</h1>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">英语语法互动练习系统</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">用户名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold"
                  placeholder="请输入用户名"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">密码</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-bold"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-rose-500 text-xs font-bold text-center">{loginError}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
            >
              <LogIn className="w-5 h-5" />
              立即登录
            </button>
          </form>

          <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-10">
            初中英语语法专项突破工具
          </p>
        </motion.div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-sm max-w-md w-full text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">未找到题目</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">当前筛选条件下没有找到相关题目，请尝试调整筛选选项。</p>
          <button 
            onClick={() => { setFilterDifficulty("All"); setFilterCategory("All"); }}
            className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg"
          >
            重置所有筛选
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] font-sans selection:bg-indigo-100 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-100"
            >
              <GraduationCap className="text-white w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-900">GrammarMaster</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-500 font-black">互动学习</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">初中版</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">当前进度</span>
                <span className="text-xs font-mono font-bold text-gray-900">
                  {currentQuestionIndex + 1} / {filteredQuestions.length}
                </span>
              </div>
              <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
              <Trophy className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-black text-emerald-700">{score}</span>
            </div>
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="text-gray-400 hover:text-gray-900 transition-colors"
              title="退出登录"
            >
              <LogIn className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 md:py-12">
        {!quizFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar: Filters */}
            <aside className="lg:col-span-3 space-y-6 sticky top-28">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" /> 练习筛选
                </h3>
                
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">难度等级</label>
                    <div className="flex flex-col gap-2">
                      {["All", ...Object.values(Difficulty)].map((d) => (
                        <button
                          key={d}
                          onClick={() => setFilterDifficulty(d as any)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                            filterDifficulty === d 
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {d}
                          {filterDifficulty === d && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">语法分类</label>
                    <div className="flex flex-col gap-2">
                      {["All", ...Object.values(GrammarPoint)].map((c) => (
                        <button
                          key={c}
                          onClick={() => setFilterCategory(c as any)}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                            filterCategory === c 
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {c}
                          {filterCategory === c && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-amber-600">小贴士</h3>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  先阅读整个句子，理解句意后再选择最合适的选项。
                </p>
              </div>
            </aside>

            {/* Main Content: Question Card */}
            <div className="lg:col-span-9 space-y-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion?.id || 'empty'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-10 md:p-16 rounded-[4rem] shadow-sm border border-gray-100 relative"
                >
                  {/* Correct Answer Smile Effect */}
                  <AnimatePresence>
                    {isSubmitted && selectedOptionId === currentQuestion?.correctOptionId && (
                      <motion.div 
                        initial={{ scale: 0, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: -40 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center"
                      >
                        <div className="bg-emerald-500 text-white p-4 rounded-full shadow-xl shadow-emerald-200">
                          <Smile className="w-12 h-12" />
                        </div>
                        <span className="text-emerald-600 font-black mt-2 text-xl">答对了！</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Category & Difficulty Header */}
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                          {currentQuestion?.category}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">考察知识点</p>
                      </div>
                    </div>
                    
                    <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                      currentQuestion?.difficulty === Difficulty.Junior ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      currentQuestion?.difficulty === Difficulty.Middle ? "bg-amber-50 text-amber-600 border-amber-100" :
                      "bg-rose-50 text-rose-600 border-rose-100"
                    }`}>
                      {currentQuestion?.difficulty} 难度
                    </div>
                  </div>

                  {/* Question Sentence - ENLARGED */}
                  <div className="mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold leading-[1.5] text-gray-900">
                      {currentQuestion?.sentenceBefore}
                      <motion.span 
                        layout
                        className={`inline-block min-w-[180px] border-b-8 mx-4 text-center transition-all py-2 px-6 rounded-t-2xl ${
                          isSubmitted 
                            ? (selectedOptionId === currentQuestion?.correctOptionId ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-rose-50 border-rose-500 text-rose-600")
                            : "bg-indigo-50/30 border-indigo-200 text-indigo-600"
                        }`}
                      >
                        {selectedOptionId ? currentQuestion?.options.find(o => o.id === selectedOptionId)?.text : "______"}
                      </motion.span>
                      {currentQuestion?.sentenceAfter}
                    </h2>
                  </div>

                  {/* Options Grid - ENLARGED */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                    {currentQuestion?.options.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={!isSubmitted ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitted ? { scale: 0.98 } : {}}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={isSubmitted}
                        className={`group relative p-8 rounded-[2.5rem] text-left transition-all border-4 flex items-center justify-between ${
                          selectedOptionId === option.id
                            ? (isSubmitted 
                                ? (option.id === currentQuestion?.correctOptionId ? "bg-emerald-50 border-emerald-500" : "bg-rose-50 border-rose-500")
                                : "bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-100")
                            : (isSubmitted && option.id === currentQuestion?.correctOptionId
                                ? "bg-emerald-50 border-emerald-200"
                                : "bg-gray-50 border-transparent hover:border-gray-200")
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                            selectedOptionId === option.id ? "bg-white/20" : "bg-white shadow-sm text-gray-400"
                          }`}>
                            {String.fromCharCode(65 + currentQuestion.options.indexOf(option))}
                          </div>
                          <span className="text-2xl font-black">{option.text}</span>
                        </div>
                        
                        {isSubmitted && option.id === currentQuestion?.correctOptionId && (
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        )}
                        {isSubmitted && selectedOptionId === option.id && option.id !== currentQuestion?.correctOptionId && (
                          <XCircle className="w-8 h-8 text-rose-500" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-gray-50">
                    <p className="text-sm text-gray-400 font-bold">
                      {isSubmitted ? "请查看下方的详细解析" : "选择最合适的选项完成句子"}
                    </p>
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      {!isSubmitted ? (
                        <button
                          onClick={handleSubmit}
                          disabled={!selectedOptionId}
                          className={`flex-1 sm:flex-none px-12 py-5 rounded-[2rem] font-black transition-all shadow-2xl ${
                            selectedOptionId 
                              ? "bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700" 
                              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                          }`}
                        >
                          提交答案
                        </button>
                      ) : (
                        <button
                          onClick={handleNext}
                          className="flex-1 sm:flex-none bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-indigo-200 hover:bg-indigo-700 flex items-center justify-center gap-3 group"
                        >
                          {currentQuestionIndex < filteredQuestions.length - 1 ? "下一题" : "查看结果"}
                          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Explanation Section */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="space-y-6"
                  >
                    <div className="bg-white p-12 rounded-[4rem] shadow-sm border border-gray-100 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-3 h-full bg-indigo-500" />
                      
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                          <Info className="w-6 h-6 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight">语法详解</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        <div className="md:col-span-7 space-y-10">
                          <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-4">语法规则</label>
                            <div className="prose prose-lg prose-indigo max-w-none text-gray-700 leading-relaxed font-bold">
                              <ReactMarkdown>{currentQuestion?.explanation.rule}</ReactMarkdown>
                            </div>
                          </div>
                          
                          <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100/50">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-4">应用例句</label>
                            <p className="text-indigo-900 font-black text-xl italic leading-relaxed">
                              "{currentQuestion?.explanation.example}"
                            </p>
                          </div>
                        </div>

                        <div className="md:col-span-5 space-y-8">
                          <div className="bg-rose-50/50 p-8 rounded-[2.5rem] border border-rose-100/50">
                            <label className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] block mb-4">注意避坑！</label>
                            <p className="text-rose-900 text-base font-black leading-relaxed">
                              {currentQuestion?.explanation.commonMistake}
                            </p>
                          </div>

                          <div className="pt-8">
                            <a 
                              href="https://learnenglish.britishcouncil.org/grammar" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group inline-flex items-center gap-3 text-sm font-black text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                              深入学习该语法点
                              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          /* Final Score Summary */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto bg-white p-16 md:p-24 rounded-[5rem] shadow-sm text-center border border-gray-100"
          >
            <motion.div 
              initial={{ rotate: -10, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-40 h-40 bg-emerald-50 rounded-[3rem] flex items-center justify-center mx-auto mb-12 shadow-2xl shadow-emerald-100"
            >
              <Trophy className="w-20 h-20 text-emerald-500" />
            </motion.div>
            
            <h2 className="text-6xl font-black mb-6 tracking-tight text-gray-900">练习完成！</h2>
            <p className="text-2xl text-gray-500 mb-16 font-bold">{getEncouragement()}</p>
            
            <div className="flex items-center justify-center gap-12 md:gap-24 mb-20">
              <div className="text-center">
                <p className="text-8xl font-black text-indigo-600 tabular-nums">{score}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4">正确题数</p>
              </div>
              <div className="h-24 w-px bg-gray-100"></div>
              <div className="text-center">
                <p className="text-8xl font-black text-gray-900 tabular-nums">{filteredQuestions.length}</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-4">总题数</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button 
                onClick={handleReset}
                className="bg-indigo-600 text-white py-6 rounded-[2.5rem] font-black shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-4 text-xl"
              >
                <RotateCcw className="w-8 h-8" />
                重新开始
              </button>
              <button 
                onClick={() => { setFilterDifficulty("All"); setFilterCategory("All"); handleReset(); }}
                className="bg-gray-50 text-gray-600 py-6 rounded-[2.5rem] font-black hover:bg-gray-100 transition-all text-xl"
              >
                更换知识点
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Classroom Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-16 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-sm font-black text-gray-400 uppercase tracking-widest">GrammarMaster 课堂教学辅助工具</span>
        </div>
        <p className="text-xs text-gray-400 font-black uppercase tracking-widest text-center md:text-right">
          初中英语语法专项突破系统 · 互动学习版
        </p>
      </footer>
    </div>
  );
}
