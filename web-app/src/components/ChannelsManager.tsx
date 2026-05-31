import React from "react";
import { Radio, RefreshCw } from "lucide-react";
import { TikTokChannel } from "../types";

interface ChannelsManagerProps {
  channels: TikTokChannel[];
  onReconnectChannel: (channelId: string) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function ChannelsManager({
  channels,
  onReconnectChannel,
  showToast
}: ChannelsManagerProps) {
  return (
    <div className="space-y-6">
      <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Radio className="w-6 h-6 text-[#fe2c55]" />
            <h2 className="text-xl font-bold text-white">จัดการช่องทางเผยแพร่ (TikTok Channels)</h2>
          </div>
          <button
            onClick={() => showToast("เปิดหน้าต่างเบราว์เซอร์เพื่อเชื่อมต่อ OAuth... 🔐", "info")}
            className="px-4 py-2 bg-[#fe2c55] text-white rounded-xl font-bold text-sm hover:bg-white hover:text-black transition-all"
          >
            + เชื่อมต่อบัญชี TikTok ใหม่
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className={`p-5 rounded-2xl border backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[180px] ${
                channel.status === "Connected"
                  ? "bg-[#111122]/60 border-white/5"
                  : "bg-red-950/20 border-red-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={channel.avatar} alt={channel.handle} className="w-12 h-12 rounded-full border border-white/10 object-cover" />
                  <div className="text-left">
                    <h3 className="text-base font-bold text-white">{channel.name}</h3>
                    <p className="text-xs text-slate-400">{channel.handle}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  channel.status === "Connected"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-[#fe2c55]/20 text-[#fe2c55] animate-pulse"
                }`}>
                  {channel.status === "Connected" ? "พร้อมใช้งาน" : "เซสชันหมดอายุ"}
                </span>
              </div>

              {/* Middle Channel Specs */}
              <div className="my-4 grid grid-cols-3 gap-2 py-3 border-y border-white/5 text-center">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">ผู้ติดตาม</p>
                  <p className="text-sm font-extrabold text-white mt-0.5">{channel.followers}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">ประเภทบัญชี</p>
                  <p className="text-xs font-semibold text-slate-300 mt-1">{channel.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">โพสต์แล้ว</p>
                  <p className="text-sm font-extrabold text-white mt-0.5">{channel.postsCount} คลิป</p>
                </div>
              </div>

              {/* Bottom action row */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">
                  {channel.expiresIn ? `โทเคนหมดอายุใน: ${channel.expiresIn}` : "เชื่อมต่อแบบสิทธิ์ส่วนบุคคล"}
                </span>

                {channel.status === "Expired" ? (
                  <button
                    onClick={() => onReconnectChannel(channel.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#fe2c55] text-white rounded-lg font-bold shadow-lg hover:bg-red-500 transition-all text-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    รีเฟรชสิทธิ์
                  </button>
                ) : (
                  <button
                    onClick={() => showToast("กำลังยกเลิกการเชื่อมโยงบัญชีและสิทธิ์เข้าถึง...", "info")}
                    className="text-slate-500 hover:text-red-400 font-medium"
                  >
                    ตัดการเชื่อมต่อ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
