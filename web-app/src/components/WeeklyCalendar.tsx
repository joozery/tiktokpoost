import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { ScheduledPost } from "../types";

interface WeeklyCalendarProps {
  posts: ScheduledPost[];
  setActivePost: (post: ScheduledPost) => void;
  setActiveTab: (tab: "dashboard" | "calendar" | "media" | "channels" | "settings") => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function WeeklyCalendar({
  posts,
  setActivePost,
  setActiveTab,
  showToast
}: WeeklyCalendarProps) {
  return (
    <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-[#fe2c55]" />
          <h2 className="text-xl font-bold text-white">ตารางการโพสต์วิดีโอประจําสัปดาห์</h2>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-[#fe2c55]/20 text-[#fe2c55] px-3 py-1 rounded-full font-bold">พฤษภาคม 2026</span>
        </div>
      </div>

      {/* Grid week calendar view */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสฯ", "ศุกร์", "เสาร์"].map((day, idx) => (
          <div key={idx} className="bg-[#0a0a0f] border border-white/5 rounded-xl p-4 min-h-[160px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-slate-400">{day}</span>
                <span className="text-xs bg-white/5 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                  {24 + idx} พ.ค.
                </span>
              </div>

              {/* Show items scheduled on this day */}
              <div className="space-y-2">
                {posts
                  .filter((p) => {
                    const date = new Date(p.scheduledTime);
                    return date.getDay() === idx;
                  })
                  .map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setActivePost(post);
                        setActiveTab("dashboard");
                      }}
                      className="p-2 rounded bg-[#fe2c55]/10 border border-[#fe2c55]/30 text-[10px] text-slate-200 cursor-pointer hover:bg-[#fe2c55]/20 transition-all font-semibold truncate"
                    >
                      {post.title}
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab("dashboard");
                showToast("กรุณากรอกข้อมูลวันและเวลาโพสต์ตามต้องการในฟอร์ม", "info");
              }}
              className="w-full py-1 text-center border border-dashed border-white/10 hover:border-white/20 rounded text-[10px] text-slate-500 hover:text-slate-300 font-bold transition-all"
            >
              + เพิ่มคิว
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
