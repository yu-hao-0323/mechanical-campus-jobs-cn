"use client";

import { createClient, type User } from "@supabase/supabase-js";
import { useEffect, useMemo, useState } from "react";

type Job = {
  id: string;
  title: string;
  location: string;
  areas: string[];
  degree: string;
  direction: string;
  majors: string;
  deadline: string;
  responsibilities: string[];
  requirements: string[];
  note?: string;
  url: string;
};

type Company = {
  id: string;
  name: string;
  short: string;
  industry: string;
  batch: string;
  verified: string;
  source: string;
  website: string;
  status?: "official" | "announcement";
  sourceOrigin?: "企业官网发布";
  jobs: Job[];
};

const catOps =
  "https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000388302/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E5%88%B6%E9%80%A0%E8%BF%90%E8%90%A5%E7%B1%BB/";
const catMfg =
  "https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000387385/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E5%88%B6%E9%80%A0%E8%BF%90%E8%90%A5%E7%B1%BB-%E5%88%B6%E9%80%A0%E5%B7%A5%E7%A8%8B%E5%B8%88-%E6%9C%BA%E6%A2%B0%E8%87%AA%E5%8A%A8%E5%8C%96%E6%99%BA%E8%83%BD%E5%8C%96%E4%BB%BF%E7%9C%9F/";
const catPower =
  "https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000387378/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E7%A0%94%E5%8F%91%E6%8A%80%E6%9C%AF%E7%B1%BB-%E5%8F%91%E5%8A%A8%E6%9C%BA-%E4%BC%A0%E5%8A%A8%E6%96%B9%E5%90%91/";
