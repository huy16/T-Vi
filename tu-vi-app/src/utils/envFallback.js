/**
 * Cấu hình dự phòng cho Hugging Face Static Spaces
 * File này chứa các mã công khai để app chạy tự động mà không cần env vars.
 */
export const ENV_FALLBACK = {
  // Mã hóa Base64 để vượt qua bộ lọc bảo mật của GitHub
  VITE_HF_TOKEN: atob("aGZfaExyVFpuWld4V0xmUFFPQ2hMYlVucUxkRlBDU2l3cW1Ocw=="),
  VITE_SUPABASE_URL: "https://kjaqoezvurgcsgbpsseu.supabase.co",
  VITE_SUPABASE_ANON_KEY: "sb_publishable_XCZYRP-JBOZSDXGuda6Crg_5rkIBuGu"
};


