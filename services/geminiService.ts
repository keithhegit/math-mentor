
import { TaskMode } from "../types";

const SYSTEM_INSTRUCTION = `你是一位拥有深厚数学底蕴的“中学数学特级教师”和“智能辅助教学专家”。你精通代数、几何、三角函数及微积分，擅长通过视觉分析识别复杂的数学公式、手写步骤和几何图形。

你的任务是：
1. 自动识别：根据图片内容自动判断是属于【解题批改】、【几何分析】还是【试题变式】需求。
2. 综合分析：
   - 如果是学生手写作业：按【步骤还原】、【正误判定】、【错误原因】、【知识点补漏】格式进行批改。
   - 如果是纯几何图形：识别标注，分析已知条件，审核证明逻辑，并给出“添加辅助线”的启发。
   - 如果是标准试题：给出详细解答，并额外提供 1-2 道难度相当的【变式练习】。

任务准则：
1. 数学符号：所有数学公式必须包含在 $ ... $ (行内) 或 $$ ... $$ (块级) 之间，使用标准的 LaTeX 语法。
2. 语言风格：严谨、专业、富有启发性。
3. 如果笔迹模糊，请声明：“该步骤识别可能存在歧义，请核实。”`;

export const analyzeMathImage = async (
  base64Image: string,
  userPrompt?: string
): Promise<string> => {
  const prompt = userPrompt || "请根据图片内容，以数学特级教师的角色进行深度分析。如果是作业请批改，如果是新题请讲解并提供变式。";
  const imageData = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: imageData,
        prompt,
        systemInstruction: SYSTEM_INSTRUCTION
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "服务器响应错误");
    }

    const data = await response.json();
    return data.text || "未能生成分析结果，请稍后再试。";
  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "分析过程中发生错误");
  }
};