const companies: Company[] = [
  {
    id: "caterpillar",
    name: "卡特彼勒",
    short: "CAT",
    industry: "工程机械与动力系统",
    batch: "2027届校园招聘",
    verified: "2026-08-27 18:10",
    source: "卡特彼勒招聘官网",
    website: "https://careers.caterpillar.com/zh/",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "cat-logistics",
        title: "智能物流研发工程师",
        location: "江苏 · 徐州",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "自动化",
        majors: "机械、电气自动化、智能物流、工业工程或计算机相关专业",
        deadline: "截止 2026-10-30",
        responsibilities: [
          "负责 AGV/AMR 或自动化仓库的现场部署、业务逻辑梳理及供应商沟通",
          "完成 AGV 路线建图、站点配置、对接调试及任务配置",
          "完成简单逻辑电路设计修改，解决联调问题",
          "开展 AGV 整车机械、电气元器件检修及导航激光校准",
          "记录现场问题并协同研发、生产人员推动产品迭代",
          "处理项目售后问题，对客户开展使用培训并配合项目验收",
        ],
        requirements: [
          "本科及以上，机械、电气自动化、智能物流、工业工程或计算机相关专业",
          "熟悉低压电气元件、传感器、驱动器、电机和编码器",
          "熟悉电路图并能独立完成接线，具有 PLC 软件基础",
          "具备软件代码及应用层基础",
          "熟悉 TCP/IP、串口、MODBUS、S7、CAN 等工业通信协议",
          "抗压、沟通协调和学习能力强",
          "熟悉 AGV/ASRS 机械电气结构、工程机械生产工艺或独立项目经验者优先",
        ],
        url: catOps,
      },
      {
        id: "cat-digital",
        title: "数字化工程师",
        location: "江苏 · 徐州",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "自动化",
        majors: "计算机、软件、工业工程或相关工科专业",
        deadline: "截止 2026-10-30",
        responsibilities: [
          "推动企业级数字化转型与落地实施",
          "围绕业务需求参与并主导数字化解决方案设计与开发",
          "运用数据分析和智能办公自动化技术提升运营效率与决策能力",
          "精简部署流程、提高实施效率并降低项目风险",
        ],
        requirements: [
          "具备清晰高效的沟通能力",
          "掌握识别、预判和解决组织、运营或流程问题的方法",
          "理解软件产品技术架构与关键技术要素",
          "能够设计、配置及集成软件产品技术方案",
          "能够排查硬件、软件、应用系统或运营过程中的技术故障",
        ],
        url: catOps,
      },
      {
        id: "cat-mfg-xz",
        title: "制造工程师（机械 / 自动化 / 智能方向）",
        location: "江苏 · 徐州",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "电气工程、机械工程、自动化或人工智能相关专业",
        deadline: "截止 2026-10-30",
        responsibilities: [
          "分析生产车间智能化需求，负责智能数字化总体规划、设计和实施",
          "识别自动化改进机会，推进信息化、自动化方案落地",
          "参与设备智能规划、模拟、优化和自动化升级改造",
          "运用精益原则推动持续改进并跟踪项目进度",
          "管理自动化/机器人供应商并处理产线自动化异常",
          "根据新产品特性在现有设备中实现自动化",
        ],
        requirements: [
          "电气工程、机械工程、自动化或人工智能相关本科及以上学历",
          "熟悉 AutoCAD、三维设计软件、工厂模拟和 PLC 编程",
          "具备智能制造技术基础，熟悉视觉系统和软件编程",
          "具备研究分析、技术文档、团队协作和沟通能力",
          "智能制造或跨部门项目负责人经验优先",
          "了解精益制造，英语读听说能力良好者优先",
        ],
        url: catOps,
      },
      {
        id: "cat-virtual",
        title: "虚拟制造工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科或硕士",
        direction: "仿真分析",
        majors: "先进制造、机械设计或机械制造专业",
        deadline: "截止 2026-10-30",
        responsibilities: [
          "使用虚拟分析与仿真工具验证新产品设计和三维工厂",
          "协同设计、集成、测试和制造工程师完成零部件、系统及整机工艺虚拟验证",
          "通过虚拟装配、虚拟审查和制造仿真优化产品及工艺设计",
          "开发三维数字化工厂，验证并优化生产线布局和制造工序",
        ],
        requirements: [
          "先进制造、机械设计或机械制造专业本科或研究生",
          "熟练使用三维建模和制造技术仿真软件",
          "具备优秀的问题解决能力",
          "具备优秀英文听说读写及沟通能力",
          "积极主动并具有团队合作精神",
        ],
        url: catMfg,
      },
      {
        id: "cat-smart",
        title: "智能制造工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "自动化",
        majors: "机械工程、汽车工程、自动化或相近专业",
        deadline: "截止 2026-10-30",
        responsibilities: [
          "根据客户需求创建三维数字化工厂模型并验证工艺布局",
          "建立、运行并迭代过程仿真模型，解释结果并形成结论",
          "验证工艺流程开发结果，交付验证报告并协调计划",
          "协同制造和测试团队交付及改进新流程",
          "参与跨部门过程评审，支持工艺团队验证仿真方案",
          "归档过程仿真模型与结果并持续跟踪新技术",
        ],
        requirements: [
          "机械工程、汽车工程、自动化或相同专业硕士及以上",
          "具备 Creo 或其他同类三维建模软件能力",
          "具备 Siemens 类软件或 Vis Mockup 背景者优先",
          "具备智能制造或机器学习经验者优先",
          "具备问题解决、沟通协作、自主学习和严谨负责的工作态度",
          "出差比例低于 10%",
        ],
        url: catMfg,
      },
      {
        id: "cat-engine",
        title: "发动机零部件设计工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科或硕士",
        direction: "研发设计",
        majors: "机械工程或机械相关专业",
        deadline: "截止 2026-10-30",
        responsibilities: [
          "主导新发动机零部件设计与开发",
          "开展 DFMEA，编制并执行 DVP&R",
          "创建 TAN、EDR 等工程技术文件",
          "准备并主持跨职能设计评审",
          "推动稳健且具有成本效益的设计方案",
          "支持零部件资源切换和本地化项目",
        ],
        requirements: [
          "机械工程或机械相关专业本科或硕士",
          "理解产品设计开发流程并能把客户需求转化为设计",
          "具备 CAD/CAE、设计分析及可制造性知识",
          "能够管理多个并发目标和项目优先级",
          "具备较强英语书面与口头沟通、协作和人际交往能力",
        ],
        url: catPower,
      },
      {
        id: "cat-transmission",
        title: "传动系统设计工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科或硕士",
        direction: "研发设计",
        majors: "机械工程或机械相关专业",
        deadline: "截止 2026-10-30",
        responsibilities: [
          "负责动力传动产品或部件设计与分析",
          "参与传动系统产品开发、工程验证和技术问题解决",
          "协同跨职能团队推进设计、制造与产品落地",
        ],
        requirements: [
          "机械工程或机械相关专业本科或硕士",
          "掌握变矩器、变速箱和驱动桥等动力传动系统知识",
          "了解锻造、热处理、机加工和检验制造技术",
          "具备 CAD/CAE、产品设计开发和工程分析能力",
          "具备良好英语书面及口头沟通能力",
        ],
        url: catPower,
      },
    ],
  },
  {
    id: "nio",
    name: "蔚来",
    short: "NIO",
    industry: "智能电动汽车 · 热管理与换电装备",
    batch: "2027届秋季校园招聘·正式批",
    verified: "2026-08-28 16:35",
    source: "蔚来中国校园招聘官网",
    website: "https://campus.nio.com/",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "nio-thermal-rd",
        title: "热管理研发工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械设计及其自动化、车辆工程、热能与动力工程等相关专业",
        deadline: "校招正式批 · 申请开放",
        responsibilities: [
          "从事新能源汽车热管理零部件（热管理集成模块、空调箱等）的智能化开发",
          "参与热管理零部件从需求分析、零件设计到验证的正向开发",
          "参与零件标准化模块开发，借助 AI 根据输入需求生成三维数据方案",
        ],
        requirements: [
          "硕士及以上学历优先，机械设计及其自动化、车辆工程、热能与动力工程等相关专业，偏机械与热管理方向",
          "具备扎实的机械结构设计或热管理研发理论基础",
          "熟悉 CAD、Catia 等至少一种相关软件",
          "具备机器学习或数据建模课程基础；对 AI 赋能工业研发、智能化设计感兴趣，有相关项目实践、竞赛经历或数据分析经验者优先",
          "逻辑清晰，善于总结沉淀，具备学习能力、创新思维和团队协作能力，愿意深耕智能化机械研发领域",
        ],
        url: "https://nio.jobs.feishu.cn/campus/position/7673027301600938266/detail",
      },
      {
        id: "nio-project-quality",
        title: "项目质量改进工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "质量测试",
        majors: "车辆工程、机械、质量、材料等相关专业",
        deadline: "校招正式批 · 申请开放",
        responsibilities: [
          "牵头整车质量问题改进工作",
          "建立供应链、制造、质量、研发、售后等跨部门团队，持续提升过程与产品质量",
          "协调跨部门团队优先推进质量改进行动",
          "管理项目阶段重难点复合问题，推进制造范围内问题的根因分析和纠正措施",
          "针对整车重大质量与关键过程质量问题建立临时围堵和长期纠正措施，评估市场风险并落实处理决策",
        ],
        requirements: [
          "本科及以上，车辆工程、机械、质量、材料等相关专业",
          "了解车辆构造及制造工艺，有大学生方程式经历者优先",
          "热爱汽车行业，具备良好学习能力、沟通表达能力和团队合作精神",
        ],
        url: "https://nio.jobs.feishu.cn/campus/position/7677841219935291711/detail",
      },
      {
        id: "nio-process-quality",
        title: "过程质量工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "质量测试",
        majors: "理工科专业（机械、车辆、制造、材料等方向优先）",
        deadline: "校招正式批 · 申请开放",
        responsibilities: [
          "实施制造过程质量预防，协同研发与制造工艺团队推进新项目质量活动",
          "提升关键工艺过程控制能力，制定覆盖结构设计、制造控制和交付质量的标准",
          "结合项目风险开展质量工艺文件开发，通过 FMEA 完成 QCP 开发、验证、发布和迭代",
          "结合新工艺、新材料开展质量风险评估与预防方案策划，推进专项 FMEA",
          "使用 PFMEA、CP、作业指导书等文件开展过程能力评估，识别并闭环制造风险",
          "分析制造过程质量数据，挖掘潜在风险并提升过程能力",
        ],
        requirements: [
          "本科及以上，理工科专业背景",
          "具备数据分析能力，有 AI 数据分析应用案例者优先",
          "熟悉汽车制造工艺，有相关实习经历者优先",
          "具备沟通、协调、组织、快速适应和学习能力",
          "熟练使用 Office，能够操作 AutoCAD、Catia 等软件",
          "熟悉 8D、FMEA 等质量管理工具",
        ],
        url: "https://nio.jobs.feishu.cn/campus/position/7673026938868615434/detail",
      },
      {
        id: "nio-smart-equipment",
        title: "智能设备运营工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "自动化",
        majors: "机械工程、智能制造工程、机械电子、自动化等相关专业",
        deadline: "校招正式批 · 申请开放",
        responsibilities: [
          "开展智能制造领域机器人技术研发、方案设计与落地调试，覆盖工业/人形机器人结构优化、运动控制与功能迭代",
          "承担机器视觉方案设计、算法适配、程序开发与现场调试，实现视觉检测、定位、识别和分拣等功能",
          "参与机器人和机器视觉项目的需求调研、可行性分析、方案输出、开发测试与迭代优化",
          "推进既有智能制造设备和机器人系统的技术升级、故障排查、性能优化和车型迭代",
          "跟进行业前沿机器人、工业智能视觉和智能制造自动化技术，沉淀并优化技术体系",
        ],
        requirements: [
          "机械工程、智能制造工程、机械电子、自动化等专业本科及以上，具备机械结构设计、智能制造原理和自动化控制基础",
          "熟悉机器视觉原理，了解工业相机、镜头、光源等硬件选型，以及视觉算法适配、图像预处理和特征识别",
          "熟练掌握 Python、C++、C# 等至少一种编程语言，熟悉 Halcon、OpenCV 等视觉开发工具者优先",
          "能够接受高强度工作节奏",
        ],
        url: "https://nio.jobs.feishu.cn/campus/position/7673026938868910346/detail",
      },
      {
        id: "nio-stamping-equipment",
        title: "冲压设备工程师（MF3）",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "设备工程",
        majors: "机械、电气及相关专业",
        deadline: "校招正式批 · 申请开放",
        responsibilities: [
          "参与冲压工艺开发，制定机械、液压、气动专业安装质量标准、验收清单及新设备知识文件",
          "参与复杂、关键工艺及新设计设备的监造、施工质量监督和专业验收，推动问题解决与经验沉淀",
          "编制冲压车间机械、液压、气动专业知识文件与 TPM/PM 维护标准，并培训维修人员",
          "梳理专业备件信息并完成运行备品申购，支持设备体系文件和认证工作",
          "通过 M-FMEA、PM/TPM 等方式优化设备维护体系，提升 OEE、可靠性和成本控制",
        ],
        requirements: [
          "本科及以上，机械、电气及相关专业",
          "责任感强，具备沟通技巧、团队合作意识和学习能力",
          "积极乐观、抗压能力强，适应变化能力较好",
        ],
        url: "https://nio.jobs.feishu.cn/campus/position/7673026784782715163/detail",
      },
      {
        id: "nio-stamping-process",
        title: "冲压工艺工程师（MF2）",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械相关专业",
        deadline: "校招正式批 · 申请开放",
        responsibilities: [
          "参与冲压工艺开发，制定机械、液压、气动安装质量标准、验收清单及新设备知识文件",
          "参与关键工艺、新设计设备的监造和专业验收，推动实际问题解决",
          "编制冲压车间机械、液压、气动专业维护标准和备件资料，支持设备体系建设",
          "运用 M-FMEA、PM/TPM 优化机械、液压、气动维护体系，保障设备可靠加工状态",
          "推进备件国产化替代、设备技术革新和运行成本优化",
        ],
        requirements: [
          "本科及以上，理工科背景",
          "英语口语及读写能力良好",
          "熟练使用 Office、AutoCAD、Catia 等软件",
          "诚信、积极、创新、执行力强，具备团队合作和沟通协调能力",
          "能够接受高强度工作节奏",
        ],
        url: "https://nio.jobs.feishu.cn/campus/position/7673026809440635162/detail",
      },
    ],
  },
  {
    id: "sany",
    name: "三一集团",
    short: "SANY",
    industry: "工程机械与高端装备",
    batch: "2027届秋季校园招聘",
    verified: "2026-08-27 19:20",
    source: "三一集团校招系统",
    website: "https://sany.zhiye.com/campus/jobs",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "sany-mech",
        title: "机械工程师",
        location: "江苏 · 昆山 / 常熟",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械设计制造及其自动化、车辆工程、机械电子工程、工业设计等",
        deadline: "申请入口开放",
        responsibilities: [
          "承担通用机械、传动或转向/制动/悬架等底盘系统设计开发与验证",
          "负责需求分析、方案设计、三维建模和工程图纸输出",
          "开展选型匹配、设计评审和技术文件编制",
          "跟进样机试制、装配调试及试验验证，闭环技术问题",
          "推进产品系列化、标准化、降本和持续优化",
        ],
        requirements: [
          "硕士及以上，机械设计制造、车辆、机械电子或工业设计等专业优先",
          "掌握机械原理、工程制图、机械系统及零部件设计",
          "能使用 CAD、Creo、CATIA 等工具建模分析",
          "掌握通用机械、传动或底盘系统匹配验证方法",
          "逻辑清晰、严谨负责，具备学习、分析、沟通和协作能力",
          "相关科研、竞赛、实习或项目经历优先，能配合现场调试或短期出差",
        ],
        url: "https://sany.zhiye.com/campus/jobs",
      },
      {
        id: "sany-hydraulic",
        title: "液压工程师",
        location: "江苏 · 昆山 / 杭州",
        areas: ["江苏全域", "杭州"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械工程、流体传动与控制、液压、车辆工程等",
        deadline: "申请入口开放",
        responsibilities: [
          "承担液压系统总体、回路或泵阀缸等元件设计选型与验证",
          "负责需求分析、回路设计、参数匹配与元件选型",
          "输出液压原理图、技术规范、计算分析及设计文件",
          "参与系统联调、性能测试和故障诊断",
          "推动泄漏、温升、冲击问题闭环及效率、可靠性和成本优化",
        ],
        requirements: [
          "硕士及以上，机械、流体传动、液压、车辆等专业优先",
          "掌握液压传动、元件选型和系统回路设计",
          "能使用液压仿真、测试和数据分析工具",
          "具备液压元件性能分析能力",
          "逻辑清晰，具备学习、工程分析、沟通和团队协作能力",
          "相关科研、竞赛、实习或项目经历优先，可配合现场调试和短期出差",
        ],
        url: "https://sany.zhiye.com/campus/jobs",
      },
      {
        id: "sany-test",
        title: "测试工程师",
        location: "江苏 · 昆山",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "质量测试",
        majors: "机械、车辆、电气、自动化、测试计量等",
        deadline: "申请入口开放",
        responsibilities: [
          "负责产品或系统试验需求分析、测试方案、验证计划和评价标准制定",
          "搭建测试环境并实施功能、性能、可靠性或耐久试验",
          "分析测试数据和异常原因，推动问题整改、复测与闭环",
          "编制试验报告，维护测试规范、设备及数据资产",
        ],
        requirements: [
          "硕士及以上，机械、车辆、电气、自动化或测试计量等专业优先",
          "掌握试验设计、测试设备使用、数据采集分析和验证流程",
          "逻辑清晰、严谨负责，具备学习、工程问题分析、沟通和协作能力",
          "相关科研、竞赛、实习或项目经历优先，可配合试制、测试、现场调试或短期出差",
        ],
        url: "https://sany.zhiye.com/campus/jobs",
      },
      {
        id: "sany-product",
        title: "产品规划工程师",
        location: "江苏 · 昆山 / 常熟",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "车辆工程、机械工程、工业工程、市场营销等",
        deadline: "申请入口开放",
        responsibilities: [
          "开展市场客户需求、产品路线和配置规划或整车总布置工作",
          "研究市场、客户、竞品与技术趋势并识别产品机会",
          "负责产品定位、功能配置、技术指标及路线规划",
          "协同研发、营销、制造推进立项、评审和上市交付",
          "跟踪产品表现与反馈，持续优化产品组合和全生命周期",
        ],
        requirements: [
          "硕士及以上，车辆、机械、工业工程或市场营销等专业优先",
          "具备市场客户需求分析、产品定义、竞品研究和生命周期管理能力",
          "掌握市场研究、产品定义、整车总布置等方法",
          "逻辑清晰，具备学习、工程分析、跨专业沟通和协作能力",
          "相关科研、竞赛、实习或项目经历优先，可配合现场调试或短期出差",
        ],
        url: "https://sany.zhiye.com/campus/jobs",
      },
      {
        id: "sany-assembly",
        title: "装配与装调工艺工程师",
        location: "江苏 · 常熟",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械工程、电气工程、车辆工程、工业工程等",
        deadline: "申请入口开放",
        responsibilities: [
          "承担厂内装调、现场安装、产线建设或通用装配工艺策划与验证",
          "制定装配装调工艺方案、工位布置和作业标准",
          "参与工艺验证、新品导入和人员培训",
          "分析质量、节拍和安全问题并推动闭环",
          "优化工装、流程、产能和作业方法",
        ],
        requirements: [
          "本科及以上，部分方向要求硕士；机械、电气、车辆、工业工程等专业优先",
          "掌握装配调试工艺、工位规划、工时分析和作业文件编制",
          "具备装配装调、现场安装、产线或园区建设工艺至少一个方向能力",
          "具备学习、工程分析、沟通协作能力",
          "相关项目经历优先，可配合现场调试或短期出差",
        ],
        url: "https://sany.zhiye.com/campus/jobs",
      },
      {
        id: "sany-process",
        title: "制造工艺工程师",
        location: "江苏 · 昆山",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械工程、材料成型、焊接、车辆工程、工业工程等",
        deadline: "申请入口开放",
        responsibilities: [
          "承担车架、焊接、机加工、涂装、下料成型或通用制造工艺规划验证",
          "规划新产品工艺、工序路线、参数标准和作业文件",
          "参与新品导入、工艺验证、试制爬坡和异常处理",
          "开展焊接、机加、涂装或成型工艺优化及风险控制",
          "推动效率、质量、成本、自动化和精益改善项目",
        ],
        requirements: [
          "本科及以上，部分方向要求硕士；机械、材料成型、焊接、车辆或工业工程等专业优先",
          "掌握工艺规划、工时产能分析、文件编制和现场问题解决",
          "具备车架、焊接、机加、涂装或下料成型至少一个专项方向",
          "具备学习、工程分析、沟通和团队协作能力",
          "相关项目经历优先，可配合试制、测试、现场调试或短期出差",
        ],
        url: "https://sany.zhiye.com/campus/jobs",
      },
    ],
  },
  {
    id: "geely",
    name: "吉利控股",
    short: "GEELY",
    industry: "汽车与智能出行",
    batch: "2027届秋季全球校招",
    verified: "2026-08-27 19:10",
    source: "吉利校园招聘官网",
    website:
      "https://campus.geely.com/campus-recruitment/geely/78436?locale=zh-CN#/jobs?commitment%5B0%5D=%E5%85%A8%E8%81%8C",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "geely-mech-maint",
        title: "机械维修岗",
        location: "浙江 · 宁波",
        areas: ["宁波"],
        degree: "本科及以上",
        direction: "设备工程",
        majors: "机械、电气、自动化等相关专业优先",
        deadline: "申请入口开放",
        responsibilities: [
          "负责工厂设备产品的程序设计、改良和升级优化",
          "制作机械原理图并指导布线安装",
          "负责设备故障排查、升级和维修保养",
          "负责新项目机械方案及机械控制需求设计",
          "响应现场设备报修并快速恢复生产",
        ],
        requirements: [
          "本科及以上，机械、电气、自动化等相关专业优先",
          "CET-4 及以上，具备良好英语听说读写能力",
          "具备设备电气、机械系统维护和设计能力",
          "熟悉机械制造、装配和测试基础知识",
          "了解常见设备及检测方法，能够阅读图纸",
          "具备沟通表达和团队协作精神，相关项目或实习经验优先",
        ],
        url: "https://campus.geely.com/campus-recruitment/geely/78436?locale=zh-CN#/job/8ba0dc88-85df-4217-91e9-1b7108eb8d76",
      },
      {
        id: "geely-elec-maint",
        title: "机械电气维修岗",
        location: "浙江 · 宁波",
        areas: ["宁波"],
        degree: "本科及以上",
        direction: "设备工程",
        majors: "机械、电气自动化、电气控制相关专业",
        deadline: "申请入口开放",
        responsibilities: [
          "执行挂牌上锁等安全规定，编制安全操作规程并落实培训",
          "审核维修工单、收集故障数据并提出技改方案",
          "参与疑难故障维修与分析，采购电气备件、耗材和工辅具",
          "编制优化 TPM、PM 计划和设备单机卡，优化加工动作及防错程序",
          "编制培训课件并培训电气/机械维修人员",
          "分析备件异常消耗，调整库存并支持备件采购",
        ],
        requirements: [
          "本科及以上，机械、电气自动化或电气控制相关专业",
          "CET-4 以上或英语听说读写熟练",
          "熟练掌握电气/机械控制图纸和硬件规范",
          "熟练应用 FANUC、SIEMENS Step7 等编程软件",
          "具备设备电气/机械控制改造调试能力",
          "具备 S120 等驱动系统调试和诊断能力",
        ],
        url: "https://campus.geely.com/campus-recruitment/geely/78436?locale=zh-CN#/job/3b260a99-eb56-4751-84e6-9e18030fbfc4",
      },
    ],
  },
  {
    id: "sungrow",
    name: "阳光电源",
    short: "SG",
    industry: "新能源装备与电力电子",
    batch: "2027届全球校招正式批",
    verified: "2026-08-27 19:35",
    source: "阳光电源校园招聘官网",
    website: "https://app.mokahr.com/campus-recruitment/sungrow/94416#/jobs",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "sg-reliability",
        title: "可靠性工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "博士",
        direction: "质量测试",
        majors: "电气工程、电力电子、材料、可靠性工程、机械工程等",
        deadline: "正式批申请开放",
        responsibilities: [
          "参与搭建功率半导体、电力电子/储能整机及零部件可靠性评估体系，编制标准和测试规范",
          "配合完成加速老化、逆向分析和整机可靠性试验方案设计、落地与判定",
          "使用电学测试、金相、SEM-EDS、X-ray、热成像等手段分析器件、结构件、功率模块和电池失效",
          "运用 FMEA、FTA 开展可靠性风险分析，在器件、材料、结构和电路设计阶段识别隐患",
          "参与宽禁带器件、电池和高压绝缘老化等课题研究并沉淀方法",
        ],
        requirements: [
          "2027届博士，电气、电力电子、材料、可靠性或机械工程等专业",
          "熟悉电力电子拓扑和高压绝缘，掌握 IGBT/SiC 特性并了解储能电池基础",
          "掌握可靠性理论、加速寿命试验、威布尔分析、ESS/HASS 等方法",
          "了解高分子、金属和电池材料老化机理及相关国标、IEC 标准",
          "逻辑清晰，善于故障分析，具备钻研、并行推进和抗压能力",
          "高压设备、光储 PCS、功率半导体封装可靠性或产学研项目经历优先",
        ],
        url: "https://app.mokahr.com/campus-recruitment/sungrow/94416#/job/6b00594c-d8a8-4991-acd3-43cbb5004b37",
      },
      {
        id: "sg-equipment",
        title: "设备工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "设备工程",
        majors: "电气类、机械类、工业工程类相关专业",
        deadline: "正式批申请开放",
        responsibilities: [
          "指导统筹日常设备故障维修、问题分析和跟踪总结，协调突发事件资源",
          "起草设备技改方案并跟进落地，提升生产率、自动化和信息化水平",
          "管理设备档案、现场资料、软件及核心设备备件",
          "搭建并推进 TPM 体系，降低故障率并提升综合效率",
          "制定年度、月度和周维护计划，编制操作程序和标准作业流程，监控 OEE",
        ],
        requirements: [
          "2027届本科及以上毕业生",
          "电气类、机械类或工业工程类相关专业",
        ],
        url: "https://app.mokahr.com/campus-recruitment/sungrow/94416#/job/7be305ea-0745-4954-957e-522b5295c86f",
      },
      {
        id: "sg-manufacturing",
        title: "制造管理工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "工业工程、机械制造、电气工程等相关专业",
        deadline: "正式批申请开放",
        responsibilities: [
          "统筹光伏、储能产品生产制造全流程运行管理",
          "主导生产制程优化，识别工艺瓶颈并提升产能效率",
          "监督现场作业规范落地，保障产品质量",
          "协调生产、工艺和质量团队，闭环生产异常",
          "分析运营数据，制定并跟踪降本增效方案",
          "迭代生产管理体系并完善标准化流程",
          "监控生产安全合规并排查运营风险",
        ],
        requirements: [
          "工业工程、机械制造或电气工程等专业本科及以上",
          "掌握精益生产、IE 改善等方法",
          "能够熟练使用办公软件和生产管理系统开展统计分析",
        ],
        url: "https://app.mokahr.com/campus-recruitment/sungrow/94416#/job/53f4383d-defc-4264-b806-b377e95d422e",
      },
      {
        id: "sg-tooling",
        title: "工装设计工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械设计、自动化相关专业",
        deadline: "正式批申请开放",
        responsibilities: [
          "负责新能源电源设备生产工装夹具、模具的方案设计与优化",
          "主导方案评审并协同生产、工艺部门验证可行性",
          "设计工装 3D/2D 图纸，编制技术要求和 BOM",
          "跟踪加工、装配和试产，解决现场应用问题",
          "评估工装效率并优化结构以提升良率和效率",
          "建立技术档案并规范全生命周期维护流程",
          "对接供应商并跟踪外采工装质量和周期",
        ],
        requirements: [
          "机械设计、自动化相关专业本科及以上",
          "熟练使用 SolidWorks、AutoCAD，掌握机械加工工艺",
          "熟悉工装夹具、非标自动化治具设计，可独立完成全流程设计",
          "了解钣金、机加工、注塑等工艺，具备现场问题解决能力",
          "严谨细致，具备跨部门沟通和团队协作意识",
        ],
        url: "https://app.mokahr.com/campus-recruitment/sungrow/94416#/job/c828f8b3-cf8f-48b2-8281-f5556c4f9e42",
      },
    ],
  },
  {
    id: "nexchip",
    name: "晶合集成",
    short: "NEXCHIP",
    industry: "半导体晶圆制造 · 设备与工艺",
    batch: "2027届校园招聘",
    verified: "2026-08-28 21:10",
    source: "晶合集成中国校园招聘官网",
    website: "https://www.nexchip.com.cn/campus-recruitment",
    sourceOrigin: "企业官网发布",
    status: "announcement",
    jobs: [
      {
        id: "nexchip-equipment-process",
        title: "设备工程师 / 工艺工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "设备工程",
        majors: "机械制造、机械、自动化、机电一体化、电气、微电子、材料等理工科相关专业",
        deadline: "2027届校招项目开放",
        responsibilities: ["参与晶圆制造设备或量产工艺方向的工程技术工作", "支持半导体生产设备、工艺参数、制程稳定性和持续改善工作"],
        requirements: ["面向2027届应届毕业生", "本科及以上，机械制造、自动化、机电一体化、电气、微电子、材料等相关专业", "具体岗位职责、班次和专业细分以官方校招系统实时职位为准"],
        note: "公告级信息：官网已确认2027校园招聘和合肥工作地点，并公开设备/工艺方向；独立岗位JD待官方职位系统补全。",
        url: "https://www.nexchip.com.cn/campus-recruitment",
      },
    ],
  },
  {
    id: "haistar",
    name: "海星股份",
    short: "HAISTAR",
    industry: "储能材料与智能装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 20:30",
    source: "海星股份中国校园招聘官网",
    website: "https://www.haistar.com.cn/join/xyzp/",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "haistar-mechanical",
        title: "机械工程师",
        location: "江苏 · 南通",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械工程、机械设计、先进制造等机械相关专业",
        deadline: "官网申请开放",
        responsibilities: ["完成生产系统、设备及部件的设计绘制", "持续优化现有系统设备，提高智能化和可靠性", "参与设备制造、改造、安装、调试和保养"],
        requirements: ["机械工程、机械设计、先进制造等机械相关专业，专业成绩优异", "熟练查阅期刊和专利", "本科及以上学历"],
        url: "https://www.haistar.com.cn/join/xyzp/",
      },
      {
        id: "haistar-plc",
        title: "自动化 PLC 工程师",
        location: "江苏 · 南通",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "自动化",
        majors: "电气工程、测控与仪器等相关专业",
        deadline: "官网申请开放",
        responsibilities: ["使用 Mitsubishi 或 Siemens PLC 编程并完成相关控制任务", "根据要求设计和绘制电气原理图", "掌握组态软件并编制人机界面", "理解自动控制、传感器和常见电子元件原理，完成常用元件设计计算与选型"],
        requirements: ["电气工程、测控与仪器等相关专业", "具备 PLC 编程或相近课程基础", "本科及以上学历"],
        url: "https://www.haistar.com.cn/join/xyzp/",
      },
    ],
  },
  {
    id: "cxmt",
    name: "长鑫存储",
    short: "CXMT",
    industry: "大型半导体制造 · DRAM与智能制造",
    batch: "2027届提前批校园招聘",
    verified: "2026-08-28 19:10",
    source: "长鑫存储中国招聘官网与2027届提前批公告",
    website: "https://www.cxmt.com/join.html",
    status: "announcement",
    jobs: [
      {
        id: "cxmt-process",
        title: "工艺工程 / 工艺整合",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "制造工程",
        majors:
          "微电子、机械工程、电气工程、化学工程、物理、材料、化学、数学、统计学等理工科相关专业",
        deadline: "2027届提前批 · 申请开放",
        responsibilities: [
          "参与 DRAM 量产技术方向的工艺工程或工艺整合工作",
          "服务于存储芯片制造工艺、质量控制与量产技术能力建设",
        ],
        requirements: [
          "面向2027届海内外高校毕业生（毕业时间为2027年1月1日至12月31日）",
          "本科及以上，微电子、机械工程、电气工程、化学工程、物理、材料、化学、数学、统计学等理工科相关专业",
          "完成网申、AI初试及在线测评后进入简历筛选、专业复试、综合评估和录用流程",
        ],
        note: "官方校招入口当前无法公开读取单岗完整JD；已确认届次、地点、岗位方向、学历与专业，后续补全独立JD。",
        url: "http://jobs.cxmt.com/Campus",
      },
      {
        id: "cxmt-quality-reliability",
        title: "产品质量与可靠性工程 / 研发质量改善与检测量测",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上（部分方向硕士/博士优先）",
        direction: "质量测试",
        majors:
          "机械工程、自动化、电气工程、微电子、材料、物理、化学、力学、智能制造等理工科相关专业",
        deadline: "2027届提前批 · 申请开放",
        responsibilities: [
          "参与产品质量与可靠性、研发质量改善、检测量测等半导体研发技术方向",
          "支持产品质量、失效分析、检测量测与研发质量改进相关工作",
        ],
        requirements: [
          "面向2027届海内外高校毕业生",
          "机械工程、自动化、电气工程、微电子、材料、物理、化学、力学、智能制造等理工科相关专业",
          "具体学历门槛与项目要求以官方职位系统实时信息为准",
        ],
        note: "公告级信息：当前确认的是官方校招方向、届次与专业范围，独立岗位JD待官方系统恢复访问后补全。",
        url: "http://jobs.cxmt.com/Campus",
      },
    ],
  },
  {
    id: "wayeal",
    name: "皖仪科技",
    short: "WAYEAL",
    industry: "分析仪器与精密装备",
    batch: "2027届秋季校园招聘",
    verified: "2026-08-28 18:20",
    source: "皖仪科技中国校园招聘官网",
    website: "https://wayeal.zhiye.com/campus/jobs",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "wayeal-mechanical",
        title: "机械工程师",
        location: "安徽 · 合肥 · 高新区",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors:
          "机械工程（真空方向）、机械设计制造及其自动化、机械电子工程、过程装备与控制工程、流体机械及工程等",
        deadline: "校招申请开放",
        responsibilities: [
          "承担项目方案设计与技术沟通，完成设计方案确认",
          "完成机械结构、气动图纸及材料清单编制，对项目节点负责",
          "为机械装配和售后现场提供机械结构技术支持",
          "开展机械改进设计、设计标准化工作，输出图纸和 BOM",
        ],
        requirements: [
          "硕士及以上，机械工程（真空方向）、机械设计制造、机械电子、过程装备与控制、流体机械等相关专业",
          "具备扎实机械设计理论基础，掌握机械原理、机械设计、材料力学、公差配合与测量、机械制造工艺等知识",
          "具备机械问题分析思路，能判断故障可能原因；图纸和 BOM 条理清晰、版本可控，具备设计标准化和模块化改进基础",
        ],
        url: "https://wayeal.zhiye.com/campus/jobs",
      },
      {
        id: "wayeal-system-product",
        title: "系统/产品工程师",
        location: "安徽 · 合肥 · 高新区",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors:
          "精密仪器、机械工程、自动化、测控技术与仪器、流体机械、过程装备与控制等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "参与产品前期方案讨论，协助确定技术路线和关键指标",
          "完成样机机械结构组装、电气接线、系统联调与性能验证",
          "承担单一模块需求分解、方案设计、验证测试和问题闭环",
          "编写并归档测试报告、验证记录和操作手册等技术资料",
          "参与产品版本改进，为售前、生产和售后提供全生命周期技术支持",
        ],
        requirements: [
          "硕士及以上，精密仪器、机械工程、自动化、测控、流体机械、过程装备与控制等相关专业",
          "具备精密仪器结构、真空系统基础理论，有样机装配、调试和测试经验",
          "沟通表达、主动性和抗压能力良好，逻辑清晰、严谨细致，具备学习复盘意识",
        ],
        url: "https://wayeal.zhiye.com/campus/jobs",
      },
      {
        id: "wayeal-process",
        title: "工艺工程师",
        location: "安徽 · 合肥 · 高新区",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械工程、物理、电子、控制科学与工程等机电相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "维护和改善仪器量产及机加工艺",
          "参与产品试制，固化 SOP、装配规范、调试/标定作业指导书、工时定额、PFMEA 与控制计划",
          "监督工艺纪律并支持现场，处理制程工艺异常、装配不良和调试合格率波动",
          "推动 ECN 工程变更在产线落地，组织培训并验证变更效果",
          "维护优化工装夹具，提出产线自动化和测试工装升级需求",
        ],
        requirements: [
          "本科及以上，机械工程、物理、电子、控制科学与工程等机电相关专业",
          "具备独立工作和解决问题能力，善于沟通合作，热衷新技术、乐于动手实践和总结分享",
        ],
        url: "https://wayeal.zhiye.com/campus/jobs",
      },
    ],
  },
  {
    id: "sinoma",
    name: "中亚装备",
    short: "SINOMA",
    industry: "央企 · 高端建材装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 09:20",
    source: "高校就业网发布的中亚装备2027校招公告",
    website: "http://www.hfzyhrm.com/",
    jobs: [
      {
        id: "sinoma-rd-doctor",
        title: "装备研发设计工程师（博士专项）",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "博士及以上",
        direction: "研发设计",
        majors: "机械工程、智能制造等相关专业",
        deadline: "公告投递开放中",
        responsibilities: [
          "牵头核心产品立式磨的技术战略规划与迭代升级",
          "主导关键技术预研与突破，构建核心技术壁垒",
          "统筹新产品研发全流程，包括方案论证、仿真验证、性能优化和可靠性研究",
          "制定产品设计标准与制造规范，推动工艺体系升级",
          "统筹研究总院、实验室和跨部门研发资源，推动前沿技术产业化",
        ],
        requirements: [
          "博士及以上，具备扎实理论基础和系统科研方法论",
          "精通机械结构设计、多物理场仿真分析等技术",
          "具备独立牵头重大科研项目及成果转化能力",
          "具备技术战略视野、创新思维和团队领导潜质",
          "党员、英语突出或有高端装备重大项目经验者优先",
        ],
        url: "https://job.hust.edu.cn/zpinfo1/2407505.htm",
      },
      {
        id: "sinoma-rd",
        title: "装备研发设计工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械工程、智能制造等相关专业",
        deadline: "公告投递开放中",
        responsibilities: [
          "负责立式磨产品迭代升级、设计优化、仿真分析和性能可靠性研究",
          "跟进新产品研发、试验和应用，协助解决技术问题",
          "制定产品设计标准和规范，优化制造工艺",
          "开展与集团研究总院和实验室的协同研发",
        ],
        requirements: [
          "硕士及以上学历",
          "能独立开展工作并适应中等强度出差",
          "熟悉机械结构设计和仿真分析",
          "具备科研思维、学习创新、科研攻关和团队协作能力",
          "党员、英语突出或有类似项目经验者优先",
        ],
        url: "https://job.hust.edu.cn/zpinfo1/2407505.htm",
      },
      {
        id: "sinoma-smart",
        title: "智能化工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "自动化",
        majors: "计算机、软件工程、电子信息、自动化、控制工程等",
        deadline: "公告投递开放中",
        responsibilities: [
          "研发并落地立式磨少人化、无人化智能控制系统",
          "推动生产制造端信息化、智能化和数字化升级",
          "参与集团或公司重大专项研发项目",
          "实施和维护公司信息化管理系统",
        ],
        requirements: [
          "硕士及以上学历",
          "能独立工作并适应中等强度出差",
          "熟练使用多种编程语言，具备编程或低代码开发能力",
          "熟悉工业网络、工业软件和自动化设备接口",
          "党员、英语突出或有类似项目经验者优先",
        ],
        url: "https://job.hust.edu.cn/zpinfo1/2407505.htm",
      },
    ],
  },
  {
    id: "amd",
    name: "中科光电",
    short: "AMD",
    industry: "智能分选装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 09:20",
    source: "中科大就业网来源的校招公告",
    website: "http://www.cn-amd.com",
    jobs: [
      {
        id: "amd-mechatronic",
        title: "机电工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机电一体化、机械设计制造、力学、精密仪器等",
        deadline: "官网投递开放中",
        responsibilities: [
          "开展机电产品设计与优化",
          "进行电磁、静力、流体和热力学等多物理场仿真",
        ],
        requirements: [
          "硕士及以上，机电一体化、机械设计制造、力学或精密仪器相关专业",
          "熟悉 SolidWorks、AutoCAD、Ansys、COMSOL 等软件",
          "有振动、气动或传动相关设计经验者优先",
        ],
        url: "http://www.cn-amd.com",
      },
      {
        id: "amd-mechatronic-research",
        title: "机电研究员",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机电一体化、机械设计制造、力学、精密仪器、机器人等",
        deadline: "官网投递开放中",
        responsibilities: [
          "预研色选机机电系统相关新材料、新结构、新工艺和新系统",
          "攻关复杂机电问题，开展复杂机电系统设计优化和多物理场耦合仿真",
          "牵头机电新产品、新部件研发，协调资源推动项目落地",
        ],
        requirements: [
          "硕士及以上，机电、机械、力学、精密仪器或机器人相关专业",
          "对技术趋势敏感，具备学术转化和问题解决能力",
          "精密机械、工业机器人或智能装备研发经验优先",
          "有振动、气动、传动相关经验优先",
          "熟练使用 SolidWorks、AutoCAD、Ansys、COMSOL 等软件",
        ],
        url: "http://www.cn-amd.com",
      },
      {
        id: "amd-mechanical",
        title: "机械工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械工程及相关专业",
        deadline: "官网投递开放中",
        responsibilities: ["负责产品结构设计"],
        requirements: [
          "本科及以上学历",
          "掌握机械原理与 CAD 制图",
          "能使用 SolidWorks、AutoCAD 等绘图软件",
          "具备结构设计相关项目经历",
        ],
        url: "http://www.cn-amd.com",
      },
    ],
  },
  {
    id: "hengli",
    name: "恒立液压",
    short: "HL",
    industry: "上市公司 · 液压系统",
    batch: "2027届校园招聘",
    verified: "2026-08-28 09:10",
    source: "恒立2027校招公告；官方校园招聘页",
    website: "https://www.henglihydraulics.com/col47/list",
    status: "announcement",
    jobs: [
      {
        id: "hengli-rd",
        title: "27届培训生 · 研发类（泵阀）",
        location: "江苏 · 常州",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "液压、流体、机械、机电、电气等相关专业",
        deadline: "公告截止 2026-09-20",
        responsibilities: [
          "研发工程：液压泵、阀、马达等产品开发设计和测试调试",
          "液压应用工程：整机液压系统匹配调试和搭载测试",
          "仿真工程：开展流场、结构强度和多物理场耦合仿真",
          "标准化工程：制定编写标准文件，开展规范宣讲、技术支持和指导",
          "嵌入式工程：研究双核嵌入式AI控制器及智能传感器",
          "电气工程：开展整机电气系统匹配调试、元件选型和技术支持",
        ],
        requirements: [
          "公告确认面向2027届硕士及以上毕业生",
          "液压、流体、机械、机电、材料、电气等相关专业",
          "具体岗位会在恒立校园招聘页面继续细分",
        ],
        note: "公告级信息：校招已启动，岗位方向和基本要求已公开；各方向独立职位页仍在逐步更新。",
        url: "https://www.henglihydraulics.com/col47/list",
      },
      {
        id: "hengli-production",
        title: "27届培训生 · 生产管理类（泵阀）",
        location: "江苏 · 常州",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械、机电、材料、电气、工业工程等相关专业",
        deadline: "公告截止 2026-09-20",
        responsibilities: [
          "生产计划：安排生产计划、智能调度和排产模型优化",
          "工艺管理：开展工艺策划、刀具应用和测试编程",
          "物流管理：建设精益与智能物流，提升交付效率",
          "质量管理：开展供应商、物料、制程、新品和客诉全流程质量管理",
          "设备管理：推进设备维修、保养和自动化，降低故障率",
          "采购工程：开展标准件、非标件采购与供应商管理",
        ],
        requirements: [
          "公告确认面向2027届本科及以上毕业生",
          "机械、机电、材料、电气、工业工程等相关专业",
          "具体专项要求在恒立校园招聘页面持续发布",
        ],
        note: "公告级信息：企业已明确开放方向与地点，独立岗位JD尚在官方系统陆续更新。",
        url: "https://www.henglihydraulics.com/col47/list",
      },
    ],
  },
  {
    id: "haitian",
    name: "海天集团",
    short: "HT",
    industry: "上市公司 · 高端装备制造",
    batch: "2027届校园招聘",
    verified: "2026-08-28 09:05",
    source: "海天集团官方校招入口及2027校招公告",
    website: "https://www.haitian.com/cn/career/",
    status: "announcement",
    jobs: [
      {
        id: "haitian-rd",
        title: "2027届校园招聘 · 设计研发方向",
        location: "浙江 · 宁波 / 安徽 · 合肥",
        areas: ["宁波", "合肥"],
        degree: "以官方职位页为准",
        direction: "研发设计",
        majors: "机械、机电、自动化、材料等制造相关专业",
        deadline: "招满即止",
        responsibilities: [
          "海天2027届校招公告已确认覆盖宁波、合肥等制造基地",
          "设计研发为官方校招职位类别之一，具体职责随各事业部独立岗位发布",
        ],
        requirements: [
          "面向2027届应届毕业生",
          "具体学历、专业和软件要求需以事业部最新职位页为准",
        ],
        note: "公告级信息：官方已确认2027校招启动和地点范围，但当前公开页面尚未列出可逐条核验的设计研发岗位。",
        url: "https://www.haitian.com/cn/career/",
      },
      {
        id: "haitian-manufacturing",
        title: "2027届校园招聘 · 制造技术方向",
        location: "浙江 · 宁波 / 安徽 · 合肥",
        areas: ["宁波", "合肥"],
        degree: "以官方职位页为准",
        direction: "制造工程",
        majors: "机械制造、自动化、工业工程等相关专业",
        deadline: "招满即止",
        responsibilities: [
          "制造技术为海天官方校招职位类别之一",
          "具体部门、产品线和岗位职责将随校园招聘系统职位发布",
        ],
        requirements: [
          "面向2027届应届毕业生",
          "各岗位学历和专业门槛以招聘系统实时职位为准",
        ],
        note: "公告级信息：仅用于提示当前校招已开启，不将未发布的岗位细节虚构为完整JD。",
        url: "https://www.haitian.com/cn/career/",
      },
    ],
  },
  {
    id: "leoch",
    name: "利欧集团",
    short: "LEO",
    industry: "上市公司 · 泵与流体装备",
    batch: "2027届全球校园招聘",
    verified: "2026-08-28 09:00",
    source: "利欧2027校招公告",
    website: "https://www.leogroup.cn/",
    status: "announcement",
    jobs: [
      {
        id: "leoch-rd",
        title: "研究开发方向 · 研发技术/测试认证",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科 / 硕士 / 博士",
        direction: "研发设计",
        majors:
          "机械设计制造、机电一体化、流体机械、能源动力、电气、自动控制等",
        deadline: "公告投递开放中",
        responsibilities: [
          "研究开发方向覆盖研发技术、项目管理、电磁研发、控制软件和测试认证",
          "具体职责会按产品线和独立岗位进一步发布",
        ],
        requirements: [
          "面向2026年9月至2027年7月毕业的应届生",
          "机械、流体、机电、能源动力、电气和自动控制等相关专业",
          "具体学历、岗位技能要求以利欧校招系统为准",
        ],
        note: "公告级信息：校招岗位类别、专业和杭州地点已公开；独立职位JD由校招系统实时发布。",
        url: "https://www.leogroup.cn/",
      },
      {
        id: "leoch-production",
        title: "生产制造方向 · 工艺/采购管理",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械工程、材料成型、机电、工业工程、质量管理等",
        deadline: "公告投递开放中",
        responsibilities: [
          "生产制造方向覆盖采购管理、计划采购和工艺岗位",
          "具体职责和部门分配将以校招系统开放职位为准",
        ],
        requirements: [
          "面向2027届应届毕业生",
          "机械、材料成型、机电、工业工程等相关专业",
          "具体学历和经验门槛按实时职位确认",
        ],
        note: "公告级信息：用于保留已确认开放的制造方向，等待企业细化独立岗位JD。",
        url: "https://www.leogroup.cn/",
      },
    ],
  },
  {
    id: "xinje",
    name: "信捷电气",
    short: "XINJE",
    industry: "上市公司 · 工业自动化",
    batch: "2027届校园招聘",
    verified: "2026-08-29 20:40",
    source: "信捷电气2027校招简章",
    website: "https://www.xinje.com/",
    jobs: [
      {
        id: "xinje-motor-structure",
        title: "电机结构工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械设计、机械电子等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "完成通用品、行业专机和定制机的电机结构整体设计、出图、样机试制与测试跟踪",
          "负责转轴、轴承、密封件、机壳和端盖等零件的设计校核、材料选型和供应商技术交流",
          "与电磁、硬件、软件和测试部门协作完成问题分析与闭环",
          "参与电机技术攻关、质量改进和产品降本",
          "整理归档项目资料、图纸并参与专利申请",
        ],
        requirements: [
          "机械设计、机械电子等专业本科及以上",
          "了解机械原理、电气控制、机械加工和装配工艺",
          "熟练使用 AutoCAD、SolidWorks/Creo/NX、Ansys、ERP/PLM 等工具",
          "熟练使用测量与装配工具",
          "熟悉标准件选型、非标设计和强度理论计算校核",
          "责任心强，具备沟通、钻研和团队协作能力",
        ],
        url: "https://career.hebut.edu.cn/home/correcruit/content/id/79439.html",
      },
      {
        id: "xinje-motor-process",
        title: "电机工艺工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械设计、机械电子等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "参与新品开发设计评审，评估制造工艺可行性并制定方案",
          "开展新产品工艺开发和导入，制定生产工艺流程",
          "设计、验证并优化样机工装夹具",
          "主导新产品试制，梳理并解决样机制作问题",
          "搭建工艺平台，改善瓶颈工序和关键工艺，提升质量与效率",
        ],
        requirements: [
          "机械设计、机械电子等相关专业本科及以上",
          "具备机械制造、装配及工艺设计基础",
          "具备工装夹具设计、试制问题分析与跨部门协作能力",
          "责任心强，学习意愿和团队合作意识良好",
        ],
        url: "https://career.hebut.edu.cn/home/correcruit/content/id/79439.html",
      },
      {
        id: "xinje-electromagnetic",
        title: "电磁设计工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "电气工程、机械工程等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "负责电机产品设计开发，包括方案设计和磁路设计",
          "开展电磁、热仿真与振动噪音优化",
          "跟踪样机测试，分析结果、排查故障并进行设计改进",
          "指导电机电磁相关生产工艺",
          "优化电机性能和成本，提升可制造性",
        ],
        requirements: [
          "电气工程、机械工程等相关专业硕士及以上",
          "熟悉电机基本知识、参数与设计方法",
          "能熟练使用 Maxwell、Jmag 等主流电磁设计软件",
          "具备责任心、主动性和沟通协调能力",
        ],
        url: "https://career.hebut.edu.cn/home/correcruit/content/id/79439.html",
      },
      {
        id: "xinje-mechanical-design",
        title: "机械设计工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械、机电等相关专业",
        deadline: "校招申请开放（未公示截止日）",
        responsibilities: [
          "负责非标自动化设备机械部分设计、技术支持及安装调试指导",
          "负责生产工装夹具设计、生产工艺流程制定以及新工艺、新材料应用",
          "优化现有非标设备结构和工艺，提高产品标准化程度",
          "负责对内对外技术沟通、产品验收和技术资料收集",
          "参与产品试制跟踪、组装和调试",
          "解决产品生产、组装、调试过程中的机械技术问题",
        ],
        requirements: [
          "机械、机电等相关专业，本科及以上学历；专业课程成绩优良，获得奖学金者优先",
          "具备扎实的机械设计、机械原理、机械制造基础和机械制图知识",
          "熟练使用 SolidWorks、CAD 等设计软件",
          "愿意长期从事非标机械设计工作",
          "愿意从基层工作开始，具备吃苦耐劳精神",
          "语言和文字表达能力良好，能够进行技术交流并撰写技术文件",
          "性格开朗稳重，善于学习和思考，工作认真负责、效率较高",
          "工作热情和自觉性较高，自我管理能力与心理素质良好",
        ],
        note: "岗位职责与任职资格逐条来自信捷电气2027届招聘简章；企业官网用于校招入口核验。",
        url: "https://career.hebut.edu.cn/home/correcruit/content/id/79439.html",
      },
      {
        id: "xinje-failure-analysis",
        title: "机械设计工程师（失效分析方向）",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "质量测试",
        majors: "机械、机电、材料科学、仪器科学与技术等相关专业",
        deadline: "校招申请开放（未公示截止日）",
        responsibilities: [
          "运用失效分析技术分析电机故障件根本原因，定位缺陷并推动改进",
          "针对重点失效问题开展专题研究，通过理论与实验结合提出并验证优化方案，降低故障率",
          "研究行业标准，参与制定伺服电机物料测试方案，识别并管控潜在质量风险",
        ],
        requirements: [
          "机械、机电、材料科学、仪器科学与技术等相关专业，本科及以上学历",
          "熟悉机械和电气基础，了解材料科学基础及失效分析原理，熟练使用 SolidWorks 等工业设计软件",
          "对伺服电机质量与可靠性工作有浓厚兴趣；有失效分析经验或相关科研项目成果者优先",
        ],
        note: "岗位职责与任职资格逐条来自信捷电气2027届招聘简章；企业官网用于校招入口核验。",
        url: "https://career.hebut.edu.cn/home/correcruit/content/id/79439.html",
      },
    ],
  },
  {
    id: "cetc8",
    name: "中国电科八所",
    short: "CETC8",
    industry: "央企 · 光电装备与传输",
    batch: "2027届校园招聘",
    verified: "2026-08-28 10:25",
    source: "中国电科八所2027校招公告",
    website: "https://8.cetc.com.cn/8/",
    status: "announcement",
    jobs: [
      {
        id: "cetc8-mechanical",
        title: "机械设计工程师（大型机械）",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士 / 博士",
        direction: "研发设计",
        majors: "机械工程、液压机械、材料工程、精密仪器等相关专业",
        deadline: "邮件投递开放",
        responsibilities: [
          "中国电科八所2027校招公告已列出机械设计工程师（大型机械）岗位",
          "所属单位研发光电线缆、连接器、光器件、光纤传感器和独立功能装备等产品",
        ],
        requirements: [
          "公告明确面向硕士、博士毕业生",
          "机械工程、液压机械、材料工程、精密仪器等相关专业",
          "岗位详情通过官方校招二维码或邮件渠道获取",
        ],
        note: "公告级信息：岗位名称、学历、专业、投递渠道已公开；完整职责由企业在扫码岗位详情中发布。",
        url: "https://career.nankai.edu.cn/correcruit/content/id/116835.html",
      },
    ],
  },
  {
    id: "iflytek",
    name: "科大讯飞",
    short: "iFLYTEK",
    industry: "上市公司 · 人工智能装备",
    batch: "2027届秋季校园招聘",
    verified: "2026-08-28 10:20",
    source: "科大讯飞2027校招公告",
    website: "https://www.iflytek.com/",
    status: "announcement",
    jobs: [
      {
        id: "iflytek-structure",
        title: "机械结构工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "以官方职位页为准",
        direction: "研发设计",
        majors: "机械工程、机电、自动化等相关专业",
        deadline: "秋招申请开放",
        responsibilities: [
          "科大讯飞2027届秋招公告已列出合肥机械结构工程师岗位",
        ],
        requirements: [
          "公告已确认面向2025年6月至2027年8月毕业生",
          "具体学历、职责、设计软件要求以科大讯飞校招职位页为准",
        ],
        note: "公告级信息：岗位名称与工作地点已公开，独立岗位JD需在讯飞校招系统进一步确认。",
        url: "https://jy.bsu.edu.cn/front/zpxx.jspa?tid=2089619655797788673",
      },
    ],
  },
  {
    id: "cctech",
    name: "长川科技",
    short: "CCTECH",
    industry: "上市公司 · 半导体测试装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 11:10",
    source: "长川科技2027校招简章",
    website: "https://www.hzcctech.com/JoinUs/index.aspx",
    jobs: [
      {
        id: "cctech-mechanical",
        title: "机械工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械设计及相关专业",
        deadline: "网申申请开放",
        responsibilities: [
          "参与半导体测试装备的机械设计与研发工作",
          "按项目要求开展结构方案、图纸和工程化工作",
        ],
        requirements: [
          "机械设计及相关专业硕士及以上",
          "具体产品线、设计软件和项目经历要求以长川校招职位页为准",
        ],
        note: "公告已明确岗位、专业、地点和学历；独立JD在企业校招系统中持续更新。",
        url: "https://career.nankai.edu.cn/correcruit/content/id/116718.html",
      },
      {
        id: "cctech-fea",
        title: "FEA工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "硕士及以上",
        direction: "仿真分析",
        majors: "机械工程、航空航天、车辆工程、热能工程等",
        deadline: "网申申请开放",
        responsibilities: ["开展产品有限元分析与工程仿真支持"],
        requirements: [
          "机械、航空航天、车辆、热能等专业硕士及以上",
          "具体仿真软件与项目能力要求以校招职位页为准",
        ],
        note: "公告级信息：岗位类别和基本资格已公开。",
        url: "https://career.nankai.edu.cn/correcruit/content/id/116718.html",
      },
      {
        id: "cctech-production",
        title: "生产技术工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械、电气、自动化等相关专业",
        deadline: "网申申请开放",
        responsibilities: ["参与半导体测试装备的生产技术与制造支持工作"],
        requirements: [
          "机械、电气、自动化等相关专业本科及以上",
          "具体制造工艺与现场能力要求以企业职位页为准",
        ],
        note: "公告级信息：企业已列明岗位、地点、专业和学历。",
        url: "https://career.nankai.edu.cn/correcruit/content/id/116718.html",
      },
    ],
  },
  {
    id: "cetc38",
    name: "中国电科三十八所",
    short: "CETC38",
    industry: "央企 · 国防电子装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 11:05",
    source: "国家大学生就业服务平台校招公告",
    website: "https://cetc38.zhaopin.com/",
    status: "announcement",
    jobs: [
      {
        id: "cetc38-mechanical",
        title: "浮空器系统设计师 / 数字化设计与制造设计师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士 / 博士",
        direction: "研发设计",
        majors: "机械、材料、机电、制造等相关专业",
        deadline: "公告投递开放",
        responsibilities: [
          "公告列出浮空器系统设计、数字化设计与制造等机械材料类岗位",
          "服务于电子装备的研究、开发、制造与测试",
        ],
        requirements: [
          "博士岗位覆盖浮空器系统、工艺、机电、环控、力学仿真与测试方向",
          "硕士及以上岗位覆盖浮空器系统和数字化设计与制造方向",
          "有相关项目经验或论文者优先",
        ],
        note: "公告级信息：招聘方向、学历与专业类别已公开，独立岗位详情以官方校招官网为准。",
        url: "https://www.ncss.cn/student/jobs/DDCCdr9FkSs7hfr55TsHPB/detail.html",
      },
    ],
  },
  {
    id: "shuanghuan",
    name: "双环传动",
    short: "SH",
    industry: "上市公司 · 齿轮与传动系统",
    batch: "2027届秋季校园招聘",
    verified: "2026-08-28 11:00",
    source: "双环传动2027校招公告",
    website: "https://www.gearbox.com.cn/",
    status: "announcement",
    jobs: [
      {
        id: "shuanghuan-project",
        title: "项目管理岗（机械/车辆方向）",
        location: "杭州 / 宁波",
        areas: ["杭州", "宁波"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械类、车辆工程、项目管理等相关专业",
        deadline: "秋招申请开放",
        responsibilities: ["参与传动系统相关项目管理与跨部门协同"],
        requirements: [
          "面向2027届本科及以上毕业生",
          "机械类、车辆工程、项目管理等相关专业",
          "具体项目方向与岗位职责以企业校招系统为准",
        ],
        note: "公告级信息：岗位、专业、届次和目标工作城市已公开。",
        url: "https://www.gearbox.com.cn/",
      },
    ],
  },
  {
    id: "jingce",
    name: "精测电子",
    short: "JINGCE",
    industry: "上市公司 · 精密检测装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 10:55",
    source: "精测电子2027校招公告",
    website: "https://www.jingce.com/",
    status: "announcement",
    jobs: [
      {
        id: "jingce-mechanical",
        title: "机械工程师 / 工艺工程师",
        location: "江苏 · 苏州 / 常州 / 无锡",
        areas: ["江苏全域"],
        degree: "本科 / 硕士 / 博士",
        direction: "研发设计",
        majors: "机械工程、机电、自动化等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "公告列出机械工程师、工艺工程师、研发测试和电控等热招方向",
          "服务半导体、显示和新能源领域的精密检测装备研发制造",
        ],
        requirements: [
          "面向2027届海内外本科、硕士、博士毕业生",
          "具体学历、专业与产品线要求以精测官方校招系统为准",
        ],
        note: "公告级信息：企业已确认苏州、常州、无锡制造研发基地和机械类热招方向。",
        url: "https://www.jingce.com/",
      },
    ],
  },
  {
    id: "donghua",
    name: "东华科技",
    short: "ECEC",
    industry: "驻皖央企 · 上市工程科技公司",
    batch: "2027届校园招聘",
    verified: "2026-08-28 11:45",
    source: "东华科技2027校招简章",
    website: "https://www.chinaecec.com/",
    status: "announcement",
    jobs: [
      {
        id: "donghua-process",
        title: "化工机械 / 过程装备与控制相关岗位",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科 / 硕士",
        direction: "研发设计",
        majors:
          "化工过程机械、过程装备与控制、机械设计制造、机械工程、动力工程、流体机械等",
        deadline: "校招申请开放",
        responsibilities: [
          "参与化工、新材料、新能源和生态环保工程的研发、咨询、设计、采购、施工管理与工程总承包业务",
        ],
        requirements: [
          "面向2027届毕业生",
          "招收化工机械、过程装备、机械设计制造、机械工程、动力和流体机械等专业",
          "具体岗位职责与项目地点以企业校招系统为准",
        ],
        note: "公告级信息：企业、届次、总部地点和机械相关专业范围已公开。",
        url: "https://job.tju.edu.cn/recruitment/content/type/2/id/6218.html",
      },
    ],
  },
  {
    id: "cecii",
    name: "中国电子系统工程第二建设",
    short: "CECI",
    industry: "央企 · 高科技工业工程",
    batch: "2027届校园招聘",
    verified: "2026-08-28 11:40",
    source: "中电二2027校招公告",
    website: "https://campus.cec.com.cn/",
    status: "announcement",
    jobs: [
      {
        id: "cecii-power",
        title: "动力工程师",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科 / 硕士",
        direction: "设备工程",
        majors: "机械工程、动力工程、给排水、电气、化工等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "服务电子、大健康、数据中心和新能源等高科技制造领域的工程设计、建造与智慧运维",
        ],
        requirements: [
          "面向2027年毕业的本科、硕士毕业生",
          "机械、动力、给排水、电气、化工等相关专业",
          "具体项目与岗位职责以中电二招聘官网为准",
        ],
        note: "公告级信息：当前校招已启动，岗位名称、地点和专业范围已公开。",
        url: "https://www.fenbi.com/page/fenxiaozhaokaodetail/1/2072/468660734153728",
      },
    ],
  },
  {
    id: "huaqin",
    name: "华勤技术",
    short: "HQ",
    industry: "上市公司 · 智能制造",
    batch: "2027届秋季校园招聘",
    verified: "2026-08-28 11:35",
    source: "华勤技术2027校招公告",
    website: "https://www.huaqin.com/",
    status: "announcement",
    jobs: [
      {
        id: "huaqin-engineering",
        title: "工程技术类 · 工艺 / 设备 / 自动化工程师",
        location: "江苏 · 无锡 / 浙江 · 宁波",
        areas: ["江苏全域", "宁波"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械工程、工业工程、自动化、电子、通信、材料等相关专业",
        deadline: "网申与测评已启动",
        responsibilities: [
          "工程技术方向覆盖测试、工业工程、工艺、生产、设备、自动化、新产品导入等岗位",
        ],
        requirements: [
          "面向2027届毕业生",
          "机械、工业工程、自动化等理工科专业",
          "具体岗位和工作城市以企业校招系统实时开放信息为准",
        ],
        note: "公告级信息：无锡与宁波属于企业公布的国内校招城市，工程技术岗位类别已公开。",
        url: "https://zz.jrzp.com/nView_CBBA790940CD038B.shtml",
      },
    ],
  },
  {
    id: "sugon",
    name: "中科曙光",
    short: "SUGON",
    industry: "上市公司 · 高端计算与装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 11:30",
    source: "中科曙光2027校招简章",
    website: "https://go.sugon.com/campus",
    status: "announcement",
    jobs: [
      {
        id: "sugon-structure",
        title: "高端工作站 · 结构工程师",
        location: "江苏 · 昆山 / 南京 / 浙江 · 杭州",
        areas: ["江苏全域", "杭州"],
        degree: "硕士 / 博士",
        direction: "研发设计",
        majors: "机械、自动化、硬件、电子、通信、物理等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "公告列出高端工作站结构工程师、散热工程师、硬件工程师和测试工程师等研发方向",
        ],
        requirements: [
          "面向2027年毕业的硕士、博士应届生",
          "机械、自动化、硬件、电子、通信、物理等相关专业",
          "具体岗位职责和实验室方向以中科曙光校招官网为准",
        ],
        note: "公告级信息：目标城市、岗位方向、学历和专业范围已公开。",
        url: "https://career.nankai.edu.cn/correcruit/content/id/116837.html",
      },
    ],
  },
  {
    id: "asml",
    name: "ASML",
    short: "ASML",
    industry: "外资制造 · 半导体装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 11:25",
    source: "ASML 2027校招公告",
    website: "https://www.asml.com/zh/careers",
    status: "announcement",
    jobs: [
      {
        id: "asml-install",
        title: "客户服务 / 装机工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "设备工程",
        majors: "机械、自动化、电子、材料、光学、物理、计算机等理工科专业",
        deadline: "校招申请开放",
        responsibilities: [
          "参与半导体光刻设备的客户服务、安装调试和现场技术支持",
        ],
        requirements: [
          "面向2027届本科及以上应届生",
          "机械、自动化、电子、材料、光学、物理、计算机等理工科背景",
          "具体岗位职责、英语及出差要求以ASML官方职位页为准",
        ],
        note: "公告级信息：合肥为企业公布的招聘城市，装机与客户服务工程师为当前校招方向。",
        url: "https://www.asml.com/zh/careers",
      },
    ],
  },
  {
    id: "lead",
    name: "先导智能",
    short: "LEAD",
    industry: "上市公司 · 锂电智能装备",
    batch: "2027届校园招聘",
    verified: "2026-08-30 01:15",
    source: "先导智能2027届秋招职位转载；企业中国官网",
    website: "https://www.leadintelligent.com/",
    jobs: [
      {
        id: "lead-mechanical-rd-suzhou-2027",
        title: "机械研发工程师",
        location: "江苏 · 苏州",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械类、自动化类等相关理工科专业",
        deadline: "官网投递开放（未公示截止日）",
        responsibilities: [
          "负责非标自动化组装及检测设备的设计与开发，包括结构方案、图纸绘制和工程图输出",
          "完成电机、气动元件及标准件选型，并编制相关技术文件",
          "整理BOM清单和技术资料，协助设备装配与调试",
          "参与产品设计评审，协同完成设计优化与迭代改进",
          "协助处理生产和试制过程中的技术问题并提供解决方案",
        ],
        requirements: [
          "本科及以上学历，机械类、自动化类等相关理工科专业",
          "掌握机械设计及自动化基础，了解常见传动、气动和电气控制原理",
          "熟练使用三维设计软件及二维工程制图软件，能够规范表达图纸",
          "具备沟通协调与团队协作能力，能适应多任务协作环境",
          "学习能力强、责任心强，具备抗压能力和问题解决能力",
          "英语六级及以上者优先",
        ],
        note: "原公告级精益工程师条目因字段不完整已移除。本岗位完整职责与要求来自当前2027届职位转载页，企业主体与官网入口已核验。",
        url: "https://www.shushuqiuzhi.com/article/242639",
      },
    ],
  },
  {
    id: "firstack",
    name: "飞仕得科技",
    short: "FIRSTACK",
    industry: "未上市大型企业 · 功率半导体检测装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 12:10",
    source: "飞仕得科技2027校招公告",
    website: "http://www.firstack.com/",
    jobs: [
      {
        id: "firstack-structure",
        title: "机械结构工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械工程、机电、自动化等相关专业",
        deadline: "截止 2026-11-23",
        responsibilities: [
          "负责半导体检测设备结构、非标自动化结构设计并跟进加工落地",
          "开展安规、散热和屏蔽结构设计，协同硬件优化产品性能",
          "输出研发文档，参与项目调试部署",
          "参与新材料、新结构的预研工作",
        ],
        requirements: [
          "2027届硕士及以上，机械、机电、自动化等相关专业",
          "熟练使用机械结构设计绘图软件",
          "学业基础扎实，自驱力强",
          "具备团队协作和抗压能力",
        ],
        url: "https://myjob.dlmu.edu.cn/campus/view/id/868480",
      },
    ],
  },
  {
    id: "uaes",
    name: "联合汽车电子",
    short: "UAES",
    industry: "未上市合资企业 · 汽车电子与电驱",
    batch: "2027届秋季校园招聘",
    verified: "2026-08-28 12:05",
    source: "联合汽车电子2027校招公告",
    website: "https://www.uaes.com/",
    status: "announcement",
    jobs: [
      {
        id: "uaes-smart",
        title: "智能制造 / 质量 / 项目管理方向",
        location: "江苏 · 无锡 / 苏州 / 太仓",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械、自动化、车辆、电子、工业工程等相关专业",
        deadline: "截止 2026-10-14",
        responsibilities: [
          "公告列出智能制造、质量管理、项目管理、产品研发和BMS硬件测试等校招方向",
          "覆盖发动机管理、变速箱控制、先进网联、电驱、热管理和智能传感器等业务",
        ],
        requirements: [
          "面向2027届本科及以上毕业生",
          "机械、自动化、车辆、电子和工业工程等相关专业",
          "具体岗位和技术要求以联合电子校招官网实时职位为准",
        ],
        note: "公告级信息：无锡、苏州、太仓为企业公布的生产基地或技术中心城市。",
        url: "https://www.wondercv.com/xiaozhao/uaes-2027-campus-recruitment-12526-1ace75/",
      },
    ],
  },
  {
    id: "boschbcsc",
    name: "博世中国创新与软件开发中心",
    short: "BCSC",
    industry: "未上市外资企业 · 汽车软件与智能装备",
    batch: "2027届校园招聘",
    verified: "2026-08-28 12:00",
    source: "博世中国BCSC 2027校招公告",
    website: "https://www.bosch.com.cn/careers/",
    status: "announcement",
    jobs: [
      {
        id: "boschbcsc-auto",
        title: "汽车软件 / 硬件 / 自动驾驶研发方向",
        location: "江苏 · 无锡",
        areas: ["江苏全域"],
        degree: "本科 / 硕士",
        direction: "自动化",
        majors: "机械、自动化、电子、电气、计算机等相关专业",
        deadline: "截止 2026-09-09",
        responsibilities: [
          "公告列出硬件工程师、底盘域软件、悬架软件、BMS软件、动力域控制和自动驾驶研发方向",
        ],
        requirements: [
          "面向2027届校园招聘候选人",
          "机械、自动化、电子、电气或计算机等相关背景",
          "各方向学历与技术栈要求以博世校招职位为准",
        ],
        note: "公告级信息：无锡为当前公开校招城市，具体职位JD由博世招聘系统维护。",
        url: "https://campus.niuqizp.com/schedulenew-Banking-wuxi-0/",
      },
    ],
  },
  {
    id: "neolix",
    name: "九识智能",
    short: "NEOLIX",
    industry: "未上市独角兽 · 无人配送与自动驾驶",
    batch: "2027届校园招聘",
    verified: "2026-08-28 11:55",
    source: "九识智能2027校招公开信息",
    website: "https://www.neolix.cn/",
    status: "announcement",
    jobs: [
      {
        id: "neolix-robotics",
        title: "机器人开发 / 机械设计 / 运动控制方向",
        location: "浙江 · 杭州 / 江苏 · 苏州",
        areas: ["杭州", "江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械、机器人、自动化、车辆、控制等相关专业",
        deadline: "校招通道开放",
        responsibilities: [
          "公告列出机器人开发、机械设计、运动控制和现场实施工程师等方向",
          "参与L4级自动驾驶城配物流场景的研发与产品落地",
        ],
        requirements: [
          "面向2027届本科及以上毕业生",
          "机械、机器人、自动化、车辆或控制等相关专业",
          "具体岗位职责和项目经历要求以企业招聘平台为准",
        ],
        note: "公告级信息：杭州和苏州为企业公布的校招研发城市。",
        url: "https://www.nowcoder.com/feed/main/detail/1d3d393509054eb7bb4c37d768bd83f2?urlSource=home-api",
      },
    ],
  },
  {
    id: "ziir",
    name: "浙江机器人及智能装备创新中心",
    short: "ZIIR",
    industry: "智能装备 · 工业机器人",
    batch: "2027届校园招聘",
    verified: "2026-08-29 09:20",
    source: "创新中心中国官网校园招聘",
    website: "https://www.ziir-robot.com/xiaoyuanzhaopin",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "ziir-mechanical-product",
        title: "机械研发工程师（机器人产品研发）",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械、机电一体化、自动化、机器人等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "参与智能装卸机器人、工业机器人及自动化标准产品机械结构设计开发",
          "负责机器人本体结构分析优化、加工装配工艺制定及测试改进",
          "完成三维建模、二维出图及设计评审",
          "参与有限元、动力学分析并撰写技术报告",
        ],
        requirements: [
          "硕士及以上学历，机械/机电一体化、自动化或机器人相关专业",
          "具备机械结构设计、三维建模和工程图纸能力",
          "有机器人、自动化装备或有限元分析经历者优先",
        ],
        url: "https://www.ziir-robot.com/xiaoyuanzhaopin",
      },
      {
        id: "ziir-mechanical-automation",
        title: "机械研发工程师（自动化项目）",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械、机电一体化、自动化、机器人等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "负责智能仓储、激光焊接和非标自动化装备项目方案设计与成本核算",
          "完成自动化装备主导设计、三维建模及设计输出",
          "跟踪装配调试问题直至项目验收，参与产品标准化和迭代升级",
        ],
        requirements: [
          "本科及以上学历，机械、机电一体化、自动化或机器人相关专业",
          "具备非标自动化方案设计和机械制图基础",
          "具备项目协作和现场问题分析能力",
        ],
        url: "https://www.ziir-robot.com/xiaoyuanzhaopin",
      },
    ],
  },
  {
    id: "giansun",
    name: "江顺精密科技集团",
    short: "GS",
    industry: "精密模具 · 铝加工装备",
    batch: "校园招聘",
    verified: "2026-08-29 09:25",
    source: "江顺精密中国官网人才招聘",
    website: "https://www.giansun.com/cn/giansun/contact/talent/",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "giansun-mechanical-design",
        title: "机械设计工程师",
        location: "江苏 · 江阴",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械设计、机电一体化类相关专业",
        deadline: "官网招聘开放",
        responsibilities: [
          "参与精密模具及铝加工装备的机械结构设计和技术改进",
          "结合产品需求完成零部件设计、工程图纸输出及设计变更",
          "配合工艺、制造和现场团队推进样机试制与问题闭环",
        ],
        requirements: [
          "机械设计、机电一体化类相关专业",
          "熟悉机械原理及机械加工工艺",
          "掌握 SolidWorks、UG、AutoCAD 等设计软件",
        ],
        url: "https://www.giansun.com/cn/giansun/contact/talent/",
      },
      {
        id: "giansun-mold-design",
        title: "模具设计工程师",
        location: "江苏 · 江阴",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械设计、模具设计类相关专业",
        deadline: "官网招聘开放",
        responsibilities: [
          "负责模具结构方案设计、三维建模和二维工程图输出",
          "跟进模具试制、验证及问题改善，协同生产优化加工方案",
        ],
        requirements: [
          "机械设计、模具设计类相关专业",
          "熟悉模具设计，具备独立设计模具能力",
          "掌握 SolidWorks、UG、AutoCAD 等软件",
        ],
        url: "https://www.giansun.com/cn/giansun/contact/talent/",
      },
    ],
  },
  {
    id: "jiexun",
    name: "安徽捷迅光电",
    short: "JX",
    industry: "机器视觉 · 智能分选装备",
    batch: "2027届校园招聘",
    verified: "2026-08-29 09:30",
    source: "捷迅光电中国官网校园招聘",
    website: "https://www.hfjiexun.com/job.php?id=17",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "jiexun-mechanical",
        title: "机械工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械设计制造及其自动化、机械电子等相关专业",
        deadline: "职位有效期以官网为准",
        responsibilities: [
          "参与AI质选设备及光电分选装备的机械结构研发设计",
          "完成机械方案、三维建模、工程图纸和样机验证",
          "协同电气、算法和制造团队完成设备调试与持续改进",
        ],
        requirements: [
          "面向27届应届毕业生，硕士及以上学历",
          "机械设计制造及其自动化、机械电子等相关专业",
          "具备机械结构设计和工程制图基础，有智能装备项目经历者优先",
        ],
        url: "https://www.hfjiexun.com/job.php?id=17",
      },
    ],
  },
  {
    id: "shining3d",
    name: "先临三维",
    short: "S3D",
    industry: "上市公司 · 三维视觉与智能制造",
    batch: "2027届校园招聘提前批",
    verified: "2026-08-29 10:05",
    source: "先临三维中国校招公告及官方网申",
    website: "https://shining3d.zhiye.com/campus",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "shining3d-mechanical",
        title: "机械结构设计工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科 / 硕士 / 博士",
        direction: "研发设计",
        majors: "机械、机械设计制造及其自动化、机电一体化等相关专业",
        deadline: "提前批申请开放",
        responsibilities: [
          "参与高精度三维扫描设备及3D打印系统的机械结构设计开发",
          "完成结构方案、三维建模、工程图纸输出及样机装配验证",
          "协同电子、算法、软件和制造团队推进产品测试、改进与定型",
        ],
        requirements: [
          "面向2026、2027届海内外应届毕业生",
          "机械、机械设计制造及其自动化、机电一体化等相关专业",
          "具备机械结构设计、工程制图和样机验证基础",
          "有三维视觉、精密仪器或智能制造项目经历者优先",
        ],
        note: "提前批目前开放杭州，申请入口为先临三维官方校招系统。",
        url: "https://shining3d.zhiye.com/campus",
      },
      {
        id: "shining3d-print-system",
        title: "3D打印系统工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科 / 硕士 / 博士",
        direction: "设备工程",
        majors: "机械、机电、自动化、材料等相关专业",
        deadline: "提前批申请开放",
        responsibilities: [
          "参与3D打印设备系统集成、机械模块设计和整机调试",
          "协同研发团队完成系统测试、问题定位和产品迭代",
        ],
        requirements: [
          "面向2026、2027届海内外应届毕业生",
          "机械、机电、自动化、材料等相关专业",
          "具备设备系统或精密机械项目实践经历者优先",
        ],
        note: "提前批目前开放杭州，具体职位状态以官方网申系统实时页面为准。",
        url: "https://shining3d.zhiye.com/campus",
      },
    ],
  },
  {
    id: "positec",
    name: "宝时得科技",
    short: "POS",
    industry: "大型企业 · 园林机器人与智能工具",
    batch: "2027届校园招聘",
    verified: "2026-08-29 19:05",
    source: "宝时得官方校园招聘职位页",
    website: "https://www.hotjob.cn/wt/Positec/web/index/campus",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "positec-robot-structure",
        title: "机器人结构设计工程师",
        location: "江苏 · 苏州",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械设计制造及其自动化、机械电子工程、机电一体化等相关专业",
        deadline: "官网投递开放（未公示截止日）",
        responsibilities: [
          "参与割草机器人整机结构开发，与整机、电控、软件团队协同完成产品需求分析及结构方案设计",
          "负责底盘、行走系统、切割机构、外壳等核心零部件的三维建模和二维工程图输出，编制 BOM、装配图等技术文件",
          "参与结构方案评审、样机试制、装配调试及可靠性验证，持续优化结构强度、防水防尘、装配工艺及产品可靠性",
          "基于用户场景和竞品分析，围绕沿边切割、爬坡通过性、防卡草、轻量化等关键体验开展结构创新与方案优化",
          "跟进试制及量产阶段的结构问题分析和闭环改善，优化注塑件、钣金件、传动机构设计，提升质量、可靠性和成本竞争力",
          "全程参与割草机器人从概念设计、详细设计、样机验证、试产到量产导入的研发阶段，推动产品持续迭代",
        ],
        requirements: [
          "2027届硕士及以上学历，机械设计制造及其自动化、机械电子工程、机电一体化等相关专业",
          "熟练使用 Creo/ProE、AutoCAD，具备三维建模和工程图设计能力；了解机械设计基础、公差设计及常用材料加工工艺",
          "机械结构设计基础扎实，具备工程分析与动手实践能力；有机械设计、机器人、移动底盘课程设计、科研项目或竞赛经历者优先",
          "责任心强，沟通协作良好，能够参与样机装配、调试及户外测试",
          "英语 CET-6 及以上，能够阅读英文技术资料及行业标准",
          "加分项：机器人、AGV、服务机器人、园林设备或智能装备课题/实习经历；熟悉注塑、钣金、齿轮传动、防水密封；了解 Ansys 或 SolidWorks Simulation",
        ],
        url: "https://www.hotjob.cn/wt/Positec/web/index/webPositionN300!getOnePosition?brandCode=1&columnId=1&importPost=0&lanType=1&postIdEnc=00df7045a727aff6&recruitType=1",
      },
      {
        id: "positec-structure-trainee",
        title: "结构管培生",
        location: "江苏 · 苏州",
        areas: ["江苏全域"],
        degree: "硕士",
        direction: "研发设计",
        majors: "机械设计相关专业",
        deadline: "官网投递开放（未公示截止日）",
        responsibilities: [
          "参与用户需求收集与分析，协助整合产品包需求，理解并挖掘产品核心功能与使用场景",
          "参与产品图纸设计及技术文件编制维护，配合设计评审和样机验证，确保结构功能、性能、可靠性与可制造性",
          "运用头脑风暴、TRIZ 创新方法和用户体验分析等工具，提出创新结构方案与设计改进思路",
          "协助推动现有产品品质提升与成本优化，持续改进结构设计并提升产品竞争力",
          "学习并参与整机项目从概念设计到量产的全流程验证与优化",
        ],
        requirements: [
          "2027届毕业生，硕士学历，机械设计相关专业",
          "英语六级，能够借助工具阅读英文文献资料并处理英文邮件",
          "具备三维绘图软件基础，能够进行基本的绘图设计",
          "熟悉机械设计手册相关内容",
          "具备良好的沟通能力和结构化思维能力",
        ],
        url: "https://www.hotjob.cn/wt/Positec/mobweb/v8/position/subscriptionPositionList",
      },
    ],
  },
  {
    id: "haier",
    name: "海尔集团",
    short: "HAIER",
    industry: "大型企业 · 智能制造与家电装备",
    batch: "2027届校园招聘",
    verified: "2026-08-29 14:10",
    source: "海尔中国校园招聘官网",
    website: "https://maker.haier.net/client/campus/customizedptjobdetail/sid/35/rid/465",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "haier-structure",
        title: "结构工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械设计制造及其自动化、工业设计、机电一体化等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "进行三维结构设计与建模，完成工程图纸绘制",
          "参与样品制作，从结构强度、散热和电磁屏蔽等方面测试并优化设计",
          "协同其他系统完成结构兼容性设计，编写设计说明书和测试报告",
          "参与专利申请相关技术文件编写",
        ],
        requirements: [
          "2027届应届毕业生，硕士及以上学历",
          "机械设计制造及其自动化、工业设计、机电一体化等相关专业",
          "熟悉机械制图、机械原理、材料力学",
          "熟练使用 SolidWorks、AutoCAD，了解钣金加工和表面处理工艺",
          "具备创新思维和问题解决能力",
        ],
        url: "https://maker.haier.net/client/campus/customizedptjobdetail/sid/35/rid/465",
      },
    ],
  },
  {
    id: "suzhou-keda",
    name: "苏州科达",
    short: "KEDACOM",
    industry: "上市公司 · 智能视讯与结构研发",
    batch: "2027届校园招聘",
    verified: "2026-08-29 23:52",
    source: "苏州科达2027校园招聘职位页",
    website: "https://www.kedacom.com/cn/xyjob.jhtml",
    sourceOrigin: "企业官网发布",
    jobs: [
      {
        id: "suzhou-keda-structure",
        title: "结构开发工程师",
        location: "江苏 · 苏州",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "控制科学与工程、机械工程、材料与化工等相关专业",
        deadline: "官网投递开放（未公示截止日）",
        responsibilities: [
          "参与新产品的机械结构设计、开发和优化，负责零部件细化设计、图纸绘制和技术文件编制",
          "配合新产品试制、调试、组装和测试，分析并解决样机、试制、试产或量产阶段出现的结构技术问题",
          "参与产品设计评审，根据测试结果或生产反馈持续改进产品结构并推进降本增效",
          "负责编写、归档和维护设计规范、工艺文件及专利文档",
          "与采购、生产和质量部门协作提供技术支持；与供应商进行技术沟通并参与试模、跟模",
        ],
        requirements: [
          "硕士及以上学历，机械设计制造及其自动化、机械工程、车辆工程、工程力学、材料成型及控制工程等相关专业",
          "熟练掌握Creo、SolidWorks、UG等至少一种主流三维设计软件，以及AutoCAD等二维制图软件",
          "具备扎实的机械原理、理论力学、材料力学和机械制图基础，了解机加工、钣金、冲压、注塑等材料性能和加工工艺",
          "优选条件：熟练使用Creo",
          "优选条件：有机械设计竞赛、科研项目、结构设计实习或实际产品开发全流程经历",
          "优选条件：了解钣金、塑胶、压铸产品设计、成型工艺、材料特性及表面处理工艺",
        ],
        note: "职责、任职资格和优选条件均来自苏州科达官方招聘系统当前职位页，已逐项完整录入。",
        url: "https://kedacom.zhiye.com/zpdetail/511187506?d=30",
      },
    ],
  },
  {
    id: "rigol",
    name: "普源精电",
    short: "RIGOL",
    industry: "上市公司 · 测试测量仪器",
    batch: "2027届校园招聘",
    verified: "2026-08-29 14:20",
    source: "普源精电2027校园招聘职位页",
    website: "https://www.rigol.com/",
    jobs: [
      {
        id: "rigol-mechanical",
        title: "机械结构工程师",
        location: "江苏 · 苏州",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械设计制造及其自动化、机械工程、材料、机电一体化等相关专业",
        deadline: "校招申请开放",
        responsibilities: [
          "参与仪器仪表及微波部件产品结构方案设计、仿真、试制装配和功能调试",
          "依据设计流程完善技术文档、工程图纸标注和BOM",
          "协助现有产品维护，分析并解决产品开发过程中的结构问题",
        ],
        requirements: [
          "本科及以上学历，机械设计制造及其自动化、机械工程、材料或机电一体化等专业",
          "了解机械原理和塑胶、金属材料成型工艺",
          "熟练使用 AutoCAD、SolidWorks 等建模软件",
          "有热仿真、电磁仿真或机械创新/机器人竞赛经历者优先",
        ],
        url: "https://www.shushuqiuzhi.com/position/368653",
      },
    ],
  },
  {
    id: "syntegon",
    name: "星德科包装技术",
    short: "SYN",
    industry: "外企 · 制药与食品包装装备",
    batch: "2027届校园招聘",
    verified: "2026-08-29 19:35",
    source: "国家大学生就业服务平台岗位详情；星德科中国官网",
    website: "https://www.syntegon.com.cn/contact",
    jobs: [
      {
        id: "syntegon-mechanical-2027",
        title: "机械工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械及相关专业",
        deadline: "招聘平台投递开放（未公示截止日）",
        responsibilities: [
          "负责工艺流程图设计，包括准备技术文件、物料选型、绘图、安装和调试",
          "参与制药设备从海外工厂向国内转移以及设备本土化工作",
          "负责设备布局方案设计，包括设备上下游管道设计与布局",
          "负责压力容器等设备的系统集成",
          "为本地制造和降低成本提供机械技术支持",
          "执行岗位安排的其他交付任务",
        ],
        requirements: [
          "本科及以上学历，机械等相关专业",
          "具备良好的英语口语和书面表达能力，英语六级及以上优先",
          "熟悉 SolidWorks、AutoCAD 和 Microsoft Office",
          "具备良好的沟通表达能力、工作灵活性和问题解决能力",
          "自我驱动力强，具有创新思维",
          "组织协调能力较强，关注细节并具备团队合作精神",
          "责任心强、工作积极主动，能够合理安排时间",
        ],
        note: "完整字段来自国家大学生就业服务平台当前职位页；企业中国官网用于核验在华主体。该职位并非企业中国官网直接发布，已明确标记为第三方平台来源。",
        url: "https://job.ncss.cn/student/jobs/21aAUn7ZQxg7gA1VdKesdc/detail.html",
      },
    ],
  },
  {
    id: "wika",
    name: "威卡自动化仪表",
    short: "WIKA",
    industry: "外企 · 工业测量与智能传感",
    batch: "2027届校园招聘",
    verified: "2026-08-29 20:10",
    source: "威卡2027校招公告转载；威卡中文招聘官网与官方校招系统",
    website: "https://jobs.wika.com/zh/career_portal.WIKA",
    jobs: [
      {
        id: "wika-mechanical-design-assistant",
        title: "机械设计助理工程师",
        location: "江苏 · 苏州",
        areas: ["江苏全域"],
        degree: "本科 / 硕士 / 博士",
        direction: "研发设计",
        majors: "机械类、仪器类、自动化等相关专业",
        deadline: "截止 2027-06-30（招满可能提前关闭）",
        responsibilities: [
          "负责工业自动化仪表的机械结构设计",
          "完成产品三维建模和工程图纸输出",
          "负责产品工程变更管理",
          "协同相关团队推进零部件国产化",
          "协同推进研发项目落地",
        ],
        requirements: [
          "面向2027届全日制本科、硕士、博士应届毕业生",
          "机械类、仪器类、自动化等相关专业",
          "熟练使用 CAD、Creo 等设计软件",
          "具备扎实的机械专业基础",
          "主动好学，善于团队协作",
          "能够无障碍阅读英文技术资料",
        ],
        note: "完整职责与要求来自当前校招公告转载；企业主体、苏州基地及招聘入口由威卡中文招聘官网核验。该岗位详情不是威卡中文官网直接呈现，因此标记为第三方平台来源。",
        url: "https://www.wondercv.com/xiaozhao/wika-suzhou-2027-graduate-recruitment-12744-8e5b36/",
      },
    ],
  },
  {
    id: "dahua",
    name: "大华股份",
    short: "DAHUA",
    industry: "上市公司 · 智慧物联与智能硬件",
    batch: "2027届校园招聘",
    verified: "2026-08-29 21:20",
    source: "大华2027校招岗位转载；大华股份招聘官网",
    website: "https://job.dahuatech.com/",
    jobs: [
      {
        id: "dahua-structure-2027",
        title: "研发中心 · 结构工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械及相关专业",
        deadline: "招满即止",
        responsibilities: [
          "负责产品结构设计以及打样、开模工作的进度跟踪，保证设计顺利实现产品化",
          "开展样机试制和装配验证，制定结构测试方案并协助完成测试与认证",
          "分析并定位试制和生产阶段出现的结构问题，提出解决方案；协同品管完成结构件来料异常分析与处理",
        ],
        requirements: [
          "本科及以上学历，机械相关专业",
          "熟练使用 Pro/E（Creo）、AutoCAD 等设计软件",
          "熟练掌握机械设计基础理论，了解注塑件、压铸件、钣金件的设计要点、材料选型、制造工艺及模具基础知识",
          "具备良好的沟通表达、动手实践和分析能力",
          "具备创新思维与问题解决能力",
        ],
        note: "完整职责与要求来自当前岗位转载页；2027校招批次和官方投递入口由大华招聘官网及校招公告交叉核验。岗位详情并非大华官网直接展示，已标记为第三方来源。",
        url: "https://watchjobs.net/zh/explore/job/c498-e3489a1d-0163-46ac-bb10-df6aad6faa40/%E7%A0%94%E5%8F%91%E4%B8%AD%E5%BF%83-2027%E5%B1%8A%E7%BB%93%E6%9E%84%E5%B7%A5%E7%A8%8B%E5%B8%88-J24502-%E5%A4%A7%E5%8D%8E%E8%82%A1%E4%BB%BD",
      },
    ],
  },
  {
    id: "babycare",
    name: "Babycare",
    short: "BC",
    industry: "大型企业 · 消费产品与结构研发",
    batch: "2027届校园招聘",
    verified: "2026-08-29 22:05",
    source: "Babycare 2027校招官方页面；岗位详情转载",
    website: "https://babycare.zhiye.com/",
    jobs: [
      {
        id: "babycare-structure-trainee-2027",
        title: "结构工程管培生",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械工程、电气工程等专业优先",
        deadline: "官网投递开放（未公示截止日）",
        responsibilities: [
          "开展产品技术企划：洞察用户需求，持续跟进市场产品技术动态，协助输出技术企划路线图，保障技术创新和产品力",
          "开展产品结构设计：根据产品或项目需求协助输出产品实现方案，制定技术开发计划并完成产品测试，保障技术实现与成本控制",
          "提供技术支持及改进：针对已有产品协助开展技术改进和体验升级，并推动方案落地",
        ],
        requirements: [
          "本科及以上学历，机械工程、电气工程专业优先",
          "具备较强的机械实操能力、沟通表达能力和创新思维",
          "具备应变能力与抗压能力，乐观、自信、有责任心",
          "熟练使用 Office 等办公软件",
        ],
        note: "岗位职责与要求来自当前职位转载页；2027届范围、网申启动时间和官方投递入口由Babycare官方校招页面交叉核验。岗位详情已标记为第三方来源。",
        url: "https://www.shushuqiuzhi.com/position/462000",
      },
    ],
  },
  {
    id: "joyson",
    name: "均胜电子",
    short: "JOYSON",
    industry: "上市公司 · 汽车智能与具身机器人",
    batch: "2027届秋季校园招聘",
    verified: "2026-08-29 22:10",
    source: "均胜27届秋招岗位转载；均胜电子中国官网",
    website: "https://www.joyson.com/index.php/join/",
    jobs: [
      {
        id: "joyson-agentic-robotics-2027",
        title: "Agentic Robotics 研究员",
        location: "浙江 · 宁波",
        areas: ["宁波"],
        degree: "硕士及以上",
        direction: "自动化",
        majors: "计算机、人工智能、自动化、机器人工程、认知科学等相关专业",
        deadline: "截止 2026-10-23",
        responsibilities: [
          "负责面向具身智能的 Agentic Robotics 研究与开发，构建机器人智能体系统",
          "研究情景记忆、语义记忆、技能记忆和环境记忆等长期记忆机制",
          "探索机器人智能体自我进化能力，形成“执行—反馈—反思—学习—再执行”闭环",
          "开展任务规划、技能调用、工具使用、异常检测和自主恢复等技术方向研究",
        ],
        requirements: [
          "面向2027届毕业生，硕士及以上学历",
          "计算机、人工智能、自动化、机器人工程、认知科学等相关专业",
          "具备扎实的编程能力，能够使用 Python、PyTorch 等工具",
          "具备具身智能、机器人智能体、任务规划或相关方向研究经验",
          "能够将研究方法转化为机器人系统中的工程实现",
        ],
        note: "同一招聘页面包含4个社招岗位，本站仅收录明确标注“27届校招”的Agentic Robotics研究员，其他社招岗位未录入。完整信息来自岗位转载页，企业主体与校园招聘入口由均胜中国官网核验。",
        url: "https://www.wondercv.com/xiaozhao/joyson-2027-fall-embodied-intelligence-campus-13005-d135ec/",
      },
    ],
  },
  {
    id: "picea",
    name: "杉川机器人",
    short: "PICEA",
    industry: "大型企业 · 移动机器人与智能清洁",
    batch: "2027届校园招聘",
    verified: "2026-08-30 00:35",
    source: "杉川机器人2027岗位转载；杉川官方校园招聘入口",
    website: "https://www.piceacorp.com/join-us",
    jobs: [
      {
        id: "picea-robot-structure-2027",
        title: "机器人结构工程师",
        location: "江苏 · 苏州 / 广东 · 深圳",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械设计制造及其自动化、机械工程、机电一体化、车辆工程、工程力学等",
        deadline: "截止 2026-11-30",
        responsibilities: [
          "参与机器人整机结构方案评审和ID可行性评估，完成整机堆叠布局及内外饰结构详细设计",
          "使用Creo完成整机三维建模、零件和装配工程图输出、BOM编制、尺寸链与公差校核，输出全套设计文档",
          "跟进手板制作、样机装配和可靠性测试，分析异响、间隙、装配干涉及耐久失效问题并迭代验证",
          "对接模具、注塑和钣金供应商，参与DFM评审及试模跟进，处理开模和量产阶段结构不良问题",
          "协同硬件、电控、工艺和测试团队完成整机联调，支撑新品从概念、手板、试产到量产落地",
          "沉淀结构标准化设计规范和通用件库，参与专利挖掘、技术文档归档以及量产阶段结构异常整改",
        ],
        requirements: [
          "2027届应届毕业生，本科及以上学历，机械设计制造及其自动化、机械工程、机电一体化、车辆工程、工程力学等相关专业",
          "熟练使用Creo或SolidWorks进行三维建模，使用AutoCAD输出二维图纸；掌握国标机械制图、公差配合和形位公差规范",
          "掌握理论力学、材料力学和机械设计基础，熟悉塑胶、钣金、硅胶、压铸等材料及成型工艺",
          "具备DFM面向制造设计思维，了解模具、注塑和装配流程；有课程设计、毕业设计或结构实习项目者优先",
          "动手能力强，愿意参与样机拆装和调试测试，具备问题拆解、分析和闭环能力",
          "具备跨部门沟通协作和逻辑表达能力，学习意愿强，能接受研发项目阶段性加班",
          "加分项：扫地机、小家电或3C整机结构经历；会Ansys/Simscale仿真；具备机构设计、机械竞赛或专利经历",
        ],
        note: "岗位职责和要求来自当前2027职位转载页；企业校园招聘入口和企业主体由杉川官网核验，网站标记为第三方来源。",
        url: "https://www.shushuqiuzhi.com/position/449317",
      },
      {
        id: "picea-compressor-structure-2027",
        title: "结构工程师（压缩机）",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械、能源与动力工程、压缩机和制冷等相关专业",
        deadline: "截止 2026-11-30",
        responsibilities: [
          "围绕压缩机结构创新提出提升能效、降低成本、降低噪声和提高可靠性的方案",
          "完成结构设计出图、打样、装机、测试、数据分析和实验报告撰写",
          "开展相关专利撰写工作",
        ],
        requirements: [
          "2027届应届毕业生，本科及以上学历，机械相关专业；能源与动力工程、压缩机和制冷专业优先",
          "创新意识强，勤奋好学",
          "善于沟通协作",
        ],
        note: "企业当前岗位公开内容较精炼，本站已完整收录全部职责和要求，没有自行扩写。",
        url: "https://www.nowcoder.com/jobs/detail/462660",
      },
      {
        id: "picea-noise-phd-2027",
        title: "噪声工程师（博士）",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "博士及以上",
        direction: "仿真分析",
        majors: "声学、力学、机械工程、车辆工程等振动与噪声方向",
        deadline: "截止 2026-12-31",
        responsibilities: [
          "研发压缩机减振降噪创新技术，并推动技术在压缩机产品中落地应用",
          "开展压缩机及空调产品噪声与振动测试分析、模态仿真和试验模态分析、声学仿真分析",
        ],
        requirements: [
          "博士及以上学历，声学、力学、机械工程、车辆工程等振动与噪声方向，具备扎实的振动噪声理论基础",
          "熟练使用Ansys、Abaqus、HyperWorks、COMSOL或同类有限元软件，能够独立完成结构模态仿真与优化",
          "熟练使用Simcenter Testlab、B&K或同类噪声振动测试软件，能够独立完成噪声、振动和模态试验及分析",
          "性格开朗、积极主动，具备团队协作能力",
        ],
        url: "https://www.nowcoder.com/jobs/detail/462420",
      },
    ],
  },
  {
    id: "ikingtec",
    name: "云圣智能",
    short: "IKING",
    industry: "大型企业 · 工业无人机与低空智能体",
    batch: "2027届秋季校园招聘",
    verified: "2026-08-29 23:10",
    source: "云圣智能2027岗位转载；云圣官方校招系统",
    website: "https://ikingtec.zhiye.com/campus/jobs",
    jobs: [
      {
        id: "ikingtec-structure-2027",
        title: "结构工程师",
        location: "江苏 · 苏州 / 天津",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "机械工程、航空航天工程、材料科学与工程、机电一体化等相关专业",
        deadline: "官网投递开放（未公示截止日）",
        responsibilities: [
          "参与多旋翼无人机、机库和各类吊舱产品结构设计，覆盖机身、机架和动力系统安装结构，从概念设计跟进至详细设计",
          "开展结构强度、刚度和模态仿真分析，验证并优化设计方案，解决结构力学问题并提升可靠性",
          "协同硬件、软件团队完成结构与电子元件、控制系统的集成设计，保障系统兼容与整机性能",
          "参与原型机制作和测试，根据反馈迭代结构设计，记录设计变更并形成完整设计文档",
          "跟踪行业结构设计前沿技术，收集技术资料，为产品研发提供参考与创新思路",
        ],
        requirements: [
          "2027届应届毕业生，硕士及以上学历；机械工程、航空航天工程、材料科学与工程、机电一体化等相关专业优先",
          "掌握机械设计原理、材料力学和结构力学，了解多旋翼无人机基本结构与工作原理",
          "熟练使用SolidWorks、Creo等至少一种三维建模软件；具备Ansys、Abaqus等有限元软件经验者优先",
          "逻辑思维、创新和问题解决能力良好，工作认真负责，具备团队合作与沟通能力",
          "对无人机行业有浓厚兴趣；有相关科研项目、竞赛或实习经历者优先",
        ],
        note: "完整职责与要求来自当前27届秋招岗位转载页；2027届范围和官方投递入口由云圣官方校招系统核验，网站标记为第三方来源。",
        url: "https://www.shushuqiuzhi.com/position/459579",
      },
    ],
  },
  {
    id: "hfpress",
    name: "合锻智能",
    short: "HFP",
    industry: "上市公司 · 高端成形机床与智能装备",
    batch: "2027届校园招聘",
    verified: "2026-08-29 23:40",
    source: "合锻智能2027届校招简章；企业中国官网",
    website: "http://www.hfpress.com/",
    jobs: [
      {
        id: "hfpress-mechanical-rd-2027",
        title: "机械研发工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械设计、机械工程类相关专业",
        deadline: "校招申请开放（未公示截止日）",
        responsibilities: [
          "从事机械压力机、液压机系统及自动化系统的设计与研发",
          "开展机构动力学分析和结构优化",
          "参与研发项目管理",
        ],
        requirements: [
          "211及以上院校本科及以上学历",
          "机械设计、机械工程类相关专业",
          "专业知识扎实、基础技能熟练",
          "熟练使用相关办公软件以及机械设计、制图软件",
        ],
        note: "企业公开简章的岗位职责和要求较精炼，本站已逐项完整录入，没有额外扩写。投递邮箱及联系方式以企业最新公告为准。",
        url: "https://m.yingjiesheng.com/xuanjianghui/xjh_6229796",
      },
      {
        id: "hfpress-process-rd-2027",
        title: "工艺研发工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "本科及以上",
        direction: "制造工程",
        majors: "机械、材料类相关专业",
        deadline: "校招申请开放（未公示截止日）",
        responsibilities: [
          "开展机械压力机、液压机及自动化设备的加工工艺设计",
          "编写工艺技术文件",
          "依据机械产品工艺技术和标准推进工艺实施",
        ],
        requirements: [
          "第一批次院校本科及以上学历",
          "机械、材料类相关专业",
          "专业知识扎实、基础技能熟练",
          "熟练使用相关办公软件以及设计、制图软件",
        ],
        note: "企业公开简章的岗位职责和要求较精炼，本站已逐项完整录入，没有额外扩写。",
        url: "https://m.yingjiesheng.com/xuanjianghui/xjh_6229796",
      },
    ],
  },
  {
    id: "xynova",
    name: "曦诺未来",
    short: "XYNOVA",
    industry: "独角兽 · 人形机器人灵巧手与关节模组",
    batch: "2027届校园招聘",
    verified: "2026-08-30 00:05",
    source: "曦诺未来2027校招公告；企业中国官网",
    website: "https://www.xynova.com.cn/join-us",
    jobs: [
      {
        id: "xynova-mechanical-2027",
        title: "机械工程师（机器人关节/灵巧手）",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "机械设计制造及其自动化、机械工程、智能制造等机械相关专业",
        deadline: "截止 2027-06-30",
        responsibilities: [
          "参与机器人关节、电缸及关节模组产品的结构方案设计与开发，配合实现精度、体积、推力和寿命指标并推动方案迭代",
          "协助机械传动方案设计，完成电机、制动器、编码器、减速器等核心零部件的选型、适配与验证",
          "协助完成结构强度校核和尺寸链计算，验证结构设计的合理性、可加工性与可装配性",
          "编制、整理并归档零部件三维图、二维工程图及生产配套技术文件，保证图纸规范、准确、统一",
          "参与样机试制、组装和调试，跟进试制过程并协助处理小批量试产中的技术问题，推进量产落地",
          "配合跨部门团队开展技术对接、需求沟通和项目推进，及时闭环基础设计问题",
        ],
        requirements: [
          "2027届应届毕业生，本科及以上学历，机械设计制造及其自动化、机械工程、智能制造等机械相关专业",
          "掌握机械原理和机械设计基础，熟悉机械加工工艺、金属材料及表面处理；了解RV、谐波或行星减速器者优先",
          "熟练使用至少一种主流三维设计软件，能够独立完成结构建模、零部件建模和二维工程图绘制，并熟练使用CAD",
          "具备图纸识读、尺寸校核和结构分析能力，严谨细致，拥有良好的工程思维和问题排查意识",
          "具备团队协作、沟通和执行能力，学习能力强，愿意深耕精密机械与机器人结构领域",
          "态度踏实认真，责任心和抗压能力较强，愿意接受应届生培养节奏",
        ],
        note: "职责与要求逐条来自2027校招公告；企业主体和在招岗位入口由曦诺未来中国官网交叉核验。",
        url: "https://career.cuhk.edu.cn/job/view/id/469132",
      },
      {
        id: "xynova-cae-2027",
        title: "CAE仿真工程师",
        location: "浙江 · 杭州",
        areas: ["杭州"],
        degree: "硕士及以上",
        direction: "仿真分析",
        majors: "机械工程、工程力学、材料科学与工程、流体力学等相关专业",
        deadline: "截止 2027-06-30",
        responsibilities: [
          "协助开展机器人灵巧手、关节模组的强度、刚度、模态和耐久有限元仿真，完成结构性能校核",
          "开展灵巧手及关节模组运动学、动力学仿真，分析运动与受力特性，为结构优化和运动方案设计提供数据",
          "根据运行工况开展控制器、结构零部件等核心部件的热仿真，评估散热性能和工况适配性",
          "整理和分析仿真数据，规范编写CAE报告，输出结论、风险及优化建议",
          "参与关键零部件结构可靠性风险评估，复盘测试及试运行中的强度、刚度与稳定性问题，协助迭代结构方案",
        ],
        requirements: [
          "2027届应届毕业生，硕士及以上学历，机械工程、工程力学、材料科学与工程、流体力学等相关专业",
          "掌握至少一种主流CAE仿真软件，熟悉强度和耐久分析流程；有机器人结构或运动学/动力学仿真经验者优先",
          "掌握材料力学、弹性力学、热力学和有限元基础，了解建模、网格划分及工况加载流程",
          "具备数据分析和逻辑思维能力，能够梳理仿真数据并排查基础仿真问题",
          "学习和钻研能力强，责任心良好，具备团队协作与沟通能力，愿意深耕仿真分析领域",
        ],
        note: "职责与要求逐条来自2027校招公告；企业主体和在招岗位入口由曦诺未来中国官网交叉核验。",
        url: "https://career.cuhk.edu.cn/job/view/id/469132",
      },
    ],
  },
  {
    id: "lexy",
    name: "莱克电气",
    short: "LEXY",
    industry: "上市公司 · 高速电机与智能家电",
    batch: "2027届校园招聘",
    verified: "2026-08-30 00:20",
    source: "莱克电气2027岗位转载；莱克中国官网人才招聘",
    website: "https://www.lexy.cn/rczp",
    jobs: [
      {
        id: "lexy-motor-development-2027",
        title: "电机开发工程师助理",
        location: "江苏 · 苏州",
        areas: ["江苏全域"],
        degree: "本科及以上",
        direction: "研发设计",
        majors: "电气工程、自动化、机械设计制造等相关专业",
        deadline: "截止 2027-07-01",
        responsibilities: [
          "负责吸尘器、吹风机等产品的高速驱动电机整体开发，包括电磁方案核算、结构参数设计及整机性能匹配",
          "解决电机样机调试、性能测试和量产阶段的效率、温升、噪声振动及耐久失效问题",
          "协同电控工程师完成电机控制参数匹配和控制算法调试，优化不同负载下的运行状态",
          "负责定子、转子、磁钢和轴承等关键零部件选型，制定质量标准并推进品质管控与成本优化",
          "开展耐久、高低温和模拟工况等可靠性测试，分析异常数据、输出整改方案并固化标准化电机方案",
          "调研国内外电机前沿技术和竞品方案，完成技术消化创新并落地适配家电产品的电机解决方案",
        ],
        requirements: [
          "2027届统招应届本科及以上学历，电气工程、自动化、机械设计制造等相关专业",
          "掌握电机原理、电磁场理论、电力电子、自动控制和单片机等专业知识",
          "能够使用Matlab仿真、PLC编程和AutoCAD绘图工具完成参数计算与方案迭代",
          "具备数据研判和故障排查能力，愿意深耕电机技术并具备良好抗压能力",
          "严谨负责、项目推进高效，具备跨部门协同意识",
        ],
        note: "岗位职责、要求、届别和投递时间来自当前校招职位页；企业主体和招聘入口由莱克中国官网核验，网站标记为第三方来源。",
        url: "https://www.nowcoder.com/jobs/detail/462931",
      },
    ],
  },
  {
    id: "itek",
    name: "埃科光电",
    short: "I-TEK",
    industry: "上市公司 · 工业机器视觉与光机电系统",
    batch: "2027届校园招聘",
    verified: "2026-08-30 00:45",
    source: "埃科光电2027岗位转载；埃科官方校招系统",
    website: "http://career.i-tek.cn/",
    jobs: [
      {
        id: "itek-optical-system-2027",
        title: "光学系统工程师",
        location: "安徽 · 合肥",
        areas: ["合肥"],
        degree: "硕士及以上",
        direction: "研发设计",
        majors: "光学、精密仪器等相关专业",
        deadline: "截止 2027-03-31",
        responsibilities: [
          "负责二维和三维成像光学系统开发以及成像系统指标分解",
          "负责成像系统装调与测试方案开发",
          "负责成像系统需求开发及建模",
          "参与光学与光电系统集成调试",
          "负责成像系统光机械结构设计，并配合结构设计人员完成细化",
        ],
        requirements: [
          "硕士及以上学历，光学、精密仪器等相关专业",
          "硕士期间发表过一区共同一作或第一作者文章，或拥有三篇及以上专利者优先",
          "熟悉光学原理，具备几何光学和物理光学基础，熟练使用常用光学设计与照明设计软件",
          "具备应用及几何光学设计经历；有三维扫描成像、精密镜头设计和装调经验者优先",
          "具备良好的学习、逻辑思维、沟通协调和抗压能力",
          "具备团队合作精神和创新精神",
          "务实、严谨、肯钻研",
        ],
        note: "岗位职责、要求和投递时间来自当前校招职位页；企业主体与官方网申入口由埃科光电校招官网交叉核验，网站标记为第三方来源。",
        url: "https://www.nowcoder.com/jobs/detail/457619",
      },
    ],
  },
  {
    id: "mettler-toledo",
    name: "梅特勒托利多",
    short: "MT",
    industry: "外企 · 精密仪器与工业称重",
    batch: "2027届校园招聘",
    verified: "2026-08-30 01:00",
    source: "梅特勒托利多2027岗位转载；梅特勒托利多中国招聘官网",
    website: "https://jobs.mt.com.cn/",
    jobs: [
      {
        id: "mettler-product-support-2027",
        title: "产品支持工程师",
        location: "江苏 · 常州",
        areas: ["江苏全域"],
        degree: "硕士及以上",
        direction: "设备工程",
        majors: "机械制造及其自动化、机械电子工程、机械工程、工业设计工程等",
        deadline: "官网投递开放（未公示截止日）",
        responsibilities: [
          "学习行业现有技术和产品应用价值，并根据所学知识改进、完善现有技术",
          "学习行业前沿技术及发展趋势，将技术与客户需求结合并提供创新解决方案",
          "开展售前技术调研、场景化方案策划、技术参数讨论和方案制作，搭建产品与客户之间的技术桥梁",
          "根据客户需求搭建产品应用测试环境、制定验证方式，并总结技术要点与客户价值",
          "分析、处理客户技术问题，总结经验并优化流程，引入智能工具提升支持效率、降低成本",
          "收集市场应用反馈、客户需求和技术趋势，整合产品优化建议并推动研发团队升级产品功能",
          "协同市场团队推进新产品上市、技术推广、行业交流和客户培训，输出产品技术宣讲",
          "复盘产品技术支持数据、梳理应用案例，持续优化技术支持流程，并与全球支持和培训团队协作",
          "制作技术文档、手册、公告、销售工具、培训材料、应用案例、检查清单、故障排除指南及产品应用视频",
        ],
        requirements: [
          "硕士及以上学历，机械制造及其自动化、机械电子工程、机械工程、工业设计工程等相关专业",
          "思维清晰、学习速度快，具备冷静解决问题的能力",
          "具备良好的沟通、组织和团队合作能力，能够与国际团队协作",
          "积极主动、诚实可靠",
          "熟练使用Word、Excel、PowerPoint、Outlook、Project等Microsoft办公软件",
          "有AutoCAD、SolidWorks、Creo、Inventor等制图经验者优先",
          "具备良好的英语听说读写能力",
          "必要时能够出差",
        ],
        note: "岗位为2027届校园招聘全职岗位，包含入职前集中学习安排，但不是生产技能岗。职责与要求来自当前职位页，企业主体由梅特勒托利多中国招聘官网核验。",
        url: "https://www.shushuqiuzhi.com/position/326421",
      },
    ],
  },
]; 

