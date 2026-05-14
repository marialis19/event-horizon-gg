const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RegisterData {
  email: string;
  gamertag: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  requires_otp: boolean;
}

interface UserResponse {
  id: string;
  email: string;
  gamertag: string;
  role: string;
  status: string;
  is_2fa_enabled: boolean;
}

interface ApiError {
  detail: string;
}

export async function registerUser(data: RegisterData): Promise<UserResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.detail || "Registration failed");
  }

  return res.json();
}

export async function loginUser(data: LoginData): Promise<TokenResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // necesario para recibir la cookie del refresh token
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err: ApiError = await res.json();
    throw new Error(err.detail || "Login failed");
  }

  return res.json();
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function getMe(token: string): Promise<UserResponse> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}