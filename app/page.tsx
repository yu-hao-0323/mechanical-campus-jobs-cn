'use client';

import { useMemo, useState } from 'react';

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
  status?: 'official' | 'announcement';
  jobs: Job[];
};

const catOps = 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000388302/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E5%88%B6%E9%80%A0%E8%BF%90%E8%90%A5%E7%B1%BB/';
const catMfg = 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000387385/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E5%88%B6%E9%80%A0%E8%BF%90%E8%90%A5%E7%B1%BB-%E5%88%B6%E9%80%A0%E5%B7%A5%E7%A8%8B%E5%B8%88-%E6%9C%BA%E6%A2%B0%E8%87%AA%E5%8A%A8%E5%8C%96%E6%99%BA%E8%83%BD%E5%8C%96%E4%BB%BF%E7%9C%9F/';
const catPower = 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000387378/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E7%A0%94%E5%8F%91%E6%8A%80%E6%9C%AF%E7%B1%BB-%E5%8F%91%E5%8A%A8%E6%9C%BA-%E4%BC%A0%E5%8A%A8%E6%96%B9%E5%90%91/';
const companies: Company[] = [
  {
    id: 'caterpillar', name: '卡特彼勒', short: 'CAT', industry: '工程机械与动力系统', batch: '2027届校园招聘', verified: '2026-08-27 18:10', source: '卡特彼勒招聘官网', website: 'https://careers.caterpillar.com/zh/',
    jobs: [
      { id: 'cat-logistics', title: '智能物流研发工程师', location: '江苏 · 徐州', areas: ['江苏全域'], degree: '本科及以上', direction: '自动化', majors: '机械、电气自动化、智能物流、工业工程或计算机相关专业', deadline: '截止 2026-10-30', responsibilities: ['负责 AGV/AMR 或自动化仓库的现场部署、业务逻辑梳理及供应商沟通', '完成 AGV 路线建图、站点配置、对接调试及任务配置', '完成简单逻辑电路设计修改，解决联调问题', '开展 AGV 整车机械、电气元器件检修及导航激光校准', '记录现场问题并协同研发、生产人员推动产品迭代', '处理项目售后问题，对客户开展使用培训并配合项目验收'], requirements: ['本科及以上，机械、电气自动化、智能物流、工业工程或计算机相关专业', '熟悉低压电气元件、传感器、驱动器、电机和编码器', '熟悉电路图并能独立完成接线，具有 PLC 软件基础', '具备软件代码及应用层基础', '熟悉 TCP/IP、串口、MODBUS、S7、CAN 等工业通信协议', '抗压、沟通协调和学习能力强', '熟悉 AGV/ASRS 机械电气结构、工程机械生产工艺或独立项目经验者优先'], url: catOps },
      { id: 'cat-digital', title: '数字化工程师', location: '江苏 · 徐州', areas: ['江苏全域'], degree: '本科及以上', direction: '自动化', majors: '计算机、软件、工业工程或相关工科专业', deadline: '截止 2026-10-30', responsibilities: ['推动企业级数字化转型与落地实施', '围绕业务需求参与并主导数字化解决方案设计与开发', '运用数据分析和智能办公自动化技术提升运营效率与决策能力', '精简部署流程、提高实施效率并降低项目风险'], requirements: ['具备清晰高效的沟通能力', '掌握识别、预判和解决组织、运营或流程问题的方法', '理解软件产品技术架构与关键技术要素', '能够设计、配置及集成软件产品技术方案', '能够排查硬件、软件、应用系统或运营过程中的技术故障'], url: catOps },
      { id: 'cat-mfg-xz', title: '制造工程师（机械 / 自动化 / 智能方向）', location: '江苏 · 徐州', areas: ['江苏全域'], degree: '本科及以上', direction: '制造工程', majors: '电气工程、机械工程、自动化或人工智能相关专业', deadline: '截止 2026-10-30', responsibilities: ['分析生产车间智能化需求，负责智能数字化总体规划、设计和实施', '识别自动化改进机会，推进信息化、自动化方案落地', '参与设备智能规划、模拟、优化和自动化升级改造', '运用精益原则推动持续改进并跟踪项目进度', '管理自动化/机器人供应商并处理产线自动化异常', '根据新产品特性在现有设备中实现自动化'], requirements: ['电气工程、机械工程、自动化或人工智能相关本科及以上学历', '熟悉 AutoCAD、三维设计软件、工厂模拟和 PLC 编程', '具备智能制造技术基础，熟悉视觉系统和软件编程', '具备研究分析、技术文档、团队协作和沟通能力', '智能制造或跨部门项目负责人经验优先', '了解精益制造，英语读听说能力良好者优先'], url: catOps },
      { id: 'cat-virtual', title: '虚拟制造工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '本科或硕士', direction: '仿真分析', majors: '先进制造、机械设计或机械制造专业', deadline: '截止 2026-10-30', responsibilities: ['使用虚拟分析与仿真工具验证新产品设计和三维工厂', '协同设计、集成、测试和制造工程师完成零部件、系统及整机工艺虚拟验证', '通过虚拟装配、虚拟审查和制造仿真优化产品及工艺设计', '开发三维数字化工厂，验证并优化生产线布局和制造工序'], requirements: ['先进制造、机械设计或机械制造专业本科或研究生', '熟练使用三维建模和制造技术仿真软件', '具备优秀的问题解决能力', '具备优秀英文听说读写及沟通能力', '积极主动并具有团队合作精神'], url: catMfg },
      { id: 'cat-smart', title: '智能制造工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '硕士及以上', direction: '自动化', majors: '机械工程、汽车工程、自动化或相近专业', deadline: '截止 2026-10-30', responsibilities: ['根据客户需求创建三维数字化工厂模型并验证工艺布局', '建立、运行并迭代过程仿真模型，解释结果并形成结论', '验证工艺流程开发结果，交付验证报告并协调计划', '协同制造和测试团队交付及改进新流程', '参与跨部门过程评审，支持工艺团队验证仿真方案', '归档过程仿真模型与结果并持续跟踪新技术'], requirements: ['机械工程、汽车工程、自动化或相同专业硕士及以上', '具备 Creo 或其他同类三维建模软件能力', '具备 Siemens 类软件或 Vis Mockup 背景者优先', '具备智能制造或机器学习经验者优先', '具备问题解决、沟通协作、自主学习和严谨负责的工作态度', '出差比例低于 10%'], url: catMfg },
      { id: 'cat-engine', title: '发动机零部件设计工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '本科或硕士', direction: '研发设计', majors: '机械工程或机械相关专业', deadline: '截止 2026-10-30', responsibilities: ['主导新发动机零部件设计与开发', '开展 DFMEA，编制并执行 DVP&R', '创建 TAN、EDR 等工程技术文件', '准备并主持跨职能设计评审', '推动稳健且具有成本效益的设计方案', '支持零部件资源切换和本地化项目'], requirements: ['机械工程或机械相关专业本科或硕士', '理解产品设计开发流程并能把客户需求转化为设计', '具备 CAD/CAE、设计分析及可制造性知识', '能够管理多个并发目标和项目优先级', '具备较强英语书面与口头沟通、协作和人际交往能力'], url: catPower },
      { id: 'cat-transmission', title: '传动系统设计工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '本科或硕士', direction: '研发设计', majors: '机械工程或机械相关专业', deadline: '截止 2026-10-30', responsibilities: ['负责动力传动产品或部件设计与分析', '参与传动系统产品开发、工程验证和技术问题解决', '协同跨职能团队推进设计、制造与产品落地'], requirements: ['机械工程或机械相关专业本科或硕士', '掌握变矩器、变速箱和驱动桥等动力传动系统知识', '了解锻造、热处理、机加工和检验制造技术', '具备 CAD/CAE、产品设计开发和工程分析能力', '具备良好英语书面及口头沟通能力'], url: catPower },
    ],
  },
  {
    id: 'sany', name: '三一集团', short: 'SANY', industry: '工程机械与高端装备', batch: '2027届秋季校园招聘', verified: '2026-08-27 19:20', source: '三一集团校招系统', website: 'https://sany.zhiye.com/campus/jobs',
    jobs: [
      { id: 'sany-mech', title: '机械工程师', location: '江苏 · 昆山 / 常熟', areas: ['江苏全域'], degree: '硕士及以上', direction: '研发设计', majors: '机械设计制造及其自动化、车辆工程、机械电子工程、工业设计等', deadline: '申请入口开放', responsibilities: ['承担通用机械、传动或转向/制动/悬架等底盘系统设计开发与验证', '负责需求分析、方案设计、三维建模和工程图纸输出', '开展选型匹配、设计评审和技术文件编制', '跟进样机试制、装配调试及试验验证，闭环技术问题', '推进产品系列化、标准化、降本和持续优化'], requirements: ['硕士及以上，机械设计制造、车辆、机械电子或工业设计等专业优先', '掌握机械原理、工程制图、机械系统及零部件设计', '能使用 CAD、Creo、CATIA 等工具建模分析', '掌握通用机械、传动或底盘系统匹配验证方法', '逻辑清晰、严谨负责，具备学习、分析、沟通和协作能力', '相关科研、竞赛、实习或项目经历优先，能配合现场调试或短期出差'], url: 'https://sany.zhiye.com/campus/jobs' },
      { id: 'sany-hydraulic', title: '液压工程师', location: '江苏 · 昆山 / 杭州', areas: ['江苏全域', '杭州'], degree: '硕士及以上', direction: '研发设计', majors: '机械工程、流体传动与控制、液压、车辆工程等', deadline: '申请入口开放', responsibilities: ['承担液压系统总体、回路或泵阀缸等元件设计选型与验证', '负责需求分析、回路设计、参数匹配与元件选型', '输出液压原理图、技术规范、计算分析及设计文件', '参与系统联调、性能测试和故障诊断', '推动泄漏、温升、冲击问题闭环及效率、可靠性和成本优化'], requirements: ['硕士及以上，机械、流体传动、液压、车辆等专业优先', '掌握液压传动、元件选型和系统回路设计', '能使用液压仿真、测试和数据分析工具', '具备液压元件性能分析能力', '逻辑清晰，具备学习、工程分析、沟通和团队协作能力', '相关科研、竞赛、实习或项目经历优先，可配合现场调试和短期出差'], url: 'https://sany.zhiye.com/campus/jobs' },
      { id: 'sany-test', title: '测试工程师', location: '江苏 · 昆山', areas: ['江苏全域'], degree: '硕士及以上', direction: '质量测试', majors: '机械、车辆、电气、自动化、测试计量等', deadline: '申请入口开放', responsibilities: ['负责产品或系统试验需求分析、测试方案、验证计划和评价标准制定', '搭建测试环境并实施功能、性能、可靠性或耐久试验', '分析测试数据和异常原因，推动问题整改、复测与闭环', '编制试验报告，维护测试规范、设备及数据资产'], requirements: ['硕士及以上，机械、车辆、电气、自动化或测试计量等专业优先', '掌握试验设计、测试设备使用、数据采集分析和验证流程', '逻辑清晰、严谨负责，具备学习、工程问题分析、沟通和协作能力', '相关科研、竞赛、实习或项目经历优先，可配合试制、测试、现场调试或短期出差'], url: 'https://sany.zhiye.com/campus/jobs' },
      { id: 'sany-product', title: '产品规划工程师', location: '江苏 · 昆山 / 常熟', areas: ['江苏全域'], degree: '硕士及以上', direction: '研发设计', majors: '车辆工程、机械工程、工业工程、市场营销等', deadline: '申请入口开放', responsibilities: ['开展市场客户需求、产品路线和配置规划或整车总布置工作', '研究市场、客户、竞品与技术趋势并识别产品机会', '负责产品定位、功能配置、技术指标及路线规划', '协同研发、营销、制造推进立项、评审和上市交付', '跟踪产品表现与反馈，持续优化产品组合和全生命周期'], requirements: ['硕士及以上，车辆、机械、工业工程或市场营销等专业优先', '具备市场客户需求分析、产品定义、竞品研究和生命周期管理能力', '掌握市场研究、产品定义、整车总布置等方法', '逻辑清晰，具备学习、工程分析、跨专业沟通和协作能力', '相关科研、竞赛、实习或项目经历优先，可配合现场调试或短期出差'], url: 'https://sany.zhiye.com/campus/jobs' },
      { id: 'sany-assembly', title: '装配与装调工艺工程师', location: '江苏 · 常熟', areas: ['江苏全域'], degree: '本科及以上', direction: '制造工程', majors: '机械工程、电气工程、车辆工程、工业工程等', deadline: '申请入口开放', responsibilities: ['承担厂内装调、现场安装、产线建设或通用装配工艺策划与验证', '制定装配装调工艺方案、工位布置和作业标准', '参与工艺验证、新品导入和人员培训', '分析质量、节拍和安全问题并推动闭环', '优化工装、流程、产能和作业方法'], requirements: ['本科及以上，部分方向要求硕士；机械、电气、车辆、工业工程等专业优先', '掌握装配调试工艺、工位规划、工时分析和作业文件编制', '具备装配装调、现场安装、产线或园区建设工艺至少一个方向能力', '具备学习、工程分析、沟通协作能力', '相关项目经历优先，可配合现场调试或短期出差'], url: 'https://sany.zhiye.com/campus/jobs' },
      { id: 'sany-process', title: '制造工艺工程师', location: '江苏 · 昆山', areas: ['江苏全域'], degree: '本科及以上', direction: '制造工程', majors: '机械工程、材料成型、焊接、车辆工程、工业工程等', deadline: '申请入口开放', responsibilities: ['承担车架、焊接、机加工、涂装、下料成型或通用制造工艺规划验证', '规划新产品工艺、工序路线、参数标准和作业文件', '参与新品导入、工艺验证、试制爬坡和异常处理', '开展焊接、机加、涂装或成型工艺优化及风险控制', '推动效率、质量、成本、自动化和精益改善项目'], requirements: ['本科及以上，部分方向要求硕士；机械、材料成型、焊接、车辆或工业工程等专业优先', '掌握工艺规划、工时产能分析、文件编制和现场问题解决', '具备车架、焊接、机加、涂装或下料成型至少一个专项方向', '具备学习、工程分析、沟通和团队协作能力', '相关项目经历优先，可配合试制、测试、现场调试或短期出差'], url: 'https://sany.zhiye.com/campus/jobs' },
    ],
  },
  {
    id: 'geely', name: '吉利控股', short: 'GEELY', industry: '汽车与智能出行', batch: '2027届秋季全球校招', verified: '2026-08-27 19:10', source: '吉利校园招聘官网', website: 'https://campus.geely.com/campus-recruitment/geely/78436?locale=zh-CN#/jobs?commitment%5B0%5D=%E5%85%A8%E8%81%8C',
    jobs: [
      { id: 'geely-mech-maint', title: '机械维修岗', location: '浙江 · 宁波', areas: ['宁波'], degree: '本科及以上', direction: '设备工程', majors: '机械、电气、自动化等相关专业优先', deadline: '申请入口开放', responsibilities: ['负责工厂设备产品的程序设计、改良和升级优化', '制作机械原理图并指导布线安装', '负责设备故障排查、升级和维修保养', '负责新项目机械方案及机械控制需求设计', '响应现场设备报修并快速恢复生产'], requirements: ['本科及以上，机械、电气、自动化等相关专业优先', 'CET-4 及以上，具备良好英语听说读写能力', '具备设备电气、机械系统维护和设计能力', '熟悉机械制造、装配和测试基础知识', '了解常见设备及检测方法，能够阅读图纸', '具备沟通表达和团队协作精神，相关项目或实习经验优先'], url: 'https://campus.geely.com/campus-recruitment/geely/78436?locale=zh-CN#/job/8ba0dc88-85df-4217-91e9-1b7108eb8d76' },
      { id: 'geely-elec-maint', title: '机械电气维修岗', location: '浙江 · 宁波', areas: ['宁波'], degree: '本科及以上', direction: '设备工程', majors: '机械、电气自动化、电气控制相关专业', deadline: '申请入口开放', responsibilities: ['执行挂牌上锁等安全规定，编制安全操作规程并落实培训', '审核维修工单、收集故障数据并提出技改方案', '参与疑难故障维修与分析，采购电气备件、耗材和工辅具', '编制优化 TPM、PM 计划和设备单机卡，优化加工动作及防错程序', '编制培训课件并培训电气/机械维修人员', '分析备件异常消耗，调整库存并支持备件采购'], requirements: ['本科及以上，机械、电气自动化或电气控制相关专业', 'CET-4 以上或英语听说读写熟练', '熟练掌握电气/机械控制图纸和硬件规范', '熟练应用 FANUC、SIEMENS Step7 等编程软件', '具备设备电气/机械控制改造调试能力', '具备 S120 等驱动系统调试和诊断能力'], url: 'https://campus.geely.com/campus-recruitment/geely/78436?locale=zh-CN#/job/3b260a99-eb56-4751-84e6-9e18030fbfc4' },
    ],
  },
  {
    id: 'sungrow', name: '阳光电源', short: 'SG', industry: '新能源装备与电力电子', batch: '2027届全球校招正式批', verified: '2026-08-27 19:35', source: '阳光电源校园招聘官网', website: 'https://app.mokahr.com/campus-recruitment/sungrow/94416#/jobs',
    jobs: [
      { id: 'sg-reliability', title: '可靠性工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '博士', direction: '质量测试', majors: '电气工程、电力电子、材料、可靠性工程、机械工程等', deadline: '正式批申请开放', responsibilities: ['参与搭建功率半导体、电力电子/储能整机及零部件可靠性评估体系，编制标准和测试规范', '配合完成加速老化、逆向分析和整机可靠性试验方案设计、落地与判定', '使用电学测试、金相、SEM-EDS、X-ray、热成像等手段分析器件、结构件、功率模块和电池失效', '运用 FMEA、FTA 开展可靠性风险分析，在器件、材料、结构和电路设计阶段识别隐患', '参与宽禁带器件、电池和高压绝缘老化等课题研究并沉淀方法'], requirements: ['2027届博士，电气、电力电子、材料、可靠性或机械工程等专业', '熟悉电力电子拓扑和高压绝缘，掌握 IGBT/SiC 特性并了解储能电池基础', '掌握可靠性理论、加速寿命试验、威布尔分析、ESS/HASS 等方法', '了解高分子、金属和电池材料老化机理及相关国标、IEC 标准', '逻辑清晰，善于故障分析，具备钻研、并行推进和抗压能力', '高压设备、光储 PCS、功率半导体封装可靠性或产学研项目经历优先'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416#/job/6b00594c-d8a8-4991-acd3-43cbb5004b37' },
      { id: 'sg-equipment', title: '设备工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '本科及以上', direction: '设备工程', majors: '电气类、机械类、工业工程类相关专业', deadline: '正式批申请开放', responsibilities: ['指导统筹日常设备故障维修、问题分析和跟踪总结，协调突发事件资源', '起草设备技改方案并跟进落地，提升生产率、自动化和信息化水平', '管理设备档案、现场资料、软件及核心设备备件', '搭建并推进 TPM 体系，降低故障率并提升综合效率', '制定年度、月度和周维护计划，编制操作程序和标准作业流程，监控 OEE'], requirements: ['2027届本科及以上毕业生', '电气类、机械类或工业工程类相关专业'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416#/job/7be305ea-0745-4954-957e-522b5295c86f' },
      { id: 'sg-manufacturing', title: '制造管理工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '本科及以上', direction: '制造工程', majors: '工业工程、机械制造、电气工程等相关专业', deadline: '正式批申请开放', responsibilities: ['统筹光伏、储能产品生产制造全流程运行管理', '主导生产制程优化，识别工艺瓶颈并提升产能效率', '监督现场作业规范落地，保障产品质量', '协调生产、工艺和质量团队，闭环生产异常', '分析运营数据，制定并跟踪降本增效方案', '迭代生产管理体系并完善标准化流程', '监控生产安全合规并排查运营风险'], requirements: ['工业工程、机械制造或电气工程等专业本科及以上', '掌握精益生产、IE 改善等方法', '能够熟练使用办公软件和生产管理系统开展统计分析'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416#/job/53f4383d-defc-4264-b806-b377e95d422e' },
      { id: 'sg-tooling', title: '工装设计工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '本科及以上', direction: '研发设计', majors: '机械设计、自动化相关专业', deadline: '正式批申请开放', responsibilities: ['负责新能源电源设备生产工装夹具、模具的方案设计与优化', '主导方案评审并协同生产、工艺部门验证可行性', '设计工装 3D/2D 图纸，编制技术要求和 BOM', '跟踪加工、装配和试产，解决现场应用问题', '评估工装效率并优化结构以提升良率和效率', '建立技术档案并规范全生命周期维护流程', '对接供应商并跟踪外采工装质量和周期'], requirements: ['机械设计、自动化相关专业本科及以上', '熟练使用 SolidWorks、AutoCAD，掌握机械加工工艺', '熟悉工装夹具、非标自动化治具设计，可独立完成全流程设计', '了解钣金、机加工、注塑等工艺，具备现场问题解决能力', '严谨细致，具备跨部门沟通和团队协作意识'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416#/job/c828f8b3-cf8f-48b2-8281-f5556c4f9e42' },
    ],
  },
  {
    id: 'sinoma', name: '中亚装备', short: 'SINOMA', industry: '央企 · 高端建材装备', batch: '2027届校园招聘', verified: '2026-08-28 09:20', source: '高校就业网发布的中亚装备2027校招公告', website: 'https://job.hust.edu.cn/zpinfo1/2407505.htm',
    jobs: [
      { id: 'sinoma-rd-doctor', title: '装备研发设计工程师（博士专项）', location: '安徽 · 合肥', areas: ['合肥'], degree: '博士及以上', direction: '研发设计', majors: '机械工程、智能制造等相关专业', deadline: '公告投递开放中', responsibilities: ['牵头核心产品立式磨的技术战略规划与迭代升级', '主导关键技术预研与突破，构建核心技术壁垒', '统筹新产品研发全流程，包括方案论证、仿真验证、性能优化和可靠性研究', '制定产品设计标准与制造规范，推动工艺体系升级', '统筹研究总院、实验室和跨部门研发资源，推动前沿技术产业化'], requirements: ['博士及以上，具备扎实理论基础和系统科研方法论', '精通机械结构设计、多物理场仿真分析等技术', '具备独立牵头重大科研项目及成果转化能力', '具备技术战略视野、创新思维和团队领导潜质', '党员、英语突出或有高端装备重大项目经验者优先'], url: 'https://job.hust.edu.cn/zpinfo1/2407505.htm' },
      { id: 'sinoma-rd', title: '装备研发设计工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '硕士及以上', direction: '研发设计', majors: '机械工程、智能制造等相关专业', deadline: '公告投递开放中', responsibilities: ['负责立式磨产品迭代升级、设计优化、仿真分析和性能可靠性研究', '跟进新产品研发、试验和应用，协助解决技术问题', '制定产品设计标准和规范，优化制造工艺', '开展与集团研究总院和实验室的协同研发'], requirements: ['硕士及以上学历', '能独立开展工作并适应中等强度出差', '熟悉机械结构设计和仿真分析', '具备科研思维、学习创新、科研攻关和团队协作能力', '党员、英语突出或有类似项目经验者优先'], url: 'https://job.hust.edu.cn/zpinfo1/2407505.htm' },
      { id: 'sinoma-smart', title: '智能化工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '硕士及以上', direction: '自动化', majors: '计算机、软件工程、电子信息、自动化、控制工程等', deadline: '公告投递开放中', responsibilities: ['研发并落地立式磨少人化、无人化智能控制系统', '推动生产制造端信息化、智能化和数字化升级', '参与集团或公司重大专项研发项目', '实施和维护公司信息化管理系统'], requirements: ['硕士及以上学历', '能独立工作并适应中等强度出差', '熟练使用多种编程语言，具备编程或低代码开发能力', '熟悉工业网络、工业软件和自动化设备接口', '党员、英语突出或有类似项目经验者优先'], url: 'https://job.hust.edu.cn/zpinfo1/2407505.htm' },
    ],
  },
  {
    id: 'amd', name: '中科光电', short: 'AMD', industry: '智能分选装备', batch: '2027届校园招聘', verified: '2026-08-28 09:20', source: '中科大就业网来源的校招公告', website: 'http://www.cn-amd.com',
    jobs: [
      { id: 'amd-mechatronic', title: '机电工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '硕士及以上', direction: '研发设计', majors: '机电一体化、机械设计制造、力学、精密仪器等', deadline: '官网投递开放中', responsibilities: ['开展机电产品设计与优化', '进行电磁、静力、流体和热力学等多物理场仿真'], requirements: ['硕士及以上，机电一体化、机械设计制造、力学或精密仪器相关专业', '熟悉 SolidWorks、AutoCAD、Ansys、COMSOL 等软件', '有振动、气动或传动相关设计经验者优先'], url: 'http://www.cn-amd.com' },
      { id: 'amd-mechatronic-research', title: '机电研究员', location: '安徽 · 合肥', areas: ['合肥'], degree: '硕士及以上', direction: '研发设计', majors: '机电一体化、机械设计制造、力学、精密仪器、机器人等', deadline: '官网投递开放中', responsibilities: ['预研色选机机电系统相关新材料、新结构、新工艺和新系统', '攻关复杂机电问题，开展复杂机电系统设计优化和多物理场耦合仿真', '牵头机电新产品、新部件研发，协调资源推动项目落地'], requirements: ['硕士及以上，机电、机械、力学、精密仪器或机器人相关专业', '对技术趋势敏感，具备学术转化和问题解决能力', '精密机械、工业机器人或智能装备研发经验优先', '有振动、气动、传动相关经验优先', '熟练使用 SolidWorks、AutoCAD、Ansys、COMSOL 等软件'], url: 'http://www.cn-amd.com' },
      { id: 'amd-mechanical', title: '机械工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '本科及以上', direction: '研发设计', majors: '机械工程及相关专业', deadline: '官网投递开放中', responsibilities: ['负责产品结构设计'], requirements: ['本科及以上学历', '掌握机械原理与 CAD 制图', '能使用 SolidWorks、AutoCAD 等绘图软件', '具备结构设计相关项目经历'], url: 'http://www.cn-amd.com' },
    ],
  },
  {
    id: 'hengli', name: '恒立液压', short: 'HL', industry: '上市公司 · 液压系统', batch: '2027届校园招聘', verified: '2026-08-28 09:10', source: '恒立2027校招公告；官方校园招聘页', website: 'https://www.henglihydraulics.com/col47/list', status: 'announcement',
    jobs: [
      { id: 'hengli-rd', title: '27届培训生 · 研发类（泵阀）', location: '江苏 · 常州', areas: ['江苏全域'], degree: '硕士及以上', direction: '研发设计', majors: '液压、流体、机械、机电、电气等相关专业', deadline: '公告截止 2026-09-20', responsibilities: ['研发工程：液压泵、阀、马达等产品开发设计和测试调试', '液压应用工程：整机液压系统匹配调试和搭载测试', '仿真工程：开展流场、结构强度和多物理场耦合仿真', '标准化工程：制定编写标准文件，开展规范宣讲、技术支持和指导', '嵌入式工程：研究双核嵌入式AI控制器及智能传感器', '电气工程：开展整机电气系统匹配调试、元件选型和技术支持'], requirements: ['公告确认面向2027届硕士及以上毕业生', '液压、流体、机械、机电、材料、电气等相关专业', '具体岗位会在恒立校园招聘页面继续细分'], note: '公告级信息：校招已启动，岗位方向和基本要求已公开；各方向独立职位页仍在逐步更新。', url: 'https://www.henglihydraulics.com/col47/list' },
      { id: 'hengli-production', title: '27届培训生 · 生产管理类（泵阀）', location: '江苏 · 常州', areas: ['江苏全域'], degree: '本科及以上', direction: '制造工程', majors: '机械、机电、材料、电气、工业工程等相关专业', deadline: '公告截止 2026-09-20', responsibilities: ['生产计划：安排生产计划、智能调度和排产模型优化', '工艺管理：开展工艺策划、刀具应用和测试编程', '物流管理：建设精益与智能物流，提升交付效率', '质量管理：开展供应商、物料、制程、新品和客诉全流程质量管理', '设备管理：推进设备维修、保养和自动化，降低故障率', '采购工程：开展标准件、非标件采购与供应商管理'], requirements: ['公告确认面向2027届本科及以上毕业生', '机械、机电、材料、电气、工业工程等相关专业', '具体专项要求在恒立校园招聘页面持续发布'], note: '公告级信息：企业已明确开放方向与地点，独立岗位JD尚在官方系统陆续更新。', url: 'https://www.henglihydraulics.com/col47/list' },
    ],
  },
  {
    id: 'haitian', name: '海天集团', short: 'HT', industry: '上市公司 · 高端装备制造', batch: '2027届校园招聘', verified: '2026-08-28 09:05', source: '海天集团官方校招入口及2027校招公告', website: 'https://www.haitian.com/cn/career/', status: 'announcement',
    jobs: [
      { id: 'haitian-rd', title: '2027届校园招聘 · 设计研发方向', location: '浙江 · 宁波 / 安徽 · 合肥', areas: ['宁波', '合肥'], degree: '以官方职位页为准', direction: '研发设计', majors: '机械、机电、自动化、材料等制造相关专业', deadline: '招满即止', responsibilities: ['海天2027届校招公告已确认覆盖宁波、合肥等制造基地', '设计研发为官方校招职位类别之一，具体职责随各事业部独立岗位发布'], requirements: ['面向2027届应届毕业生', '具体学历、专业和软件要求需以事业部最新职位页为准'], note: '公告级信息：官方已确认2027校招启动和地点范围，但当前公开页面尚未列出可逐条核验的设计研发岗位。', url: 'https://www.haitian.com/cn/career/' },
      { id: 'haitian-manufacturing', title: '2027届校园招聘 · 制造技术方向', location: '浙江 · 宁波 / 安徽 · 合肥', areas: ['宁波', '合肥'], degree: '以官方职位页为准', direction: '制造工程', majors: '机械制造、自动化、工业工程等相关专业', deadline: '招满即止', responsibilities: ['制造技术为海天官方校招职位类别之一', '具体部门、产品线和岗位职责将随校园招聘系统职位发布'], requirements: ['面向2027届应届毕业生', '各岗位学历和专业门槛以招聘系统实时职位为准'], note: '公告级信息：仅用于提示当前校招已开启，不将未发布的岗位细节虚构为完整JD。', url: 'https://www.haitian.com/cn/career/' },
    ],
  },
  {
    id: 'leoch', name: '利欧集团', short: 'LEO', industry: '上市公司 · 泵与流体装备', batch: '2027届全球校园招聘', verified: '2026-08-28 09:00', source: '利欧2027校招公告', website: 'https://www.leogroup.cn/', status: 'announcement',
    jobs: [
      { id: 'leoch-rd', title: '研究开发方向 · 研发技术/测试认证', location: '浙江 · 杭州', areas: ['杭州'], degree: '本科 / 硕士 / 博士', direction: '研发设计', majors: '机械设计制造、机电一体化、流体机械、能源动力、电气、自动控制等', deadline: '公告投递开放中', responsibilities: ['研究开发方向覆盖研发技术、项目管理、电磁研发、控制软件和测试认证', '具体职责会按产品线和独立岗位进一步发布'], requirements: ['面向2026年9月至2027年7月毕业的应届生', '机械、流体、机电、能源动力、电气和自动控制等相关专业', '具体学历、岗位技能要求以利欧校招系统为准'], note: '公告级信息：校招岗位类别、专业和杭州地点已公开；独立职位JD由校招系统实时发布。', url: 'https://www.leogroup.cn/' },
      { id: 'leoch-production', title: '生产制造方向 · 工艺/采购管理', location: '浙江 · 杭州', areas: ['杭州'], degree: '本科及以上', direction: '制造工程', majors: '机械工程、材料成型、机电、工业工程、质量管理等', deadline: '公告投递开放中', responsibilities: ['生产制造方向覆盖采购管理、计划采购和工艺岗位', '具体职责和部门分配将以校招系统开放职位为准'], requirements: ['面向2027届应届毕业生', '机械、材料成型、机电、工业工程等相关专业', '具体学历和经验门槛按实时职位确认'], note: '公告级信息：用于保留已确认开放的制造方向，等待企业细化独立岗位JD。', url: 'https://www.leogroup.cn/' },
    ],
  },
  {
    id: 'xinje', name: '信捷电气', short: 'XINJE', industry: '上市公司 · 工业自动化', batch: '2027届校园招聘', verified: '2026-08-28 10:30', source: '信捷电气2027校招简章', website: 'https://www.xinje.com/',
    jobs: [
      { id: 'xinje-motor-structure', title: '电机结构工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '本科及以上', direction: '研发设计', majors: '机械设计、机械电子等相关专业', deadline: '校招申请开放', responsibilities: ['完成通用品、行业专机和定制机的电机结构整体设计、出图、样机试制与测试跟踪', '负责转轴、轴承、密封件、机壳和端盖等零件的设计校核、材料选型和供应商技术交流', '与电磁、硬件、软件和测试部门协作完成问题分析与闭环', '参与电机技术攻关、质量改进和产品降本', '整理归档项目资料、图纸并参与专利申请'], requirements: ['机械设计、机械电子等专业本科及以上', '了解机械原理、电气控制、机械加工和装配工艺', '熟练使用 AutoCAD、SolidWorks/Creo/NX、Ansys、ERP/PLM 等工具', '熟练使用测量与装配工具', '熟悉标准件选型、非标设计和强度理论计算校核', '责任心强，具备沟通、钻研和团队协作能力'], url: 'https://career.hebut.edu.cn/home/correcruit/content/id/79439.html' },
      { id: 'xinje-motor-process', title: '电机工艺工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '本科及以上', direction: '制造工程', majors: '机械设计、机械电子等相关专业', deadline: '校招申请开放', responsibilities: ['参与新品开发设计评审，评估制造工艺可行性并制定方案', '开展新产品工艺开发和导入，制定生产工艺流程', '设计、验证并优化样机工装夹具', '主导新产品试制，梳理并解决样机制作问题', '搭建工艺平台，改善瓶颈工序和关键工艺，提升质量与效率'], requirements: ['机械设计、机械电子等相关专业本科及以上', '具备机械制造、装配及工艺设计基础', '具备工装夹具设计、试制问题分析与跨部门协作能力', '责任心强，学习意愿和团队合作意识良好'], url: 'https://career.hebut.edu.cn/home/correcruit/content/id/79439.html' },
      { id: 'xinje-electromagnetic', title: '电磁设计工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '硕士及以上', direction: '研发设计', majors: '电气工程、机械工程等相关专业', deadline: '校招申请开放', responsibilities: ['负责电机产品设计开发，包括方案设计和磁路设计', '开展电磁、热仿真与振动噪音优化', '跟踪样机测试，分析结果、排查故障并进行设计改进', '指导电机电磁相关生产工艺', '优化电机性能和成本，提升可制造性'], requirements: ['电气工程、机械工程等相关专业硕士及以上', '熟悉电机基本知识、参数与设计方法', '能熟练使用 Maxwell、Jmag 等主流电磁设计软件', '具备责任心、主动性和沟通协调能力'], url: 'https://career.hebut.edu.cn/home/correcruit/content/id/79439.html' },
    ],
  },
  {
    id: 'cetc8', name: '中国电科八所', short: 'CETC8', industry: '央企 · 光电装备与传输', batch: '2027届校园招聘', verified: '2026-08-28 10:25', source: '中国电科八所2027校招公告', website: 'https://career.nankai.edu.cn/correcruit/content/id/116835.html', status: 'announcement',
    jobs: [
      { id: 'cetc8-mechanical', title: '机械设计工程师（大型机械）', location: '安徽 · 合肥', areas: ['合肥'], degree: '硕士 / 博士', direction: '研发设计', majors: '机械工程、液压机械、材料工程、精密仪器等相关专业', deadline: '邮件投递开放', responsibilities: ['中国电科八所2027校招公告已列出机械设计工程师（大型机械）岗位', '所属单位研发光电线缆、连接器、光器件、光纤传感器和独立功能装备等产品'], requirements: ['公告明确面向硕士、博士毕业生', '机械工程、液压机械、材料工程、精密仪器等相关专业', '岗位详情通过官方校招二维码或邮件渠道获取'], note: '公告级信息：岗位名称、学历、专业、投递渠道已公开；完整职责由企业在扫码岗位详情中发布。', url: 'https://career.nankai.edu.cn/correcruit/content/id/116835.html' },
    ],
  },
  {
    id: 'iflytek', name: '科大讯飞', short: 'iFLYTEK', industry: '上市公司 · 人工智能装备', batch: '2027届秋季校园招聘', verified: '2026-08-28 10:20', source: '科大讯飞2027校招公告', website: 'https://www.iflytek.com/', status: 'announcement',
    jobs: [
      { id: 'iflytek-structure', title: '机械结构工程师', location: '安徽 · 合肥', areas: ['合肥'], degree: '以官方职位页为准', direction: '研发设计', majors: '机械工程、机电、自动化等相关专业', deadline: '秋招申请开放', responsibilities: ['科大讯飞2027届秋招公告已列出合肥机械结构工程师岗位'], requirements: ['公告已确认面向2025年6月至2027年8月毕业生', '具体学历、职责、设计软件要求以科大讯飞校招职位页为准'], note: '公告级信息：岗位名称与工作地点已公开，独立岗位JD需在讯飞校招系统进一步确认。', url: 'https://jy.bsu.edu.cn/front/zpxx.jspa?tid=2089619655797788673' },
    ],
  },
];

const areas = ['全部地区', '合肥', '江苏全域', '杭州', '宁波'];
const directions = ['全部方向', '研发设计', '车辆研发', '仿真分析', '自动化', '制造工程', '设备工程', '质量测试'];
const publicationDates: Record<string, string> = {
  'cat-logistics': '2026-08-13', 'cat-digital': '2026-08-13', 'cat-mfg-xz': '2026-08-13',
  'cat-virtual': '2026-08-09', 'cat-smart': '2026-08-09', 'cat-engine': '2026-08-09', 'cat-transmission': '2026-08-09',
  'sany-mech': '2026-08-26', 'sany-hydraulic': '2026-08-26', 'sany-test': '2026-08-26',
  'sany-product': '2026-08-26', 'sany-assembly': '2026-08-26', 'sany-process': '2026-08-26',
  'geely-mech-maint': '2026-08-22', 'geely-elec-maint': '2026-08-13',
  'sg-reliability': '2026-08-10', 'sg-equipment': '2026-08-10', 'sg-manufacturing': '2026-08-10', 'sg-tooling': '2026-08-10',
  'sinoma-rd-doctor': '2026-08-26', 'sinoma-rd': '2026-08-26', 'sinoma-smart': '2026-08-26',
  'amd-mechatronic': '2026-08-14', 'amd-mechatronic-research': '2026-08-14', 'amd-mechanical': '2026-08-14',
  'hengli-rd': '2026-08-23', 'hengli-production': '2026-08-23',
  'haitian-rd': '2026-08-20', 'haitian-manufacturing': '2026-08-20',
  'leoch-rd': '2026-08-19', 'leoch-production': '2026-08-19',
  'xinje-motor-structure': '2026-08-18', 'xinje-motor-process': '2026-08-18', 'xinje-electromagnetic': '2026-08-18',
  'cetc8-mechanical': '2026-08-20', 'iflytek-structure': '2026-08-24',
};

const watchlist = [
  { name: '安徽合力', area: '合肥', tag: '上市国企', focus: '工业车辆、智能物流', url: 'https://www.helichina.com/contact/job/' },
  { name: '江淮汽车', area: '合肥', tag: '上市国企', focus: '整车、底盘、工艺研发', url: 'https://www.jac.com.cn/rczp/' },
  { name: '国轩高科', area: '合肥', tag: '上市公司', focus: '动力电池、设备、工艺', url: 'https://www.gotion.com.cn/join' },
  { name: '安凯汽车', area: '合肥', tag: '上市国企', focus: '新能源客车、整车研发', url: 'https://www.ankai.com/' },
  { name: '大众安徽', area: '合肥', tag: '合资车企', focus: '新能源汽车、制造工程', url: 'https://www.volkswagen-anhui.com/' },
  { name: '蔚来合肥', area: '合肥', tag: '新能源车企', focus: '整车、智能制造、质量', url: 'https://www.nio.com/careers' },
  { name: '徐工集团', area: '江苏 · 徐州', tag: '上市国企', focus: '工程机械、研发制造', url: 'https://www.xcmg.com/aboutus/job_center.htm' },
  { name: '中车南京浦镇', area: '江苏 · 南京', tag: '央企', focus: '轨道交通、车辆装备', url: 'https://www.crrcgc.cc/pz/' },
  { name: '中车戚墅堰', area: '江苏 · 常州', tag: '央企', focus: '轨道交通、传动系统', url: 'https://www.crrcgc.cc/qs/' },
  { name: '先导智能', area: '江苏 · 无锡', tag: '上市公司', focus: '锂电智能装备、自动化', url: 'https://www.leadintelligent.com/' },
  { name: '博世中国', area: '江苏 · 苏州/无锡', tag: '外资制造', focus: '汽车零部件、智能制造', url: 'https://www.bosch.com.cn/careers/' },
  { name: '三一重机', area: '江苏 · 昆山', tag: '上市集团', focus: '工程机械、液压、研发', url: 'https://sany.zhiye.com/campus/jobs' },
  { name: '杭叉集团', area: '杭州', tag: '上市公司', focus: '工业车辆、液压、电气', url: 'https://www.zjhc.cn/aboutHumanResources.html' },
  { name: '西子联合', area: '杭州', tag: '装备制造', focus: '电梯、锅炉、工业装备', url: 'https://www.xizigroup.com/' },
  { name: '中控技术', area: '杭州', tag: '上市公司', focus: '工业自动化、智能制造', url: 'https://www.supcon.com/' },
  { name: '海康机器人', area: '杭州', tag: '上市集团', focus: '移动机器人、机器视觉', url: 'https://www.hikrobotics.com/cn/' },
  { name: '浙江吉利控股', area: '杭州', tag: '上市集团', focus: '汽车、动力系统、智能制造', url: 'https://campus.geely.com/' },
  { name: '拓普集团', area: '宁波', tag: '上市公司', focus: '汽车零部件、机器人', url: 'https://www.tuopu.com/' },
  { name: '均胜电子', area: '宁波', tag: '上市公司', focus: '汽车安全、智能驾驶', url: 'https://www.joyson.com/' },
  { name: '均普智能', area: '宁波', tag: '上市公司', focus: '智能制造装备、自动化', url: 'https://cn.piagroup.com/careers/' },
  { name: '宁波华翔', area: '宁波', tag: '上市公司', focus: '汽车内外饰、零部件', url: 'https://www.nbhx.com/' },
  { name: '旭升集团', area: '宁波', tag: '上市公司', focus: '精密铝合金、汽车零部件', url: 'https://www.shengroup.com/' },
  { name: '双林股份', area: '宁波', tag: '上市公司', focus: '汽车零部件、智能座舱', url: 'https://www.slcorp.com.cn/' },
  { name: '宁波钢铁', area: '宁波', tag: '国企', focus: '冶金装备、设备工程', url: 'https://www.nbsteel.com/' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('全部地区');
  const [direction, setDirection] = useState('全部方向');
  const [openCompanies, setOpenCompanies] = useState<Set<string>>(new Set());
  const [openJob, setOpenJob] = useState<string | null>(null);

  const filtered = useMemo(() => companies.map((company) => {
    const needle = query.trim().toLowerCase();
    const jobs = company.jobs.filter((job) => {
      const matchesQuery = !needle || `${company.name}${job.title}${job.majors}${job.location}`.toLowerCase().includes(needle);
      const matchesArea = area === '全部地区' || job.areas.includes(area);
      const matchesDirection = direction === '全部方向' || job.direction === direction;
      return matchesQuery && matchesArea && matchesDirection;
    });
    return { ...company, jobs };
  }).filter((company) => company.jobs.length > 0), [query, area, direction]);

  const totalJobs = filtered.reduce((sum, company) => sum + company.jobs.length, 0);
  const reset = () => { setQuery(''); setArea('全部地区'); setDirection('全部方向'); };
  const toggleCompany = (id: string) => setOpenCompanies((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <main className="min-h-screen bg-[#f5f6f2] text-[#14211a]">
      <header className="border-b border-[#dce1da] bg-[#f5f6f2]/95">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="机遇引擎首页"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#173f2a] text-sm font-bold text-white">ME</span><span><strong className="block text-[15px] tracking-[0.08em]">机遇引擎</strong><small className="text-xs text-[#68746c]">机械校招聚合</small></span></a>
          <nav className="hidden items-center gap-7 text-sm text-[#536159] sm:flex"><span>无需登录 · 官网直投</span><a href="#standards" className="rounded-full border border-[#aeb8b0] px-4 py-2 font-medium text-[#173f2a] hover:bg-white">收录标准</a></nav>
        </div>
      </header>

      <section id="top" className="border-b border-[#dce1da] bg-[#e8eee7]">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
          <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#ce5a35]">2027 届校园招聘 · 持续更新</p>
          <div className="grid gap-7 lg:grid-cols-[1fr_330px] lg:items-end">
            <div><h1 className="max-w-3xl text-4xl font-semibold leading-[1.13] tracking-[-0.035em] sm:text-6xl">先选公司，再看清<br className="hidden sm:block" /><span className="text-[#1c6741]">岗位与招聘进度</span></h1><p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#59675e]">完整官方JD逐项展示职责和资格；企业已启动校招但尚未公开独立JD的，保留在公告级信息中，并明确标注待补全。</p></div>
            <div className="rounded-2xl border border-[#ced8cf] bg-white/70 p-5"><div className="flex items-end justify-between"><span className="text-sm text-[#647168]">当前收录</span><strong className="text-4xl font-semibold tracking-tight">{companies.reduce((sum, company) => sum + company.jobs.length, 0)}</strong></div><div className="mt-4 flex justify-between text-xs text-[#748078]"><span>{companies.length} 家重点企业</span><span>核验于 8月27日</span></div></div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[250px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#dce1da] bg-white p-5 lg:sticky lg:top-5">
          <div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">筛选岗位</h2><button onClick={reset} className="text-xs font-medium text-[#1c6741] hover:underline">重置</button></div>
          <label htmlFor="keyword" className="block text-xs font-medium text-[#68746c]">关键词</label><input id="keyword" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d3dad4] bg-[#fafbf8] px-3 py-2.5 text-sm outline-none focus:border-[#508465] focus:ring-2 focus:ring-[#d8e8dc]" placeholder="岗位、公司或专业" />
          <fieldset className="mt-6 space-y-3"><legend className="mb-3 text-xs font-medium text-[#68746c]">工作地区</legend>{areas.map((item) => <label key={item} className="flex cursor-pointer items-center gap-2.5 text-sm"><input type="radio" name="area" checked={area === item} onChange={() => setArea(item)} className="accent-[#1c6741]" />{item}</label>)}</fieldset>
          <label htmlFor="direction" className="mt-6 block text-xs font-medium text-[#68746c]">岗位方向</label><select id="direction" value={direction} onChange={(event) => setDirection(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d3dad4] bg-[#fafbf8] px-3 py-2.5 text-sm outline-none focus:border-[#508465]">{directions.map((item) => <option key={item}>{item}</option>)}</select>
        </aside>

        <div>
          <div className="mb-5 flex items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold tracking-tight">招聘公司</h2><p className="mt-1 text-sm text-[#6c786f]">{filtered.length} 家公司 · {totalJobs} 个匹配岗位或招聘方向</p></div><span className="rounded-full bg-[#e4ece5] px-3 py-1.5 text-xs font-semibold text-[#225d3d]">完整JD + 公告级信息</span></div>
          <div className="space-y-4" aria-live="polite">
            {filtered.map((company) => {
              const isOpen = openCompanies.has(company.id);
              return <article key={company.id} className="overflow-hidden rounded-2xl border border-[#d8dfd9] bg-white shadow-[0_7px_22px_rgba(31,61,42,0.04)]">
                <button onClick={() => toggleCompany(company.id)} aria-expanded={isOpen} className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#fbfcf9] sm:p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#173f2a] text-xs font-bold tracking-wide text-white">{company.short}</span>
                  <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><strong className="text-xl tracking-tight">{company.name}</strong><span className="rounded-md bg-[#f4e8de] px-2 py-1 text-[11px] font-medium text-[#a94728]">{company.batch}</span>{company.status === 'announcement' && <span className="rounded-md bg-[#fff2c7] px-2 py-1 text-[11px] font-medium text-[#8a5b00]">公告级 · 待补全JD</span>}</span><span className="mt-1.5 block text-sm text-[#6b776f]">{company.industry} · {company.jobs.length} 个匹配岗位</span></span>
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#cbd4cc] text-xl text-[#245b3c] transition ${isOpen ? 'rotate-45 bg-[#e5eee7]' : ''}`}>＋</span>
                </button>

                {isOpen && <div className="drawer-in border-t border-[#e2e6e1] bg-[#f8faf7] p-3 sm:p-5">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#738077]"><span>来源：{company.source} · 最后核验 {company.verified}</span><a href={company.website} target="_blank" rel="noreferrer" className="font-semibold text-[#1c6741] hover:underline">公司校招官网 ↗</a></div>
                  <div className="space-y-2">
                    {company.jobs.map((job) => {
                      const jobOpen = openJob === job.id;
                      return <section key={job.id} className="overflow-hidden rounded-xl border border-[#dbe2dc] bg-white">
                        <button onClick={() => setOpenJob(jobOpen ? null : job.id)} aria-expanded={jobOpen} className="flex w-full items-center gap-3 p-4 text-left hover:bg-[#fbfcfa] sm:px-5">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ce5a35]" />
                          <span className="min-w-0 flex-1"><strong className="block text-[15px]">{job.title}</strong><span className="mt-1 block text-xs text-[#748078]">{job.location} · {job.degree} · {job.direction}</span></span>
                          <span className="hidden text-xs font-medium text-[#1c6741] sm:block">{job.deadline}</span><span className={`text-lg text-[#5d6c62] transition ${jobOpen ? 'rotate-180' : ''}`}>⌄</span>
                        </button>
                        {jobOpen && <div className="drawer-in border-t border-[#e5e9e5] px-4 py-5 sm:px-8 sm:py-6">
                          {company.status === 'announcement' && <p className="mb-5 rounded-lg border border-[#eed99e] bg-[#fff8df] px-3 py-2.5 text-xs leading-5 text-[#765100]">公告级信息：企业已确认启动该届校招与招聘方向，但尚未公开或尚未能核验独立岗位JD。页面只展示当前已公开内容。</p>}
                          <div className="grid gap-6 md:grid-cols-2">
                            <div><p className="drawer-label">{company.status === 'announcement' ? '已公开的工作内容' : '岗位职责'}</p><ul className="detail-list">{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
                            <div><p className="drawer-label">{company.status === 'announcement' ? '已公开的招聘条件' : '招聘要求'}</p><ul className="detail-list">{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul></div>
                          </div>
                          <div className="mt-6 grid gap-3 rounded-xl bg-[#f1f5f0] p-4 text-sm sm:grid-cols-2 lg:grid-cols-3"><p><span className="detail-key">专业</span>{job.majors}</p><p><span className="detail-key">学历</span>{job.degree}</p><p><span className="detail-key">工作性质</span>校园招聘 · 全职</p><p><span className="detail-key">发布日期</span>{publicationDates[job.id]}</p><p><span className="detail-key">截止状态</span>{job.deadline}</p><p><span className="detail-key">薪资</span>企业官网未公布</p></div>
                          {job.note && <p className="mt-4 rounded-lg border border-[#ead5c8] bg-[#fff8f3] px-3 py-2.5 text-xs leading-5 text-[#9b4d31]">信息说明：{job.note}</p>}
                          <div className="mt-5 flex items-center justify-between gap-3"><span className="text-xs text-[#808a82]">投递前请再次核对官网最新要求</span><a href={job.url} target="_blank" rel="noreferrer" className="rounded-xl bg-[#173f2a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#225c3a]">前往官网投递 ↗</a></div>
                        </div>}
                      </section>;
                    })}
                  </div>
                </div>}
              </article>;
            })}
            {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-[#c9d1ca] bg-white px-6 py-14 text-center"><p className="font-semibold">没有符合当前条件的岗位</p><p className="mt-2 text-sm text-[#6c786f]">试试减少筛选条件。</p><button onClick={reset} className="mt-5 rounded-xl bg-[#173f2a] px-4 py-2 text-sm font-semibold text-white">清除筛选</button></div>}
          </div>
        </div>
      </section>

      <section className="border-t border-[#dce1da] bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold tracking-[0.16em] text-[#ce5a35]">重点企业雷达</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">{watchlist.length} 家持续监测企业</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#66736a]">这些企业在目标地区设有制造、研发或工程技术岗位。尚未进入“当前可投”列表的，不代表没有机会，只是尚未满足本站的校招与岗位信息核验标准。</p></div><span className="w-fit rounded-full border border-[#cbd5cc] px-3 py-1.5 text-xs font-semibold text-[#42624d]">上市公司 · 央国企 · 头部制造</span></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {watchlist.map((company) => <a key={company.name} href={company.url} target="_blank" rel="noreferrer" className="group rounded-xl border border-[#dde4de] bg-[#fbfcfa] p-4 transition hover:-translate-y-0.5 hover:border-[#9cb6a1] hover:bg-white"><div className="flex items-start justify-between gap-3"><strong className="text-[15px] group-hover:text-[#1c6741]">{company.name}</strong><span className="shrink-0 rounded-md bg-[#e8eee7] px-2 py-1 text-[10px] font-semibold text-[#3f614a]">{company.tag}</span></div><p className="mt-2 text-xs text-[#657269]">{company.area}</p><p className="mt-1 text-sm text-[#33463a]">{company.focus}</p><p className="mt-3 text-xs font-semibold text-[#1c6741]">查看招聘入口 ↗</p></a>)}
          </div>
        </div>
      </section>

      <section id="standards" className="border-t border-[#dce1da] bg-[#173f2a] text-white"><div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_1.25fr]"><div><p className="text-xs font-bold tracking-[0.16em] text-[#ef9a78]">收录标准</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">岗位与企业，分层呈现</h2></div><div className="grid gap-4 text-sm leading-6 text-[#d4e2d7] sm:grid-cols-2"><p><strong className="block text-white">当前可投</strong>只保留仍有效的校招岗位或已明确启动的校招公告。</p><p><strong className="block text-white">完整职责与资格</strong>逐项展示企业公布的全部职责和任职要求。</p><p><strong className="block text-white">公告级信息</strong>校招已经确认、但独立JD未完全公开时，明确标为待补全。</p><p><strong className="block text-white">重点企业雷达</strong>持续监测上市公司、央国企和头部制造企业的官方招聘入口。</p></div></div></section>
      <footer className="bg-[#102d20] px-5 py-6 text-center text-xs text-[#9fb3a5]">公开访问，无需登录。岗位信息以企业官网实时页面为最终依据。</footer>
    </main>
  );
}
