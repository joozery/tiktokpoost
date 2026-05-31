import React, { useState, useRef, useEffect } from "react";
import { Film, Loader2, Sparkles, Upload, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface MediaLibraryProps {
  selectedVideoTheme: string;
  setSelectedVideoTheme: (url: string) => void;
  setActiveTab: (tab: "dashboard" | "calendar" | "media" | "channels" | "settings") => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}



export default function MediaLibrary({
  selectedVideoTheme,
  setSelectedVideoTheme,
  setActiveTab,
  showToast
}: MediaLibraryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<Array<{ name: string; desc: string; url: string }>>([]);

  useEffect(() => {
    const saved = localStorage.getItem('custom_videos');
    const custom = saved ? JSON.parse(saved) : [];
    setItems([...custom]);
  }, []);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

      setItems([...updatedCustom]);
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

  const handleDeleteCustomVideo = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Extract filename from URL to delete from Supabase storage too
    try {
      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      
      // Delete from storage
      await supabase.storage.from("videos").remove([filename]);
    } catch (err) {
      console.error("Failed to delete from Supabase storage:", err);
    }

    const saved = localStorage.getItem('custom_videos');
    const custom = saved ? JSON.parse(saved) : [];
    const updatedCustom = custom.filter((item: any) => item.url !== url);
    localStorage.setItem('custom_videos', JSON.stringify(updatedCustom));
    
    setItems([...updatedCustom]);
    
    // If deleted video was selected, fall back to default
    if (selectedVideoTheme === url) {
      setSelectedVideoTheme("");
    }
    
    showToast("ลบวิดีโอออกจากคลังและเซิร์ฟเวอร์เรียบร้อยครับ 🗑", "info");
  };

  return (
    <div className="bg-[#10101c]/70 border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Film className="w-6 h-6 text-[#25f4ee]" />
          <h2 className="text-xl font-bold text-white">คลังเก็บคลิปวิดีโอ (Media Library)</h2>
        </div>
        
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
        {items.map((item, idx) => {
          const isCustom = !item.url.includes("mixkit.co");
          return (
            <div
              key={idx}
              className={`bg-[#0a0a0f] border rounded-xl overflow-hidden group hover:border-[#fe2c55] transition-all relative ${
                selectedVideoTheme === item.url ? "border-[#fe2c55]" : "border-white/5"
              }`}
            >
              {/* Delete Button for Custom Videos */}
              {isCustom && (
                <button
                  onClick={(e) => handleDeleteCustomVideo(item.url, e)}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 hover:bg-[#fe2c55] text-white/80 hover:text-white rounded-lg transition-all backdrop-blur-md opacity-0 group-hover:opacity-100"
                  title="ลบวิดีโอนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

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
                      setActiveTab("dashboard"); // Auto-navigate back to post form!
                      showToast(`เลือกคลิป ${item.name} เข้าไปในแดชบอร์ดสำเร็จ! 🎞️`, "success");
                    }}
                    className="px-3 py-1.5 bg-[#fe2c55] text-white text-xs rounded-lg font-bold shadow-lg"
                  >
                    เลือกใช้งาน
                  </button>
                </div>
              </div>
              <div className="p-3 text-left">
                <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                  {isCustom && <Sparkles className="w-3 h-3 text-[#25f4ee]" />}
                  <span>{item.name}</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
