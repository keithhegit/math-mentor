
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathRendererProps {
  content: string;
}

const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
  return (
    <div className="math-content prose prose-slate max-w-none prose-sm sm:prose-base">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-xl sm:text-2xl font-black mt-8 mb-4 text-slate-900 flex items-center" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg sm:text-xl font-bold mt-6 mb-3 text-slate-800 border-l-4 border-indigo-500 pl-3 py-0.5" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-base sm:text-lg font-bold mt-5 mb-2 text-slate-700" {...props} />,
          p: ({node, ...props}) => <p className="my-4 leading-relaxed text-slate-600 tracking-tight" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc ml-5 my-4 space-y-2 text-slate-600" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal ml-5 my-4 space-y-2 text-slate-600" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-slate-900 bg-yellow-50 px-1 rounded" {...props} />,
          blockquote: ({node, ...props}) => (
            <blockquote className="border-l-4 border-indigo-200 pl-4 py-1 bg-slate-50 rounded-r-xl my-6 text-slate-600 italic font-medium" {...props} />
          ),
          code: ({node, ...props}) => (
            <code className="bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props} />
          ),
          // 核心优化：处理 Katex 可能导致的移动端溢出
          span: ({node, ...props}) => {
            if ((props as any).className?.includes('katex-display')) {
              return (
                <span className="block w-full overflow-x-auto no-scrollbar py-4 px-1" {...props} />
              );
            }
            return <span {...props} />;
          },
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-6 rounded-xl border border-slate-100 shadow-sm">
              <table className="min-w-full divide-y divide-slate-100" {...props} />
            </div>
          ),
          th: ({node, ...props}) => <th className="bg-slate-50 px-4 py-2 text-left text-xs font-bold text-slate-500 uppercase tracking-wider" {...props} />,
          td: ({node, ...props}) => <td className="px-4 py-2 text-sm text-slate-600 border-t border-slate-50" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MathRenderer;
