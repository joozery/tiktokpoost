import React from "react";
import { Plus, Sparkles, Loader2, Send, Activity, Zap, Film, X, AlertCircle } from "lucide-react";
import { TikTokChannel } from "../types";

interface PostFormProps {
  channels: TikTokChannel[];
  selectedChannel: string;
  setSelectedChannel: (id: string) => void;
  postTitle: string;
  setPostTitle: (title: string) => void;
  postCaption: string;
  setPostCaption: (caption: string) => void;
  postHashtagsString: string;
  setPostHashtagsString: (tags: string) => void;
  postTime: string;
  setPostTime: (time: string) => void;
  postMusic: string;
  setPostMusic: (music: string) => void;
  selectedVideoTheme: string;
  setSelectedVideoTheme: (url: string) => void;
  postRepeatCount: number;
  setPostRepeatCount: (val: number) => void;
  setActiveTab: (tab: "dashboard" | "calendar" | "media" | "channels" | "settings") => void;
  isSubmitting: boolean;
  aiGenerating: boolean;
  onAiGenerateHashtags: () => void;
  onSubmit: (e: React.FormEvent) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function PostForm({
  channels,
  selectedChannel,
  setSelectedChannel,
  postTitle,
  setPostTitle,
  postCaption,
  setPostCaption,
  postHashtagsString,
  setPostHashtagsString,
  postTime,
  setPostTime,
  postMusic,
  setPostMusic,
  selectedVideoTheme,
  setSelectedVideoTheme,
  postRepeatCount,
  setPostRepeatCount,
  setActiveTab,
  isSubmitting,
  aiGenerating,
  onAiGenerateHashtags,
  onSubmit,
  showToast
}: PostFormProps) {
  return (
    <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-6 backdrop-blur-xl relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#fe2c55]" />
          <h2 className="text-lg font-bold text-white">สร้างกำหนดเวลาโพสต์วิดีโอ</h2>
        </div>
        <span className="text-xs text-slate-400">ระบบ API Upload</span>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Select Target Channel */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            เลือกช่องทางเผยแพร่ (TikTok Channel)
          </label>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] focus:ring-1 focus:ring-[#fe2c55] transition-all"
          >
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id} disabled={channel.status === "Expired"}>
                {channel.handle} ({channel.type}) {channel.status === "Expired" ? "- เซสชันหมดอายุ" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Video Title */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            ชื่อวิดีโอสำหรับการจัดการภายใน
          </label>
          <input
            type="text"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="เช่น แนะนำของตกแต่งโต๊ะคอมพิวเตอร์ EP.1"
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] focus:ring-1 focus:ring-[#fe2c55] transition-all"
          />
        </div>

        {/* Video Caption */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              แคปชันวิดีโอ (ที่จะแสดงบน TikTok)
            </label>
            <span className="text-[10px] text-slate-500 font-semibold">{postCaption.length} / 2200</span>
          </div>
          <textarea
            rows={3}
            value={postCaption}
            onChange={(e) => setPostCaption(e.target.value)}
            placeholder="เขียนอธิบายเนื้อหาวิดีโอให้น่าสนใจ ดึงดูดผู้ชม..."
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] focus:ring-1 focus:ring-[#fe2c55] transition-all resize-none"
          />
        </div>

        {/* AI Hashtag Helper Row */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              แฮชแท็ก (#Hashtags)
            </label>
            <button
              type="button"
              onClick={onAiGenerateHashtags}
              disabled={aiGenerating}
              className="flex items-center gap-1 text-[11px] text-[#25f4ee] font-bold hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {aiGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>กำลังวิเคราะห์...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI แนะนำแท็กฮิต</span>
                </>
              )}
            </button>
          </div>
          <input
            type="text"
            value={postHashtagsString}
            onChange={(e) => setPostHashtagsString(e.target.value)}
            placeholder="คั่นด้วยเครื่องหมายจุลภาค เช่น tag1, tag2 (หรือใช้ AI เจน)"
            className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] focus:ring-1 focus:ring-[#fe2c55] transition-all"
          />
        </div>

        {/* Grid: Audio and Date/Time */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              เสียงดนตรีประกอบ (Sound)
            </label>
            <input
              type="text"
              value={postMusic}
              onChange={(e) => setPostMusic(e.target.value)}
              placeholder="ลิ้งก์หรือชื่อเพลง"
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              เวลาโพสต์ (เริ่ม)
            </label>
            <input
              type="datetime-local"
              value={postTime}
              onChange={(e) => setPostTime(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              จำนวนครั้ง (โพสต์ซ้ำ)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="50"
                value={postRepeatCount}
                onChange={(e) => setPostRepeatCount(parseInt(e.target.value) || 1)}
                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] transition-all"
              />
              <span className="absolute right-4 top-3 text-xs text-slate-500 font-bold">ครั้ง</span>
            </div>
          </div>
        </div>

        {/* Select Video Source via Media Library */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            ไฟล์วิดีโอที่จะโพสต์
          </label>
          {selectedVideoTheme ? (
            <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 mb-3">
              <div className="flex items-center gap-3 truncate">
                <Film className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-semibold text-emerald-300 truncate">
                  เลือกวิดีโอจากคลังมีเดียเรียบร้อย
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedVideoTheme("")}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-400/90 font-medium">ยังไม่ได้เลือกวิดีโอ</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-[#fe2c55]/30 bg-[#fe2c55]/10 hover:bg-[#fe2c55]/20 text-[#fe2c55] font-semibold transition-all"
          >
            <Film className="w-4.5 h-4.5" />
            <span>เปิดคลังมีเดียวิดีโอ (Media Library)</span>
          </button>
        </div>

        {/* Submit Queue Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#fe2c55] to-pink-600 hover:from-pink-500 hover:to-[#fe2c55] text-white rounded-xl font-bold shadow-lg shadow-[#fe2c55]/10 hover:shadow-[#fe2c55]/25 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>กำลังเพิ่มวิดีโอลงคิว...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>บันทึกและตั้งเวลาโพสต์อัตโนมัติ</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
