import { useMemo, useState } from "react";
import { Bell, Search, LayoutDashboard, Settings, Users, Package, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ title, value, sub, icon: Icon }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
          {sub ? <p className="mt-1 text-sm text-slate-500">{sub}</p> : null}
        </div>
        {Icon ? (
          <div className="rounded-xl border bg-slate-50 p-2 text-slate-700">
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition",
        active
          ? "bg-slate-900 text-white"
          : "text-slate-700 hover:bg-slate-100"
      )}
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Table({ rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-4 py-3">
        <p className="font-semibold text-slate-900">Recent activity</p>
        <p className="text-sm text-slate-500">Latest orders and status updates</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Order</th>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.id} className="text-slate-700">
                <td className="px-4 py-3 font-medium text-slate-900">{r.id}</td>
                <td className="px-4 py-3">{r.customer}</td>
                <td className="px-4 py-3">{r.amount}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold",
                      r.status === "Paid" && "bg-emerald-50 text-emerald-700",
                      r.status === "Pending" && "bg-amber-50 text-amber-700",
                      r.status === "Failed" && "bg-rose-50 text-rose-700"
                    )}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [query, setQuery] = useState("");

  const chartData = useMemo(
    () => [
      { name: "Mon", value: 24 },
      { name: "Tue", value: 18 },
      { name: "Wed", value: 32 },
      { name: "Thu", value: 28 },
      { name: "Fri", value: 41 },
      { name: "Sat", value: 35 },
      { name: "Sun", value: 22 },
    ],
    []
  );

  const rows = useMemo(
    () => [
      { id: "ORD-1042", customer: "Amina K.", amount: "€129.00", status: "Paid", date: "2026-02-24" },
      { id: "ORD-1041", customer: "Jonas L.", amount: "€49.00", status: "Pending", date: "2026-02-24" },
      { id: "ORD-1040", customer: "Sofie M.", amount: "€219.00", status: "Paid", date: "2026-02-23" },
      { id: "ORD-1039", customer: "Noah P.", amount: "€19.00", status: "Failed", date: "2026-02-23" },
      { id: "ORD-1038", customer: "Emma R.", amount: "€89.00", status: "Paid", date: "2026-02-22" },
    ].filter((r) =>
      (r.id + r.customer + r.status).toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl gap-4 p-4 md:p-6">
        {/* Sidebar */}
        <aside className="hidden w-64 flex-shrink-0 md:block">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500">PROJECT</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">React 19 Dashboard</p>
              <p className="mt-1 text-sm text-slate-500">Docker-ready dev setup</p>
            </div>

            <nav className="rounded-2xl border bg-white p-2 shadow-sm">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active={active === "Dashboard"} onClick={() => setActive("Dashboard")} />
              <SidebarItem icon={Users} label="Users" active={active === "Users"} onClick={() => setActive("Users")} />
              <SidebarItem icon={Package} label="Products" active={active === "Products"} onClick={() => setActive("Products")} />
              <SidebarItem icon={Settings} label="Settings" active={active === "Settings"} onClick={() => setActive("Settings")} />
            </nav>

            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Tip</p>
              <p className="mt-1 text-sm text-slate-500">
                Use Docker for consistent Node versions and CI/CD builds.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-4">
          {/* Top bar */}
          <header className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Overview</p>
                <h1 className="text-xl font-semibold text-slate-900">{active}</h1>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search orders, customers, status…"
                    className="w-full rounded-xl border bg-slate-50 px-10 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-slate-200"
                  />
                </div>
                <button className="rounded-xl border bg-white p-2 text-slate-700 hover:bg-slate-50">
                  <Bell size={18} />
                </button>
              </div>
            </div>
          </header>

          {/* KPI cards */}
          <section className="grid gap-4 md:grid-cols-3">
            <Card title="Revenue" value="€12,480" sub="↗︎ +8.2% this week" icon={TrendingUp} />
            <Card title="Active users" value="1,249" sub="↗︎ +3.1% this week" icon={Users} />
            <Card title="Orders" value="342" sub="↘︎ -1.4% this week" icon={Package} />
          </section>

          {/* Chart + Table */}
          <section className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2 rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3">
                <p className="font-semibold text-slate-900">Weekly traffic</p>
                <p className="text-sm text-slate-500">Sessions last 7 days</p>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={28} />
                    <Tooltip />
                    <Area type="monotone" dataKey="value" strokeWidth={2} fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-3">
              <Table rows={rows} />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}