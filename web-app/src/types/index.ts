export interface TikTokChannel {
  id: string;
  handle: string;
  name: string;
  followers: string;
  type: "OAuth App" | "Personal";
  status: "Connected" | "Expired" | "Pending";
  avatar: string;
  expiresIn?: string;
  postsCount: number;
}

export interface ScheduledPost {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  channelId: string;
  scheduledTime: string;
  status: "Draft" | "Scheduled" | "Uploading" | "Posted" | "Failed";
  videoUrl: string;
  musicName: string;
  views?: string;
  likes?: string;
}
