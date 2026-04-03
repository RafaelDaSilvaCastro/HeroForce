import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export default function useAuth() {
  const token = localStorage.getItem('token');
  if (!token) return {user: null, isAdmin: false}

  const payload = jwtDecode<TokenPayload>(token);
  return {
    user: payload,
    isAdmin: payload.role === 'admin'
  }
}