const areas = ["全部地区", "合肥", "江苏全域", "杭州", "宁波"];
const directions = [
  "全部方向",
  "研发设计",
  "车辆研发",
  "仿真分析",
  "自动化",
  "制造工程",
  "设备工程",
  "质量测试",
];
const companyTypes = ["全部企业", "央国企", "外企", "上市公司", "大型公司"];
const informationLevels = [
  "全部信息",
  "完整官方JD",
  "已核验岗位",
  "公告级待补全",
];
const currentCompanyCategories: Record<string, string> = {
  caterpillar: "外企",
  sany: "上市公司",
  geely: "上市公司",
  sungrow: "上市公司",
  nio: "上市公司",
  haistar: "上市公司",
  nexchip: "上市公司",
  cxmt: "大型公司",
  wayeal: "上市公司",
  sinoma: "央国企",
  amd: "大型公司",
  hengli: "上市公司",
  haitian: "上市公司",
  leoch: "上市公司",
  xinje: "上市公司",
  cetc8: "央国企",
  iflytek: "上市公司",
  cctech: "上市公司",
  cetc38: "央国企",
  shuanghuan: "上市公司",
  jingce: "上市公司",
  donghua: "央国企",
  cecii: "央国企",
  huaqin: "上市公司",
  sugon: "上市公司",
  asml: "外企",
  lead: "上市公司",
  firstack: "大型公司",
  uaes: "外企",
  boschbcsc: "外企",
  neolix: "大型公司",
  ziir: "大型公司",
  giansun: "大型公司",
  jiexun: "大型公司",
  shining3d: "上市公司",
  positec: "大型公司",
  syntegon: "外企",
  wika: "外企",
  dahua: "上市公司",
  babycare: "大型公司",
  joyson: "上市公司",
  picea: "大型公司",
  ikingtec: "大型公司",
  hfpress: "上市公司",
  xynova: "大型公司",
  lexy: "上市公司",
  itek: "上市公司",
  "mettler-toledo": "外企",
};

