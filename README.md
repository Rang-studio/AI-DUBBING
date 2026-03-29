# AI 더빙 웹사이트

## 서비스 소개 및 주요 기능
이 프로젝트는 사용자가 오디오 또는 비디오 파일을 업로드하면, 원하는 언어로 더빙 결과를 생성해주는 Next.js 기반 웹 서비스입니다.

주요 기능:
- 오디오/비디오 파일 업로드
- ElevenLabs API를 이용한 음성 추출 및 전사
- 번역 텍스트 생성
- ElevenLabs API를 이용한 변경할 언어 음성 합성
- 더빙 결과 재생 및 다운로드
- Google OAuth 로그인
- Turso 기반 화이트리스트 접근 제어

## 사용한 기술 스택
- Next.js App Router
- TypeScript
- Tailwind CSS
- NextAuth(Auth.js)
- Google OAuth
- Turso(libSQL)
- ElevenLabs API

## 로컬 실행 방법
1. 패키지 설치
   ```bash
   npm install
   ```
2. `.env.example`를 복사해 `.env.local` 생성
3. 환경 변수 입력
4. 개발 서버 실행
   ```bash
   npm run dev
   ```
5. 브라우저에서 `http://localhost:3000` 접속

## 배포된 서비스 URL
Vercel 배포 후 여기에 URL을 기입합니다.

## 코딩 에이전트 활용 방법 및 노하우
- 기능 단위를 먼저 분리한 뒤 페이지, 컴포넌트, API를 나눠 구현하면 오류를 줄일 수 있습니다.
- 인증, DB, 외부 API 호출을 모두 서버 영역에 두어 키 노출을 막았습니다.
- UI는 둥근 컴포넌트, 여백, 그림자 톤을 일관되게 유지해 안정적인 인상을 주도록 설계했습니다.
- 라우팅은 `/`, `/dub/conversation`, `/dub/learning`, `/dub/business`, `/denied`로 고정해 404 가능성을 줄였습니다.

## 주의
현재 `app/api/dub/route.ts`의 번역 부분은 과제 구조 시연용 임시 함수입니다. 실제 번역 API를 연결하면 더 완성도 높은 결과를 얻을 수 있습니다.
