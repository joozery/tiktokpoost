import React from "react";
import { Film } from "lucide-react";

interface MediaLibraryProps {
  selectedVideoTheme: string;
  setSelectedVideoTheme: (url: string) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export default function MediaLibrary({
  selectedVideoTheme,
  setSelectedVideoTheme,
  showToast
}: MediaLibraryProps) {
  const mediaItems = [
    {
      name: "Laser Abstract",
      desc: "15 วินาที",
      url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32120-large.mp4"
    },
    {
      name: "Wave Lights",
      desc: "18 วินาที",
      url: "https://assets.mixkit.co/videos/preview/mixkit-waves-of-blue-and-purple-light-32095-large.mp4"
    },
    {
      name: "Gold Spiral",
      desc: "12 วินาที",
      url: "https://assets.mixkit.co/videos/preview/mixkit-spiral-of-light-and-particles-32096-large.mp4"
    }
  ];

  return (
    <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-[#25f4ee]" />
          <h2 className="text-xl font-bold text-white">คลังเก็บคลิปวิดีโอ (Media Library)</h2>
        </div>
        <button
          onClick={() => showToast("เปิดเบราว์เซอร์เพื่อเลือกไฟล์อัปโหลดจำลอง...", "info")}
          className="px-4 py-2 bg-gradient-to-r from-[#25f4ee]/80 to-indigo-600 text-slate-900 rounded-xl font-bold text-sm hover:from-white hover:to-white transition-all shadow-md shadow-[#25f4ee]/20"
        >
          + อัปโหลดไฟล์วิดีโอใหม่
        </button>
      </div>

      {/* Grid of video elements */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#0a0a0f] border border-white/5 rounded-xl overflow-hidden group hover:border-[#fe2c55] transition-all"
          >
            <div className="aspect-[9/16] relative bg-slate-950 flex items-center justify-center overflow-hidden">
              <video
                src={item.url}
                muted
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setSelectedVideoTheme(item.url);
                    showToast(`เลือกมีเดีย ${item.name} เข้าไปในฟอร์มสำเร็จ! 🎞️`, "success");
                  }}
                  className="px-3 py-1.5 bg-[#fe2c55] text-white text-xs rounded-lg font-bold shadow-lg"
                >
                  เลือกใช้งาน
                </button>
              </div>
            </div>
            <div className="p-3 text-left">
              <p className="text-xs font-bold text-white truncate">{item.name}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