type ApplicationStage = "未投递" | "已投递" | "笔试/面试" | "已结束";
const applicationStages: ApplicationStage[] = [
  "未投递",
  "已投递",
  "笔试/面试",
  "已结束",
];

type ResumeFields = {
  name: string;
  phone: string;
  email: string;
  school: string;
  degree: string;
  major: string;
  graduationYear: string;
  politicalStatus: string;
  englishLevel: string;
  skills: string;
  selfEvaluation: string;
  projects: ResumeProject[];
};

type ResumeProject = { name: string; time: string; content: string };

type ResumeRecord = {
  id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  fields: ResumeFields;
  created_at: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const emptyResumeFields: ResumeFields = {
  name: "",
  phone: "",
  email: "",
  school: "",
  degree: "",
  major: "",
  graduationYear: "",
  politicalStatus: "",
  englishLevel: "",
  skills: "",
  selfEvaluation: "",
  projects: [],
};
const resumeFieldLabels: Record<Exclude<keyof ResumeFields, "projects">, string> = {
  name: "姓名",
  phone: "手机号",
  email: "邮箱",
  school: "学校",
  degree: "学历",
  major: "专业",
  graduationYear: "毕业年份",
  politicalStatus: "政治面貌",
  englishLevel: "英语水平",
  skills: "技能关键词",
  selfEvaluation: "自我评价（完整）",
};

function extractResumeFields(text: string): ResumeFields {
  const normalized = text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n");
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const match = (pattern: RegExp) =>
    normalized.match(pattern)?.[1]?.trim() ?? "";
  const degreeRanks: Record<string, number> = {
    博士: 4,
    PhD: 4,
    硕士: 3,
    Master: 3,
    本科: 2,
    Bachelor: 2,
    大专: 1,
    专科: 1,
  };
  const degreePattern = /(博士|硕士|本科|大专|专科|PhD|Master|Bachelor)/gi;
  const datePattern =
    /(20\d{2})[.\-/年]\d{1,2}\s*(?:月)?\s*(?:~|—|-|至)\s*(20\d{2})[.\-/年]\d{1,2}/g;
  const schoolPattern =
    /([\u4e00-\u9fa5]{2,}(?:大学|学院|学校)|[A-Za-z][A-Za-z .'-]{2,}(?:University|College))/g;
  const education = lines
    .flatMap((line, index) => {
      const context = lines
        .slice(index, Math.min(index + 3, lines.length))
        .join(" ");
      const date = [...context.matchAll(datePattern)][0];
      const degrees = [...context.matchAll(degreePattern)];
      if (!date || degrees.length === 0) return [];
      const degreeMatch = degrees.sort(
        (left, right) =>
          (degreeRanks[right[1]] ?? 0) - (degreeRanks[left[1]] ?? 0),
      )[0];
      const schools = [...context.matchAll(schoolPattern)];
      const school =
        schools.find((item) => /大学|University/i.test(item[1]))?.[1] ??
        schools[0]?.[1] ??
        "";
      const lastSchool = schools.at(-1);
      const majorStart =
        lastSchool?.index === undefined
          ? 0
          : lastSchool.index + lastSchool[1].length;
      const degreeStart = degreeMatch.index ?? context.length;
      const explicitMajor =
        context.match(/(?:专业|Major)\s*[:：]?\s*([^，,；;|]{2,40})/i)?.[1] ??
        "";
      const major = (explicitMajor || context.slice(majorStart, degreeStart))
        .replace(/^\s*[\/｜|、,，-]?\s*/, "")
        .replace(/^[\u4e00-\u9fa5]{2,}学院\s*/, "")
        .replace(/(?:主修课程|课程|教育背景|教育经历)[\s\S]*/i, "")
        .replace(/[\/｜|、,，\s]+$/, "")
        .trim();
      return [
        {
          degree: degreeMatch[1],
          rank: degreeRanks[degreeMatch[1]] ?? 0,
          school,
          major: major.length >= 2 && major.length <= 40 ? major : "",
          graduationYear: date[2],
        },
      ];
    })
    .sort(
      (left, right) =>
        right.rank - left.rank ||
        Number(right.graduationYear) - Number(left.graduationYear),
    );
  const highestEducation = education[0];
  const header = lines.slice(0, 5).join(" ");
  const standaloneName =
    lines
      .slice(0, 6)
      .map((line) => line.match(/^\s*([\u4e00-\u9fa5·]{2,4})\s*$/)?.[1] ?? "")
      .find(Boolean) ?? "";
  const skills = [
    "SolidWorks",
    "AutoCAD",
    "CAD",
    "CATIA",
    "Creo",
    "UG",
    "NX",
    "ANSYS",
    "Abaqus",
    "Fluent",
    "MATLAB",
    "Simulink",
    "Python",
    "C++",
    "PLC",
    "LabVIEW",
    "FMEA",
    "GD&T",
    "Linux",
    "ROS2",
    "Jetson",
    "TCP",
    "机器视觉",
    "机器人",
  ].filter((skill) =>
    new RegExp(skill.replace("+", "\\+"), "i").test(normalized),
  );
  const dateLinePattern =
    /20\d{2}[.\-/年]\d{1,2}\s*(?:月)?\s*(?:~|—|-|至)\s*20\d{2}[.\-/年]\d{1,2}\s*(?:月)?/;
  const dateLineIndexes = lines
    .map((line, index) => ({ line, index }))
    .filter(({ line }) => dateLinePattern.test(line));
  const projectBlocks = dateLineIndexes
    .map(({ line, index }, position) => {
      const context = lines
        .slice(index, Math.min(index + 3, lines.length))
        .join(" ");
      if (/(主修课程|教育背景|教育经历)/i.test(context)) return null;
      const nextDate = dateLineIndexes[position + 1]?.index ?? lines.length;
      const singleDate = lines
        .slice(index + 1, nextDate)
        .findIndex((candidate) => /^20\d{2}[.\-/年]\d{1,2}\s/.test(candidate));
      const end = singleDate >= 0 ? index + 1 + singleDate : nextDate;
      const blockLines = lines.slice(index, end);
      const time = line.match(dateLinePattern)?.[0] ?? "";
      const firstRemainder = line.replace(dateLinePattern, "").trim();
      const name =
        firstRemainder ||
        blockLines[1]
          ?.replace(/(?:工作描述|项目内容|项目职责|职责)\s*[:：]?/i, "")
          .trim() ||
        "";
      const content = blockLines
        .slice(1)
        .join("\n")
        .replace(/^(?:工作描述|项目内容|项目职责|职责)\s*[:：]?\s*/i, "")
        .trim();
      return { time, name, content };
    })
    .filter(
      (project): project is { time: string; name: string; content: string } =>
        Boolean(
          project && project.name.length >= 2 && project.content.length >= 2,
        ),
    );
  const evaluationHeading = lines.findIndex((line) =>
    /个人评价|自我评价|个人总结|个人优势/i.test(line),
  );
  const evaluationStart = lines.findIndex((line) =>
    /^本人[\u4e00-\u9fa5]/.test(line),
  );
  const evaluation =
    evaluationHeading >= 0
      ? lines
          .slice(evaluationHeading + 1)
          .join("\n")
          .trim()
      : evaluationStart >= 0
        ? lines.slice(evaluationStart).join("\n").trim()
        : "";
  return {
    name:
      match(
        /(?:姓名|姓\s*名|Name)\s*[:：]?\s*([\u4e00-\u9fa5·]{2,8}|[A-Za-z][A-Za-z .'-]{1,30})/i,
      ) ||
      standaloneName ||
      (header.match(
        /^\s*([\u4e00-\u9fa5·]{2,4})\s+(?:求职意向|个人简历|简历)/,
      )?.[1] ??
        ""),
    phone: match(
      /(?:手机|电话|联系电话|Phone|Mobile)?\s*[:：]?\s*(1[3-9]\d{9})/i,
    ),
    email: match(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i),
    school:
      highestEducation?.school ||
      (
        lines.find(
          (line) =>
            /(?:大学|学院|University|College)/i.test(line) && line.length <= 45,
        ) ?? ""
      ).replace(/^(?:学校|院校)\s*[:：]?\s*/, ""),
    degree:
      highestEducation?.degree ||
      match(/(博士|硕士|本科|大专|专科|PhD|Master|Bachelor)/i),
    major:
      highestEducation?.major ||
      match(/(?:专业|Major)\s*[:：]?\s*([^\n，,；;|]{2,30})/i),
    graduationYear:
      highestEducation?.graduationYear ||
      match(
        /(?:毕业时间|毕业年份|毕业日期|Graduation)\s*[:：]?\s*(20\d{2})/i,
      ) ||
      match(/(20(?:2[6-9]|3\d))\s*年?\s*(?:应届|毕业)/),
    politicalStatus: match(/(中共党员|中共预备党员|共青团员|群众)/),
    englishLevel: match(
      /(CET[- ]?6|CET[- ]?4|英语六级|英语四级|雅思\s*\d(?:\.\d)?|托福\s*\d{2,3})/i,
    ),
    skills: [...new Set(skills)].join("、"),
    selfEvaluation: evaluation,
    projects: projectBlocks,
  };
}

async function extractResumeText(file: File) {
  const buffer = await file.arrayBuffer();
  if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
      import.meta.url,
    ).toString();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) })
      .promise;
    const pages: string[] = [];
    for (let index = 1; index <= pdf.numPages; index += 1) {
      const page = await pdf.getPage(index);
      const content = await page.getTextContent();
      const items = content.items
        .filter((item) => "str" in item && "transform" in item)
        .map((item) => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
        }));
      const lines: Array<{
        y: number;
        items: Array<{ text: string; x: number }>;
      }> = [];
      for (const item of items) {
        const line = lines.find(
          (candidate) => Math.abs(candidate.y - item.y) < 2.5,
        );
        if (line) line.items.push({ text: item.text, x: item.x });
        else lines.push({ y: item.y, items: [{ text: item.text, x: item.x }] });
      }
      pages.push(
        lines
          .sort((left, right) => right.y - left.y)
          .map((line) =>
            line.items
              .sort((left, right) => left.x - right.x)
              .map((item) => item.text)
              .join(" "),
          )
          .join("\n"),
      );
    }
    return pages.join("\n");
  }
  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }
  return new TextDecoder("utf-8").decode(buffer);
}
const sourceOrigins: Record<
  string,
  "企业官网发布" | "官网招聘入口" | "高校/国家就业平台转发" | "第三方平台转发"
