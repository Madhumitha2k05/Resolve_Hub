import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, ListTodo, Settings, Users, Bell, Search, Filter } from 'lucide-react';

export default function AuthorityDashboard({ user }) {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchIssues();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/issues`);
      setIssues(res.data);
    } catch (error) {
      console.error("Error fetching issues", error);
    }
  };

  const updateStatus = async (issue, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/issues/${issue.id}`, { ...issue, status: newStatus });
      fetchIssues();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const updatePriority = async (issue, newPriority) => {
    try {
      await axios.put(`http://localhost:8080/api/issues/${issue.id}`, { ...issue, priority: newPriority });
      fetchIssues();
    } catch (error) {
      console.error("Error updating priority", error);
    }
  };

  // Analytics Calculations
  const totalIssues = issues.length;
  const statusCounts = issues.reduce((acc, issue) => {
    acc[issue.status] = (acc[issue.status] || 0) + 1;
    return acc;
  }, {});

  const priorityCounts = issues.reduce((acc, issue) => {
    acc[issue.priority] = (acc[issue.priority] || 0) + 1;
    return acc;
  }, {});

  const statusData = [
    { name: 'Reported', value: statusCounts['REPORTED'] || 0, color: '#F59E0B' },
    { name: 'In Progress', value: statusCounts['IN_PROGRESS'] || 0, color: '#3B82F6' },
    { name: 'Resolved', value: statusCounts['RESOLVED'] || 0, color: '#10B981' },
    { name: 'Verified', value: statusCounts['VERIFIED'] || 0, color: '#059669' }
  ];

  const priorityData = [
    { name: 'Unassigned', count: priorityCounts['UNASSIGNED'] || 0 },
    { name: 'Low', count: priorityCounts['LOW'] || 0 },
    { name: 'Medium', count: priorityCounts['MEDIUM'] || 0 },
    { name: 'High', count: priorityCounts['HIGH'] || 0 },
    { name: 'Critical', count: priorityCounts['CRITICAL'] || 0 },
  ];

  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col md:flex-row h-[85vh] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] -mt-4">
      
      {/* Sidebar */}
      <div className="w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-xl font-black text-white tracking-widest uppercase flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            Admin Portal
          </h2>
        </div>
        
        <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-4">Menu</div>
          
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === 'analytics' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className={`h-5 w-5 ${activeTab === 'analytics' ? 'text-indigo-400' : 'text-slate-500'}`} />
            Dashboard Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('manage')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === 'manage' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <ListTodo className={`h-5 w-5 ${activeTab === 'manage' ? 'text-indigo-400' : 'text-slate-500'}`} />
            Issue Management
            {issues.filter(i => i.status === 'REPORTED').length > 0 && (
              <span className="ml-auto bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {issues.filter(i => i.status === 'REPORTED').length}
              </span>
            )}
          </button>

          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-4">System Settings</div>
          
          <button 
            onClick={() => setActiveTab('directory')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === 'directory' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <Users className={`h-5 w-5 ${activeTab === 'directory' ? 'text-indigo-400' : 'text-slate-500'}`} />
            User Directory
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === 'settings' 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner' 
                : 'hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className={`h-5 w-5 ${activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-500'}`} />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 relative">
        {/* Top Header */}
        <div className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-8 flex items-center justify-between z-10 shrink-0">
          <h1 className="text-2xl font-bold text-slate-800">
            {activeTab === 'analytics' ? 'Analytics Overview' : 
             activeTab === 'manage' ? 'Manage Community Issues' :
             activeTab === 'directory' ? 'User Directory' : 'System Settings'}
          </h1>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Decorative background blobs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute top-10 right-10 w-96 h-96 bg-fuchsia-300/30 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Issues', value: totalIssues, gradient: 'from-purple-500 to-fuchsia-500', text: 'text-white' },
                  { title: 'Open (Reported)', value: statusCounts['REPORTED'] || 0, gradient: 'from-amber-400 to-orange-500', text: 'text-white' },
                  { title: 'In Progress', value: statusCounts['IN_PROGRESS'] || 0, gradient: 'from-cyan-400 to-blue-500', text: 'text-white' },
                  { title: 'Resolved', value: (statusCounts['RESOLVED'] || 0) + (statusCounts['VERIFIED'] || 0), gradient: 'from-emerald-400 to-teal-500', text: 'text-white' }
                ].map((stat, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/20 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-xl -mr-8 -mt-8"></div>
                    <p className={`text-sm font-bold ${stat.text} opacity-90 uppercase tracking-wider mb-2`}>{stat.title}</p>
                    <p className={`text-5xl font-black ${stat.text} drop-shadow-sm`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white">
                  <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                    Issue Status Distribution
                  </h3>
                  <div className="h-80 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-sm border border-white">
                  <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                    Priority Breakdown
                  </h3>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priorityData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                        <Tooltip 
                          cursor={{fill: '#F8FAFC'}} 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={50}>
                          {priorityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.count > 5 ? '#EF4444' : entry.count > 2 ? '#F59E0B' : '#6366F1'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Search Bar */}
              <div className="flex gap-4 items-center bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white shadow-sm">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search issues by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border-0 rounded-xl text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Issue Details</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Priority</th>
                        <th className="px-8 py-5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredIssues.map((issue) => (
                        <tr key={issue.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-5">
                              {issue.photoPath ? (
                                <img src={`http://localhost:8080${issue.photoPath}`} alt="Issue" className="w-16 h-16 object-cover rounded-xl shadow-sm border border-slate-200 group-hover:scale-105 transition-transform" />
                              ) : (
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl border border-slate-200 flex items-center justify-center text-xs text-slate-400 font-medium shadow-inner shrink-0">
                                  No Image
                                </div>
                              )}
                              <div className="flex flex-col gap-1.5">
                                <div className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{issue.title}</div>
                                <div className="text-sm text-slate-500 truncate max-w-sm">{issue.description}</div>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                    📍 {issue.location.length > 30 ? issue.location.substring(0, 30) + '...' : issue.location}
                                  </span>
                                  <span className="text-xs text-indigo-600 font-medium">By: {issue.reporterName || 'Unknown'}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <div className="relative group/select">
                              <select 
                                className={`text-sm font-bold rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none pr-8 pl-4 py-2.5 transition-colors
                                  ${issue.priority === 'CRITICAL' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
                                    issue.priority === 'HIGH' ? 'bg-orange-50 text-orange-700 hover:bg-orange-100' :
                                    issue.priority === 'MEDIUM' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                    issue.priority === 'LOW' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' :
                                    'bg-slate-100 text-slate-500 border border-slate-200'
                                  }`}
                                value={issue.priority}
                                onChange={(e) => updatePriority(issue, e.target.value)}
                              >
                                <option value="UNASSIGNED">Unassigned</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="CRITICAL">Critical</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-8 py-6 whitespace-nowrap">
                            <select 
                              className={`text-sm font-bold rounded-xl shadow-sm border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none pr-8 pl-4 py-2.5 transition-colors
                                ${issue.status === 'REPORTED' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' :
                                  issue.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                  'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                }`}
                              value={issue.status}
                              onChange={(e) => updateStatus(issue, e.target.value)}
                            >
                              <option value="REPORTED">Reported</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="RESOLVED">Resolved</option>
                              <option value="VERIFIED">Verified</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredIssues.length === 0 && (
                    <div className="text-center text-slate-500 my-16 flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-slate-300" />
                      </div>
                      <p className="text-lg font-medium">No issues found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'directory' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                <div className="p-8 pb-0">
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Registered Users</h2>
                  <p className="text-slate-500 text-sm mb-6">A complete directory of all community members and authorities.</p>
                </div>
                <div className="overflow-x-auto px-8 pb-8 relative z-10">
                  <table className="min-w-full divide-y divide-slate-200/60">
                    <thead>
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider bg-slate-50/50 rounded-tl-xl">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider bg-slate-50/50">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider bg-slate-50/50 rounded-tr-xl">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-transparent">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-slate-700">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              u.role === 'AUTHORITY' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <div className="text-center py-12 text-slate-500 font-medium">Loading directory...</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white p-8 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none"></div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Settings className="text-indigo-500" /> System Settings
                </h2>
                
                <div className="space-y-6 relative z-10">
                  <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Your Profile Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                        <input type="text" readOnly value={user?.name || ''} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-700 font-medium cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                        <input type="email" readOnly value={user?.email || ''} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-700 font-medium cursor-not-allowed" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Role</label>
                        <input type="text" readOnly value={user?.role || ''} className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-3 text-indigo-700 font-bold cursor-not-allowed" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
