import React from "react";
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Film,
  Radio,
  Settings,
  Sparkles
} from "lucide-react";
import { TikTokChannel } from "../types";

interface SidebarProps {
  activeTab: "dashboard" | "calendar" | "media" | "channels" | "settings";
  setActiveTab: (tab: "dashboard" | "calendar" | "media" | "channels" | "settings") => void;
  channels: TikTokChannel[];
  scheduledCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, channels, scheduledCount }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-white/5 bg-[#090911]/60 backdrop-blur-xl flex flex-col justify-between py-6">
      <div className="space-y-6">
        <div className="px-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">CONTROL PANEL</p>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "dashboard"
                  ? "bg-white/10 text-white border-l-2 border-[#fe2c55] shadow-lg shadow-white/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4.5 h-4.5" />
                <span>แผงควบคุมหลัก</span>
              </div>
              <span className="text-[10px] bg-[#fe2c55]/20 text-[#fe2c55] font-bold px-1.5 py-0.5 rounded-full">Live</span>
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "calendar"
                  ? "bg-white/10 text-white border-l-2 border-[#fe2c55] shadow-lg shadow-white/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-4.5 h-4.5" />
                <span>ตารางงาน (Planner)</span>
              </div>
              <span className="text-[10px] bg-white/10 text-slate-300 font-bold px-1.5 py-0.5 rounded-full">{scheduledCount}</span>
            </button>

            <button
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "media"
                  ? "bg-white/10 text-white border-l-2 border-[#fe2c55] shadow-lg shadow-white/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4.5 h-4.5" />
                <span>คลังมีเดียวิดีโอ</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("channels")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "channels"
                  ? "bg-white/10 text-white border-l-2 border-[#fe2c55] shadow-lg shadow-white/5"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio className="w-4.5 h-4.5" />
                <span>ช่องทางที่เชื่อมต่อ</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-full">{channels.length} ช่อง</span>
            </button>
          </nav>
        </div>

        {/* Quick Status / Active Channels mini list */}
        <div className="px-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-2">ACTIVE SESSIONS</p>
          <div className="space-y-2">
            {channels.map(channel => (
              <div 
                key={channel.id} 
                className="flex items-center justify-between p-2 rounded-lg bg-[#11111f]/60 border border-white/5 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <img src={channel.avatar} alt={channel.handle} className="w-6 h-6 rounded-full object-cover" />
                  <span className="font-semibold text-slate-300 truncate">{channel.handle}</span>
                </div>
                <span className={`w-2 h-2 rounded-full ${channel.status === "Connected" ? "bg-emerald-400 shadow-md shadow-emerald-400/50" : "bg-[#fe2c55] animate-ping"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4">
        <div className="p-3.5 rounded-xl bg-gradient-to-tr from-[#fe2c55]/10 to-violet-600/10 border border-white/5">
          <div className="flex items-center gap-2 mb-1.5 text-white text-xs font-bold">
            <Sparkles className="w-4 h-4 text-[#fe2c55]" />
            AI Assistant Active
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            วิเคราะห์ความยาวแคปชัน แฮชแท็กแนะนำ และจัดเวลาช่วงดีที่สุดสำหรับการโพสต์เรียบร้อย
          </p>
        </div>

        <button 
          onClick={() => setActiveTab("settings")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-all"
        >
          <Settings className="w-4.5 h-4.5" />
          <span>การตั้งค่าระบบ</span>
        </button>
      </div>
    </aside>
  );
}
