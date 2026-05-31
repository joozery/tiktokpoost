import React from "react";
import { Settings, Sliders, Zap } from "lucide-react";

export default function SystemSettings() {
  return (
    <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-[#fe2c55]" />
        <h2 className="text-xl font-bold text-white">การตั้งค่าระบบและ API Credentials</h2>
      </div>

      <div className="space-y-6 max-w-xl text-left">
        {/* TikTok App API Settings */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#fe2c55]" />
            TikTok Client Application Config
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">TikTok Client Key</label>
              <input
                type="password"
                value="••••••••••••••••••••••••••••••••"
                disabled
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-slate-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">TikTok Client Secret</label>
              <input
                type="password"
                value="••••••••••••••••••••••••••••••••"
                disabled
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-slate-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Redirect URI (Callback)</label>
              <input
                type="text"
                value="https://api.joozery.com/tiktok/callback"
                disabled
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-slate-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Auto Post Settings */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#25f4ee]" />
            กำหนดค่าการอัปโหลดอัตโนมัติ (Rate Limiting & Safety)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">จำกัดจำนวนคลิปโพสต์ต่อวัน / ช่อง</span>
              <select className="bg-[#0a0a0f] border border-white/10 rounded px-2 py-1 text-slate-300">
                <option>3 คลิปต่อวัน (ปลอดภัยสูงสุด)</option>
                <option>5 คลิปต่อวัน (ปานกลาง)</option>
                <option>10 คลิปต่อวัน (ความเสี่ยงสูงต่ออัตราสแปม)</option>
              </select>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">การส่งคำขอแบบข้ามช่วงเวลาสุ่ม (Jitter Time)</span>
              <input type="checkbox" defaultChecked className="accent-[#fe2c55] w-4 h-4" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">หากการอัปโหลดล้มเหลวให้ลองใหม่ (Auto-Retry)</span>
              <select className="bg-[#0a0a0f] border border-white/10 rounded px-2 py-1 text-slate-300">
                <option>ลองใหม่ 3 ครั้ง (เว้นช่วงละ 5 นาที)</option>
                <option>ลองใหม่ 1 ครั้ง</option>
                <option>ไม่ต้องลองใหม่ (บันทึกข้อผิดพลาดทันที)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
