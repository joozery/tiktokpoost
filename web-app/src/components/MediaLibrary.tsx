import React, { useState, useRef, useEffect } from "react";
import { Film, Loader2, Sparkles, Upload } from "lucide-react";
import { supabase } from "../lib/supabase";

interface MediaLibraryProps {
  selectedVideoTheme: string;
  setSelectedVideoTheme: (url: string) => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

const DEFAULT_ITEMS = [
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

export default function MediaLibrary({
  selectedVideoTheme,
  setSelectedVideoTheme,
  showToast
}: MediaLibraryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  // Load custom uploaded videos from localStorage if any
  const [items, setItems] = useState<Array<{ name: string; desc: string; url: string }>>([]);

  useEffect(() => {
    const saved = localStorage.getItem('custom_videos');
    const custom = saved ? JSON.parse(saved) : [];
    setItems([...DEFAULT_ITEMS, ...custom]);
  }, []);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (e.g. 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showToast("ไฟล์วิดีโอต้องมีขนาดไม่เกิน 50MB! ⚠️", "error");
      return;
    }

    if (!file.type.startsWith("video/")) {
      showToast("กรุณาเลือกไฟล์ประเภทวิดีโอเท่านั้น! 🎥", "error");
      return;
    }

    setUploading(true);
    showToast("กำลังเริ่มอัปโหลดไฟล์วิดีโอขึ้น Supabase Storage... ⏳", "info");

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to "videos" bucket in Supabase
      const { data, error } = await supabase.storage
        .from("videos")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        if (error.message.includes("bucket not found") || error.message.includes("does not exist") || error.message.includes("is not found")) {
          throw new Error("ไม่พบบัคเก็ต 'videos' ใน Supabase Storage! กรุณาเปิดหน้าเว็บ Supabase Console -> ไปที่เมนู Storage -> คลิก 'New bucket' สร้าง Bucket ชื่อ 'videos' และเปิดสถานะเป็น 'Public' ก่อนกดอัปโหลดใหม่อีกครั้งครับ ⚠️");
        }
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      const newItem = {
        name: file.name.length > 20 ? file.name.substring(0, 17) + "..." : file.name,
        desc: `${(file.size / (1024 * 1024)).toFixed(1)} MB (ไฟล์จริง)`,
        url: publicUrl
      };

      const saved = localStorage.getItem('custom_videos');
      const custom = saved ? JSON.parse(saved) : [];
      const updatedCustom = [...custom, newItem];
      localStorage.setItem('custom_videos', JSON.stringify(updatedCustom));

      setItems([...DEFAULT_ITEMS, ...updatedCustom]);
      setSelectedVideoTheme(publicUrl);
      
      showToast("✅ อัปโหลดคลิปจริงขึ้นคลังและเลือกพร้อมตั้งเวลาโพสต์สำเร็จ!", "success");
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "อัปโหลดล้มเหลว กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-[#25f4ee]" />
          <h2 className="text-xl font-bold text-white">คลังเก็บคลิปวิดีโอ (Media Library)</h2>
        </div>
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="video/*"
          className="hidden"
        />

        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#25f4ee]/80 to-indigo-600 text-slate-900 rounded-xl font-bold text-sm hover:from-white hover:to-white transition-all shadow-md shadow-[#25f4ee]/20 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
              <span>กำลังอัปโหลดวิดีโอ...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 text-slate-900" />
              <span>+ อัปโหลดไฟล์วิดีโอใหม่</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of video elements */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`bg-[#0a0a0f] border rounded-xl overflow-hidden group hover:border-[#fe2c55] transition-all ${
              selectedVideoTheme === item.url ? "border-[#fe2c55]" : "border-white/5"
            }`}
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
              <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                {item.desc.includes("ไฟล์จริง") && <Sparkles className="w-3 h-3 text-[#25f4ee]" />}
                <span>{item.name}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
