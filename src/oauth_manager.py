import os
import sys
import json
import urllib.request
import urllib.parse
import webbrowser
import secrets
import hashlib
import base64
from datetime import datetime, timedelta

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

# Helper to send HTTP requests to Supabase REST API using standard urllib
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

# Generate PKCE code verifier and code challenge
def generate_pkce():
    # 64-character high-entropy random string
    chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~"
    verifier = "".join(secrets.choice(chars) for _ in range(64))
    
    # SHA256 hashed challenge Base64URL-encoded
    sha256_hash = hashlib.sha256(verifier.encode('utf-8')).digest()
    challenge = base64.urlsafe_b64encode(sha256_hash).decode('utf-8').replace('=', '')
    
    return verifier, challenge

# Generate TikTok OAuth authorization URL with PKCE
def get_auth_url(client_key, redirect_uri, state, code_challenge):
    base_url = "https://www.tiktok.com/v2/auth/authorize/"
    params = {
        "client_key": client_key,
        "scope": "video.upload",
        "response_type": "code",
        "redirect_uri": redirect_uri,
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256"
    }
    return base_url + "?" + urllib.parse.urlencode(params)

# Exchange TikTok Authorization Code for tokens with PKCE code_verifier
def exchange_code_for_tokens(client_key, client_secret, code, redirect_uri, code_verifier):
    url = "https://open.tiktokapis.com/v2/oauth/token/"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
    }
    data = {
        "client_key": client_key,
        "client_secret": client_secret,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
        "code_verifier": code_verifier
    }
    encoded_data = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data
    except Exception as e:
        print(f"❌ Error exchanging authorization code: {e}")
        return None

# Refresh TikTok Access Token using refresh_token
def refresh_access_token(client_key, client_secret, refresh_token):
    url = "https://open.tiktokapis.com/v2/oauth/token/"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache"
    }
    data = {
        "client_key": client_key,
        "client_secret": client_secret,
        "grant_type": "refresh_token",
        "refresh_token": refresh_token
    }
    encoded_data = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data
    except Exception as e:
        print(f"❌ Error refreshing access token: {e}")
        return None

