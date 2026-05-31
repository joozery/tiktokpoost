"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Zap
} from "lucide-react";

// Types
import { TikTokChannel, ScheduledPost } from "../types";

// Supabase Client
import { supabase } from "../lib/supabase";

// Components
import Sidebar from "../components/Sidebar";
import StatsOverview from "../components/StatsOverview";
import PostForm from "../components/PostForm";
import QueueList from "../components/QueueList";
import TikTokSimulator from "../components/TikTokSimulator";
import WeeklyCalendar from "../components/WeeklyCalendar";
import MediaLibrary from "../components/MediaLibrary";
import ChannelsManager from "../components/ChannelsManager";
import SystemSettings from "../components/SystemSettings";

// Seed data helper
const MOCK_CHANNELS: Omit<TikTokChannel, "id">[] = [
  {
    handle: "@devwooyoujake",
    name: "DevWooYou Jake",
    followers: "1.2M",
    type: "OAuth App",
    status: "Connected",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    expiresIn: "280 วัน",
    postsCount: 142
  },
  {
    handle: "@luna_cosmetics",
    name: "FXLUNA Pro Cosmetics",
    followers: "850K",
    type: "OAuth App",
    status: "Connected",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop",
    expiresIn: "310 วัน",
    postsCount: 98
  },
  {
    handle: "@devjuu_vlogs",
    name: "DevJuu Lifestyle & Tech",
    followers: "240K",
    type: "Personal",
    status: "Connected",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop",
    postsCount: 45
  },
  {
    handle: "@knize_gaming",
    name: "KnizeShop Gaming Studio",
    followers: "45K",
    type: "Personal",
    status: "Expired",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop",
    postsCount: 12
  }
];

