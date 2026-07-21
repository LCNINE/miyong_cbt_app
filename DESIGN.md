# DESIGN.md — 미용필기시험

이 프로젝트의 디자인 토큰과 사용 규칙.

**출처**: 화해(Hwahae) 디자인 시스템 — [oh-my-design.kr/design-systems/hwahae](https://oh-my-design.kr/design-systems/hwahae)
**참고한 이유**: 뷰티 도메인이면서 상업적이지 않고 정보·신뢰 중심. 문제 풀이 화면에 필요한 톤과 맞음. Pretendard 기반이라 한글 렌더링도 안정적.
**적용일**: 2026-07-21

토큰의 단일 출처는 `tailwind.config.js`다. 이 문서는 그 값의 **의미와 사용 규칙**을 설명한다. 값을 바꿀 땐 config를 고치고 이 문서를 함께 갱신할 것.

---

## 1. 색상

### 브랜드

| 토큰 | Hex | 용도 |
|---|---|---|
| `brand` | `#00d5ce` | 터콰이즈. 주요 액션 버튼, CTA |
| `brand-deep` | `#00a5aa` | brand의 hover 상태 |
| `brand-bright` | `#22d3d6` | 밝은 변주 (현재 미사용) |
| `brand-tint` | `#eefbfb` | 페일 민트. secondary 버튼 배경, 강조 카드 |

### 텍스트

| 토큰 | Hex | 용도 |
|---|---|---|
| `ink` | `#111111` | 제목, 강조 텍스트 |
| `ink-black` | `#000000` | input 입력값 |
| `body` | `#3d3d3d` | 본문 기본색 (`<body>`에 적용됨) |
| `muted` | `#666666` | 보조 설명 |
| `faint` | `#999999` | 최하위 캡션 |
| `placeholder` | `#aaaaaa` | input placeholder |

### 표면 · 선

| 토큰 | Hex | 용도 |
|---|---|---|
| `canvas` | `#f7f7f7` | 페이지 배경 |
| `line` | `#e8e8e8` | 헤어라인 테두리 (카드, input, 버튼) |
| `divider` | `#d8d8d8` | 구분선 |

### 기능 색

| 토큰 | Hex | 용도 |
|---|---|---|
| `amber` | `#ffaa3c` | 별점, 평가 |
| `info` | `#467dff` | 정보 칩 |
| `alert` | `#ff5555` | 오류, 파괴적 액션 |

---

## 2. 타이포그래피

**Pretendard Variable** — `src/index.css`에서 CDN import, `tailwind.config.js`의 `fontFamily.sans` 기본값.

| 역할 | Size | Weight | Line Height |
|---|---|---|---|
| 섹션 제목 | 18px | 600 | 1.33 |
| 내비 링크 | 15px | 600 / 400 | 1.5 |
| 카드 제목 | 14px | 600 | 1.5 |
| 본문 | 16px | 400 | 1.5 |
| 라벨 | 14px | 400 | 1.5 |
| 캡션 | 12px | 400 | 1.5 |

본문과 버튼은 **16px**이 기본이다. iOS Safari는 16px 미만 input에서 자동 확대를 하므로 입력 요소는 16px 아래로 내리지 말 것.

---

## 3. 형태

**Border radius**

| 크기 | 값 | 용도 |
|---|---|---|
| XS | 4px | 칩, 배지 |
| SM | 8px | 버튼, input (`rounded-lg`) |
| MD | 16px | 카드 |
| LG | 20px | 큰 카드 |
| Full | 9999px | 아바타, 알약형 |

**Spacing** — 4px 단위: `4, 8, 12, 16, 20, 24, 32, 48`

**Shadow** — 한 단계만 존재한다.
```
shadow-card: rgba(0, 0, 0, 0.08) 0px 2px 8px
```
그림자를 쌓아 깊이를 만들지 않는다. 구분은 헤어라인(`line`)과 배경 틴트로 한다.

---

## 4. 컴포넌트

### Button (`src/components/ui/button.tsx`)

| variant | 스타일 | 용도 |
|---|---|---|
| `default` | `bg-brand` + 흰 글자, hover `brand-deep` | 주요 액션 |
| `outline` | 흰 배경 + `line` 테두리 + `body` 글자 | 보조 액션 (헤더 버튼 등) |
| `secondary` | `brand-tint` 배경 + `ink` 글자 | 약한 강조 |
| `chip` | 24px 높이, 4px 라운드, 12px 글자 | 필터, 태그 |
| `ghost` | 배경 없음, hover 시 `canvas` | 아이콘 버튼 |
| `link` | 밑줄, `body` 색 | 인라인 링크 |
| `destructive` | `bg-alert` | 삭제 등 되돌릴 수 없는 액션 |

**size**: `default` 44px / `sm` 36px / `lg` 48px / `icon` 44px 정사각.
44px는 터치 타깃 최소 권장치다. `sm`은 밀집된 데스크톱 UI에서만 쓸 것.

라우터 링크에 버튼 스타일이 필요하면 `asChild`를 쓴다:

```tsx
<Button asChild variant="link">
  <Link to="/schedule">연간일정 보러가기</Link>
</Button>
```

### Card (`src/components/ui/card.tsx`)
흰 배경, `line` 테두리, 16px 라운드, `shadow-card`.

### Input (`src/components/ui/input.tsx`)
흰 배경, `line` 테두리, 8px 라운드, 44px 높이, 16px 글자, 포커스 시 `brand` 링.

---

## 5. 규칙

### Do
- 터콰이즈(`brand`)는 **그 화면에서 가장 중요한 액션 하나**에 쓴다
- 보조 버튼은 `outline`으로 — 주요 액션이 묻히지 않게
- 구분은 헤어라인과 배경 틴트로, 그림자를 쌓지 않는다
- 본문 텍스트는 `body`(`#3d3d3d`), 순수 검정은 input 입력값에만
- 터치 타깃은 44px 이상
- 색은 기능을 위해서만 쓴다 — 장식으로 쓰지 않는다

### 채점 색 (문제 풀이 화면)
정답·오답 표시는 브랜드 색을 쓰지 않고 Tailwind 기본 `emerald`(정답) / `red`(오답)를 쓴다.
"맞음/틀림"은 브랜드보다 먼저 읽혀야 하는 정보라 의도적으로 분리했다. (`src/pages/test/PostList.tsx`)

선택 상태와 액션의 위계:
- 선택된 보기 → `border-brand` + `bg-brand-tint` (민트 틴트)
- 제출·다음 버튼 → `bg-brand` (채워진 청록)

둘 다 채우면 지금 눌러야 할 것이 흐려진다.

### Don't
- 한 화면에 청록으로 **채워진** 버튼을 여러 개 두지 않는다 (CTA 효과가 죽는다)
- `brand-tint`를 넓은 면적 배경으로 쓰지 않는다 — 강조 블록용이다
- 새 강조색을 추가하지 않는다 — `amber`/`info`/`alert`가 기능 색의 전부다
- 그림자를 여러 단계로 쌓지 않는다
- 페이지에 hex 값을 직접 박지 않는다 — 토큰을 쓴다

---

## 6. 알려진 부채

이 시스템은 **컴포넌트 레이어에만** 적용됐다. 아직 남은 것:

- 여러 페이지에 `slate-*`, `gray-*` 하드코딩 클래스가 남아 있다. shadcn이 CSS 변수 없이(`colors: {}`) 설치돼서 컴포넌트마다 색이 박혀 있었고, 자주 쓰는 것만 토큰으로 옮겼다.
- `src/components/ui/` 아래 나머지 컴포넌트(dialog, tabs, table, badge 등)는 여전히 slate 계열이다. 실제로 화면에 쓰일 때 토큰으로 옮기면 된다.
- 다크 모드는 지원하지 않는다. `darkMode: ["class"]` 설정만 있고 실제 다크 토큰은 없다.

새 화면을 만들 땐 slate를 복사하지 말고 위 토큰을 쓸 것.

---

## 7. 색을 바꾸려면

`tailwind.config.js`의 `brand` 값 하나만 바꾸면 버튼·CTA·포커스 링이 전부 따라온다. 브랜드 색을 자체적으로 정하게 되면 그 한 줄만 교체하고 이 문서의 출처 항목을 갱신할 것.
