import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const sourcePath = new URL('../app/page.tsx', import.meta.url);
const reportPath = new URL('../reports/latest-recruitment-scan.json', import.meta.url);
const summaryPath = new URL('../reports/latest-recruitment-scan.md', import.meta.url);
const publicReportPath = new URL('../public/scan/latest-recruitment-scan.json', import.meta.url);
const timeoutMs = 15_000;
const concurrency = 6;

function extractWatchlist(source) {
  const block = source.match(/const watchlist = \[([\s\S]*?)\n\];\n\nexport default function Home/);
  if (!block) throw new Error('无法在 app/page.tsx 中读取企业监测名单。');

  const entries = [...block[1].matchAll(/\{ name: '([^']+)', area: '([^']+)', tag: '([^']+)', focus: '([^']+)', url: '([^']+)' \}/g)];
  if (entries.length === 0) throw new Error('企业监测名单为空。');
  return entries.map(([, name, area, tag, focus, url]) => ({ name, area, tag, focus, url }));
}

function extractCurrentCompanyPortals(source) {
  const entries = [...source.matchAll(/id: '([^']+)', name: '([^']+)'[^\n]*website: '([^']+)'/g)];
  return entries.map(([, id, name, url]) => ({ id, name, area: '当前可投企业', tag: '中国官网/中国区官方入口', focus: '当前可投岗位核验', url }));
}

function compactText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function pageTitle(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  return compactText(title).slice(0, 120);
}

function classify(text) {
  const campus = /校园招聘|校招|应届生|毕业生|campus\s*recruit/i.test(text);
  const recruiting = /招聘|招募|岗位|职位|join\s+us|career/i.test(text);
  const closed = /提前批(?:已)?结束|校招(?:已)?结束|网申(?:已)?结束|招聘(?:已)?结束|停止投递|已截止/i.test(text);
  if (campus && recruiting && !closed) return '疑似在招校招信号';
  if (campus && recruiting) return '发现校招但可能已结束';
  if (recruiting) return '发现招聘入口，待人工确认校招';
  return '未发现明确招聘信号';
}

async function inspect(company) {
  const started = Date.now();
  try {
    const response = await fetch(company.url, {
      headers: {
        'user-agent': 'MechanicalCampusJobsMonitor/1.0 (+https://github.com/yu-hao-0323/mechanical-campus-jobs-cn)',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.7',
      },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow',
    });
    const html = await response.text();
    const text = compactText(html).slice(0, 120_000);
    return {
      ...company,
      result: response.ok ? classify(text) : '访问异常，待人工复核',
      httpStatus: response.status,
      finalUrl: response.url,
      title: pageTitle(html),
      fingerprint: createHash('sha256').update(`${response.url}\n${pageTitle(html)}\n${text.slice(0, 40_000)}`).digest('hex').slice(0, 16),
      checkedAt: new Date().toISOString(),
      durationMs: Date.now() - started,
    };
  } catch (error) {
    return {
      ...company,
      result: '访问异常，待人工复核',
      httpStatus: null,
      finalUrl: company.url,
      title: '',
      fingerprint: null,
      checkedAt: new Date().toISOString(),
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.name : 'UnknownError',
    };
  }
}

async function pool(items, handler) {
  const result = [];
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor++];
      result.push(await handler(item));
    }
  }));
  return result.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
}

const source = await readFile(sourcePath, 'utf8');
const allCompanies = [...extractWatchlist(source), ...extractCurrentCompanyPortals(source)]
  .filter((company, index, list) => list.findIndex((item) => item.url === company.url) === index);
const limit = Number.parseInt(process.env.SCAN_LIMIT ?? '', 10);
const companies = Number.isFinite(limit) && limit > 0 ? allCompanies.slice(0, limit) : allCompanies;
const results = await pool(companies, inspect);
const counts = Object.groupBy(results, ({ result }) => result);
const report = {
  generatedAt: new Date().toISOString(),
  scope: '合肥、江苏全域、杭州、宁波；机械/装备及相关工程技术校招监测',
  policy: '仅监测中国官网或中国区官方招聘入口。扫描结果仅作为待核验线索；发布前必须人工核对官网、岗位JD和投递状态。',
  totals: Object.fromEntries(Object.entries(counts).map(([key, value]) => [key, value.length])),
  companies: results,
};

const rows = results.map((item) => `| ${item.name} | ${item.area} | ${item.result} | ${item.httpStatus ?? '-'} | ${item.title || '-'} |`).join('\n');
const markdown = `# 每日招聘扫描报告\n\n- 扫描时间：${report.generatedAt}\n- 范围：${report.scope}\n- 原则：${report.policy}\n\n| 企业 | 地区 | 扫描结果 | HTTP | 页面标题 |\n| --- | --- | --- | --- | --- |\n${rows}\n`;

await mkdir(new URL('../reports/', import.meta.url), { recursive: true });
await mkdir(new URL('../public/scan/', import.meta.url), { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
await writeFile(summaryPath, markdown, 'utf8');
await writeFile(publicReportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(`已扫描 ${results.length} 家企业；疑似在招校招信号：${counts['疑似在招校招信号']?.length ?? 0}。`);
