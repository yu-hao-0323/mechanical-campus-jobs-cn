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
  jobs: Job[];
};

const catOps = 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000388302/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E5%88%B6%E9%80%A0%E8%BF%90%E8%90%A5%E7%B1%BB/';
const catMfg = 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000387385/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E5%88%B6%E9%80%A0%E8%BF%90%E8%90%A5%E7%B1%BB-%E5%88%B6%E9%80%A0%E5%B7%A5%E7%A8%8B%E5%B8%88-%E6%9C%BA%E6%A2%B0%E8%87%AA%E5%8A%A8%E5%8C%96%E6%99%BA%E8%83%BD%E5%8C%96%E4%BB%BF%E7%9C%9F/';
const catPower = 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000387378/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E7%A0%94%E5%8F%91%E6%8A%80%E6%9C%AF%E7%B1%BB-%E5%8F%91%E5%8A%A8%E6%9C%BA-%E4%BC%A0%E5%8A%A8%E6%96%B9%E5%90%91/';
const catAuto = 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000390959/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E7%A0%94%E5%8F%91%E7%B1%BB-%E8%87%AA%E5%8A%A8%E9%A9%BE%E9%A9%B6%E6%96%B9%E5%90%91/';

const companies: Company[] = [
  {
    id: 'caterpillar', name: '卡特彼勒', short: 'CAT', industry: '工程机械与动力系统', batch: '2027届校园招聘', verified: '2026-08-27 18:10', source: '卡特彼勒招聘官网', website: 'https://careers.caterpillar.com/zh/',
    jobs: [
      { id: 'cat-logistics', title: '智能物流研发工程师', location: '江苏 · 徐州', areas: ['江苏全域'], degree: '本科及以上', direction: '自动化', majors: '机械、电气自动化、智能物流、工业工程或计算机相关专业', deadline: '截止 2026-10-30', responsibilities: ['参与 AGV、AMR 与自动化仓库的部署和联调', '配置路线、站点与工业通信，对现场问题进行分析闭环', '协助项目验收、使用培训和售后问题处理'], requirements: ['熟悉低压电气元件、传感器、电机或编码器', '具备电路接线和 PLC 软件基础', '了解 TCP/IP、MODBUS、S7、CAN 等工业通信协议'], url: catOps },
      { id: 'cat-digital', title: '数字化工程师', location: '江苏 · 徐州', areas: ['江苏全域'], degree: '本科及以上', direction: '自动化', majors: '计算机、软件、工业工程或相关工科专业', deadline: '截止 2026-10-30', responsibilities: ['参与企业数字化解决方案设计与实施', '使用数据分析和办公自动化工具提升运营效率', '支持软件部署、集成及技术问题排查'], requirements: ['具备有效沟通和问题解决能力', '理解软件产品架构、配置与集成', '能够进行硬件、软件或应用系统故障排查'], url: catOps },
      { id: 'cat-quality', title: '质量工程师', location: '江苏 · 徐州', areas: ['江苏全域'], degree: '以官网更新为准', direction: '质量测试', majors: '机械、材料、质量工程等相关专业', deadline: '截止 2026-10-30', responsibilities: ['招聘官网已列出该岗位，详细职责尚待企业更新'], requirements: ['详细学历、专业和能力要求尚待企业官网更新'], note: '信息未补全，不根据岗位名称推测具体要求。', url: catOps },
      { id: 'cat-facility', title: '设备 / 设施工程师', location: '江苏 · 徐州', areas: ['江苏全域'], degree: '以官网更新为准', direction: '设备工程', majors: '机械、电气自动化、工业工程等相关专业', deadline: '截止 2026-10-30', responsibilities: ['招聘官网已列出该岗位，详细职责尚待企业更新'], requirements: ['详细学历、专业和能力要求尚待企业官网更新'], note: '岗位仍可投递，但官网暂未发布完整职位描述。', url: catOps },
      { id: 'cat-mfg-xz', title: '制造工程师（机械 / 自动化 / 智能方向）', location: '江苏 · 徐州', areas: ['江苏全域'], degree: '本科及以上', direction: '制造工程', majors: '电气工程、机械工程、自动化或人工智能相关专业', deadline: '截止 2026-10-30', responsibilities: ['规划并实施生产车间智能化项目', '识别自动化改进机会并推动设备升级', '管理自动化与机器人供应商，跟踪项目进度'], requirements: ['熟悉 AutoCAD、三维设计软件、工厂仿真或 PLC 编程', '了解视觉系统、软件编程和精益制造', '具备技术文档、团队协作和英语沟通能力'], url: catOps },
      { id: 'cat-mfg-sz', title: '制造工程师', location: '江苏 · 苏州', areas: ['江苏全域'], degree: '以官网更新为准', direction: '制造工程', majors: '机械、制造、工业工程等相关专业', deadline: '截止 2026-10-30', responsibilities: ['招聘官网已列出该岗位，详细职责尚待企业更新'], requirements: ['详细要求请以申请页面后续更新为准'], note: '当前职位入口有效，官网职位描述待更新。', url: catMfg },
      { id: 'cat-virtual', title: '虚拟制造工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '本科或硕士', direction: '仿真分析', majors: '先进制造、机械设计或机械制造专业', deadline: '截止 2026-10-30', responsibilities: ['使用虚拟分析和仿真工具验证产品与工艺设计', '开展虚拟装配、制造仿真和三维工厂开发', '验证生产线布局并优化制造工序'], requirements: ['熟练使用三维建模和制造技术仿真软件', '具备问题解决、英文读写与沟通能力', '积极主动并具有团队协作意识'], url: catMfg },
      { id: 'cat-smart', title: '智能制造工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '硕士及以上', direction: '自动化', majors: '机械工程、汽车工程、自动化或相近专业', deadline: '截止 2026-10-30', responsibilities: ['创建三维数字化工厂模型并进行工艺布局验证', '建立仿真模型、运行迭代并形成验证报告', '参与工艺评审和新技术持续改进'], requirements: ['具备 Creo 或同类三维建模软件能力', '具备智能制造、机器学习或 Siemens 仿真软件经验者优先', '具备良好沟通、自主学习和团队协作能力'], url: catMfg },
      { id: 'cat-engine', title: '发动机零部件设计工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '本科或硕士', direction: '研发设计', majors: '机械工程或机械相关专业', deadline: '截止 2026-10-30', responsibilities: ['负责发动机零部件设计与开发', '组织 DFMEA、DVP&R 和跨职能设计评审', '支持零部件本地化及工程技术文件输出'], requirements: ['能够进行产品设计、分析和计算机辅助工程', '理解可制造性、质量目标与成本约束', '具备较强英语书面及口头沟通能力'], url: catPower },
      { id: 'cat-transmission', title: '传动系统设计工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '本科或硕士', direction: '研发设计', majors: '机械工程或机械相关专业', deadline: '截止 2026-10-30', responsibilities: ['参与变矩器、变速箱和驱动桥等传动系统设计', '开展设计分析、验证和工程问题解决', '协同制造团队推进产品开发'], requirements: ['掌握动力传动系统基础知识', '了解锻造、热处理、机加工和检验工艺', '具备 CAD/CAE、产品设计及英文沟通能力'], url: catPower },
      { id: 'cat-driving-data', title: '自动驾驶数据引擎工程师', location: '江苏 · 无锡', areas: ['江苏全域'], degree: '以官网更新为准', direction: '研发设计', majors: '计算机、自动化、车辆或相关专业', deadline: '截止 2026-10-30', responsibilities: ['招聘官网已列出该岗位，详细职责尚待企业更新'], requirements: ['详细学历、专业和技术栈要求尚待企业官网更新'], note: '该职位于 2026-08-27 发布，当前申请入口开放。', url: catAuto },
      { id: 'cat-driving-e2e', title: '自动驾驶端到端算法工程师', location: '江苏 · 无锡 / 上海', areas: ['江苏全域'], degree: '以官网更新为准', direction: '研发设计', majors: '人工智能、计算机、自动化、车辆或相关专业', deadline: '截止 2026-10-30', responsibilities: ['招聘官网已列出该岗位，详细职责尚待企业更新'], requirements: ['详细算法和工程能力要求尚待企业官网更新'], note: '网站仅按目标范围保留无锡工作地点。', url: catAuto },
    ],
  },
  {
    id: 'sany', name: '三一集团', short: 'SANY', industry: '工程机械与高端装备', batch: '2027届秋季校园招聘', verified: '2026-08-27 18:00', source: '三一集团校招系统', website: 'https://sanycampus.zhiye.com/4/jobs',
    jobs: [
      { id: 'sany-mech', title: '机械研发方向', location: '昆山 / 南京 / 常熟', areas: ['江苏全域'], degree: '本科 / 硕士 / 博士', direction: '研发设计', majors: '机械工程、机械设计制造及相关专业', deadline: '正式批开放中', responsibilities: ['机械产品与系统研发方向，具体职责按投递系统中的事业部岗位确定'], requirements: ['面向 2027 届毕业生（2026年9月至2027年8月毕业）', '机械类相关专业，本科、硕士或博士', '具体软件、语言和项目要求以所选岗位为准'], note: '三一招聘简章按岗位方向发布，城市与具体职位需在官网筛选确认。', url: 'https://sanycampus.zhiye.com/4/jobs' },
      { id: 'sany-hydraulic', title: '液压与动力研发方向', location: '昆山 / 南京 / 常熟', areas: ['江苏全域'], degree: '本科 / 硕士 / 博士', direction: '研发设计', majors: '流体传动、机械、动力工程等相关专业', deadline: '正式批开放中', responsibilities: ['液压系统、动力系统或相关产品研发，具体职责以职位页为准'], requirements: ['2027届本科、硕士或博士毕业生', '具备液压、机械或动力相关专业基础', '岗位专项能力要求以投递系统实时职位为准'], url: 'https://sanycampus.zhiye.com/4/jobs' },
      { id: 'sany-structure', title: '结构与仿真方向', location: '昆山 / 南京 / 常熟', areas: ['江苏全域'], degree: '本科 / 硕士 / 博士', direction: '仿真分析', majors: '机械、工程力学、结构、材料等相关专业', deadline: '正式批开放中', responsibilities: ['结构设计、工程分析或仿真方向，实际职责由具体岗位确定'], requirements: ['2027届毕业生', '机械、结构、力学或材料相关专业', '具体 CAE 软件和项目经验要求以官网职位为准'], url: 'https://sanycampus.zhiye.com/4/jobs' },
      { id: 'sany-process', title: '工艺研发方向', location: '昆山 / 南京 / 常熟', areas: ['江苏全域'], degree: '本科 / 硕士', direction: '制造工程', majors: '机械制造、材料成型、焊接、工业工程等', deadline: '正式批开放中', responsibilities: ['机加、焊接、冲压、涂装或装调工艺方向，按具体岗位匹配'], requirements: ['2027届本科或硕士毕业生', '对应制造工艺或材料相关专业', '具体工艺知识和软件要求以官网职位为准'], url: 'https://sanycampus.zhiye.com/4/jobs' },
      { id: 'sany-test', title: '测试与质量工程方向', location: '昆山 / 南京 / 常熟', areas: ['江苏全域'], degree: '本科 / 硕士', direction: '质量测试', majors: '机械、车辆、测控、材料或质量工程等', deadline: '正式批开放中', responsibilities: ['产品测试验证、过程质量或供应商质量方向'], requirements: ['2027届本科或硕士毕业生', '机械、测控、车辆、材料等相关专业', '详细职位要求以三一校招系统为准'], url: 'https://sanycampus.zhiye.com/4/jobs' },
    ],
  },
  {
    id: 'geely', name: '吉利控股', short: 'GEELY', industry: '汽车与智能出行', batch: '2027届秋季全球校招', verified: '2026-08-27 17:50', source: '吉利校园招聘官网', website: 'https://campus.geely.com/',
    jobs: [
      { id: 'geely-power-ai', title: '动力系统智能化开发岗', location: '杭州 / 宁波 / 无锡 / 苏州', areas: ['杭州', '宁波', '江苏全域'], degree: '本科 / 硕士 / 博士', direction: '车辆研发', majors: '车辆、机械、能源动力、自动化等相关专业', deadline: '网申截止 2026-10-31', responsibilities: ['动力系统智能化研发，具体职责以校招职位页为准'], requirements: ['2027届毕业生，毕业时间为2026年9月至2027年8月', '专业和学历要求按具体职位确定', '每名候选人最多可投递 3 个岗位'], url: 'https://campus.geely.com/' },
      { id: 'geely-sim', title: '智能仿真技术开发岗', location: '杭州 / 宁波 / 无锡 / 苏州', areas: ['杭州', '宁波', '江苏全域'], degree: '本科 / 硕士 / 博士', direction: '仿真分析', majors: '机械、车辆、力学、计算机等相关专业', deadline: '网申截止 2026-10-31', responsibilities: ['整车或系统智能仿真技术开发，详细职责以职位页为准'], requirements: ['面向 2027 届本科、硕士和博士', '具备对应仿真、工程或算法专业背景', '具体软件与项目要求以所选城市职位为准'], url: 'https://campus.geely.com/' },
      { id: 'geely-energy', title: '运动能量子系统开发岗', location: '杭州 / 宁波 / 无锡 / 苏州', areas: ['杭州', '宁波', '江苏全域'], degree: '本科 / 硕士 / 博士', direction: '车辆研发', majors: '车辆、机械、能源动力、控制等相关专业', deadline: '网申截止 2026-10-31', responsibilities: ['车辆运动与能量子系统开发，岗位细节以官网为准'], requirements: ['2027届应届毕业生', '具备车辆、动力、机械或控制相关知识', '工作地点与学历要求需在职位页进一步确认'], url: 'https://campus.geely.com/' },
      { id: 'geely-integration', title: '动力系统集成岗', location: '杭州 / 宁波 / 无锡 / 苏州', areas: ['杭州', '宁波', '江苏全域'], degree: '本科 / 硕士 / 博士', direction: '车辆研发', majors: '车辆工程、机械、热能与动力等', deadline: '网申截止 2026-10-31', responsibilities: ['动力系统集成开发及跨系统协同，详细职责以职位页为准'], requirements: ['2027届本科、硕士或博士毕业生', '相关工程专业背景', '具体测试、开发工具及英语要求以职位页为准'], url: 'https://campus.geely.com/' },
    ],
  },
  {
    id: 'sungrow', name: '阳光电源', short: 'SG', industry: '新能源装备与电力电子', batch: '2027届全球校招正式批', verified: '2026-08-27 17:40', source: '阳光电源招聘官网', website: 'https://app.mokahr.com/campus-recruitment/sungrow/94416',
    jobs: [
      { id: 'sg-structure', title: '结构研发方向', location: '合肥', areas: ['合肥'], degree: '以具体职位为准', direction: '研发设计', majors: '机械、车辆工程、力学、机电等相关专业', deadline: '正式批开放中', responsibilities: ['产品结构设计、方案评估与工程问题解决，具体职责以职位页为准'], requirements: ['面向 2027 届应届毕业生（2026年8月至2027年7月毕业）', '机械、车辆、力学或相关专业', '具体学历、软件和项目要求以官网职位为准'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416' },
      { id: 'sg-sim', title: '仿真研发方向', location: '合肥', areas: ['合肥'], degree: '以具体职位为准', direction: '仿真分析', majors: '力学、机械、热能、车辆等相关专业', deadline: '正式批开放中', responsibilities: ['产品或系统仿真分析，实际职责按官网职位确定'], requirements: ['2027届应届毕业生', '具备力学、机械或相应仿真专业基础', '具体 CAE 工具要求以职位页为准'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416' },
      { id: 'sg-thermal', title: '热设计方向', location: '合肥', areas: ['合肥'], degree: '以具体职位为准', direction: '研发设计', majors: '工程热物理、热能、机械、流体等相关专业', deadline: '正式批开放中', responsibilities: ['产品热设计、热分析与验证，详细职责以职位页为准'], requirements: ['2027届毕业生', '热能、流体、机械或相关专业', '仿真软件和项目经历要求以实时职位为准'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416' },
      { id: 'sg-reliability', title: '可靠性方向', location: '合肥', areas: ['合肥'], degree: '以具体职位为准', direction: '质量测试', majors: '机械、材料、可靠性、测控等相关专业', deadline: '正式批开放中', responsibilities: ['产品可靠性分析、验证或改进，具体职责以职位页为准'], requirements: ['2027届应届毕业生', '机械、材料、可靠性或测试相关专业', '详细学历和技术要求以官网为准'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416' },
      { id: 'sg-test', title: '测试方向', location: '合肥', areas: ['合肥'], degree: '以具体职位为准', direction: '质量测试', majors: '机械、车辆、测控、自动化等相关专业', deadline: '正式批开放中', responsibilities: ['产品测试、验证与问题分析，具体职责由职位页说明'], requirements: ['2027届毕业生', '机械、测控、车辆或自动化相关专业', '测试工具和项目要求以具体岗位为准'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416' },
      { id: 'sg-process', title: '工艺工程方向', location: '合肥', areas: ['合肥'], degree: '以具体职位为准', direction: '制造工程', majors: '机械制造、工业工程、材料、自动化等', deadline: '正式批开放中', responsibilities: ['制造工艺开发、优化与生产导入，详细职责以官网为准'], requirements: ['2027届应届毕业生', '机械制造、工业工程、材料或自动化相关专业', '具体工艺能力要求按职位页确定'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416' },
      { id: 'sg-equipment', title: '设备与自动化方向', location: '合肥', areas: ['合肥'], degree: '以具体职位为准', direction: '设备工程', majors: '机械、电气、自动化、机电等相关专业', deadline: '正式批开放中', responsibilities: ['生产设备、自动化方案或设备工程方向，具体职责以官网为准'], requirements: ['2027届毕业生', '机械、电气、自动化或机电相关专业', 'PLC、设计软件等专项要求以职位页为准'], url: 'https://app.mokahr.com/campus-recruitment/sungrow/94416' },
    ],
  },
];

const areas = ['全部地区', '合肥', '江苏全域', '杭州', '宁波'];
const directions = ['全部方向', '研发设计', '车辆研发', '仿真分析', '自动化', '制造工程', '设备工程', '质量测试'];

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
            <div><h1 className="max-w-3xl text-4xl font-semibold leading-[1.13] tracking-[-0.035em] sm:text-6xl">先选公司，再看清<br className="hidden sm:block" /><span className="text-[#1c6741]">每一个岗位要求</span></h1><p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#59675e]">点开公司查看当前校招岗位，再点岗位展开职责、专业、学历和能力要求。仅展示目标地区当前仍能投递的工程技术岗位。</p></div>
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
          <div className="mb-5 flex items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold tracking-tight">招聘公司</h2><p className="mt-1 text-sm text-[#6c786f]">{filtered.length} 家公司 · {totalJobs} 个匹配岗位</p></div><span className="rounded-full bg-[#e4ece5] px-3 py-1.5 text-xs font-semibold text-[#225d3d]">公司 → 岗位 → 要求</span></div>
          <div className="space-y-4" aria-live="polite">
            {filtered.map((company) => {
              const isOpen = openCompanies.has(company.id);
              return <article key={company.id} className="overflow-hidden rounded-2xl border border-[#d8dfd9] bg-white shadow-[0_7px_22px_rgba(31,61,42,0.04)]">
                <button onClick={() => toggleCompany(company.id)} aria-expanded={isOpen} className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#fbfcf9] sm:p-6">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#173f2a] text-xs font-bold tracking-wide text-white">{company.short}</span>
                  <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><strong className="text-xl tracking-tight">{company.name}</strong><span className="rounded-md bg-[#f4e8de] px-2 py-1 text-[11px] font-medium text-[#a94728]">{company.batch}</span></span><span className="mt-1.5 block text-sm text-[#6b776f]">{company.industry} · {company.jobs.length} 个匹配岗位</span></span>
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
                          <div className="grid gap-6 md:grid-cols-2">
                            <div><p className="drawer-label">岗位职责</p><ul className="detail-list">{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></div>
                            <div><p className="drawer-label">招聘要求</p><ul className="detail-list">{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul></div>
                          </div>
                          <div className="mt-6 grid gap-3 rounded-xl bg-[#f1f5f0] p-4 text-sm sm:grid-cols-3"><p><span className="detail-key">专业</span>{job.majors}</p><p><span className="detail-key">学历</span>{job.degree}</p><p><span className="detail-key">截止状态</span>{job.deadline}</p></div>
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

      <section id="standards" className="border-t border-[#dce1da] bg-[#173f2a] text-white"><div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_1.25fr]"><div><p className="text-xs font-bold tracking-[0.16em] text-[#ef9a78]">信息边界</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">官网没写的，我们不猜</h2></div><div className="grid gap-4 text-sm leading-6 text-[#d4e2d7] sm:grid-cols-2"><p><strong className="block text-white">只收当前可投</strong>提前批结束、申请入口关闭后立即隐藏。</p><p><strong className="block text-white">要求逐项展开</strong>学历、专业、职责与能力要求集中展示。</p><p><strong className="block text-white">缺失信息明示</strong>企业尚未更新职位描述时明确标记待更新。</p><p><strong className="block text-white">最终以官网为准</strong>每个岗位都保留原始校招投递入口。</p></div></div></section>
      <footer className="bg-[#102d20] px-5 py-6 text-center text-xs text-[#9fb3a5]">公开访问，无需登录。岗位信息以企业官网实时页面为最终依据。</footer>
    </main>
  );
}
