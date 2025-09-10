// Color Debug Panel - Visual tool to understand color extraction logic
// Shows all extracted colors and the decision process

'use client';

import { useState } from 'react';
import { SmartExtractedColors } from '@/hooks/useSmartColorExtraction';

interface ColorDebugPanelProps {
  colors: SmartExtractedColors | null;
  imageUrl?: string;
}

export function ColorDebugPanel({ colors, imageUrl }: ColorDebugPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!colors) return null;

  const isWarmColor = (hex: string | null) => {
    if (!hex) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Blue dominated = cold
    if (b > r && b > g) return false;
    // Red dominated = warm
    return r >= g * 0.8;
  };

  const getBrightness = (hex: string | null) => {
    if (!hex) return 0;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return Math.round((r * 299 + g * 587 + b * 114) / 1000);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl z-50">
      {/* Collapsed view - just a button */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-semibold">🎨 颜色分析</span>
          <div className="flex gap-1">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors.primary }}
              title={colors.primary}
            />
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors.secondary }}
              title={colors.secondary}
            />
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: colors.accent }}
              title={colors.accent}
            />
          </div>
          <span className="text-xs text-gray-500">▶</span>
        </button>
      ) : (
        <div className="p-4 max-w-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">🎨 颜色提取分析</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 text-xl leading-none"
            >
              ×
            </button>
          </div>
      
      {/* All extracted colors */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold mb-2">提取的6种颜色：</h4>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(colors.allColors).map(([name, hex]) => (
            <div key={name} className="text-xs">
              <div className="flex items-center gap-1">
                <div 
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: hex || '#ccc' }}
                />
                <div>
                  <div className="font-medium">
                    {name.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  {hex && (
                    <>
                      <div className="text-gray-500">{hex}</div>
                      <div className="text-gray-400">
                        {isWarmColor(hex) ? '🔥暖' : '❄️冷'} | 
                        亮度:{getBrightness(hex)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision process */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <h4 className="text-sm font-semibold mb-2">🤔 选择逻辑：</h4>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">1. 过滤冷色：</span>
            <span>去除蓝/紫色（降低食欲）</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">2. 优先深色：</span>
            <span>Dark Vibrant → Dark Muted → Muted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">3. 选择暖色：</span>
            <span>红/橙/棕色系（激发食欲）</span>
          </div>
        </div>
      </div>

      {/* Selected colors */}
      <div className="border-t pt-3">
        <h4 className="text-sm font-semibold mb-2">✅ 最终选择：</h4>
        <div className="flex gap-2">
          <div className="text-center">
            <div 
              className="w-12 h-12 rounded border-2 border-green-500"
              style={{ backgroundColor: colors.primary }}
            />
            <div className="text-xs mt-1">主色</div>
            <div className="text-xs text-gray-500">{colors.primary}</div>
          </div>
          <div className="text-center">
            <div 
              className="w-12 h-12 rounded border"
              style={{ backgroundColor: colors.secondary }}
            />
            <div className="text-xs mt-1">次色</div>
            <div className="text-xs text-gray-500">{colors.secondary}</div>
          </div>
          <div className="text-center">
            <div 
              className="w-12 h-12 rounded border"
              style={{ backgroundColor: colors.accent }}
            />
            <div className="text-xs mt-1">强调</div>
            <div className="text-xs text-gray-500">{colors.accent}</div>
          </div>
        </div>
      </div>

      {/* Gradient preview */}
      <div className="mt-3">
        <h4 className="text-xs font-semibold mb-1">背景渐变预览：</h4>
        <div 
          className="h-20 rounded"
          style={{ background: colors.backgroundGradient }}
        />
      </div>
        </div>
      )}
    </div>
  );
}