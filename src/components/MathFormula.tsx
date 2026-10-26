import React, { useMemo } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  formula: string;
  block?: boolean;
  className?: string;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ formula, block = false, className = '' }) => {
  const renderedHtml = useMemo(() => {
    try {
      // Check if formula contains $...$ or $$...$$
      let cleanFormula = formula.trim();
      if (cleanFormula.startsWith('$$') && cleanFormula.endsWith('$$')) {
        cleanFormula = cleanFormula.slice(2, -2).trim();
      } else if (cleanFormula.startsWith('$') && cleanFormula.endsWith('$')) {
        cleanFormula = cleanFormula.slice(1, -1).trim();
      }

      return katex.renderToString(cleanFormula, {
        displayMode: block,
        throwOnError: false,
      });
    } catch {
      return null;
    }
  }, [formula, block]);

  if (!renderedHtml) {
    return <span className={`font-serif italic ${className}`}>{formula}</span>;
  }

  return (
    <span
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
};

export const RenderRichMathText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  // Parses mixed markdown/math text with $formula$ or $$block$$
  const parts = useMemo(() => {
    if (!text) return [];
    const tokens: Array<{ type: 'text' | 'math' | 'blockMath'; content: string }> = [];
    const regex = /(\$\$[\s\S]*?\$\$|\$[^\$]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      const raw = match[0];
      if (raw.startsWith('$$')) {
        tokens.push({ type: 'blockMath', content: raw.slice(2, -2) });
      } else {
        tokens.push({ type: 'math', content: raw.slice(1, -1) });
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      tokens.push({ type: 'text', content: text.substring(lastIndex) });
    }
    return tokens;
  }, [text]);

  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.type === 'blockMath') {
          return (
            <div key={i} className="my-2 text-center overflow-x-auto py-1">
              <MathFormula formula={p.content} block />
            </div>
          );
        }
        if (p.type === 'math') {
          return <MathFormula key={i} formula={p.content} />;
        }
        return <span key={i}>{p.content}</span>;
      })}
    </span>
  );
};