> = {
  caterpillar: "企业官网发布",
  sany: "企业官网发布",
  geely: "企业官网发布",
  sungrow: "企业官网发布",
  nio: "企业官网发布",
  haistar: "企业官网发布",
  hengli: "官网招聘入口",
  haitian: "官网招聘入口",
  cxmt: "官网招聘入口",
  sinoma: "高校/国家就业平台转发",
  amd: "高校/国家就业平台转发",
  xinje: "高校/国家就业平台转发",
  cetc8: "高校/国家就业平台转发",
  iflytek: "高校/国家就业平台转发",
  cctech: "高校/国家就业平台转发",
  cetc38: "高校/国家就业平台转发",
  donghua: "高校/国家就业平台转发",
  sugon: "高校/国家就业平台转发",
  firstack: "高校/国家就业平台转发",
  leoch: "第三方平台转发",
  shuanghuan: "第三方平台转发",
  jingce: "第三方平台转发",
  cecii: "第三方平台转发",
  huaqin: "第三方平台转发",
  asml: "第三方平台转发",
  lead: "第三方平台转发",
  uaes: "第三方平台转发",
  boschbcsc: "第三方平台转发",
  neolix: "第三方平台转发",
};
const publicationDates: Record<string, string> = {
  "cat-logistics": "2026-08-13",
  "cat-digital": "2026-08-13",
  "cat-mfg-xz": "2026-08-13",
  "cat-virtual": "2026-08-09",
  "cat-smart": "2026-08-09",
  "cat-engine": "2026-08-09",
  "cat-transmission": "2026-08-09",
  "sany-mech": "2026-08-26",
  "sany-hydraulic": "2026-08-26",
  "sany-test": "2026-08-26",
  "sany-product": "2026-08-26",
  "sany-assembly": "2026-08-26",
  "sany-process": "2026-08-26",
  "geely-mech-maint": "2026-08-22",
  "geely-elec-maint": "2026-08-13",
  "nio-thermal-rd": "2026-08-28",
  "nio-project-quality": "2026-08-28",
  "nio-process-quality": "2026-08-28",
  "nio-smart-equipment": "2026-08-28",
  "nio-stamping-equipment": "2026-08-28",
  "nio-stamping-process": "2026-08-28",
  "wayeal-mechanical": "2026-08-24",
  "wayeal-system-product": "2026-08-24",
  "wayeal-process": "2026-08-24",
  "cxmt-process": "2026-08-27",
  "cxmt-quality-reliability": "2026-08-27",
  "haistar-mechanical": "2026-08-28",
  "haistar-plc": "2026-08-28",
  "nexchip-equipment-process": "2026-08-28",
  "sg-reliability": "2026-08-10",
  "sg-equipment": "2026-08-10",
  "sg-manufacturing": "2026-08-10",
  "sg-tooling": "2026-08-10",
  "sinoma-rd-doctor": "2026-08-26",
  "sinoma-rd": "2026-08-26",
  "sinoma-smart": "2026-08-26",
  "amd-mechatronic": "2026-08-14",
  "amd-mechatronic-research": "2026-08-14",
  "amd-mechanical": "2026-08-14",
  "hengli-rd": "2026-08-23",
  "hengli-production": "2026-08-23",
  "haitian-rd": "2026-08-20",
  "haitian-manufacturing": "2026-08-20",
  "leoch-rd": "2026-08-19",
  "leoch-production": "2026-08-19",
  "xinje-motor-structure": "2026-08-18",
  "xinje-motor-process": "2026-08-18",
  "xinje-electromagnetic": "2026-08-18",
  "cetc8-mechanical": "2026-08-20",
  "iflytek-structure": "2026-08-24",
  "cctech-mechanical": "2026-08-21",
  "cctech-fea": "2026-08-21",
  "cctech-production": "2026-08-21",
  "cetc38-mechanical": "2026-08-21",
  "shuanghuan-project": "2026-08-22",
  "jingce-mechanical": "2026-08-10",
  "donghua-process": "2026-08-28",
  "cecii-power": "2026-08-27",
  "huaqin-engineering": "2026-08-18",
  "sugon-structure": "2026-08-21",
  "asml-install": "2026-08-01",
  "lead-lean": "2026-08-25",
  "firstack-structure": "2026-08-21",
  "uaes-smart": "2026-08-16",
  "boschbcsc-auto": "2026-08-12",
  "neolix-robotics": "2026-08-23",
};

