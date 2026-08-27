'use client';

import { useMemo, useState } from 'react';

type Job = {
  id: number;
  company: string;
  title: string;
  location: string;
  areas: string[];
  degree: string;
  batch: string;
  deadline: string;
  direction: string;
  majors: string;
  source: string;
  url: string;
  verified: string;
};

const jobs: Job[] = [
  {
    id: 1,
    company: '卡特彼勒',
    title: '制造工程师（机械 / 自动化 / 智能方向）',
    location: '江苏 · 徐州',
    areas: ['江苏全域'],
    degree: '本科及以上',
    batch: '2027届校园招聘',
    deadline: '截止 2026-10-30',
    direction: '制造工程',
    majors: '机械、电气自动化、智能物流、工业工程等',
    source: '卡特彼勒招聘官网',
    url: 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000388302/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E5%88%B6%E9%80%A0%E8%BF%90%E8%90%A5%E7%B1%BB/',
    verified: '2026-08-27 10:30',
  },
  {
    id: 2,
    company: '卡特彼勒',
    title: '设备 / 设施工程师',
    location: '江苏 · 徐州',
    areas: ['江苏全域'],
    degree: '本科及以上',
    batch: '2027届校园招聘',
    deadline: '截止 2026-10-30',
    direction: '设备工程',
    majors: '机械、电气自动化、工业工程等',
    source: '卡特彼勒招聘官网',
    url: 'https://careers.caterpillar.com/zh/%E8%81%8C%E4%BD%8D/r0000388302/2027%E6%A0%A1%E5%9B%AD%E6%8B%9B%E8%81%98-%E5%88%B6%E9%80%A0%E8%BF%90%E8%90%A5%E7%B1%BB/',
    verified: '2026-08-27 10:30',
  },
  {
    id: 3,
    company: '三一集团',
    title: '研发技术类（机械 / 液压 / 结构 / 仿真）',
    location: '江苏 · 昆山 / 南京 / 常熟',
    areas: ['江苏全域'],
    degree: '本科 / 硕士 / 博士',
    batch: '2027届秋季校招',
    deadline: '正式批开放中',
    direction: '研发设计',
    majors: '机械、液压、动力、仿真、控制、工艺、结构等',
    source: '三一集团校招系统',
    url: 'https://sany.zhiye.com/Portal/Apply/Index',
    verified: '2026-08-27 10:20',
  },
  {
    id: 4,
    company: '吉利控股',
    title: '整车研发类（动力 / 仿真 / 系统集成）',
    location: '杭州 / 宁波 / 江苏',
    areas: ['杭州', '宁波', '江苏全域'],
    degree: '本科 / 硕士 / 博士',
    batch: '2027届秋季校招',
    deadline: '截止 2026-10-31',
    direction: '车辆研发',
    majors: '机械、车辆、能源动力、自动化、材料等',
    source: '吉利校园招聘官网',
    url: 'https://campus.geely.com/',
    verified: '2026-08-27 10:10',
  },
  {
    id: 5,
    company: '阳光电源',
    title: '机械与结构研发类（多岗位）',
    location: '合肥',
    areas: ['合肥'],
    degree: '本科及以上',
    batch: '2027届正式批',
    deadline: '正式批开放中',
    direction: '结构设计',
    majors: '机械设计、车辆工程、力学、自动化等',
    source: '阳光电源招聘官网',
    url: 'https://jobs.sungrowpower.com/',
    verified: '2026-08-27 10:00',
  },
];

