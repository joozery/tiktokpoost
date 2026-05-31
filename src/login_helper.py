import os
import sys
import json
import urllib.request
import urllib.parse
from datetime import datetime

# Helper to load configurations from Next.js .env.local
def load_env():
    env = {}
    paths = [".env.local", "web-app/.env.local", "../web-app/.env.local"]
    for path in paths:
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if "=" in line and not line.startswith("#"):
                        parts = line.split("=", 1)
                        if len(parts) == 2:
                            env[parts[0].strip()] = parts[1].strip()
            break
    return env

# Helper to send HTTP requests to Supabase REST API
def supabase_request(url_path, method="GET", body=None, query_params=None):
    env = load_env()
    supabase_url = env.get("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not supabase_url or not supabase_key:
        print("❌ Error: Supabase credentials not found in .env.local!")
        sys.exit(1)

    url = f"{supabaseUrl.rstrip('/')}/rest/v1/{url_path.lstrip('/')}"
    if query_params:
        url += "?" + urllib.parse.urlencode(query_params)

    headers = {
        "apikey": supabase_key,
        "Authorization": f"Bearer {supabase_key}",
        "Content-Type": "application/json",
    }

    data = None
    if body:
        data = json.dumps(body).encode("utf-8")

    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            if res_data:
                return json.loads(res_data)
            return []
    except Exception as e:
        print(f"❌ Supabase HTTP Request Failed: {e}")
        return None

def main():
    if len(sys.argv) < 2:
        print("💡 Usage:")
        print("  python src/login_helper.py <channel_id>")
        sys.exit(1)

    channel_id = sys.argv[1]

    print(f"\n👥 --- เริ่มขั้นตอนการต่อสิทธิ์บัญชีส่วนตัว (Personal Session) ของช่อง {channel_id} ---")
    print("\n1. เปิดแอพหรือเว็บ TikTok และทำการเข้าสู่ระบบบัญชีของคุณ")
    print("2. เปิดเครื่องมือผู้พัฒนา (F12) > ไปที่แท็บ Application > คุกกี้ (Cookies) > https://www.tiktok.com")
    print("3. คัดลอกค่าของ Cookie ที่ชื่อ 'sessionid'")
    
    session_id = input("\n👉 กรอกค่า Cookie 'sessionid' ของคุณ: ").strip()

    if not session_id or len(session_id) < 10:
        print("❌ Error: ค่า Session ID คุกกี้ไม่ถูกต้องหรือไม่สมบูรณ์!")
        sys.exit(1)

    # In Personal cookie mode, we save the sessionid to access_token to serve as API authentication
    body = {
        "status": "Connected",
        "access_token": f"cookie_sessionid={session_id}",
        "token_expires_at": None, # Personal cookie doesn't expire in 1 day
        "expires_in": "ไม่จำกัดอายุการใช้งาน"
    }

    print(f"\n4. ทำการบันทึก Session Cookie ของช่อง {channel_id} ลงฐานข้อมูล Supabase...")
    supabase_request(f"channels?id=eq.{channel_id}", method="PATCH", body=body)

    print(f"\n✅ อัปเดตสิทธิ์เซสชันบุคคลทั่วไปของช่อง {channel_id} เรียบร้อยและใช้งานได้แล้ว!")

if __name__ == "__main__":
    supabaseUrl = "https://grrbzmzfoyfmkptqtzhl.supabase.co"
    main()
