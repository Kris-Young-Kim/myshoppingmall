import { CalendarClock } from "lucide-react";
import type { User } from "@clerk/nextjs/server";

interface ProfileCardProps {
  user: User | null;
  recentOrderCount: number;
}

function resolveDisplayName(user: User | null): string {
  if (!user) return "게스트";
  if (user.fullName) return user.fullName;
  const primaryEmail = user.emailAddresses?.[0]?.emailAddress;
  return primaryEmail ?? "사용자";
}

export function ProfileCard({ user, recentOrderCount }: ProfileCardProps) {
  const displayName = resolveDisplayName(user);
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const lastSignInAt = user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString("ko-KR") : null;

  return (
    <section className="space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">안녕하세요, {displayName}님</h2>
        {email && <p className="text-sm text-muted-foreground">{email}</p>}
      </header>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarClock className="h-4 w-4" />
        <span>최근 로그인: {lastSignInAt ?? "정보 없음"}</span>
      </div>
      <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-gray-900">
        최근 주문 {recentOrderCount.toLocaleString("ko-KR")}건을 확인할 수 있어요.
      </div>
    </section>
  );
}

