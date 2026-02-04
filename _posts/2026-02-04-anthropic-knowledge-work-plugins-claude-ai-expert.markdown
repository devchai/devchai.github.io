---
layout: post
title: "Anthropic Knowledge Work Plugins: Claude를 업무 전문가로 만드는 오픈소스 도구"
date: 2026-02-04 11:30:00 +0900
categories: "AI"
author: "Dev C"
tag: claude
keywords: "Claude 플러그인, Anthropic Knowledge Work Plugins, Claude Code 확장, AI 업무 자동화, MCP 서버, Claude Cowork, AI 생산성 도구"
description: "Anthropic이 공개한 Knowledge Work Plugins로 Claude를 영업, 마케팅, 데이터 분석 등 11개 분야 전문가로 확장하는 방법을 알아봅니다."
comments: true
---

![Anthropic Knowledge Work Plugins](https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png)

Anthropic이 **Knowledge Work Plugins**를 오픈소스로 공개했습니다. 이 플러그인 시스템은 Claude를 단순한 AI 어시스턴트에서 **업무별 전문가**로 변신시키는 강력한 도구입니다. 영업, 마케팅, 데이터 분석, 재무 등 11개 분야를 지원하며, 마크다운과 JSON만으로 누구나 커스터마이징할 수 있습니다.

## Knowledge Work Plugins란?

Knowledge Work Plugins는 Claude Code와 Claude Cowork에서 사용할 수 있는 **역할 기반 전문성 확장 시스템**입니다.

핵심 특징:
- **11개 업무 도메인** 지원
- **코드 없이** 마크다운/JSON만으로 구성
- **MCP 서버**를 통한 외부 도구 연결
- **기업 맞춤형** 커스터마이징 지원

## 플러그인 구조

```
plugin-name/
├── .claude-plugin/plugin.json   # 플러그인 매니페스트
├── .mcp.json                    # 도구 연결 설정
├── commands/                    # 슬래시 명령어
└── skills/                      # 자동 활성화 지식
```

**Skills**는 Claude가 상황에 맞게 자동으로 활성화하고, **Commands**는 `/sales:call-prep`처럼 사용자가 직접 호출합니다.

## 지원하는 11개 플러그인

| 플러그인 | 주요 기능 | 연동 도구 |
|---------|---------|----------|
| **productivity** | 작업/캘린더 관리 | Slack, Notion, Asana, Jira |
| **sales** | 영업 준비, 파이프라인 분석 | HubSpot, Close, ZoomInfo |
| **marketing** | 콘텐츠 작성, 캠페인 계획 | Canva, Figma, Ahrefs |
| **data** | SQL 쿼리, 시각화, 통계 | Snowflake, BigQuery, Hex |
| **product-management** | 스펙 작성, 로드맵 | Linear, Amplitude, Figma |
| **finance** | 분개 작성, 계정 조정 | Snowflake, Databricks |
| **customer-support** | 티켓 분류, 응답 작성 | Intercom, HubSpot, Guru |
| **legal** | 계약 검토, NDA 분석 | Box, Egnyte, Jira |
| **enterprise-search** | 통합 검색 | Slack, Notion, Jira |
| **bio-research** | 문헌 검색, 유전체 분석 | PubMed, Benchling |
| **cowork-plugin-management** | 플러그인 생성/관리 | — |

## 설치 방법

### Claude Code (CLI)에서 설치

```bash
# 1. 마켓플레이스 추가
claude plugin marketplace add anthropics/knowledge-work-plugins

# 2. 원하는 플러그인 설치
claude plugin install sales@knowledge-work-plugins
claude plugin install marketing@knowledge-work-plugins
claude plugin install data@knowledge-work-plugins
```

### Claude Cowork에서 설치

[https://claude.com/plugins/](https://claude.com/plugins/)에서 원클릭 설치가 가능합니다.

## 실제 사용 예시

### 영업팀을 위한 활용

```bash
/sales:call-prep "내일 ABC 기업 미팅"
```

Claude가 자동으로:
- 회사 정보 리서치
- 담당자 LinkedIn 분석
- 예상 질문 및 답변 준비
- 제안서 초안 작성

### 마케팅팀을 위한 활용

```bash
/marketing:draft-content "신제품 런칭 블로그 포스트"
```

Claude가 제공하는 것:
- SEO 최적화된 헤드라인 3개
- 구조화된 본문 초안
- 관련 키워드 추천
- CTA 문구 제안

### 데이터팀을 위한 활용

```bash
/data:write-query "지난 분기 매출 상위 10개 제품"
```

Claude가 작성하는 것:
- 최적화된 SQL 쿼리
- 쿼리 설명 및 주석
- 시각화 추천

## 기업 맞춤형 커스터마이징

Knowledge Work Plugins의 진정한 강점은 **기업 환경에 맞게 수정**할 수 있다는 점입니다.

### 커스터마이징 가능 영역

1. **커넥터 변경**: `.mcp.json`에서 회사의 도구 스택 지정
2. **도메인 지식 추가**: 회사 용어, 조직 구조, 프로세스 입력
3. **워크플로우 조정**: 실제 팀의 업무 방식에 맞게 수정
4. **새 플러그인 생성**: 미지원 역할에 대해 직접 제작

### 커스터마이징 예시

```json
// .mcp.json - 회사 도구 연결
{
  "servers": {
    "slack": { "command": "npx @anthropic/mcp-server-slack" },
    "notion": { "command": "npx @anthropic/mcp-server-notion" }
  }
}
```

## 왜 Knowledge Work Plugins인가?

### 1. 코드 없이 확장 가능

기존 AI 확장 도구들은 복잡한 코드와 인프라가 필요했습니다. Knowledge Work Plugins는 **마크다운과 JSON만**으로 작동합니다.

### 2. 즉시 생산성 향상

설치 즉시 전문가 수준의 업무 지원을 받을 수 있습니다. 별도의 학습이나 설정 없이 바로 사용 가능합니다.

### 3. 팀 전체 표준화

조직 전체가 동일한 플러그인을 사용하면 **일관된 업무 품질**과 **지식 공유**가 가능해집니다.

### 4. 오픈소스 생태계

Apache-2.0 라이선스로 공개되어 자유롭게 수정하고 기여할 수 있습니다. GitHub에서 2.5k+ 스타를 받으며 활발히 발전 중입니다.

## 시작하기

Knowledge Work Plugins를 사용하려면:

1. **Claude Code 설치**: Anthropic 공식 CLI 도구
2. **마켓플레이스 추가**: `claude plugin marketplace add anthropics/knowledge-work-plugins`
3. **필요한 플러그인 설치**: 업무에 맞는 플러그인 선택
4. **MCP 서버 연결**: 사용 중인 도구와 연동

자세한 정보는 [GitHub 저장소](https://github.com/anthropics/knowledge-work-plugins)에서 확인할 수 있습니다.

## 마무리

Anthropic의 Knowledge Work Plugins는 AI를 업무 도구로 활용하는 방식을 한 단계 끌어올립니다. 단순한 질문-답변을 넘어, Claude가 **각 분야 전문가처럼** 맥락을 이해하고 업무를 지원합니다.

마케터, 영업 담당자, 데이터 분석가 등 어떤 역할이든 Knowledge Work Plugins로 Claude를 **나만의 전문가 어시스턴트**로 만들어 보세요.

---

**관련 링크**:
- [GitHub: anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins)
- [Claude Code 공식 문서](https://docs.anthropic.com/claude-code)
