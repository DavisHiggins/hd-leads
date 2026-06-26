import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { DEMO_LEADS, PIPELINE_STAGES } from "@/lib/demoData";
import { Users, Flame, Zap, Mail, FileText, Trophy, DollarSign, TrendingUp, Globe, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";

const COLORS = ["#d4a017", "#0d1b2a", "#1b2d45", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];

export default function Analytics() {
  const [leads, setLeads] = useState([]);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const db = await base44.entities.Lead.list();
        if (db && db.length > 0) { setLeads(db); setIsDemo(false); }
        else { setLeads(DEMO_LEADS); setIsDemo(true); }
      } catch { setLeads(DEMO_LEADS); setIsDemo(true); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-4 border-gray-200 border-t-amber-400 rounded-full animate-spin" /></div>;

  const hot = leads.filter(l => l.priority === "Hot").length;
  const warm = leads.filter(l => l.priority === "Warm").length;
  const low = leads.filter(l => l.priority === "Low").length;
  const contacted = leads.filter(l => ["Contacted", "Followed Up"].includes(l.pipeline_stage)).length;
  const proposals = leads.filter(l => l.pipeline_stage === "Proposal Sent").length;
  const won = leads.filter(l => l.pipeline_stage === "Won").length;
  const avgScore = leads.length ? Math.round(leads.reduce((a, l) => a + (l.lead_score || 0), 0) / leads.length) : 0;
  const websiteLeads = leads.filter(l => l.has_website);
  const avgWebScore = websiteLeads.length ? Math.round(websiteLeads.reduce((a, l) => a + (l.website_score || 0), 0) / websiteLeads.length) : 0;

  const stats = [
    { label: "Total Leads", value: leads.length, icon: Users, bg: "bg-[#0d1b2a]", ic: "text-amber-400" },
    { label: "Hot Leads", value: hot, icon: Flame, bg: "bg-red-50", ic: "text-red-600" },
    { label: "Warm Leads", value: warm, icon: Zap, bg: "bg-amber-50", ic: "text-amber-600" },
    { label: "Contacted", value: contacted, icon: Mail, bg: "bg-blue-50", ic: "text-blue-600" },
    { label: "Proposals Sent", value: proposals, icon: FileText, bg: "bg-purple-50", ic: "text-purple-600" },
    { label: "Won Clients", value: won, icon: Trophy, bg: "bg-green-50", ic: "text-green-600" },
    { label: "Avg Lead Score", value: avgScore, icon: TrendingUp, bg: "bg-gray-50", ic: "text-gray-600" },
    { label: "Avg Website Score", value: avgWebScore, icon: Globe, bg: "bg-cyan-50", ic: "text-cyan-600" },
    { label: "Est. Revenue", value: `$${(won * 3500).toLocaleString()}`, icon: DollarSign, bg: "bg-amber-50", ic: "text-amber-600" },
  ];

  const industryMap = {};
  leads.forEach(l => { industryMap[l.category] = (industryMap[l.category] || 0) + 1; });
  const industryData = Object.entries(industryMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  const serviceMap = {};
  leads.forEach(l => { if (l.suggested_service) serviceMap[l.suggested_service] = (serviceMap[l.suggested_service] || 0) + 1; });
  const serviceData = Object.entries(serviceMap).map(([name, value]) => ({ name, value }));

  const priorityData = [
    { name: "Hot", value: hot },
    { name: "Warm", value: warm },
    { name: "Low", value: low },
  ];

  const pipelineData = PIPELINE_STAGES.map(s => ({ name: s.length > 10 ? s.substring(0, 10) + "…" : s, value: leads.filter(l => l.pipeline_stage === s).length }));

  // Score distribution
  const scoreRanges = ["0-20", "21-40", "41-60", "61-80", "81-100"];
  const scoreData = scoreRanges.map(r => {
    const [min, max] = r.split("-").map(Number);
    return { name: r, value: leads.filter(l => (l.lead_score || 0) >= min && (l.lead_score || 0) <= max).length };
  });

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Performance overview and insights</p>
        </div>
        {isDemo && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Demo Data</Badge>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-9 gap-3 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border p-3 text-center hover:shadow-md transition-shadow">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mx-auto mb-2`}>
              <s.icon size={15} className={s.ic} />
            </div>
            <p className="text-lg font-display font-bold">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Pipeline Overview</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#0d1b2a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Lead Score Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#d4a017" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Priority Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                <Cell fill="#ef4444" />
                <Cell fill="#f59e0b" />
                <Cell fill="#3b82f6" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Services Needed</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                {serviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {serviceData.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-display font-semibold text-sm mb-4">Top Industries</h3>
          <div className="space-y-2">
            {industryData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between py-1.5">
                <span className="text-sm truncate mr-2">{d.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0d1b2a] rounded-full" style={{ width: `${(d.value / leads.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold w-5 text-right">{d.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