const areas = ['全部地区', '合肥', '江苏全域', '杭州', '宁波'];
const directions = ['全部方向', '研发设计', '车辆研发', '结构设计', '制造工程', '设备工程'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('全部地区');
  const [direction, setDirection] = useState('全部方向');

  const filtered = useMemo(() => jobs.filter((job) => {
    const normalized = query.trim().toLowerCase();
    const queryMatch = !normalized || `${job.company}${job.title}${job.majors}${job.location}`.toLowerCase().includes(normalized);
    const areaMatch = area === '全部地区' || job.areas.includes(area);
    const directionMatch = direction === '全部方向' || job.direction === direction;
    return queryMatch && areaMatch && directionMatch;
  }), [query, area, direction]);

  const reset = () => { setQuery(''); setArea('全部地区'); setDirection('全部方向'); };

  return (
    <main className="min-h-screen bg-[#f5f6f2] text-[#14211a]">
      <header className="border-b border-[#dce1da] bg-[#f5f6f2]/95">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="机遇引擎首页">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#173f2a] text-sm font-bold text-white">ME</span>
            <span><strong className="block text-[15px] tracking-[0.08em]">机遇引擎</strong><small className="text-xs text-[#68746c]">机械校招聚合</small></span>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-[#536159] sm:flex" aria-label="主导航">
            <span>当前仅收录可投岗位</span>
            <a href="#standards" className="rounded-full border border-[#aeb8b0] px-4 py-2 font-medium text-[#173f2a] transition hover:bg-white">收录标准</a>
          </nav>
        </div>
      </header>

      <section id="top" className="border-b border-[#dce1da] bg-[#e8eee7]">
        <div className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
          <p className="mb-4 text-xs font-bold tracking-[0.18em] text-[#ce5a35]">2027 届校园招聘 · 测试版</p>
          <div className="grid gap-7 lg:grid-cols-[1fr_330px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.13] tracking-[-0.035em] sm:text-6xl">找到真正还在开放的<br className="hidden sm:block" /><span className="text-[#1c6741]">机械工程岗位</span></h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-[#59675e]">聚合合肥、江苏、杭州与宁波的企业官网校招信息。提前批已结束、入口已关闭和生产技能岗位不会出现在这里。</p>
            </div>
            <div className="rounded-2xl border border-[#ced8cf] bg-white/70 p-5">
              <div className="flex items-end justify-between"><span className="text-sm text-[#647168]">测试版已核验</span><strong className="text-4xl font-semibold tracking-tight">{jobs.length}</strong></div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#dce3dc]"><div className="h-full w-full rounded-full bg-[#1c6741]" /></div>
              <p className="mt-3 text-xs text-[#748078]">最近核验：2026-08-27 10:30</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1180px] gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[250px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#dce1da] bg-white p-5 lg:sticky lg:top-5">
          <div className="mb-5 flex items-center justify-between"><h2 className="font-semibold">筛选岗位</h2><button onClick={reset} className="text-xs font-medium text-[#1c6741] hover:underline">重置</button></div>
          <label htmlFor="keyword" className="block text-xs font-medium text-[#68746c]">关键词</label>
          <input id="keyword" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d3dad4] bg-[#fafbf8] px-3 py-2.5 text-sm outline-none transition focus:border-[#508465] focus:ring-2 focus:ring-[#d8e8dc]" placeholder="岗位、公司或专业" />
          <fieldset className="mt-6 space-y-3">
            <legend className="mb-3 text-xs font-medium text-[#68746c]">工作地区</legend>
            {areas.map((item) => <label key={item} className="flex cursor-pointer items-center gap-2.5 text-sm"><input type="radio" name="area" checked={area === item} onChange={() => setArea(item)} className="accent-[#1c6741]" />{item}</label>)}
          </fieldset>
          <label htmlFor="direction" className="mt-6 block text-xs font-medium text-[#68746c]">岗位方向</label>
          <select id="direction" value={direction} onChange={(event) => setDirection(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d3dad4] bg-[#fafbf8] px-3 py-2.5 text-sm outline-none focus:border-[#508465]">
            {directions.map((item) => <option key={item}>{item}</option>)}
          </select>
        </aside>

        <div>
          <div className="mb-5 flex items-end justify-between gap-3">
            <div><h2 className="text-2xl font-semibold tracking-tight">正在招聘</h2><p className="mt-1 text-sm text-[#6c786f]">找到 {filtered.length} 个当前可投岗位</p></div>
            <span className="rounded-full bg-[#e4ece5] px-3 py-1.5 text-xs font-semibold text-[#225d3d]">仅校招 · 仅可投</span>
          </div>

          <div className="space-y-3" aria-live="polite">
            {filtered.map((job) => (
              <article key={job.id} className="group rounded-2xl border border-[#dce1da] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#9eb4a2] hover:shadow-[0_12px_30px_rgba(31,61,42,0.07)] sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs"><span className="rounded-md bg-[#173f2a] px-2 py-1 font-semibold text-white">{job.company}</span><span className="rounded-md bg-[#f4e8de] px-2 py-1 font-medium text-[#a94728]">{job.batch}</span></div>
                    <h3 className="text-xl font-semibold tracking-tight group-hover:text-[#1c6741]">{job.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#647168]"><span>{job.location}</span><span>{job.degree}</span><span>{job.direction}</span></div>
                    <p className="mt-4 text-sm leading-6 text-[#59675e]"><span className="font-medium text-[#29382f]">相关专业：</span>{job.majors}</p>
                    <p className="mt-3 text-xs text-[#879188]">来源：{job.source} · 核验于 {job.verified}</p>
                  </div>
                  <div className="flex min-w-fit items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <span className="text-xs font-medium text-[#1c6741]">● {job.deadline}</span>
                    <a href={job.url} target="_blank" rel="noreferrer" className="rounded-xl bg-[#173f2a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#225c3a] focus:outline-none focus:ring-2 focus:ring-[#6ea07d] focus:ring-offset-2">前往官网投递 ↗</a>
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 && <div className="rounded-2xl border border-dashed border-[#c9d1ca] bg-white px-6 py-14 text-center"><p className="font-semibold">没有符合当前条件的岗位</p><p className="mt-2 text-sm text-[#6c786f]">试试减少筛选条件，或稍后查看新一批岗位。</p><button onClick={reset} className="mt-5 rounded-xl bg-[#173f2a] px-4 py-2 text-sm font-semibold text-white">清除筛选</button></div>}
          </div>
        </div>
      </section>

      <section id="standards" className="border-t border-[#dce1da] bg-[#173f2a] text-white">
        <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_1.25fr]">
          <div><p className="text-xs font-bold tracking-[0.16em] text-[#ef9a78]">收录标准</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">每一个“可投”都有依据</h2></div>
          <div className="grid gap-4 text-sm leading-6 text-[#d4e2d7] sm:grid-cols-2">
            <p><strong className="block text-white">明确属于校招</strong>招聘页面需标注校园招聘、应届生或毕业届次。</p>
            <p><strong className="block text-white">投递入口仍有效</strong>仅保留官网中能打开并继续申请的岗位。</p>
            <p><strong className="block text-white">只看工程技术岗</strong>不收录普工、操作工与生产技能类岗位。</p>
            <p><strong className="block text-white">每日重新核验</strong>截止、下线或无法确认的岗位会自动隐藏。</p>
          </div>
        </div>
      </section>

      <footer className="bg-[#102d20] px-5 py-6 text-center text-xs text-[#9fb3a5]">测试版数据用于功能验证，投递前请以企业官网最新信息为准。</footer>
    </main>
  );
}