# Command Line Interface (CLI) implementation
def main():
    if len(sys.argv) < 3:
        print("💡 Usage:")
        print("  python src/oauth_manager.py login <channel_id>")
        print("  python src/oauth_manager.py refresh <channel_id>")
        sys.exit(1)

    action = sys.argv[1].lower()
    channel_id = sys.argv[2]

    env = load_env()
    client_key = env.get("TIKTOK_CLIENT_KEY")
    client_secret = env.get("TIKTOK_CLIENT_SECRET")
    redirect_uri = "https://tiktokpoost.vercel.app/" # Verified HTTPS Vercel URL

    if not client_key or not client_secret:
        print("❌ Error: TIKTOK_CLIENT_KEY or TIKTOK_CLIENT_SECRET not found in .env.local!")
        sys.exit(1)

    # 1. Login action
    if action == "login":
        print(f"\n🔐 --- เริ่มขั้นตอนการล็อกอินของช่อง {channel_id} ---")
        
        # Generate PKCE verifier and challenge to solve 'code_challenge' error!
        code_verifier, code_challenge = generate_pkce()
        
        auth_url = get_auth_url(client_key, redirect_uri, channel_id, code_challenge)
        print(f"\n1. กำลังเปิดบราวเซอร์เพื่อเริ่มขอสิทธิ์เข้าถึงจาก TikTok (พร้อมระบบความปลอดภัย PKCE)...")
        print(f"🔗 ลิงก์ล็อกอิน: {auth_url}")
        
        webbrowser.open(auth_url)
        
        print("\n2. ล็อกอินและยอมรับสิทธิ์ในบราวเซอร์ให้เรียบร้อย")
        print("3. หลังจากกดยอมรับสำเร็จ บราวเซอร์จะ redirect ไปยังหน้า localhost")
        print("4. ให้คัดลอกค่า 'code' หรือคัดลอก URL ทั้งหมดจาก Address bar ของบราวเซอร์มาวางด้านล่างนี้:")
        
        user_input = input("\n👉 กรอกค่า code หรือวาง URL เต็ม: ").strip()
        
        code = user_input
        if "code=" in user_input:
            # Parse code out of URL
            parsed = urllib.parse.urlparse(user_input)
            params = urllib.parse.parse_qs(parsed.query)
            code = params.get("code", [None])[0]

        if not code:
            print("❌ Error: ไม่สามารถระบุค่า Authorization Code ได้!")
            sys.exit(1)

        print(f"\n5. กำลังส่งคำขอแลกเปลี่ยนโทเคน (Token Exchange) พร้อมส่ง code_verifier...")
        tokens = exchange_code_for_tokens(client_key, client_secret, code, redirect_uri, code_verifier)
        
        if not tokens or "access_token" not in tokens:
            print(f"❌ Error: แลกเปลี่ยนโทเคนล้มเหลว! ข้อมูลส่งกลับ: {tokens}")
            sys.exit(1)

        # Success: Save to Supabase
        access_token = tokens.get("access_token")
        refresh_token = tokens.get("refresh_token")
        expires_in = tokens.get("expires_in", 86400) # Default 1 day
        
        # Calculate expiry
        expiry_time = datetime.now() + timedelta(seconds=int(expires_in))
        expiry_str = expiry_time.isoformat()

        # Build update body
        body = {
            "status": "Connected",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_expiry": expiry_str,
        }

        print(f"6. ทำการบันทึกโทเคน API ของช่อง {channel_id} ลง Supabase Real-time Database...")
        # PostgREST PATCH request to update the channel row
        res = supabase_request(f"channels?id=eq.{channel_id}", method="PATCH", body=body)
        
        print(f"\n✅ ล็อกอินและเชื่อมสิทธิ์ API ของช่อง {channel_id} สำเร็จเรียบร้อยแล้ว!")

    # 2. Refresh token action
    elif action == "refresh":
        print(f"\n🔄 --- เริ่มรีเฟรชสิทธิ์โทเคนของช่อง {channel_id} ---")
        
        # Fetch current refresh token from Supabase
        channel_data = supabase_request("channels", method="GET", query_params={"id": f"eq.{channel_id}"})
        if not channel_data or len(channel_data) == 0:
            print(f"❌ Error: ไม่พบช่อง {channel_id} ในฐานข้อมูล!")
            sys.exit(1)

        old_refresh_token = channel_data[0].get("refresh_token")
        if not old_refresh_token:
            print(f"❌ Error: ช่อง {channel_id} ยังไม่เคยล็อกอินหรือไม่มี refresh_token!")
            sys.exit(1)

        print("1. ส่งคำขอรีเฟรชโทเคนกับ TikTok API...")
        tokens = refresh_access_token(client_key, client_secret, old_refresh_token)
        
        if not tokens or "access_token" not in tokens:
            print(f"❌ Error: รีเฟรชโทเคนล้มเหลว! ข้อมูลส่งกลับ: {tokens}")
            sys.exit(1)

        access_token = tokens.get("access_token")
        new_refresh_token = tokens.get("refresh_token", old_refresh_token)
        expires_in = tokens.get("expires_in", 86400)
        
        expiry_time = datetime.now() + timedelta(seconds=int(expires_in))
        expiry_str = expiry_time.isoformat()

        body = {
            "status": "Connected",
            "access_token": access_token,
            "refresh_token": new_refresh_token,
            "token_expiry": expiry_str,
        }

        print("2. ปรับปรุงสิทธิ์โทเคนใหม่ลงฐานข้อมูล Supabase...")
        supabase_request(f"channels?id=eq.{channel_id}", method="PATCH", body=body)
        
        print(f"\n✅ รีเฟรชและอัปเดตสิทธิ์การอัปโหลดของช่อง {channel_id} สำเร็จแล้ว!")
        
    else:
        print(f"❌ Action '{action}' ไม่ถูกต้อง! กรุณาเลือก 'login' หรือ 'refresh'")

if __name__ == "__main__":
    supabaseUrl = "https://grrbzmzfoyfmkptqtzhl.supabase.co"
    main()
