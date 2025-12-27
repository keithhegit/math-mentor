
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TaskMode } from "../types";

const SYSTEM_INSTRUCTION = `你是一位拥有深厚数学底蕴的“中学数学特级教师”和“智能辅助教学专家”。你精通代数、几何、三角函数及微积分，擅长通过视觉分析识别复杂的数学公式、手写步骤和几何图形。

任务准则：
1. 数学符号：所有数学公式必须包含在 $ ... $ (行内) 或 $$ ... $$ (块级) 之间，使用标准的 LaTeX 语法。
2. 语言风格：严谨、清晰、逻辑极强。
3. 如果笔迹模糊，请声明：“该步骤识别可能存在歧义，请核实。”

任务场景逻辑：
场景 1：手写作业批改 (STEP_CORRECTION)
- 使用 LaTeX 还原每一行关键步骤。
- 标注错误发生的行号，区分计算粗心、公式错误或逻辑不严谨。
- 指出需要复习的知识点。

场景 2：平面几何解析 (GEOMETRY_ANALYSIS)
- 首先描述识别出的图形特征（点、线、垂直符号、角度等）。
- 审核证明逻辑是否严密。
- 提供辅助线建议作为启发。

场景 3：辅助出题与变式 (PROBLEM_VARIATION)
- 生成 2-3 道知识点相同但条件/数字改变的“变式题”。
- 附带标准答案。`;

export const analyzeMathImage = async (
  base64Image: string,
  mode: TaskMode,
  userPrompt?: string
): Promise<string> => {
  // Use correct initialization as per guidelines: new GoogleGenAI({ apiKey: process.env.API_KEY })
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let modePrompt = "";
  switch (mode) {
    case TaskMode.STEP_CORRECTION:
      modePrompt = "请识别图片中的数学解题过程，并按【步骤还原】、【正误判定】、【错误原因】、【知识点补漏】格式进行批改。";
      break;
    case TaskMode.GEOMETRY_ANALYSIS:
      modePrompt = "请识别图片中的几何图形及标注，分析其已知条件。如果是证明题，请审核推导逻辑；如果解题遇到瓶颈，请给出“添加辅助线”的灵感引导。";
      break;
    case TaskMode.PROBLEM_VARIATION:
      modePrompt = "请识别这道题目，并基于该知识点生成 2-3 道变式题。保持难度相当，改变数字或图形方向，并附上标准答案。";
      break;
  }

  const prompt = userPrompt ? `${modePrompt}\n用户额外补充：${userPrompt}` : modePrompt;

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image.split(',')[1],
    },
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      // Use 'gemini-3-pro-preview' for complex math reasoning tasks
      model: "gemini-3-pro-preview",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // High precision for math
      },
    });

    // Access text property directly
    return response.text || "未能生成分析结果，请稍后再试。";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "分析过程中发生错误");
  }
};
