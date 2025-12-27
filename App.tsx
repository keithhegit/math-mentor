
import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import MathRenderer from './components/MathRenderer';
import ImageCropper from './components/ImageCropper';
import { TaskMode } from './types';
import { analyzeMathImage } from './services/geminiService';
import { 
  Camera, 
  Upload, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Triangle, 
  Copy, 
  Loader2,
  Image as ImageIcon,
  MessageSquarePlus,
  Calculator,
  BookOpen,
  ChevronRight,
  Crop
} from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<TaskMode>(TaskMode.STEP_CORRECTION);
  const [image, setImage] = useState<string | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setIsCropping(true);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setImage(croppedImage);
    setIsCropping(false);
    setTempImage(null);
  };

  const handleCropCancel = () => {
    setIsCropping(false);
    setTempImage(null);
  };

  const triggerUpload = () => fileInputRef.current?.click();
  const triggerCamera = () => cameraInputRef.current?.click();

  const handleAnalyze = async () => {
    if (!image) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const output = await analyzeMathImage(image, mode, prompt);
      setResult(output);
      // 移动端自动滚动到结果区
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err: any) {
      alert(`分析失败: ${err.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setResult(null);
    setPrompt("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {isCropping && tempImage && (
        <ImageCropper 
          image={tempImage} 
          onCropComplete={handleCropComplete} 
          onCancel={handleCropCancel} 
        />
      )}
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-4 sm:py-8 space-y-6">
        {/* Mode Selector - Improved for touch */}
        <div className="flex p-1 bg-slate-200/60 rounded-2xl backdrop-blur-sm overflow-x-auto no-scrollbar">
          {[
            { id: TaskMode.STEP_CORRECTION, label: '解题批改', icon: CheckCircle2 },
            { id: TaskMode.GEOMETRY_ANALYSIS, label: '几何分析', icon: Triangle },
            { id: TaskMode.PROBLEM_VARIATION, label: '试题变式', icon: Sparkles },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setMode(item.id)}
              className={`flex-1 flex items-center justify-center py-2.5 px-3 rounded-xl transition-all whitespace-nowrap ${
                mode === item.id 
                  ? 'bg-white text-indigo-600 shadow-md scale-100 font-bold' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <item.icon className={`w-4 h-4 mr-2 ${mode === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Image Area */}
          <div className="space-y-4">
            <div 
              className={`relative border-2 border-dashed rounded-3xl transition-all aspect-[4/3] lg:aspect-square flex flex-col items-center justify-center overflow-hidden bg-white shadow-inner group ${
                image ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-300 hover:border-indigo-300'
              }`}
            >
              {image ? (
                <>
                  <img src={image} alt="Math Input" className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="absolute top-4 right-4 flex flex-col space-y-2">
                    <button 
                      onClick={clearImage}
                      className="bg-white/90 p-2.5 rounded-2xl shadow-xl hover:bg-red-50 text-red-500 transition-all active:scale-90"
                      title="清除图片"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setTempImage(image);
                        setIsCropping(true);
                      }}
                      className="bg-white/90 p-2.5 rounded-2xl shadow-xl hover:bg-indigo-50 text-indigo-600 transition-all active:scale-90"
                      title="重新裁剪"
                    >
                      <Crop className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-4">
                  <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 bg-indigo-100 rounded-3xl rotate-6 animate-pulse" />
                    <div className="absolute inset-0 bg-indigo-50 rounded-3xl flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-10 h-10 text-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">老师，请交卷</h3>
                    <p className="text-slate-400 text-sm mt-1">拍摄手写作业或几何图形</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button 
                      onClick={triggerCamera}
                      className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      拍照上传
                    </button>
                    <button 
                      onClick={triggerUpload}
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      相册选择
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                    <input type="file" ref={cameraInputRef} onChange={handleImageUpload} accept="image/*" capture="environment" className="hidden" />
                  </div>
                </div>
              )}
            </div>

            {image && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  <div className="flex items-center space-x-2 mb-2 text-slate-500">
                    <MessageSquarePlus className="w-4 h-4" />
                    <label className="text-xs font-bold uppercase tracking-wider">补充说明 / 考察点</label>
                  </div>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="例如：请特别注意辅助线建议，或学生公式推导第三行..."
                    className="w-full p-0 bg-transparent text-sm outline-none resize-none placeholder:text-slate-300"
                    rows={2}
                  />
                </div>
                
                <button 
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl transition-all ${
                    analyzing 
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-100'
                  }`}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>特级教师正在阅卷...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>开启 AI 深度分析</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Result Area */}
          <div id="result-section" className="space-y-4 scroll-mt-6">
            <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col transition-all ${!result && !analyzing ? 'bg-slate-50/50 border-dashed' : 'bg-white'}`}>
              <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${result ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="text-sm font-bold text-slate-800">诊断报告</span>
                </div>
                {result && (
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(result);
                      alert('结果已复制到剪贴板');
                    }}
                    className="flex items-center text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    复制
                  </button>
                )}
              </div>
              
              <div className="p-6 flex-1">
                {analyzing ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-6 py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Calculator className="w-6 h-6 text-indigo-400 animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-slate-700 font-bold">正在研判数学逻辑</p>
                      <p className="text-xs text-slate-400">正在应用 LaTeX 渲染引擎与几何推理算法</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="animate-in fade-in duration-700">
                    <MathRenderer content={result} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-24 px-6 opacity-30">
                    <BookOpen className="w-16 h-16 text-slate-400 mb-4" />
                    <p className="text-slate-600 font-medium max-w-[200px]">等待输入... 建议上传清晰的解题过程</p>
                  </div>
                )}
              </div>
            </div>

            {result && (
              <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Sparkles className="w-32 h-32" />
                </div>
                <div className="flex items-start space-x-4 relative z-10">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">教师寄语</h4>
                    <p className="text-xs text-indigo-100 mt-1 leading-relaxed">
                      诊断结果已出。建议针对该学生的知识薄弱环节进行专项变式练习，重点关注本题涉及的定理推演。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-slate-400 text-[10px] uppercase tracking-widest font-bold">
          <p>© 2024 MATH MENTOR PRO · ALL RIGHTS RESERVED</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span>Powered by Gemini 3 Pro</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <span>特级教师学术支持</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
