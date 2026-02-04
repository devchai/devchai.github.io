---
layout: post
title: "React + Supabase + Vercel로 SaaS 개발하기 완벽 가이드 | 2026"
date: 2026-02-04 13:30:00 +0900
categories: "AI"
author: "Dev C"
tag: SaaS
keywords: "React Supabase Vercel, SaaS 개발, Supabase 인증, Vercel 배포, React SaaS 스택, 풀스택 개발, BaaS, PostgreSQL"
description: "React, Supabase, Vercel 조합으로 SaaS를 빠르게 개발하는 방법을 설치부터 배포까지 상세히 안내합니다. 2026년 최적의 SaaS 개발 스택."
comments: true
---

![React Supabase Vercel SaaS 개발 스택](https://supabase.com/_next/image?url=%2Fimages%2Fblog%2Flaunch-week-6%2Fday-2-auth-hooks%2Fsupabase-auth-hooks-og.jpg&w=3840&q=75)

2026년 현재, **SaaS(Software as a Service)** 개발에서 가장 효율적인 스택 조합은 단연 **React + Supabase + Vercel**입니다. 이 조합은 빠른 개발 속도, 예측 가능한 비용, 그리고 확장성까지 모두 갖춘 현대적인 풀스택 솔루션입니다.

이 글에서는 설치부터 배포까지, SaaS 프로젝트를 시작하는 데 필요한 모든 과정을 상세히 다룹니다.

## 왜 React + Supabase + Vercel인가?

### Firebase 대신 Supabase를 선택하는 이유

2026년 [Backend-as-a-Service 시장에서 Supabase가 Firebase를 추월](https://makerkit.dev/blog/saas/supabase-vs-firebase)하고 있습니다. 그 이유는 명확합니다:

| 비교 항목 | Supabase | Firebase |
|----------|----------|----------|
| 데이터베이스 | PostgreSQL (SQL) | Firestore (NoSQL) |
| 가격 정책 | 예측 가능한 고정 요금 | 사용량 기반 (예측 어려움) |
| AI 통합 | pgvector로 임베딩 저장 | 외부 서비스 필요 |
| 오픈소스 | ✅ 셀프 호스팅 가능 | ❌ 구글 종속 |
| Row Level Security | PostgreSQL RLS 내장 | 별도 규칙 설정 필요 |

특히 **pgvector 확장**을 통해 AI 임베딩을 같은 데이터베이스에 저장할 수 있어, Pinecone 같은 별도 벡터 DB 없이도 AI 기능을 구현할 수 있습니다.

### Vercel의 장점

- **제로 설정 배포**: Git push만으로 자동 배포
- **Edge Functions**: 전 세계 엣지 네트워크에서 실행
- **Supabase 통합**: 환경 변수 자동 설정
- **프리뷰 배포**: PR마다 독립적인 미리보기 환경

## 개발 환경 설정

### 1. Node.js 및 필수 도구 설치

```bash
# Node.js 20+ LTS 설치 확인
node --version

# pnpm 설치 (권장 패키지 매니저)
npm install -g pnpm

# Vercel CLI 설치
npm install -g vercel
```

### 2. 프로젝트 생성 - Vite + React + TypeScript

```bash
# Vite로 React + TypeScript 프로젝트 생성
pnpm create vite my-saas-app --template react-ts

# 프로젝트 디렉토리 이동
cd my-saas-app

# 의존성 설치
pnpm install
```

### 3. Supabase 패키지 설치

```bash
# Supabase 클라이언트 라이브러리
pnpm add @supabase/supabase-js

# 인증 UI 컴포넌트 (선택)
pnpm add @supabase/auth-ui-react @supabase/auth-ui-shared
```

## Supabase 프로젝트 설정

### 1. Supabase 대시보드에서 프로젝트 생성

1. [supabase.com](https://supabase.com)에서 계정 생성
2. **New Project** 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호, 리전 선택 (한국 사용자는 **Singapore** 또는 **Northeast Asia** 권장)

### 2. API 키 확인

프로젝트 생성 후 **Settings > API**에서 다음 값을 확인합니다:

- **Project URL**: `https://xxxxx.supabase.co`
- **anon/public key**: 클라이언트에서 사용
- **service_role key**: 서버 사이드에서만 사용 (절대 노출 금지)

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **보안 참고**: `anon key`는 브라우저에 노출되어도 안전합니다. Row Level Security(RLS)가 데이터를 보호하기 때문입니다.

## Supabase 클라이언트 초기화

### src/lib/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 타입 생성 (선택이지만 강력 권장)

Supabase CLI를 사용하면 데이터베이스 스키마에서 TypeScript 타입을 자동 생성할 수 있습니다:

```bash
# Supabase CLI 설치
pnpm add -D supabase

# 타입 생성
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

## 인증 시스템 구현

### 1. 인증 컨텍스트 생성

**src/contexts/AuthContext.tsx**

```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 현재 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 인증 상태 변화 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      session,
      user: session?.user ?? null,
      loading,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### 2. 로그인 컴포넌트

**src/components/Auth.tsx**

```typescript
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../lib/supabase'

export function AuthComponent() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']}
        redirectTo={window.location.origin}
      />
    </div>
  )
}
```

### 3. OAuth 프로바이더 설정

Supabase 대시보드에서 **Authentication > Providers**로 이동:

- **Google**: GCP Console에서 OAuth 클라이언트 ID 생성
- **GitHub**: GitHub Settings > Developer settings > OAuth Apps에서 앱 등록

## 데이터베이스 설계 및 RLS

### 1. 테이블 생성 예시

Supabase SQL Editor에서 실행:

```sql
-- 사용자 프로필 테이블
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 새 사용자 가입 시 자동 프로필 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2. Row Level Security 설정

```sql
-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## 실시간 기능 구현

Supabase의 강력한 실시간 구독 기능을 활용합니다:

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeMessages(channelId: string) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // 초기 데이터 로드
    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true })

      if (data) setMessages(data)
    }

    fetchMessages()

    // 실시간 구독
    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [channelId])

  return messages
}
```

## Vercel 배포

### 1. Vercel 프로젝트 연결

```bash
# Vercel에 로그인
vercel login