const watchlist = [
  {
    name: "安徽合力",
    area: "合肥",
    tag: "上市国企",
    focus: "工业车辆、智能物流",
    url: "https://www.helichina.com/contact/job/",
  },
  {
    name: "江淮汽车",
    area: "合肥",
    tag: "上市国企",
    focus: "整车、底盘、工艺研发",
    url: "https://www.jac.com.cn/rczp/",
  },
  {
    name: "国轩高科",
    area: "合肥",
    tag: "上市公司",
    focus: "动力电池、设备、工艺",
    url: "https://www.gotion.com.cn/join",
  },
  {
    name: "安凯汽车",
    area: "合肥",
    tag: "上市国企",
    focus: "新能源客车、整车研发",
    url: "https://www.ankai.com/",
  },
  {
    name: "大众安徽",
    area: "合肥",
    tag: "合资车企",
    focus: "新能源汽车、制造工程",
    url: "https://www.volkswagen-anhui.com/",
  },
  {
    name: "蔚来合肥",
    area: "合肥",
    tag: "新能源车企",
    focus: "整车、智能制造、质量",
    url: "https://campus.nio.com/",
  },
  {
    name: "徐工集团",
    area: "江苏 · 徐州",
    tag: "上市国企",
    focus: "工程机械、研发制造",
    url: "https://www.xcmg.com/aboutus/job_center.htm",
  },
  {
    name: "中车南京浦镇",
    area: "江苏 · 南京",
    tag: "央企",
    focus: "轨道交通、车辆装备",
    url: "https://www.crrcgc.cc/pz/",
  },
  {
    name: "中车戚墅堰",
    area: "江苏 · 常州",
    tag: "央企",
    focus: "轨道交通、传动系统",
    url: "https://www.crrcgc.cc/qs/",
  },
  {
    name: "先导智能",
    area: "江苏 · 无锡",
    tag: "上市公司",
    focus: "锂电智能装备、自动化",
    url: "https://www.leadintelligent.com/",
  },
  {
    name: "博世中国",
    area: "江苏 · 苏州/无锡",
    tag: "外资制造",
    focus: "汽车零部件、智能制造",
    url: "https://www.bosch.com.cn/careers/",
  },
  {
    name: "三一重机",
    area: "江苏 · 昆山",
    tag: "上市集团",
    focus: "工程机械、液压、研发",
    url: "https://sany.zhiye.com/campus/jobs",
  },
  {
    name: "杭叉集团",
    area: "杭州",
    tag: "上市公司",
    focus: "工业车辆、液压、电气",
    url: "https://www.zjhc.cn/aboutHumanResources.html",
  },
  {
    name: "西子联合",
    area: "杭州",
    tag: "装备制造",
    focus: "电梯、锅炉、工业装备",
    url: "https://www.xizigroup.com/",
  },
  {
    name: "中控技术",
    area: "杭州",
    tag: "上市公司",
    focus: "工业自动化、智能制造",
    url: "https://www.supcon.com/",
  },
  {
    name: "海康机器人",
    area: "杭州",
    tag: "上市集团",
    focus: "移动机器人、机器视觉",
    url: "https://www.hikrobotics.com/cn/",
  },
  {
    name: "浙江吉利控股",
    area: "杭州",
    tag: "上市集团",
    focus: "汽车、动力系统、智能制造",
    url: "https://campus.geely.com/",
  },
  {
    name: "拓普集团",
    area: "宁波",
    tag: "上市公司",
    focus: "汽车零部件、机器人",
    url: "https://www.tuopu.com/",
  },
  {
    name: "均普智能",
    area: "宁波",
    tag: "上市公司",
    focus: "智能制造装备、自动化",
    url: "https://cn.piagroup.com/careers/",
  },
  {
    name: "宁波华翔",
    area: "宁波",
    tag: "上市公司",
    focus: "汽车内外饰、零部件",
    url: "https://www.nbhx.com/",
  },
  {
    name: "旭升集团",
    area: "宁波",
    tag: "上市公司",
    focus: "精密铝合金、汽车零部件",
    url: "https://www.shengroup.com/",
  },
  {
    name: "双林股份",
    area: "宁波",
    tag: "上市公司",
    focus: "汽车零部件、智能座舱",
    url: "https://www.slcorp.com.cn/",
  },
  {
    name: "宁波钢铁",
    area: "宁波",
    tag: "国企",
    focus: "冶金装备、设备工程",
    url: "https://www.nbsteel.com/",
  },
  {
    name: "大众汽车零部件（安徽）",
    area: "合肥",
    tag: "外资制造",
    focus: "动力系统、智能制造、应届生岗位",
    url: "https://volkswagenac.com/zh-hans/careers/",
  },
  {
    name: "常青股份",
    area: "合肥",
    tag: "上市公司",
    focus: "汽车冲压、车身零部件",
    url: "https://www.hfchangqing.com/",
  },
  {
    name: "芯碁微装",
    area: "合肥",
    tag: "上市公司",
    focus: "半导体装备、精密机械",
    url: "https://www.xinchip.com/",
  },
  {
    name: "应流股份",
    area: "合肥",
    tag: "上市公司",
    focus: "高端装备零部件、泵阀",
    url: "https://www.yingliugroup.com/",
  },
  {
    name: "合肥高科",
    area: "合肥",
    tag: "上市公司",
    focus: "金属模具、冲压件、家电零部件",
    url: "https://www.hfgk.com/",
  },
  {
    name: "合肥美的暖通",
    area: "合肥",
    tag: "上市集团",
    focus: "暖通装备、研发制造",
    url: "https://career.midea.com/",
  },
  {
    name: "格力凌达压缩机",
    area: "合肥",
    tag: "上市集团",
    focus: "压缩机、设备与工艺",
    url: "https://zp.gree.com/",
  },
  {
    name: "合肥万向钱潮",
    area: "合肥",
    tag: "上市集团子公司",
    focus: "汽车底盘、传动轴、制动器",
    url: "https://campus.51job.com/wxsz/job.html",
  },
  {
    name: "京东方合肥",
    area: "合肥",
    tag: "上市集团",
    focus: "智能制造、设备工程",
    url: "https://talent.boe.com/",
  },
  {
    name: "埃斯顿自动化",
    area: "江苏 · 南京",
    tag: "上市公司",
    focus: "工业机器人、运动控制",
    url: "https://www.estun.com/",
  },
  {
    name: "天奇自动化",
    area: "江苏 · 无锡",
    tag: "上市公司",
    focus: "汽车智能装备、机器人",
    url: "https://www.chinaconveyor.com/",
  },
  {
    name: "隆达超合金",
    area: "江苏 · 无锡",
    tag: "上市公司",
    focus: "高温合金、工艺与设备",
    url: "https://www.wxlongda.com/joinus.html",
  },
  {
    name: "无锡先导智能",
    area: "江苏 · 无锡",
    tag: "上市公司",
    focus: "锂电智能装备、自动化",
    url: "https://www.leadintelligent.com/",
  },
  {
    name: "江苏鱼跃医疗",
    area: "江苏 · 镇江",
    tag: "上市公司",
    focus: "医疗器械、智能制造",
    url: "https://www.yuwell.com/",
  },
  {
    name: "纽威股份",
    area: "江苏 · 苏州",
    tag: "上市公司",
    focus: "工业阀门、流体装备",
    url: "https://www.neway.com.cn/",
  },
  {
    name: "中天科技",
    area: "江苏 · 南通",
    tag: "上市公司",
    focus: "线缆装备、智能制造",
    url: "https://www.chinaztt.com/",
  },
  {
    name: "常州比亚迪",
    area: "江苏 · 常州",
    tag: "未上市大型企业",
    focus: "新能源汽车、智能制造",
    url: "https://job.byd.com/",
  },
  {
    name: "理想汽车常州",
    area: "江苏 · 常州",
    tag: "上市车企",
    focus: "新能源汽车、制造工程",
    url: "https://www.lixiang.com/careers",
  },
  {
    name: "扬力集团",
    area: "江苏 · 扬州",
    tag: "未上市大型企业",
    focus: "压力机、锻压装备",
    url: "https://www.yangli.com/",
  },
  {
    name: "杭氧股份",
    area: "杭州",
    tag: "上市国企",
    focus: "空分装备、流程与机械",
    url: "https://www.hangyang.com/",
  },
  {
    name: "西子洁能",
    area: "杭州",
    tag: "上市公司",
    focus: "能源装备、锅炉与环保",
    url: "https://www.xizice.com/",
  },
  {
    name: "万向钱潮",
    area: "杭州",
    tag: "上市公司",
    focus: "汽车零部件、传动系统",
    url: "https://www.wanxiang.com.cn/",
  },
  {
    name: "海亮股份",
    area: "杭州",
    tag: "上市公司",
    focus: "铜加工、智能制造",
    url: "https://www.hailiangstock.com/career.html",
  },
  {
    name: "新坐标",
    area: "杭州",
    tag: "上市公司",
    focus: "汽车发动机精密零部件",
    url: "https://www.xzbco.com/",
  },
  {
    name: "飞仕得科技",
    area: "杭州",
    tag: "未上市大型企业",
    focus: "半导体检测、非标自动化",
    url: "https://www.fasstech.com/",
  },
  {
    name: "日月股份",
    area: "宁波",
    tag: "上市公司",
    focus: "风电铸件、重型装备",
    url: "https://www.riyuehi.com/",
  },
  {
    name: "金田铜业",
    area: "宁波",
    tag: "上市公司",
    focus: "铜加工、装备与工艺",
    url: "https://www.jintian.com/",
  },
  {
    name: "舜宇光学",
    area: "宁波",
    tag: "上市公司",
    focus: "光学精密制造、设备工程",
    url: "https://www.sunnyoptical.com/",
  },
  {
    name: "公牛集团",
    area: "宁波",
    tag: "上市公司",
    focus: "电器制造、自动化",
    url: "https://www.gongniu.cn/",
  },
  {
    name: "乐惠国际",
    area: "宁波",
    tag: "上市公司",
    focus: "啤酒饮料装备、机械设计",
    url: "https://www.lehui.com/",
  },
  {
    name: "帅特龙汽车系统",
    area: "宁波",
    tag: "未上市大型企业",
    focus: "汽车电子、内外饰系统",
    url: "https://www.nbstl.cn/Index/join2",
  },
  {
    name: "宁波港",
    area: "宁波",
    tag: "上市国企",
    focus: "港口装备、机械设备",
    url: "https://www.nbport.com.cn/",
  },
  {
    name: "合肥晶合集成",
    area: "合肥",
    tag: "上市公司",
    focus: "半导体设备、工艺与智能制造",
    url: "https://www.nexchip.com.cn/campus-recruitment",
  },
  {
    name: "长鑫存储",
    area: "合肥",
    tag: "大型企业",
    focus: "存储芯片、工艺与设备工程",
    url: "https://www.cxmt.com/join.html",
  },
  {
    name: "海康威视",
    area: "杭州",
    tag: "上市公司",
    focus: "机器视觉、机器人与智能制造",
    url: "https://campushr.hikvision.com/",
  },
  {
    name: "睿创微纳",
    area: "江苏 · 苏州/无锡",
    tag: "上市公司",
    focus: "红外芯片、智能装备与机器人",
    url: "https://www.raytrontek.com/join/join_us.htm",
  },
  {
    name: "宁波德业",
    area: "宁波",
    tag: "上市公司",
    focus: "暖通、新能源与储能装备",
    url: "https://www.deye.com.cn/join/campus.html",
  },
];

