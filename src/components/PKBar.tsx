import React from "react";

interface ProgressBarProps {
  leftValue: number;
  rightValue: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  leftLabel?: string;
  rightLabel?: string;
}

const PKBar: React.FC<ProgressBarProps> = ({
  leftValue = 890,
  rightValue = 360,
  leftIcon,
  rightIcon,
  leftLabel = "汽车网",
  rightLabel = "360",
}) => {
  const total = leftValue + rightValue;
  const leftPercentage = (leftValue / total) * 100;
  const rightPercentage = (rightValue / total) * 100;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* 进度条背景 */}
      <div className="flex h-12 rounded-full overflow-hidden bg-gray-200">
        {/* 左侧蓝色进度 */}
        <div
          className="flex items-center justify-end h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${leftPercentage}%` }}
        >
          <span className="text-white font-bold mr-2 text-lg">{leftValue}</span>
        </div>

        {/* 右侧红色进度 */}
        <div
          className="flex items-center h-full bg-red-500 transition-all duration-500"
          style={{ width: `${rightPercentage}%` }}
        >
          <span className="text-white font-bold ml-2 text-lg">
            {rightValue}
          </span>
        </div>
      </div>

      {/* 中间的PK标志（透明背景） */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white px-3 py-1 rounded-full flex items-center">
          {/* 这里替换为您的透明PK图片或使用SVG */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 font-extrabold text-2xl">
            PK
          </span>
        </div>
      </div>

      {/* 底部标签 */}
      <div className="flex justify-between mt-2">
        <span className="text-blue-600 font-medium">{leftLabel}</span>
        <span className="text-red-600 font-medium">{rightLabel}</span>
      </div>

      {/* 圆形图标（可选） */}
      {leftIcon || rightIcon ? (
        <div className="flex justify-between -mt-8 mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {leftIcon}
          </div>
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
            {rightIcon}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PKBar;
