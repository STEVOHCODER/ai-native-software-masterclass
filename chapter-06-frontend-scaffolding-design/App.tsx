import { useEffect, useMemo, useState, type ReactElement } from 'react';

interface CourseProgress { readonly title: string; readonly progress: number; readonly lessons: number; }
interface DashboardData { readonly greeting: string; readonly streak: number; readonly courses: readonly CourseProgress[]; }
type Layout = 'grid' | 'list';

const fallbackData: DashboardData = {
  greeting: 'Welcome back',
  streak: 4,
  courses: [
    { title: 'Local Sandbox Wiring', progress: 82, lessons: 6 },
    { title: 'API Infrastructure Gateways', progress: 46, lessons: 8 },
    { title: 'Database Architecture', progress: 21, lessons: 7 },
  ],
};

export default function App(): ReactElement {
  const [layout, setLayout] = useState<Layout>(() => (localStorage.getItem('hub-layout') as Layout) || 'grid');
  const [data, setData] = useState<DashboardData>(fallbackData);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    localStorage.setItem('hub-layout', layout);
  }, [layout]);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/dashboard', { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`Dashboard request failed (${response.status})`); return response.json() as Promise<DashboardData>; })
      .then((payload) => { setData(payload); setStatus('ready'); })
      .catch((error: unknown) => { if (error instanceof DOMException && error.name === 'AbortError') return; setStatus('error'); });
    return () => controller.abort();
  }, []);

  const completed = useMemo(() => data.courses.filter((course) => course.progress === 100).length, [data.courses]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-400">Masterclass Hub</p><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">{data.greeting}</h1><p className="mt-3 text-slate-400">Build durable systems, one chapter at a time.</p></div>
          <div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1" role="group" aria-label="Course layout">
            {(['grid', 'list'] as const).map((option) => <button key={option} type="button" onClick={() => setLayout(option)} aria-pressed={layout === option} className={`rounded-lg px-4 py-2 text-sm capitalize transition ${layout === option ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}>{option}</button>)}
          </div>
        </header>
        {status === 'error' && <p role="alert" className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">Live data is unavailable; showing the latest local snapshot.</p>}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric label="Current streak" value={`${data.streak} days`} />
          <Metric label="Chapters complete" value={`${completed} / ${data.courses.length}`} />
          <Metric label="Sync status" value={status === 'loading' ? 'Connecting…' : 'Ready'} />
        </section>
        <section className={`mt-8 grid gap-5 transition-all duration-300 ${layout === 'grid' ? 'md:grid-cols-3' : 'grid-cols-1'}`}>
          {data.courses.map((course) => <article key={course.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/30"><div className="flex items-start justify-between gap-4"><h2 className="text-lg font-semibold">{course.title}</h2><span className="text-sm text-cyan-300">{course.progress}%</span></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-cyan-400 transition-all duration-500" style={{ width: `${course.progress}%` }} /></div><p className="mt-4 text-sm text-slate-400">{course.lessons} guided lessons</p></article>)}
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { readonly label: string; readonly value: string }): ReactElement {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>;
}