export default function Home() {
  const [activeView, setActiveView] = useState<"jobs" | "saved" | "resume" | "radar" | "standards">("jobs");
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("全部地区");
  const [direction, setDirection] = useState("全部方向");
  const [companyType, setCompanyType] = useState("全部企业");
  const [informationLevel, setInformationLevel] = useState("全部信息");
  const [sortMode, setSortMode] = useState("相关度");
  const [openCompanies, setOpenCompanies] = useState<Set<string>>(new Set());
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [compareJobIds, setCompareJobIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [applicationStagesByJob, setApplicationStagesByJob] = useState<
    Record<string, ApplicationStage>
  >({});
  const [storageReady, setStorageReady] = useState(false);
  const [resumeUser, setResumeUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFields, setResumeFields] = useState<ResumeFields>({
    ...emptyResumeFields,
  });
  const [resumeText, setResumeText] = useState("");
  const [resumeRecords, setResumeRecords] = useState<ResumeRecord[]>([]);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [resumeBusy, setResumeBusy] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");

  useEffect(() => {
    const savedFavorites = window.localStorage.getItem(
      "mechanical-campus-job-favorites",
    );
    const savedStages = window.localStorage.getItem(
      "mechanical-campus-job-stages",
    );
    if (savedFavorites)
      setFavorites(new Set(JSON.parse(savedFavorites) as string[]));
    if (savedStages)
      setApplicationStagesByJob(
        JSON.parse(savedStages) as Record<string, ApplicationStage>,
      );
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(
      "mechanical-campus-job-favorites",
      JSON.stringify([...favorites]),
    );
  }, [favorites, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    window.localStorage.setItem(
      "mechanical-campus-job-stages",
      JSON.stringify(applicationStagesByJob),
    );
  }, [applicationStagesByJob, storageReady]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setResumeUser(data.session?.user ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setResumeUser(session?.user ?? null),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !resumeUser) {
      setResumeRecords([]);
      setResumeLoading(false);
      return;
    }
    setResumeLoading(true);
    supabase
      .from("resume_profiles")
      .select("id,file_path,file_name,mime_type,file_size,fields,created_at")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setResumeMessage(`读取简历库失败：${error.message}`);
        else {
          const records = (data ?? []) as ResumeRecord[];
          setResumeRecords(records);
          if (!selectedResumeId && records[0]) {
            setSelectedResumeId(records[0].id);
            setResumeFields({ ...emptyResumeFields, ...records[0].fields });
          }
        }
        setResumeLoading(false);
      });
  }, [resumeUser, selectedResumeId]);

  const currentCategory = (company: Company) =>
    currentCompanyCategories[company.id] ?? "大型公司";
  const radarCategory = (company: (typeof watchlist)[number]) =>
    /(外资|合资)/.test(company.tag)
      ? "外企"
      : /(央企|国企)/.test(company.tag)
        ? "央国企"
        : /上市/.test(company.tag)
          ? "上市公司"
          : "大型公司";

  const filtered = useMemo(
    () =>
      companies
        .map((company) => {
          const needle = query.trim().toLowerCase();
          const jobs = company.jobs.filter((job) => {
            const matchesQuery =
              !needle ||
              `${company.name}${job.title}${job.majors}${job.location}`
                .toLowerCase()
                .includes(needle);
            const matchesArea = area === "全部地区" || job.areas.includes(area);
            const matchesDirection =
              direction === "全部方向" || job.direction === direction;
            const matchesCompanyType =
              companyType === "全部企业" ||
              currentCategory(company) === companyType;
            const origin =
              sourceOrigins[company.id] ??
              company.sourceOrigin ??
              "第三方平台转发";
            const matchesInformationLevel =
              informationLevel === "全部信息" ||
              (informationLevel === "完整官方JD"
                ? company.status !== "announcement" && origin === "企业官网发布"
                : informationLevel === "已核验岗位"
                  ? company.status !== "announcement"
                  : company.status === "announcement");
            return (
              matchesQuery &&
              matchesArea &&
              matchesDirection &&
              matchesCompanyType &&
              matchesInformationLevel
            );
          });
          return { ...company, jobs };
        })
        .filter((company) => company.jobs.length > 0)
        .sort((a, b) => {
          if (sortMode === "公司名称") return a.name.localeCompare(b.name, "zh");
          if (sortMode === "岗位数量") return b.jobs.length - a.jobs.length;
          return 0;
        }),
    [query, area, direction, companyType, informationLevel, sortMode],
  );

  const totalJobs = filtered.reduce(
    (sum, company) => sum + company.jobs.length,
    0,
  );
  const savedJobs = companies
    .flatMap((company) => company.jobs.map((job) => ({ company, job })))
    .filter(({ job }) => favorites.has(job.id));
  const comparisonJobs = companies
    .flatMap((company) => company.jobs.map((job) => ({ company, job })))
    .filter(({ job }) => compareJobIds.has(job.id));
  const completeOfficialCount = companies.reduce(
    (total, company) =>
      total +
      (company.status !== "announcement" &&
      (sourceOrigins[company.id] ?? company.sourceOrigin) === "企业官网发布"
        ? company.jobs.length
        : 0),
    0,
  );
  const announcementCount = companies.reduce(
    (total, company) =>
      total + (company.status === "announcement" ? company.jobs.length : 0),
    0,
  );
  const radarFiltered = useMemo(
    () =>
      watchlist.filter(
        (company) =>
          companyType === "全部企业" || radarCategory(company) === companyType,
      ),
    [companyType],
  );
  const reset = () => {
    setQuery("");
    setArea("全部地区");
    setDirection("全部方向");
    setCompanyType("全部企业");
    setInformationLevel("全部信息");
    setSortMode("相关度");
  };
  const toggleCompany = (id: string) =>
    setOpenCompanies((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleFavorite = (jobId: string) =>
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  const toggleCompare = (jobId: string) =>
    setCompareJobIds((current) => {
      const next = new Set(current);
      if (next.has(jobId)) next.delete(jobId);
      else if (next.size < 3) next.add(jobId);
      return next;
    });
  const exportSavedJobs = () => {
    if (savedJobs.length === 0) return;
    const escapeCell = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = [
      ["公司", "岗位", "地点", "学历", "方向", "专业", "个人进度", "投递链接"],
      ...savedJobs.map(({ company, job }) => [
        company.name,
        job.title,
        job.location,
        job.degree,
        job.direction,
        job.majors,
        applicationStagesByJob[job.id] ?? "未投递",
        job.url,
      ]),
    ];
    const blob = new Blob(
      [`\uFEFF${rows.map((row) => row.map(escapeCell).join(",")).join("\n")}`],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "机械校招投递清单.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const handleAuth = async () => {
    if (!supabase || !authEmail || authPassword.length < 8) {
      setResumeMessage("请输入邮箱，密码至少 8 位。");
      return;
    }
    setResumeBusy(true);
    setResumeMessage("");
    const result =
      authMode === "register"
        ? await supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
            options: {
              emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
            },
          })
        : await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
          });
    setResumeBusy(false);
    if (result.error) setResumeMessage(result.error.message);
    else
      setResumeMessage(
        authMode === "register" && !result.data.session
          ? "注册成功，请打开邮箱完成验证后登录。"
          : "登录成功。",
      );
  };
  const resendVerification = async () => {
    if (!supabase || !authEmail) {
      setResumeMessage("请先填写注册邮箱。");
      return;
    }
    setResumeBusy(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: authEmail,
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
      },
    });
    setResumeBusy(false);
    setResumeMessage(
      error
        ? `发送失败：${error.message}`
        : "新的验证邮件已发送，请使用这封邮件中的链接。",
    );
  };
  const handleResumeFile = async (file: File | null) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setResumeMessage("文件不能超过 10 MB。");
      return;
    }
    if (!/\.(pdf|docx|txt)$/i.test(file.name)) {
      setResumeMessage("仅支持 PDF、DOCX、TXT。");
      return;
    }
    setResumeBusy(true);
    setResumeMessage("正在本地提取字段…");
    try {
      const text = await extractResumeText(file);
      setResumeFile(file);
      setResumeText(text);
      setResumeFields(extractResumeFields(text));
      setSelectedResumeId(null);
      setResumeMessage("字段提取完成，请检查并修正后上传。");
    } catch {
      setResumeMessage("无法读取该文件，请尝试导出为 PDF 或 TXT。");
    } finally {
      setResumeBusy(false);
    }
  };
  const loadResumeRecords = async () => {
    if (!supabase || !resumeUser) return;
    setResumeLoading(true);
    const { data, error } = await supabase
      .from("resume_profiles")
      .select("id,file_path,file_name,mime_type,file_size,fields,created_at")
      .order("created_at", { ascending: false });
    if (error) setResumeMessage(`读取简历库失败：${error.message}`);
    else setResumeRecords((data ?? []) as ResumeRecord[]);
    setResumeLoading(false);
  };
  const uploadResume = async () => {
    if (!supabase || !resumeUser || !resumeFile) {
      setResumeMessage("请先登录并选择简历文件。");
      return;
    }
    setResumeBusy(true);
    setResumeMessage("正在上传私有简历…");
    const extension = resumeFile.name.toLowerCase().match(/\.(pdf|docx|txt)$/)?.[0] ?? ".bin";
    const filePath = `${resumeUser.id}/${crypto.randomUUID()}${extension}`;
    const uploaded = await supabase.storage
      .from("resumes")
      .upload(filePath, resumeFile, {
        contentType: resumeFile.type || "application/octet-stream",
      });
    if (uploaded.error) {
      setResumeMessage(`上传失败：${uploaded.error.message}`);
      setResumeBusy(false);
      return;
    }
    const inserted = await supabase
      .from("resume_profiles")
      .insert({
        user_id: resumeUser.id,
        file_path: filePath,
        file_name: resumeFile.name,
        mime_type: resumeFile.type || "application/octet-stream",
        file_size: resumeFile.size,
        fields: resumeFields,
      })
      .select()
      .single();
    if (inserted.error) {
      await supabase.storage.from("resumes").remove([filePath]);
      setResumeMessage(`保存字段失败：${inserted.error.message}`);
    } else {
      setResumeMessage(
        "简历已保存到私有云端，当前字段会继续保留；选择新文件后才会替换。",
      );
      setResumeFile(null);
      setSelectedResumeId(inserted.data?.id ?? null);
      await loadResumeRecords();
    }
    setResumeBusy(false);
  };
  const saveResumeFields = async () => {
    if (!supabase || !selectedResumeId) return;
    setResumeBusy(true);
    const { error } = await supabase
      .from("resume_profiles")
      .update({ fields: resumeFields, updated_at: new Date().toISOString() })
      .eq("id", selectedResumeId);
    setResumeMessage(error ? `保存失败：${error.message}` : "字段已同步。");
    if (!error) await loadResumeRecords();
    setResumeBusy(false);
  };
  const downloadResume = async (record: ResumeRecord) => {
    if (!supabase) return;
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(record.file_path, 60);
    if (error) setResumeMessage(`下载失败：${error.message}`);
    else window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  };
  const reextractCloudResume = async (record: ResumeRecord) => {
    if (!supabase) return;
    setResumeBusy(true);
    setResumeMessage("正在使用新规则重新提取…");
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(record.file_path, 60);
    if (error) {
      setResumeMessage(`读取失败：${error.message}`);
      setResumeBusy(false);
      return;
    }
    try {
      const response = await fetch(data.signedUrl);
      const blob = await response.blob();
      const file = new File([blob], record.file_name, {
        type: record.mime_type,
      });
      const text = await extractResumeText(file);
      setSelectedResumeId(record.id);
      setResumeFile(null);
      setResumeText(text);
      setResumeFields(extractResumeFields(text));
      setResumeMessage("重新提取完成，请检查字段后点击“保存字段到云端”。");
    } catch {
      setResumeMessage("重新提取失败，请下载后再上传原文件。");
    } finally {
      setResumeBusy(false);
    }
  };
  const deleteResume = async (record: ResumeRecord) => {
    if (
      !supabase ||
      !window.confirm(`确定删除“${record.file_name}”吗？删除后无法恢复。`)
    )
      return;
    setResumeBusy(true);
    const removed = await supabase.storage
      .from("resumes")
      .remove([record.file_path]);
    const deleted = removed.error
      ? { error: removed.error }
      : await supabase.from("resume_profiles").delete().eq("id", record.id);
    setResumeMessage(
      deleted.error ? `删除失败：${deleted.error.message}` : "简历已删除。",
    );
    if (!deleted.error) await loadResumeRecords();
    setResumeBusy(false);
  };

  return (
    <main className="tech-shell min-h-screen text-[#dff8ee]">
      <header className="border-b border-[#1d4539] bg-[#07140f]/92">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            onClick={() => setActiveView("jobs")}
            className="flex items-center gap-3"
            aria-label="机遇引擎首页"
          >
            <span className="brand-orb grid h-11 w-11 place-items-center rounded-xl text-sm font-bold text-[#06110d]">
              ME
            </span>
            <span>
              <strong className="block text-[15px] tracking-[0.12em] text-white">
                机遇引擎
              </strong>
              <small className="text-xs text-[#74a896]">MECH CAREER OS</small>
            </span>
          </a>
          <nav className="hidden items-center gap-1 rounded-2xl border border-[#1e4438] bg-[#0c2019]/80 p-1 text-sm sm:flex">
            <button onClick={() => setActiveView("jobs")} className={`nav-chip ${activeView === "jobs" ? "nav-chip-active" : ""}`}>岗位情报</button>
            <button onClick={() => setActiveView("resume")} className={`nav-chip ${activeView === "resume" ? "nav-chip-active" : ""}`}>
              {resumeUser ? "我的简历库" : "简历库登录"}
            </button>
            <button onClick={() => setActiveView("saved")} className={`nav-chip ${activeView === "saved" ? "nav-chip-active" : ""}`}>
              投递清单 {favorites.size}
            </button>
            <button onClick={() => setActiveView("radar")} className={`nav-chip ${activeView === "radar" ? "nav-chip-active" : ""}`}>
              企业雷达
            </button>
            <button onClick={() => setActiveView("standards")} className={`nav-chip ${activeView === "standards" ? "nav-chip-active" : ""}`}>
              收录标准
            </button>
          </nav>
        </div>
      </header>

      <section id="top" className={`${activeView === "jobs" ? "" : "hidden"} border-b border-[#244f39] bg-[#123b29] text-white`}>
        <div className="mx-auto max-w-[1380px] px-5 py-10 sm:px-8 sm:py-12">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#f29b7b]">
            <span className="live-dot" />
            2027 届校园招聘 · 情报持续同步
          </div>
          <div className="grid gap-7 lg:grid-cols-[1fr_390px] lg:items-end">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-white sm:text-[62px]">
                机械校招情报中枢
                <span className="mt-2 block text-[#69f0c5]">发现、核验、追踪每个机会</span>
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#c6d9cb]">
                所有企业优先以中国官网或中国区官方校招站核验；完整官方JD逐项展示职责和资格，第三方仅作为原始公告参考。
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#jobs"
                  className="rounded-xl bg-[#f1a07d] px-5 py-3 text-sm font-bold text-[#173f2a] shadow-[0_8px_20px_rgba(0,0,0,.15)] transition hover:-translate-y-0.5 hover:bg-[#f5b08f]"
                >
                  立即查找岗位 ↓
                </a>
                <button
                  onClick={() => setActiveView("standards")}
                  className="rounded-xl border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  查看收录标准
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#d7e5da]">
                {['合肥', '江苏全域', '杭州', '宁波'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setArea(item === '江苏全域' ? '江苏全域' : item)}
                    className="rounded-full border border-white/20 px-3 py-1.5 transition hover:border-[#f1a07d] hover:text-[#f1a07d]"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.14)] backdrop-blur-sm">
              <div className="flex items-end justify-between">
                <span className="text-sm text-[#c6d9cb]">当前收录岗位</span>
                <strong className="text-4xl font-semibold tracking-tight">
                  {companies.reduce(
                    (sum, company) => sum + company.jobs.length,
                    0,
                  )}
                </strong>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/15 pt-4 text-center">
                <div>
                  <strong className="block text-lg text-[#f1a07d]">
                    {companies.length}
                  </strong>
                  <span className="text-[10px] text-[#c6d9cb]">招聘企业</span>
                </div>
                <div>
                  <strong className="block text-lg text-[#f1a07d]">
                    {completeOfficialCount}
                  </strong>
                  <span className="text-[10px] text-[#c6d9cb]">完整官方JD</span>
                </div>
                <div>
                  <strong className="block text-lg text-[#a85b36]">
                    {announcementCount}
                  </strong>
                  <span className="text-[10px] text-[#c6d9cb]">公告级方向</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="jobs" className={`${activeView === "jobs" ? "" : "hidden"} mx-auto grid max-w-[1380px] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[280px_1fr]`}>
        <aside className="filter-console h-fit rounded-2xl p-5 lg:sticky lg:top-24">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">筛选岗位</h2>
            <button
              onClick={reset}
              className="text-xs font-medium text-[#1c6741] hover:underline"
            >
              重置
            </button>
          </div>
          <label
            htmlFor="keyword"
            className="block text-xs font-medium text-[#68746c]"
          >
            关键词
          </label>
          <input
            id="keyword"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d3dad4] bg-[#fafbf8] px-3 py-2.5 text-sm outline-none focus:border-[#508465] focus:ring-2 focus:ring-[#d8e8dc]"
            placeholder="岗位、公司或专业"
          />
          <fieldset className="mt-6 space-y-3">
            <legend className="mb-3 text-xs font-medium text-[#68746c]">
              工作地区
            </legend>
            {areas.map((item) => (
              <label
                key={item}
                className="flex cursor-pointer items-center gap-2.5 text-sm"
              >
                <input
                  type="radio"
                  name="area"
                  checked={area === item}
                  onChange={() => setArea(item)}
                  className="accent-[#1c6741]"
                />
                {item}
              </label>
            ))}
          </fieldset>
          <label
            htmlFor="direction"
            className="mt-6 block text-xs font-medium text-[#68746c]"
          >
            岗位方向
          </label>
          <select
            id="direction"
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d3dad4] bg-[#fafbf8] px-3 py-2.5 text-sm outline-none focus:border-[#508465]"
          >
            {directions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <label
            htmlFor="company-type"
            className="mt-6 block text-xs font-medium text-[#68746c]"
          >
            企业类别
          </label>
          <select
            id="company-type"
            value={companyType}
            onChange={(event) => setCompanyType(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d3dad4] bg-[#fafbf8] px-3 py-2.5 text-sm outline-none focus:border-[#508465]"
          >
            {companyTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <label
            htmlFor="information-level"
            className="mt-6 block text-xs font-medium text-[#68746c]"
          >
            信息完整度
          </label>
          <select
            id="information-level"
            value={informationLevel}
            onChange={(event) => setInformationLevel(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d3dad4] bg-[#fafbf8] px-3 py-2.5 text-sm outline-none focus:border-[#508465]"
          >
            {informationLevels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </aside>

        <div id="jobs">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                招聘公司
              </h2>
              <p className="mt-1 text-sm text-[#6c786f]">
                {filtered.length} 家公司 · {totalJobs} 个匹配岗位或招聘方向
              </p>
              {(area !== "全部地区" || direction !== "全部方向" || companyType !== "全部企业" || informationLevel !== "全部信息" || query) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-[#506057]">当前筛选：</span>
                  {query && <span className="rounded-full bg-[#e8eee7] px-2.5 py-1 text-[#225d3d]">关键词「{query}」</span>}
                  {area !== "全部地区" && <span className="rounded-full bg-[#e8eee7] px-2.5 py-1 text-[#225d3d]">{area}</span>}
                  {direction !== "全部方向" && <span className="rounded-full bg-[#e8eee7] px-2.5 py-1 text-[#225d3d]">{direction}</span>}
                  {companyType !== "全部企业" && <span className="rounded-full bg-[#e8eee7] px-2.5 py-1 text-[#225d3d]">{companyType}</span>}
                  {informationLevel !== "全部信息" && <span className="rounded-full bg-[#e8eee7] px-2.5 py-1 text-[#225d3d]">{informationLevel}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-mode" className="text-xs text-[#718078]">
                排序
              </label>
              <select
                id="sort-mode"
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                className="rounded-full border border-[#d3dad4] bg-white px-3 py-1.5 text-xs font-medium text-[#225d3d] outline-none focus:border-[#508465]"
              >
                <option>相关度</option>
                <option>岗位数量</option>
                <option>公司名称</option>
              </select>
              <span className="hidden rounded-full bg-[#e4ece5] px-3 py-1.5 text-xs font-semibold text-[#225d3d] sm:inline-flex">
                完整JD + 公告级信息
              </span>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2" aria-live="polite">
            {filtered.map((company) => {
              const isOpen = openCompanies.has(company.id);
              const sourceOrigin =
                sourceOrigins[company.id] ??
                company.sourceOrigin ??
                "第三方平台转发";
              const sourceOriginClass =
                sourceOrigin === "企业官网发布"
                  ? "bg-[#e4ece5] text-[#225d3d]"
                  : sourceOrigin === "官网招聘入口"
                    ? "bg-[#e8effa] text-[#29558a]"
                    : "bg-[#f1f0ec] text-[#6d665e]";
              return (
                <article
                  key={company.id}
                  className={`company-card overflow-hidden rounded-2xl ${isOpen ? "xl:col-span-2" : ""}`}
                >
                  <button
                    onClick={() => toggleCompany(company.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#fbfcf9] sm:p-6"
                  >
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#173f2a] text-xs font-bold tracking-wide text-white">
                      {company.short}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <strong className="text-xl tracking-tight">
                          {company.name}
                        </strong>
                        <span className="rounded-md bg-[#e7eef7] px-2 py-1 text-[11px] font-medium text-[#285277]">
                          {currentCategory(company)}
                        </span>
                        <span className="rounded-md bg-[#f4e8de] px-2 py-1 text-[11px] font-medium text-[#a94728]">
                          {company.batch}
                        </span>
                        <span
                          className={`rounded-md px-2 py-1 text-[11px] font-medium ${sourceOriginClass}`}
                        >
                          {sourceOrigin}
                        </span>
                        {company.status === "announcement" && (
                          <span className="rounded-md bg-[#fff2c7] px-2 py-1 text-[11px] font-medium text-[#8a5b00]">
                            公告级 · 待补全JD
                          </span>
                        )}
                      </span>
                      <span className="mt-1.5 block text-sm text-[#6b776f]">
                        {company.industry} · {company.jobs.length} 个匹配岗位
                      </span>
                    </span>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#cbd4cc] text-xl text-[#245b3c] transition ${isOpen ? "rotate-45 bg-[#e5eee7]" : ""}`}
                    >
                      ＋
                    </span>
                  </button>

                  {isOpen && (
                    <div className="drawer-in border-t border-[#e2e6e1] bg-[#f8faf7] p-3 sm:p-5">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#738077]">
                        <span>
                          来源：{company.source} · 最后核验 {company.verified}
                        </span>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#1c6741] hover:underline"
                        >
                          中国官网招聘入口 ↗
                        </a>
                      </div>
                      <div className="space-y-2">
                        {company.jobs.map((job) => {
                          const jobOpen = openJob === job.id;
                          return (
                            <section
                              key={job.id}
                              className="overflow-hidden rounded-xl border border-[#dbe2dc] bg-white"
                            >
                              <button
                                onClick={() =>
                                  setOpenJob(jobOpen ? null : job.id)
                                }
                                aria-expanded={jobOpen}
                                className="flex w-full items-center gap-3 p-4 text-left hover:bg-[#fbfcfa] sm:px-5"
                              >
                                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ce5a35]" />
                                <span className="min-w-0 flex-1">
                                  <strong className="block text-[15px]">
                                    {job.title}
                                  </strong>
                                  <span className="mt-1 block text-xs text-[#748078]">
                                    {job.location} · {job.degree} ·{" "}
                                    {job.direction}
                                  </span>
                                </span>
                                <span className="hidden text-xs font-medium text-[#1c6741] sm:block">
                                  {job.deadline}
                                </span>
                                <span
                                  className={`text-lg text-[#5d6c62] transition ${jobOpen ? "rotate-180" : ""}`}
                                >
                                  ⌄
                                </span>
                              </button>
                              {jobOpen && (
                                <div className="drawer-in border-t border-[#e5e9e5] px-4 py-5 sm:px-8 sm:py-6">
                                  {company.status === "announcement" && (
                                    <p className="mb-5 rounded-lg border border-[#eed99e] bg-[#fff8df] px-3 py-2.5 text-xs leading-5 text-[#765100]">
                                      公告级信息：企业已确认启动该届校招与招聘方向，但尚未公开或尚未能核验独立岗位JD。页面只展示当前已公开内容。
                                    </p>
                                  )}
                                  <div className="grid gap-6 md:grid-cols-2">
                                    <div>
                                      <p className="drawer-label">
                                        {company.status === "announcement"
                                          ? "已公开的工作内容"
                                          : "岗位职责"}
                                      </p>
                                      <ul className="detail-list">
                                        {job.responsibilities.map((item) => (
                                          <li key={item}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                    <div>
                                      <p className="drawer-label">
                                        {company.status === "announcement"
                                          ? "已公开的招聘条件"
                                          : "招聘要求"}
                                      </p>
                                      <ul className="detail-list">
                                        {job.requirements.map((item) => (
                                          <li key={item}>{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="mt-6 grid gap-3 rounded-xl bg-[#f1f5f0] p-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                    <p>
                                      <span className="detail-key">专业</span>
                                      {job.majors}
                                    </p>
                                    <p>
                                      <span className="detail-key">学历</span>
                                      {job.degree}
                                    </p>
                                    <p>
                                      <span className="detail-key">
                                        工作性质
                                      </span>
                                      校园招聘 · 全职
                                    </p>
                                    <p>
                                      <span className="detail-key">
                                        发布日期
                                      </span>
                                      {publicationDates[job.id]}
                                    </p>
                                    <p>
                                      <span className="detail-key">
                                        截止状态
                                      </span>
                                      {job.deadline}
                                    </p>
                                    <p>
                                      <span className="detail-key">薪资</span>
                                      企业官网未公布
                                    </p>
                                  </div>
                                  {job.note && (
                                    <p className="mt-4 rounded-lg border border-[#ead5c8] bg-[#fff8f3] px-3 py-2.5 text-xs leading-5 text-[#9b4d31]">
                                      信息说明：{job.note}
                                    </p>
                                  )}
                                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dce4dd] bg-white px-4 py-3 text-xs">
                                    <span>
                                      <strong className="text-[#284933]">
                                        网站审核：
                                      </strong>
                                      {company.status === "announcement"
                                        ? "校招已确认 · 独立JD待补全"
                                        : sourceOrigin === "企业官网发布"
                                          ? "完整官方JD · 官网显示可投"
                                          : "招聘信息已核验 · 投递前需复查官网"}
                                    </span>
                                    <span className="flex flex-wrap items-center gap-2">
                                      <button
                                        onClick={() => toggleFavorite(job.id)}
                                        className={`rounded-lg px-3 py-1.5 font-semibold ${favorites.has(job.id) ? "bg-[#e2efe3] text-[#1c6741]" : "bg-[#f1f4f0] text-[#526259]"}`}
                                      >
                                        {favorites.has(job.id)
                                          ? "已收藏"
                                          : "收藏岗位"}
                                      </button>
                                      <button
                                        onClick={() => toggleCompare(job.id)}
                                        disabled={
                                          !compareJobIds.has(job.id) &&
                                          compareJobIds.size >= 3
                                        }
                                        className={`rounded-lg px-3 py-1.5 font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${compareJobIds.has(job.id) ? "bg-[#e8edf7] text-[#285277]" : "bg-[#f1f4f0] text-[#526259]"}`}
                                      >
                                        {compareJobIds.has(job.id)
                                          ? "已加入对比"
                                          : "加入对比"}
                                      </button>
                                      <label
                                        className="sr-only"
                                        htmlFor={`stage-${job.id}`}
                                      >
                                        个人投递进度
                                      </label>
                                      <select
                                        id={`stage-${job.id}`}
                                        value={
                                          applicationStagesByJob[job.id] ??
                                          "未投递"
                                        }
                                        onChange={(event) =>
                                          setApplicationStagesByJob(
                                            (current) => ({
                                              ...current,
                                              [job.id]: event.target
                                                .value as ApplicationStage,
                                            }),
                                          )
                                        }
                                        className="rounded-lg border border-[#cbd6cc] bg-white px-2 py-1.5 text-xs text-[#33463a]"
                                      >
                                        {applicationStages.map((stage) => (
                                          <option key={stage}>{stage}</option>
                                        ))}
                                      </select>
                                    </span>
                                  </div>
                                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                    <span className="text-xs text-[#808a82]">
                                      投递前请再次核对官网最新要求
                                    </span>
                                    <span className="flex flex-wrap gap-2">
                                      {sourceOrigin === "企业官网发布" ? (
                                        <a
                                          href={job.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="rounded-xl bg-[#173f2a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#225c3a]"
                                        >
                                          前往官网投递 ↗
                                        </a>
                                      ) : (
                                        <>
                                          <a
                                            href={job.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl border border-[#b9c6bb] bg-white px-4 py-2.5 text-sm font-semibold text-[#365541] hover:bg-[#f1f5f0]"
                                          >
                                            查看原始公告 ↗
                                          </a>
                                          <a
                                            href={company.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl bg-[#173f2a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#225c3a]"
                                          >
                                            前往企业招聘入口 ↗
                                          </a>
                                        </>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </section>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#c9d1ca] bg-white px-6 py-14 text-center">
                <p className="font-semibold">没有符合当前条件的岗位</p>
                <p className="mt-2 text-sm text-[#6c786f]">
                  试试减少筛选条件。
                </p>
                <button
                  onClick={reset}
                  className="mt-5 rounded-xl bg-[#173f2a] px-4 py-2 text-sm font-semibold text-white"
                >
                  清除筛选
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        id="resume-vault"
        className={`${activeView === "resume" ? "" : "hidden"} border-t border-[#dce1da] bg-[#102d20] text-white`}
      >
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#ef9a78]">
                私有简历库
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                跨电脑保存与提取简历字段
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#bfd0c3]">
                岗位浏览仍无需登录；简历库使用邮箱账号。文件保存在私有空间，每个账号只能访问自己的文件。
              </p>
            </div>
            {resumeUser && (
              <div className="rounded-xl border border-[#426650] bg-[#173f2a] px-4 py-3 text-sm">
                <span className="block text-xs text-[#9fb5a5]">已登录</span>
                <strong>{resumeUser.email}</strong>
                <button
                  onClick={() => supabase?.auth.signOut()}
                  className="ml-3 text-xs text-[#ef9a78] hover:underline"
                >
                  退出
                </button>
              </div>
            )}
          </div>

          {!supabase ? (
            <div className="mt-6 rounded-xl border border-[#745c49] bg-[#3a2e25] p-4 text-sm text-[#f4d8c8]">
              简历库尚未配置完成。
            </div>
          ) : !resumeUser ? (
            <div className="mt-6 max-w-xl rounded-2xl border border-[#426650] bg-[#173f2a] p-5">
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setAuthMode("login")}
                  className={`rounded-lg px-3 py-1.5 text-sm ${authMode === "login" ? "bg-white text-[#173f2a]" : "bg-[#284b36] text-white"}`}
                >
                  邮箱登录
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={`rounded-lg px-3 py-1.5 text-sm ${authMode === "register" ? "bg-white text-[#173f2a]" : "bg-[#284b36] text-white"}`}
                >
                  注册账号
                </button>
              </div>
              <label className="block text-xs text-[#b7cabd]">
                邮箱
                <input
                  type="email"
                  value={authEmail}
                  onChange={(event) => setAuthEmail(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#53735d] bg-[#102d20] px-3 py-2.5 text-sm text-white outline-none focus:border-[#91b49a]"
                  autoComplete="email"
                />
              </label>
              <label className="mt-3 block text-xs text-[#b7cabd]">
                密码（至少 8 位）
                <input
                  type="password"
                  value={authPassword}
                  onChange={(event) => setAuthPassword(event.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#53735d] bg-[#102d20] px-3 py-2.5 text-sm text-white outline-none focus:border-[#91b49a]"
                  autoComplete={
                    authMode === "register"
                      ? "new-password"
                      : "current-password"
                  }
                />
              </label>
              <button
                onClick={handleAuth}
                disabled={resumeBusy}
                className="mt-4 w-full rounded-xl bg-[#ef9a78] px-4 py-2.5 text-sm font-semibold text-[#2f201a] disabled:opacity-50"
              >
                {authMode === "login" ? "登录简历库" : "注册并发送验证邮件"}
              </button>
              <button
                onClick={resendVerification}
                disabled={resumeBusy || !authEmail}
                className="mt-3 w-full text-xs text-[#b7cabd] hover:text-white disabled:opacity-40"
              >
                没收到或旧链接失效？重新发送验证邮件
              </button>
            </div>
          ) : (
            <div className="mt-7 grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
              <div className="rounded-2xl border border-[#426650] bg-[#173f2a] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">上传并提取字段</h3>
                    <p className="mt-1 text-xs text-[#a9bdae]">
                      PDF、DOCX、TXT，最大 10 MB。解析先在浏览器完成。
                    </p>
                  </div>
                  <label className="cursor-pointer rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#173f2a]">
                    选择简历
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={(event) =>
                        handleResumeFile(event.target.files?.[0] ?? null)
                      }
                      className="sr-only"
                    />
                  </label>
                </div>
                {(resumeFile || selectedResumeId) && (
                  <>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {(
                        Object.keys(resumeFieldLabels) as Array<
                          keyof typeof resumeFieldLabels
                        >
                      )
                        .filter((key) => key !== "selfEvaluation")
                        .map((key) => (
                        <label
                          key={key}
                          className={`text-xs text-[#b7cabd] ${key === "skills" ? "sm:col-span-2" : ""}`}
                        >
                          {resumeFieldLabels[key]}
                          <span className="mt-1.5 flex gap-2">
                            <input
                              value={resumeFields[key]}
                              onChange={(event) =>
                                setResumeFields((current) => ({
                                  ...current,
                                  [key]: event.target.value,
                                }))
                              }
                              className="min-w-0 flex-1 rounded-lg border border-[#53735d] bg-[#102d20] px-3 py-2 text-sm text-white outline-none focus:border-[#91b49a]"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                navigator.clipboard.writeText(resumeFields[key])
                              }
                              disabled={!resumeFields[key]}
                              className="rounded-lg border border-[#53735d] px-2 text-xs disabled:opacity-40"
                            >
                              复制
                            </button>
                          </span>
                        </label>
                      ))}
                    </div>
                    <section className="mt-5 rounded-xl border border-[#426650] bg-[#102d20] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div><h4 className="font-semibold">项目经历</h4><p className="mt-1 text-xs text-[#a9bdae]">识别到 {resumeFields.projects.length} 个项目，分别保存和编辑。</p></div>
                        <button type="button" onClick={() => setResumeFields((current) => ({ ...current, projects: [...current.projects, { name: "", time: "", content: "" }] }))} className="rounded-lg border border-[#53735d] px-3 py-1.5 text-xs">新增项目</button>
                      </div>
                      <div className="mt-4 space-y-4">
                        {resumeFields.projects.map((project, index) => <article key={`${index}-${project.name}`} className="rounded-xl border border-[#456952] bg-[#173f2a] p-4"><div className="flex items-center justify-between"><strong className="text-sm">项目 {index + 1}</strong><button type="button" onClick={() => setResumeFields((current) => ({ ...current, projects: current.projects.filter((_, projectIndex) => projectIndex !== index) }))} className="text-xs text-[#ffc5b4]">移除</button></div><div className="mt-3 grid gap-3 sm:grid-cols-2"><label className="text-xs text-[#b7cabd]">项目名称<input value={project.name} onChange={(event) => setResumeFields((current) => ({ ...current, projects: current.projects.map((item, projectIndex) => projectIndex === index ? { ...item, name: event.target.value } : item) }))} className="mt-1.5 w-full rounded-lg border border-[#53735d] bg-[#102d20] px-3 py-2 text-sm text-white" /></label><label className="text-xs text-[#b7cabd]">项目时间<input value={project.time} onChange={(event) => setResumeFields((current) => ({ ...current, projects: current.projects.map((item, projectIndex) => projectIndex === index ? { ...item, time: event.target.value } : item) }))} className="mt-1.5 w-full rounded-lg border border-[#53735d] bg-[#102d20] px-3 py-2 text-sm text-white" /></label></div><label className="mt-3 block text-xs text-[#b7cabd]">项目内容<textarea value={project.content} onChange={(event) => setResumeFields((current) => ({ ...current, projects: current.projects.map((item, projectIndex) => projectIndex === index ? { ...item, content: event.target.value } : item) }))} className="mt-1.5 min-h-40 w-full rounded-lg border border-[#53735d] bg-[#102d20] px-3 py-2 text-sm leading-6 text-white" /></label><button type="button" onClick={() => navigator.clipboard.writeText(`项目名称：${project.name}\n项目时间：${project.time}\n项目内容：${project.content}`)} className="mt-2 rounded-lg border border-[#53735d] px-3 py-1.5 text-xs">复制该项目</button></article>)}
                        {resumeFields.projects.length === 0 && <p className="rounded-lg border border-dashed border-[#4d6c57] p-3 text-xs text-[#a9bdae]">未自动识别到项目时，可点击“新增项目”手动补充。</p>}
                      </div>
                    </section>
                    <label className="mt-5 block text-xs text-[#b7cabd]">{resumeFieldLabels.selfEvaluation}<textarea value={resumeFields.selfEvaluation} onChange={(event) => setResumeFields((current) => ({ ...current, selfEvaluation: event.target.value }))} className="mt-1.5 min-h-40 w-full rounded-lg border border-[#53735d] bg-[#102d20] px-3 py-2 text-sm leading-6 text-white" /></label>
                    {resumeText && (
                      <details className="mt-4 rounded-xl bg-[#102d20] p-3">
                        <summary className="cursor-pointer text-xs text-[#b7cabd]">
                          查看提取的原始文本
                        </summary>
                        <textarea
                          value={resumeText}
                          onChange={(event) =>
                            setResumeText(event.target.value)
                          }
                          className="mt-3 h-36 w-full rounded-lg border border-[#53735d] bg-[#0c2419] p-3 text-xs text-[#d6e2d8]"
                        />
                      </details>
                    )}
                    <button
                      onClick={
                        selectedResumeId ? saveResumeFields : uploadResume
                      }
                      disabled={resumeBusy}
                      className="mt-5 w-full rounded-xl bg-[#ef9a78] px-4 py-2.5 text-sm font-semibold text-[#2f201a] disabled:opacity-50"
                    >
                      {selectedResumeId
                        ? "保存字段到云端"
                        : `上传 ${resumeFile?.name ?? "简历"}`}
                    </button>
                  </>
                )}
              </div>
              <div className="rounded-2xl border border-[#426650] bg-[#173f2a] p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">云端简历</h3>
                  <span className="text-xs text-[#a9bdae]">
                    {resumeRecords.length} 份
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {resumeLoading ? (
                    <p className="rounded-xl border border-dashed border-[#4d6c57] p-5 text-sm text-[#9fb5a5]">正在读取云端简历，请稍候…</p>
                  ) : resumeRecords.length ? (
                    resumeRecords.map((record) => (
                      <article
                        key={record.id}
                        className="rounded-xl border border-[#456952] bg-[#102d20] p-4"
                      >
                        <strong className="block truncate text-sm">
                          {record.file_name}
                        </strong>
                        <p className="mt-1 text-xs text-[#94aa9a]">
                          {(record.file_size / 1024 / 1024).toFixed(2)} MB ·{" "}
                          {new Date(record.created_at).toLocaleDateString(
                            "zh-CN",
                          )}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setSelectedResumeId(record.id);
                              setResumeFields({
                                ...emptyResumeFields,
                                ...record.fields,
                              });
                              setResumeFile(null);
                              setResumeText("");
                            }}
                            className="rounded-lg bg-[#284b36] px-3 py-1.5 text-xs"
                          >
                            查看字段
                          </button>
                          <button
                            onClick={() => reextractCloudResume(record)}
                            disabled={resumeBusy}
                            className="rounded-lg bg-[#284b36] px-3 py-1.5 text-xs disabled:opacity-40"
                          >
                            重新提取
                          </button>
                          <button
                            onClick={() => downloadResume(record)}
                            className="rounded-lg bg-[#284b36] px-3 py-1.5 text-xs"
                          >
                            下载
                          </button>
                          <button
                            onClick={() => deleteResume(record)}
                            className="rounded-lg bg-[#4a2b25] px-3 py-1.5 text-xs text-[#ffc5b4]"
                          >
                            删除
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-[#4d6c57] p-5 text-sm text-[#9fb5a5]">
                      登录后上传第一份简历，即可在其他电脑访问。
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {resumeMessage && (
            <p className="mt-4 rounded-xl bg-[#173f2a] px-4 py-3 text-sm text-[#d5e4d8]">
              {resumeMessage}
            </p>
          )}
        </div>
      </section>

      {comparisonJobs.length > 0 && (
        <section id="compare" className={`${activeView === "jobs" ? "" : "hidden"} border-t border-[#dce1da] bg-white`}>
          <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-[#ce5a35]">
                  岗位横向对比
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                  已选择 {comparisonJobs.length} / 3 个岗位
                </h2>
              </div>
              <button
                onClick={() => setCompareJobIds(new Set())}
                className="rounded-xl border border-[#b7c5b8] px-4 py-2 text-sm font-semibold text-[#365541]"
              >
                清空对比
              </button>
            </div>
            <div className="mt-6 overflow-x-auto rounded-xl border border-[#dce3dd]">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-[#edf3ed]">
                  <tr>
                    <th className="w-32 p-3 text-xs text-[#627068]">对比项</th>
                    {comparisonJobs.map(({ company, job }) => (
                      <th key={job.id} className="min-w-52 p-3">
                        <span className="block text-xs text-[#6d786f]">
                          {company.name}
                        </span>
                        <strong className="mt-1 block">{job.title}</strong>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["地点", ...comparisonJobs.map(({ job }) => job.location)],
                    ["学历", ...comparisonJobs.map(({ job }) => job.degree)],
                    ["方向", ...comparisonJobs.map(({ job }) => job.direction)],
                    ["专业", ...comparisonJobs.map(({ job }) => job.majors)],
                    [
                      "投递状态",
                      ...comparisonJobs.map(
                        ({ job }) => applicationStagesByJob[job.id] ?? "未投递",
                      ),
                    ],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-[#e2e7e2]">
                      <th className="p-3 text-xs text-[#627068]">{row[0]}</th>
                      {row.slice(1).map((cell, index) => (
                        <td
                          key={`${row[0]}-${comparisonJobs[index].job.id}`}
                          className="p-3 align-top leading-6 text-[#34473a]"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section id="my-list" className={`${activeView === "saved" ? "" : "hidden"} border-t border-[#dce1da] bg-[#edf3ed]`}>
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#ce5a35]">
                我的投递清单
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                已收藏 {savedJobs.length} 个岗位
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#66736a]">
                收藏和投递进度仅保存于当前浏览器，不需要账号，也不会上传到招聘网站。
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportSavedJobs}
                disabled={savedJobs.length === 0}
                className="rounded-xl bg-[#173f2a] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                导出 CSV
              </button>
              <button
                onClick={() => {
                  setFavorites(new Set());
                  setApplicationStagesByJob({});
                }}
                disabled={savedJobs.length === 0}
                className="rounded-xl border border-[#b7c5b8] bg-white px-4 py-2 text-sm font-semibold text-[#365541] disabled:cursor-not-allowed disabled:opacity-40"
              >
                清空本地清单
              </button>
            </div>
          </div>
          {savedJobs.length > 0 ? (
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {savedJobs.map(({ company, job }) => (
                <article
                  key={job.id}
                  className="rounded-xl border border-[#d7e0d8] bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong>{job.title}</strong>
                      <p className="mt-1 text-xs text-[#68756c]">
                        {company.name} · {job.location}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleFavorite(job.id)}
                      className="text-xs font-semibold text-[#9a4e32] hover:underline"
                    >
                      移除
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-semibold text-[#1c6741] hover:underline"
                    >
                      打开投递页 ↗
                    </a>
                    <label className="flex items-center gap-2 text-xs text-[#5e6e64]">
                      我的进度
                      <select
                        value={applicationStagesByJob[job.id] ?? "未投递"}
                        onChange={(event) =>
                          setApplicationStagesByJob((current) => ({
                            ...current,
                            [job.id]: event.target.value as ApplicationStage,
                          }))
                        }
                        className="rounded-lg border border-[#cbd6cc] bg-white px-2 py-1.5 text-xs"
                      >
                        {applicationStages.map((stage) => (
                          <option key={stage}>{stage}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-[#bdcabf] bg-white/70 px-5 py-8 text-sm text-[#657269]">
              在任一岗位详情中点击“收藏岗位”，它就会出现在这里。
            </div>
          )}
        </div>
      </section>

      <section className={`${activeView === "radar" ? "" : "hidden"} border-t border-[#dce1da] bg-white`}>
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.16em] text-[#ce5a35]">
                重点企业雷达
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                {radarFiltered.length} 家持续监测企业
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66736a]">
                这些企业在目标地区设有制造、研发或工程技术岗位。尚未进入“当前可投”列表的，不代表没有机会，只是尚未满足本站的校招与岗位信息核验标准。
              </p>
            </div>
            <span className="w-fit rounded-full border border-[#cbd5cc] px-3 py-1.5 text-xs font-semibold text-[#42624d]">
              上市公司 · 央国企 · 头部制造
            </span>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {radarFiltered.map((company) => (
              <a
                key={company.name}
                href={company.url}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl border border-[#dde4de] bg-[#fbfcfa] p-4 transition hover:-translate-y-0.5 hover:border-[#9cb6a1] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <strong className="text-[15px] group-hover:text-[#1c6741]">
                    {company.name}
                  </strong>
                  <span className="shrink-0 rounded-md bg-[#e8eef7] px-2 py-1 text-[10px] font-semibold text-[#285277]">
                    {radarCategory(company)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#657269]">{company.area}</p>
                <p className="mt-1 text-sm text-[#33463a]">{company.focus}</p>
                <p className="mt-3 text-xs font-semibold text-[#1c6741]">
                  查看招聘入口 ↗
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section
        id="standards"
        className={`${activeView === "standards" ? "" : "hidden"} border-t border-[#dce1da] bg-[#173f2a] text-white`}
      >
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_1.25fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-[#ef9a78]">
              收录标准
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              岗位与企业，分层呈现
            </h2>
          </div>
          <div className="grid gap-4 text-sm leading-6 text-[#d4e2d7] sm:grid-cols-2">
            <p>
              <strong className="block text-white">中国官网优先</strong>
              所有企业以中国官网或中国区官方校招站为核验入口；外企同样优先中国区官网。
            </p>
            <p>
              <strong className="block text-white">工程技术都收录</strong>
              机械设计、研发、工艺、质量、设备、测试、自动化、智能制造等工程技术岗均纳入审核。
            </p>
            <p>
              <strong className="block text-white">仅排除生产技能岗</strong>
              不收录 CNC
              操作、普工、流水线操作员等生产技能岗位；不因岗位在制造现场而排除工程师岗位。
            </p>
            <p>
              <strong className="block text-white">完整职责与资格</strong>
              逐项展示企业公布的职责和任职要求；公告级信息明确标为待补全。
            </p>
          </div>
        </div>
      </section>
      <footer className="bg-[#102d20] px-5 py-6 text-center text-xs text-[#9fb3a5]">
        公开访问，无需登录。岗位信息以企业官网实时页面为最终依据。
      </footer>
    </main>
  );
}