export default function Dashboard() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar" | "media" | "channels" | "settings">("dashboard");

  // Helper to map tab to path and vice-versa
  const getPathFromTab = (tab: string) => {
    switch (tab) {
      case "calendar": return "/planner";
      case "media": return "/media";
      case "channels": return "/channels";
      case "settings": return "/settings";
      default: return "/";
    }
  };

  const getTabFromPath = (path: string): "dashboard" | "calendar" | "media" | "channels" | "settings" => {
    switch (path) {
      case "/planner": return "calendar";
      case "/media": return "media";
      case "/channels": return "channels";
      case "/settings": return "settings";
      default: return "dashboard";
    }
  };

  // Custom handler to set active tab and push history state
  const handleTabChange = (tab: "dashboard" | "calendar" | "media" | "channels" | "settings") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const targetPath = getPathFromTab(tab);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ tab }, "", targetPath);
      }
    }
  };

  // Sync tab with initial URL path on mount & popstate events
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Initial sync on mount
      const initialTab = getTabFromPath(window.location.pathname);
      setActiveTab(initialTab);

      // 2. popstate listener for back/forward navigation
      const handlePopState = () => {
        const currentTab = getTabFromPath(window.location.pathname);
        setActiveTab(currentTab);
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, []);

  // Dynamic States from Supabase
  const [channels, setChannels] = useState<TikTokChannel[]>([]);
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States for New Post
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [postTitle, setPostTitle] = useState("");
  const [postCaption, setPostCaption] = useState("");
  const [postHashtagsString, setPostHashtagsString] = useState("");
  const [postTime, setPostTime] = useState("");
  const [postMusic, setPostMusic] = useState("TikTok Trending Sound #2026");
  const [selectedVideoTheme, setSelectedVideoTheme] = useState<string>(
    "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-32120-large.mp4"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Active Post for Mobile Simulator
  const [activePost, setActivePost] = useState<ScheduledPost | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Show Toast Helper
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch Channels and Posts from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Channels
      let { data: channelsData, error: channelsError } = await supabase
        .from("channels")
        .select("*")
        .order("created_at", { ascending: true });

      if (channelsError) throw channelsError;

      // Seed if empty
      if (!channelsData || channelsData.length === 0) {
        const seeded = MOCK_CHANNELS.map((ch, idx) => ({
          id: `ch0${idx + 1}`,
          handle: ch.handle,
          name: ch.name,
          followers: ch.followers,
          account_type: ch.type,
          status: ch.status,
          avatar: ch.avatar,
          expires_in: ch.expiresIn || null,
          posts_count: ch.postsCount
        }));

        const { error: seedError } = await supabase.from("channels").insert(seeded);
        if (seedError) throw seedError;

        // Re-fetch channels
        const { data: refetched } = await supabase
          .from("channels")
          .select("*")
          .order("created_at", { ascending: true });
        
        channelsData = refetched;
      }

      // Convert Supabase database format to UI types
      const mappedChannels: TikTokChannel[] = (channelsData || []).map(ch => ({
        id: ch.id,
        handle: ch.handle,
        name: ch.name,
        followers: ch.followers,
        type: ch.account_type as any,
        status: ch.status as any,
        avatar: ch.avatar,
        expiresIn: ch.expires_in,
        postsCount: ch.posts_count || 0
      }));

      setChannels(mappedChannels);

      if (mappedChannels.length > 0 && !selectedChannel) {
        setSelectedChannel(mappedChannels[0].id);
      }

      // 2. Fetch Posts
      const { data: postsData, error: postsError } = await supabase
        .from("scheduled_posts")
        .select("*")
        .order("scheduled_time", { ascending: true });

      if (postsError) throw postsError;

      const mappedPosts: ScheduledPost[] = (postsData || []).map(p => ({
        id: p.id,
        title: p.title,
        caption: p.caption,
        hashtags: p.hashtags || [],
        channelId: p.channel_id,
        scheduledTime: p.scheduled_time,
        status: p.status as any,
        videoUrl: p.video_url,
        musicName: p.music_name,
        views: p.views_count,
        likes: p.likes_count
      }));

      setPosts(mappedPosts);
      
      if (mappedPosts.length > 0) {
        // Find first scheduled post or fallback to the first post
        const active = mappedPosts.find(p => p.status === "Scheduled") || mappedPosts[0];
        setActivePost(active);
      } else {
        setActivePost(null);
      }

    } catch (err: any) {
      console.error("Error loading data:", err.message || err, err.details || "", err.hint || "");
      showToast("ไม่สามารถดึงข้อมูลจาก Supabase ได้ กรุณาเช็กการตั้งค่าคีย์ ⚠️", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Enable Real-time listener for scheduled_posts changes
    const postsChannel = supabase
      .channel("realtime-posts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scheduled_posts" },
        () => {
          fetchData(); // Refetch all stats dynamically in real-time!
        }
      )
      .subscribe();

    // Enable Real-time listener for channels changes
    const channelsChannel = supabase
      .channel("realtime-channels-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "channels" },
        () => {
          fetchData(); // Refetch channels dynamically in real-time!
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(channelsChannel);
    };
  }, []);

  // AI Hashtag Generator Simulation
  const handleAiGenerateHashtags = () => {
    if (!postTitle && !postCaption) {
      showToast("กรุณากรอกชื่อคลิปหรือคำบรรยายก่อนเพื่อใช้ AI วิเคราะห์แฮชแท็ก", "error");
      return;
    }

    setAiGenerating(true);
    setTimeout(() => {
      const generated: string[] = ["fyp", "viral", "foryoupage"];
      const lowerTitle = (postTitle + " " + postCaption).toLowerCase();

      if (lowerTitle.includes("บิวตี้") || lowerTitle.includes("ลิป") || lowerTitle.includes("แต่งหน้า") || lowerTitle.includes("สวย")) {
        generated.push("รีวิวบิวตี้", "makeup", "skincare", "ของดีบอกต่อ");
      }
      if (lowerTitle.includes("โปร") || lowerTitle.includes("ลด") || lowerTitle.includes("ช้อป") || lowerTitle.includes("ราคา")) {
        generated.push("tiktokshop", "โปรเด็ด", "ลดราคา", "ช้อปปิ้งออนไลน์");
      }
      if (lowerTitle.includes("โค้ด") || lowerTitle.includes("คอม") || lowerTitle.includes("คีย์บอร์ด") || lowerTitle.includes("tech")) {
        generated.push("desksetup", "programmer", "techreview", "codinglife");
      }
      if (lowerTitle.includes("เกม") || lowerTitle.includes("gaming") || lowerTitle.includes("เล่น")) {
        generated.push("gamer", "rov", "pcgaming", "เกมมือถือ");
      }

      setPostHashtagsString(generated.join(", "));
      setAiGenerating(false);
      showToast("AI วิเคราะห์เนื้อหาและแนะนำแฮชแท็กที่ตรงกลุ่มเป้าหมายสำเร็จ", "success");
    }, 1200);
  };

  // Add Post to Queue in Supabase
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postTitle || !postCaption || !postTime) {
      showToast("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน (ชื่อคลิป, แคปชัน, เวลาโพสต์)", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const tags = postHashtagsString
        .split(/[,\s]+/)
        .map(tag => tag.replace("#", "").trim())
        .filter(tag => tag.length > 0);

      if (tags.length === 0) tags.push("fyp");

      const newDbPost = {
        id: `post-${Date.now()}`,
        title: postTitle,
        caption: postCaption,
        hashtags: tags,
        channel_id: selectedChannel,
        scheduled_time: new Date(postTime).toISOString(),
        status: "Scheduled",
        video_url: selectedVideoTheme,
        music_name: postMusic,
        views_count: "---",
        likes_count: "---"
      };

      const { error } = await supabase.from("scheduled_posts").insert([newDbPost]);
      if (error) throw error;

      setPostTitle("");
      setPostCaption("");
      setPostHashtagsString("");
      setPostTime("");
      
      showToast("ตั้งกำหนดการโพสต์ TikTok ลงคิวสำเร็จ", "success");
    } catch (err: any) {
      console.error("Error creating post:", err);
      showToast("ไม่สามารถสร้างคิวโพสต์ลงฐานข้อมูลได้", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Post from Supabase
  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase.from("scheduled_posts").delete().eq("id", id);
      if (error) throw error;
      showToast("ลบคิวโพสต์เรียบร้อยแล้ว", "info");
    } catch (err) {
      console.error("Error deleting post:", err);
      showToast("ลบคิวโพสต์ไม่สำเร็จ", "error");
    }
  };

  // Reconnect Expired Channel inside Supabase
  const handleReconnectChannel = async (channelId: string) => {
    try {
      const { error } = await supabase
        .from("channels")
        .update({ status: "Connected", expires_in: "365 วัน" })
        .eq("id", channelId);
      
      if (error) throw error;
      showToast("เชื่อมต่อ API และต่ออายุ OAuth สําเร็จแล้ว", "success");
    } catch (err) {
      console.error("Error reconnecting channel:", err);
      showToast("รีเฟรชสิทธิ์บัญชีล้มเหลว", "error");
    }
  };

  // Helper: Get channel details
  const getChannelDetails = (channelId: string) => {
    return channels.find(c => c.id === channelId) || {
      id: "ch-none",
      handle: "@unknown",
      name: "Unknown Channel",
      followers: "---",
      type: "Personal" as any,
      status: "Expired" as any,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
      postsCount: 0
    };
  };

  const connectedChannels = channels.filter(c => c.status === "Connected").length;

  return (
    <div className="h-screen bg-[#06060c] text-slate-100 flex flex-col font-sans relative overflow-hidden selection:bg-[#fe2c55]/30">
      
      {/* Background Neon Glowing Meshes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#fe2c55]/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-[#25f4ee]/10 blur-[180px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full bg-violet-600/10 blur-[150px] pointer-events-none" />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl animate-in slide-in-from-top-5 duration-300 shadow-2xl bg-[#0f0f1c]/90 border-white/10">
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-[#fe2c55]" />}
          {toast.type === "info" && <Zap className="w-5 h-5 text-[#25f4ee]" />}
          <span className="text-sm font-medium text-slate-200">{toast.message}</span>
        </div>
      )}

      {/* Header Bar */}
      <header className="border-b border-white/5 bg-[#090911]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fe2c55] to-[#25f4ee] p-[2px] flex items-center justify-center shadow-lg shadow-[#fe2c55]/10">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#fe2c55] fill-[#fe2c55]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white">TIKTOK PRO TERMINAL</h1>
              <span className="text-[10px] uppercase font-semibold bg-gradient-to-r from-[#fe2c55] to-red-600 text-white px-1.5 py-0.5 rounded tracking-widest">AUTO-POST v2.5</span>
            </div>
            <p className="text-[11px] text-slate-400">ระบบจัดการวางกำหนดการอัปโหลดและเชื่อมต่อ API อัตโนมัติ</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            TikTok API Status: Normal
          </div>
          <div className="flex items-center gap-3 border-l border-white/10 pl-6">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop" 
              alt="Admin Avatar" 
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-200">DevJuu Administrator</p>
              <p className="text-[10px] text-slate-500">Root Account</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Terminal Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar Navigation */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          channels={channels} 
          scheduledCount={posts.filter(p => p.status === "Scheduled").length} 
        />

        {/* Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">

          {loading ? (
            <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-full border-2 border-[#fe2c55] border-t-transparent animate-spin" />
              <p className="text-sm font-semibold animate-pulse">กำลังซิงก์ข้อมูลแบบ Real-time จาก Supabase Database...</p>
            </div>
          ) : (
            <>
              {activeTab === "dashboard" && (
                <>
                  {/* Stats Overview */}
                  <StatsOverview 
                    scheduledCount={posts.filter(p => p.status === "Scheduled").length} 
                    connectedChannelsCount={connectedChannels} 
                    totalChannelsCount={channels.length} 
                  />

                  {/* Grid System for Workspace */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    
                    {/* 1. Add Post Planner Form */}
                    <div className="xl:col-span-5 space-y-6">
                      <PostForm 
                        channels={channels}
                        selectedChannel={selectedChannel}
                        setSelectedChannel={setSelectedChannel}
                        postTitle={postTitle}
                        setPostTitle={setPostTitle}
                        postCaption={postCaption}
                        setPostCaption={setPostCaption}
                        postHashtagsString={postHashtagsString}
                        setPostHashtagsString={setPostHashtagsString}
                        postTime={postTime}
                        setPostTime={setPostTime}
                        postMusic={postMusic}
                        setPostMusic={setPostMusic}
                        selectedVideoTheme={selectedVideoTheme}
                        setSelectedVideoTheme={setSelectedVideoTheme}
                        isSubmitting={isSubmitting}
                        aiGenerating={aiGenerating}
                        onAiGenerateHashtags={handleAiGenerateHashtags}
                        onSubmit={handleAddPost}
                        showToast={showToast}
                      />
                    </div>

                    {/* 2. Central Active Posting Queue List */}
                    <div className="xl:col-span-4 space-y-6">
                      <QueueList 
                        posts={posts}
                        activePost={activePost}
                        setActivePost={setActivePost}
                        onDeletePost={handleDeletePost}
                        getChannel={getChannelDetails}
                      />
                    </div>

                    {/* 3. Right Column: TikTok Phone Simulator */}
                    <div className="xl:col-span-3 flex justify-center">
                      <TikTokSimulator 
                        activePost={activePost} 
                        getChannel={getChannelDetails} 
                      />
                    </div>

                  </div>
                </>
              )}

              {activeTab === "calendar" && (
                <WeeklyCalendar 
                  posts={posts}
                  setActivePost={setActivePost}
                  setActiveTab={handleTabChange}
                  showToast={showToast}
                />
              )}

              {activeTab === "media" && (
                <MediaLibrary 
                  selectedVideoTheme={selectedVideoTheme}
                  setSelectedVideoTheme={setSelectedVideoTheme}
                  setActiveTab={handleTabChange}
                  showToast={showToast}
                />
              )}

              {activeTab === "channels" && (
                <ChannelsManager 
                  channels={channels}
                  onReconnectChannel={handleReconnectChannel}
                  showToast={showToast}
                />
              )}

              {activeTab === "settings" && (
                <SystemSettings />
              )}
            </>
          )}

        </main>
      </div>

      {/* Marquee Keyframes Helper */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-60%, 0, 0); }
        }
      `}</style>

    </div>
  );
}
