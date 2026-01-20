# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소의 코드 작업 시 참고할 수 있는 가이드를 제공합니다.

## 프로젝트 개요

홀리씨즈교회 웹 애플리케이션 - 설교와 찬양을 검색하고 재생할 수 있는 교회 미디어 플랫폼입니다. Next.js 16과 Supabase를 사용하여 Progressive Web App(PWA)으로 구축되었습니다.

## 개발 명령어

```bash
npm run dev    # 개발 서버 시작 (http://localhost:3000)
npm run build  # 프로덕션 빌드
npm run start  # 프로덕션 서버 실행
npm run lint   # ESLint 실행
```

## 아키텍처

### 기술 스택
- **프레임워크**: Next.js 16.1.2 (App Router)
- **언어**: TypeScript (strict mode)
- **백엔드**: Supabase (PostgreSQL 데이터베이스, Storage, Client SDK)
- **스타일링**: CSS-in-JS (인라인 스타일) + 전역 CSS 변수
- **폰트**: Pretendard (한글), Inter (영문)

### 디렉토리 구조

```
src/app/
├── layout.tsx              # 루트 레이아웃 (헤더/푸터)
├── page.tsx               # 홈 페이지 (기능 카드)
├── globals.css            # 디자인 시스템 (Emerald Green 테마)
├── lib/
│   └── supabase.ts       # Supabase 클라이언트 싱글톤
├── admin/
│   ├── page.tsx          # 관리자 대시보드
│   └── upload/page.tsx   # 콘텐츠 업로드 폼
├── search/
│   ├── sermon/page.tsx   # 설교 검색 및 플레이어
│   └── praise/page.tsx   # 찬양 검색 및 플레이어
└── alarm/page.tsx        # 알람 설정 (UI만 구현)
```

### 데이터 모델

**Supabase 테이블:**

1. `sermons` (설교)
   - `id` (자동 생성)
   - `title` (제목)
   - `date` (날짜)
   - `video_url` (비디오 URL, Supabase Storage)
   - `audio_url` (오디오 URL, Supabase Storage)

2. `praises` (찬양)
   - `id` (자동 생성)
   - `title` (제목)
   - `lyrics` (첫 가사)
   - `video_url` (비디오 URL, Supabase Storage)
   - `audio_url` (오디오 URL, Supabase Storage)

**Supabase Storage:**
- 버킷: `videos` (공개, MP4 파일)
- 버킷: `audio` (공개, MP3 파일)
- 경로 구조: `{sermon|praise}/{timestamp}_{random}.{ext}`
- 파일 크기 제한: 최대 50MB

### 주요 패턴

**클라이언트 컴포넌트**: 모든 인터랙티브 페이지는 React hooks(useState, useEffect)나 이벤트 핸들러를 사용하므로 파일 상단에 `"use client"` 지시어를 포함합니다.

**Supabase 쿼리**:
- `@/app/lib/supabase`에서 import
- `.from()`으로 테이블 쿼리, `.storage`로 파일 작업
- 검색은 `.ilike()`로 대소문자 구분 없는 매칭
- 찬양 검색은 `.or()`로 제목 또는 가사에서 검색

**비디오/오디오 플레이어**:
- 검색 결과에서 항목 선택 시 페이지 내 플레이어 표시
- `<video>` 및 `<audio>` HTML5 태그 사용
- `autoPlay` 속성으로 자동 재생
- selectedItem 상태로 현재 재생 중인 항목 관리

**스타일링 방식**:
- Glassmorphism 디자인, [globals.css](src/app/globals.css)에 CSS 변수 정의
- React `style` 속성으로 인라인 스타일 적용
- 주요 CSS 클래스: `.glass-card`, `.text-gradient`, `.btn-primary`, `.fade-in`
- 반응형 그리드: `gridTemplateColumns: 'repeat(auto-fit, minmax(...))'`
- 다크모드: `prefers-color-scheme`로 자동 전환

**경로 별칭**: `@/`는 `src/` 디렉토리를 참조 ([tsconfig.json](tsconfig.json) 설정)

## 환경 변수

`.env.local` 파일에 필요:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 디자인 시스템

**색상 팔레트** ([globals.css](src/app/globals.css) 참조):
- Primary: `#10B981` (Emerald Green)
- Primary Light: `#34D399` (Light Emerald)
- Secondary: `#059669` (Deep Emerald)
- Accent: `#FBBF24` (Warm Gold)

**레이아웃 상수**:
- 최대 너비: `1080px`
- 헤더 높이: `80px`
- 테두리 반경: XL=36px, LG=24px, MD=16px

**타이포그래피**:
- 제목: font-weight 800, letter-spacing -0.05em
- 본문: Pretendard/Inter, font-weight 400-700
- 흐린 텍스트: `var(--text-muted)` 색상

## 주요 작업

### 새 페이지 추가하기
1. `src/app/your-route/page.tsx` 생성
2. 인터랙티브 기능 사용 시 `"use client"` 추가
3. 일관된 레이아웃을 위해 `.glass-card`와 `.container` 사용
4. 뒤로 가기 네비게이션 추가: `<Link href="/">← BACK TO HOME</Link>`

### Supabase 데이터 쿼리
```typescript
import { supabase } from "@/app/lib/supabase";

const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .ilike("column", `%${searchTerm}%`);
```

### Supabase Storage에 파일 업로드
```typescript
// 파일 업로드
const { error } = await supabase.storage
  .from('videos')  // 또는 'audio'
  .upload(filePath, file);

// 공개 URL 가져오기
const { data: { publicUrl } } = supabase.storage
  .from('videos')
  .getPublicUrl(filePath);
```

### 비디오/오디오 플레이어 구현
```typescript
// 상태 관리
const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

// 비디오 플레이어
<video controls autoPlay>
  <source src={selectedItem.video_url} type="video/mp4" />
</video>

// 오디오 플레이어
<audio controls autoPlay>
  <source src={selectedItem.audio_url} type="audio/mpeg" />
</audio>
```

## 특이사항

- 사용자 대면 텍스트는 한글, UI 레이블은 영문 사용
- 비디오/오디오 파일 모두 Supabase Storage에 저장 (videos, audio 버킷)
- 파일 형식: MP4 (비디오), MP3 (오디오), 최대 50MB
- 관리자 페이지는 인증 없음 (현재는 의도적으로 공개)
- 알람 기능은 UI만 구현 (백엔드 로직 미구현)
- PWA manifest: [public/manifest.json](public/manifest.json)

## 최근 변경사항

### 2026-01-20: Green Theme & Video Player
- 색상 테마를 Blue에서 Emerald Green으로 변경
- YouTube URL 입력 방식에서 파일 직접 업로드 방식으로 변경
- 검색 페이지에 내장 비디오/오디오 플레이어 추가
- Supabase Storage에 `videos` 버킷 추가 (기존 `audio`와 함께 사용)