# 프로젝트 연결 및 배포
vercel
```

### 2. 환경 변수 설정

Vercel 대시보드에서 **Settings > Environment Variables**:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

또는 [Supabase Integration](https://vercel.com/integrations/supabase)을 사용하면 환경 변수가 자동으로 설정됩니다.

### 3. 자동 배포 설정

GitHub 저장소를 Vercel에 연결하면:
- **main 브랜치** 푸시 → 프로덕션 배포
- **PR 생성** → 프리뷰 배포 (고유 URL 제공)

## SaaS 스타터 킷 활용

빠른 시작을 원한다면 [Vercel의 SaaS 스타터 킷](https://vercel.com/templates/next.js/stripe-supabase-saas-starter-kit)을 활용하세요:

```bash
npx create-next-app --example https://github.com/vercel/nextjs-subscription-payments
```

이 스타터 킷에는 다음이 포함되어 있습니다:

- ✅ Supabase 인증 (OAuth, 비밀번호 재설정)
- ✅ Stripe 결제 통합
- ✅ 구독 관리 UI
- ✅ Tailwind CSS 스타일링
- ✅ TypeScript 지원

## 비용 최적화 팁

### Supabase 무료 티어 한도

- 500MB 데이터베이스
- 1GB 파일 스토리지
- 50,000 월간 활성 사용자
- 2GB 대역폭

### 비용 절감 전략

1. **불필요한 실시간 구독 제거**: 실시간이 필요없는 데이터는 일반 쿼리 사용
2. **이미지 최적화**: Supabase Storage의 transform 기능 활용
3. **Edge Functions 캐싱**: 반복 요청에 캐시 헤더 설정

## 마무리

React + Supabase + Vercel 스택은 2026년 SaaS 개발의 황금 조합입니다. PostgreSQL의 안정성, 예측 가능한 가격, 그리고 빠른 배포 파이프라인이 결합되어 **MVP부터 스케일업까지 하나의 스택으로 커버**할 수 있습니다.

특히 AI 기능이 필수가 된 현재, pgvector를 통한 벡터 검색을 같은 데이터베이스에서 처리할 수 있다는 점은 큰 장점입니다.

시작이 반입니다. 오늘 바로 첫 SaaS 프로젝트를 만들어보세요!

---

## 참고 자료

- [Supabase 공식 React 가이드](https://supabase.com/docs/guides/auth/quickstarts/react)
- [Vercel + Supabase 통합](https://supabase.com/partners/integrations/vercel)
- [Supabase vs Firebase 비교 (2026)](https://www.clickittech.com/software-development/supabase-vs-firebase/)
- [LogRocket: React Supabase 인증 튜토리얼](https://blog.logrocket.com/authenticate-react-applications-supabase-auth/)
