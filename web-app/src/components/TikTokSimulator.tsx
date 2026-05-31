import React from "react";
import { Smartphone, Video, Search, Heart, MessageCircle, Share2, Music } from "lucide-react";
import { ScheduledPost, TikTokChannel } from "../types";

interface TikTokSimulatorProps {
  activePost: ScheduledPost | null;
  getChannel: (channelId: string) => TikTokChannel;
}

export default function TikTokSimulator({ activePost, getChannel }: TikTokSimulatorProps) {
  const channel = activePost ? getChannel(activePost.channelId) : null;

  return (
    <div className="space-y-4 w-full max-w-[280px]">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-[#fe2c55]" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Live Preview Simulator</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#fe2c55] animate-ping" />
      </div>

      {/* Highly Realistic Phone Frame */}
      <div className="relative mx-auto w-[270px] h-[550px] bg-black rounded-[42px] border-[8px] border-slate-800 shadow-2xl overflow-hidden shadow-violet-950/20 ring-1 ring-white/10">
        {/* Notch camera */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl z-30 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-slate-900 ml-6" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#0a0c10] ml-2" />
        </div>

        {/* Speaker grill line */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-slate-800 rounded-full z-30" />

        {/* Phone internal screen */}
        <div className="w-full h-full bg-[#030303] relative flex flex-col justify-between overflow-hidden">
          {/* Live video background loops */}
          <div className="absolute inset-0 w-full h-full z-0 bg-[#06060c]">
            {activePost?.videoUrl ? (
              <video
                key={activePost.id + activePost.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-90 transition-opacity duration-500"
              >
                <source src={activePost.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-purple-950 via-slate-950 to-pink-950 animate-pulse flex items-center justify-center">
                <Video className="w-8 h-8 text-slate-700 animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70 z-10" />
          </div>

          {/* Top navigation inside simulator */}
          <div className="relative z-20 flex justify-between items-center px-4 pt-8 text-white font-bold text-[11px] drop-shadow-md">
            <span className="opacity-60 text-[10px]">11:51 น.</span>
            <div className="flex gap-3">
              <span className="border-b-2 border-transparent pb-0.5 opacity-60">กำลังติดตาม</span>
              <span className="border-b-2 border-white pb-0.5">สำหรับคุณ</span>
            </div>
            <Search className="w-3.5 h-3.5 opacity-80" />
          </div>

          {/* Right widgets/buttons overlay (TikTok UI) */}
          <div className="absolute right-3.5 bottom-28 z-20 flex flex-col items-center gap-4 text-white">
            {/* User Avatar */}
            <div className="relative mb-2">
              <img
                src={channel ? channel.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"}
                alt="creator"
                className="w-9 h-9 rounded-full border border-white object-cover"
              />
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#fe2c55] rounded-full flex items-center justify-center text-[10px] font-black leading-none border border-black">
                +
              </div>
            </div>

            {/* Heart */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                <Heart className="w-4.5 h-4.5 text-white fill-white" />
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-100 drop-shadow">
                {activePost?.likes !== "---" ? activePost?.likes : "98.5K"}
              </span>
            </div>

            {/* Comment */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-transform">
                <MessageCircle className="w-4.5 h-4.5 text-white fill-white" />
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-100 drop-shadow">1,248</span>
            </div>

            {/* Bookmark */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center hover:scale-105 transition-transform">
                <Share2 className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-100 drop-shadow">946</span>
            </div>

            {/* Vinyl Record */}
            <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-600 flex items-center justify-center animate-spin duration-[6000ms] ease-linear">
              <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700" />
            </div>
          </div>

          {/* Bottom Description & Audio Info Overlay */}
          <div className="relative z-20 p-4 text-white text-left drop-shadow-md space-y-1.5 mt-auto">
            <h4 className="font-bold text-sm tracking-wide">
              {channel ? channel.handle : "@tiktok_user"}
            </h4>

            <p className="text-xs text-slate-200 line-clamp-3 font-normal leading-relaxed">
              {activePost?.caption || "แคปชันวิดีโอตัวอย่างจะปรากฏขึ้นที่ตรงนี้เพื่อตรวจสอบการจัดเรียงข้อความให้ออกมาสมบูรณ์แบบ..."}
            </p>

            {/* Hashtags display */}
            {activePost?.hashtags && activePost.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1 text-[11px] text-[#25f4ee] font-bold">
                {activePost.hashtags.map((tag, idx) => (
                  <span key={idx}>#{tag}</span>
                ))}
              </div>
            )}

            {/* Scrolling Audio track */}
            <div className="flex items-center gap-2 pt-1">
              <Music className="w-3 h-3 text-slate-300 flex-shrink-0" />
              <div className="w-full overflow-hidden text-[10px] text-slate-300 font-semibold relative h-4">
                <div className="absolute whitespace-nowrap animate-[marquee_12s_linear_infinite]">
                  {activePost?.musicName || "เสียงต้นฉบับ - แบรนด์ของคุณ"}
                </div>
              </div>
            </div>
          </div>

          {/* Home indicator bar bottom */}
          <div className="relative z-20 pb-2 flex justify-center w-full">
            <div className="w-28 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
