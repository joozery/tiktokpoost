import React from "react";
import { Plus, Sparkles, Loader2, Send, Activity, Zap } from "lucide-react";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              เสียงดนตรีประกอบ (Sound Link)
            </label>
            <input
              type="text"
              value={postMusic}
              onChange={(e) => setPostMusic(e.target.value)}
              placeholder="ลิ้งก์เพลงยอดนิยม หรือชื่อเพลง"
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              วัน-เวลาที่ต้องการโพสต์
            </label>
            <input
              type="datetime-local"
              value={postTime}
              onChange={(e) => setPostTime(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-[#fe2c55] transition-all"
            />
          </div>
        </div>

        {/* Mock Select Video Source */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            เลือกไฟล์วิดีโอตัวอย่าง
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedVideoTheme("https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32120-large.mp4");
                showToast("เปลี่ยนคลิปตัวอย่างเป็น Abstract Laser", "info");
              }}
              className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                selectedVideoTheme.includes("laser")
                  ? "bg-[#fe2c55]/20 border-[#fe2c55] text-white"
                  : "bg-[#0a0a0f] border-white/5 text-slate-400 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#fe2c55]" />
                <span>Laser Neon</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedVideoTheme("https://assets.mixkit.co/videos/preview/mixkit-waves-of-blue-and-purple-light-32095-large.mp4");
                showToast("เปลี่ยนคลิปตัวอย่างเป็น Wave Lights", "info");
              }}
              className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                selectedVideoTheme.includes("waves")
                  ? "bg-[#fe2c55]/20 border-[#fe2c55] text-white"
                  : "bg-[#0a0a0f] border-white/5 text-slate-400 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Wave Lights</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedVideoTheme("https://assets.mixkit.co/videos/preview/mixkit-spiral-of-light-and-particles-32096-large.mp4");
                showToast("เปลี่ยนคลิปตัวอย่างเป็น Golden Spiral", "info");
              }}
              className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                selectedVideoTheme.includes("spiral")
                  ? "bg-[#fe2c55]/20 border-[#fe2c55] text-white"
                  : "bg-[#0a0a0f] border-white/5 text-slate-400 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Gold Spiral</span>
              </div>
            </button>
          </div>
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
