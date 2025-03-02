# Pattern Generator

이미지 패턴 생성기 프로젝트입니다. 이 프로젝트는 Svelte를 사용하여 다양한 패턴을 생성하고 다운로드할 수 있는 웹 애플리케이션을 제공합니다.

## 프로젝트 설정

프로젝트를 클론하고 의존성을 설치합니다:

```bash
git clone https://github.com/your-username/PatternGenerator.git
cd PatternGenerator
npm install
```

## 개발 서버 실행

개발 서버를 시작하여 애플리케이션을 로컬에서 실행합니다:

```bash
npm run dev

# 또는 서버를 시작하고 브라우저에서 자동으로 열기
npm run dev -- --open
```

## 빌드

프로덕션 환경을 위한 빌드를 생성합니다:

```bash
npm run build
```

생성된 빌드를 미리보기 위해 다음 명령어를 실행할 수 있습니다:

```bash
npm run preview
```

> 애플리케이션을 배포하려면 대상 환경에 맞는 [어댑터](https://svelte.dev/docs/kit/adapters)를 설치해야 할 수 있습니다.

## 테스트

테스트를 실행하여 애플리케이션의 기능을 검증합니다:

```bash
npm test
```

## 주요 기능

- 이미지 업로드 및 미리보기
- 다양한 패턴 생성 (다이아몬드, 그리드 등)
- 패턴 매개변수 조정 (거리, 열, 행, 캔버스 너비 등)
- 생성된 패턴 다운로드

## 디렉토리 구조

```
PatternGenerator/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── DownloadButton.svelte
│   │   │   ├── ImageSelector.svelte
│   │   │   ├── Slider.svelte
│   │   ├── functions/
│   │   │   ├── patternGenerator.ts
│   │   ├── patternGenerator/
│   │   │   ├── diamond.ts
│   │   │   ├── grid.ts
│   ├── routes/
│   │   ├── +page.svelte
├── tests/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── DownloadButton.test.ts
│   │   │   ├── ImageSelector.test.ts
```

## 기여

기여를 환영합니다! 버그를 발견하거나 새로운 기능을 제안하려면 이슈를 생성해 주세요. 풀 리퀘스트도 환영합니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
