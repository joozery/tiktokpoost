import React from "react";
import { Clock, Video, Trash2 } from "lucide-react";
import { ScheduledPost, TikTokChannel } from "../types";

interface QueueListProps {
  posts: ScheduledPost[];
  activePost: ScheduledPost | null;
  setActivePost: (post: ScheduledPost) => void;
  onDeletePost: (id: string) => void;
  getChannel: (channelId: string) => TikTokChannel;
}

export default function QueueList({
  posts,
  activePost,
  setActivePost,
  onDeletePost,
  getChannel
}: QueueListProps) {
  return (
    <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#25f4ee]" />
            <h2 className="text-lg font-bold text-white">รายการคิวโพสต์วิดีโอ</h2>
          </div>
          <span className="text-xs bg-[#25f4ee]/20 text-[#25f4ee] font-extrabold px-2 py-0.5 rounded-full">
            {posts.length} คลิป
          </span>
        </div>

        <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
          {posts.map((post) => {
            const channel = getChannel(post.channelId);
            const isCurrentlySelected = activePost?.id === post.id;
            return (
              <div
                key={post.id}
                onClick={() => setActivePost(post)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden group flex items-start justify-between gap-3 ${
                  isCurrentlySelected
                    ? "bg-[#fe2c55]/10 border-[#fe2c55] shadow-lg shadow-[#fe2c55]/5"
                    : "bg-[#0c0c14]/80 border-white/5 hover:border-white/10 hover:bg-[#121222]/80"
                }`}
              >
                <div className="flex gap-3 min-w-0">
                  {/* Thumbnail preview box */}
                  <div className="w-12 h-16 bg-[#0a0a0f] rounded-lg overflow-hidden border border-white/10 flex-shrink-0 flex items-center justify-center relative">
                    <Video className="w-5 h-5 text-slate-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-1">
                      <span className="text-[8px] font-bold text-slate-300">PREVIEW</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate mb-1">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mb-2">
                      {post.caption}
                    </p>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] bg-white/5 border border-white/10 text-slate-300 font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <img src={channel.avatar} className="w-2.5 h-2.5 rounded-full object-cover" />
                        {channel.handle}
                      </span>
                      <span className="text-[9px] bg-violet-500/10 border border-violet-500/20 text-violet-300 font-semibold px-1.5 py-0.5 rounded">
                        {new Date(post.scheduledTime).toLocaleDateString("th-TH", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between h-full gap-4">
                  {post.status === "Scheduled" ? (
                    <span className="text-[9px] bg-[#25f4ee]/20 text-[#25f4ee] border border-[#25f4ee]/30 font-bold px-1.5 py-0.5 rounded-full">
                      รอโพสต์
                    </span>
                  ) : (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-1.5 py-0.5 rounded-full">
                      โพสต์แล้ว
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePost(post.id);
                    }}
                    className="text-slate-500 hover:text-[#fe2c55] p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-500">
        ระบบจะอัปโหลดอัตโนมัติเมื่อถึงเวลากำหนดผ่าน TikTok API
      </div>
    </div>
  );
}
