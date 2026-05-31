import React from "react";
import { Video, UserCheck, ShieldCheck, TrendingUp, Sparkles, Eye, Heart } from "lucide-react";

interface StatsOverviewProps {
  scheduledCount: number;
  connectedChannelsCount: number;
  totalChannelsCount: number;
}

export default function StatsOverview({
  scheduledCount,
  connectedChannelsCount,
  totalChannelsCount
}: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Queue Card */}
      <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden transition-all hover:border-white/10 group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Video className="w-24 h-24 text-white" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">คิวรอโพสต์ทั้งหมด</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-extrabold text-white">{scheduledCount}</h3>
          <span className="text-[10px] text-slate-500">วิดีโอในคิว</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#25f4ee]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25f4ee]" />
          <span>โพสต์ถัดไป: วันนี้ 18:30 น.</span>
        </div>
      </div>

      {/* API Connections Card */}
      <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden transition-all hover:border-white/10 group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <UserCheck className="w-24 h-24 text-white" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ช่องทางเชื่อมต่ออยู่</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-extrabold text-white">
            {connectedChannelsCount} / {totalChannelsCount}
          </h3>
          <span className="text-[10px] text-slate-500">บัญชี</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>OAuth Session ปกติ</span>
        </div>
      </div>

      {/* Total Followers Card */}
      <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden transition-all hover:border-white/10 group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingUp className="w-24 h-24 text-white" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">ยอดผู้ติดตามรวม</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#fe2c55] to-violet-400">2.33M</h3>
          <span className="text-[10px] text-slate-500">ผู้ติดตาม</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#fe2c55]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>อัตราเติบโต +4.2% รายสัปดาห์</span>
        </div>
      </div>

      {/* Cumulative Views Card */}
      <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden transition-all hover:border-white/10 group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Eye className="w-24 h-24 text-white" />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">สถิติวิเคราะห์ยอดดู</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-extrabold text-white">128.4K</h3>
          <span className="text-[10px] text-slate-500">วิว (คลิปล่าสุด)</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400">
          <Heart className="w-3.5 h-3.5 text-[#fe2c55] fill-[#fe2c55]" />
          <span>ยอดไลก์สะสม 14.2K ครั้ง</span>
        </div>
      </div>
    </div>
  );
}
