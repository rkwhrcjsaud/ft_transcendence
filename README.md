# FT_TRANSCENDENCE

## 필수 요구 사항
- Docker 및 Docker-Compose 설치
- Node.js 및 npm 설치
- python 및 pip 설치

## node.js 의존성 설치
- cd front
- npm install

## python 가상 환경 설정
- cd back
- python -m venv venv
- source venv/bin/activate

## backend 의존성 설치
- pip install -r requirements.txt

## 협업을 위한 GitHub 관리 규칙 & Git 컨벤션

### 1. 원본 레포를 Fork하여 내 레포에 생성

1. 원본(메인) 레포지토리를 **Fork**하여 내 GitHub 계정에 복사합니다.
2. **원본 레포**를 fork한 후, 로컬 환경에 해당 레포지토리를 클론합니다.

### 2. Git 초기화 및 Remote 설정

1. 원하는 디렉토리에서 `git init` 명령어로 Git을 초기화합니다.

    ```bash
    git init
    ```

2. 원본(메인) 레포를 **upstream**으로 설정하여, 최신 변경사항을 반영할 수 있도록 합니다.

    ```bash
    git remote add upstream <원본 레포 주소>
    ```

3. 내 레포를 **origin**으로 설정하여, 내 로컬 레포지토리와 연결합니다.

    ```bash
    git remote add origin <내 레포 주소>
    ```

> **작업 절차**  
> - 작업을 진행할 시 **upstream**에서 `pull`을 받아오고, **origin**으로 `push`하여 PR을 진행합니다.

---

### 3. 이슈 관리

1. **이슈 생성**
    - 원본 레포에서 **New issue**를 클릭하여 이슈를 생성합니다.
    - 이슈 한 개는 보통 **뷰 하나** 기준으로 만듭니다.
    - 이슈 제목: **[라벨이름] (동사원형) (작업주제)**  
      예) `[Feat] 생성 MainView` / `[Asset] 추가 color set`
    - 이슈 템플릿에 TODO 항목을 작성하여 작업 항목을 쪼개서 기재합니다.

---

### 4. 브랜치 및 작업 절차

1. **브랜치 생성**  
   이슈가 생성되면 해당 이슈 번호에 맞는 브랜치를 로컬에서 생성합니다.  
   - 브랜치 이름: `타입/#이슈번호`  
     예) `feat/#1`, `bug/#2`

    ```bash
    git branch feat/#1    // 이슈 번호 1에 해당하는 브랜치 생성
    ```

2. **브랜치 전환 및 작업**  
   해당 브랜치로 이동하여 작업을 진행합니다.

    ```bash
    git switch feat/#1    // 해당 브랜치로 이동
    ```

3. **변경 사항 커밋**  
   작업이 끝난 후, `git add`와 `git commit`을 사용하여 변경 사항을 커밋합니다.  
   - 커밋 메시지: **타입/#이슈번호: 커밋메시지**  
     예) `[Feat/#1] MainView 화면 생성`

    ```bash
    git add .    // 변경 사항을 스테이징
    git commit -m "[Feat/#1] MainView 화면 생성"    // 커밋 메시지 작성
    ```

4. **업스트림에서 최신 변경사항 반영**  
   다른 사람이 작업한 변경사항을 반영하기 위해 `upstream`에서 `pull`을 진행합니다.

    ```bash
    git pull upstream develop    // 원본 레포의 최신 변경사항을 로컬로 반영
    ```

5. **원격 레포로 푸시**  
   로컬 브랜치에서 작업이 끝나면 `origin`에 푸시합니다.

    ```bash
    git push -u origin feat/#1    // 해당 브랜치에 푸시
    ```

---

### 5. Pull Request(PR) 관리

1. **PR 생성**  
   작업이 완료되면 Pull Request를 생성합니다.  
   - PR 제목은 **이슈 제목과 동일하게** 작성합니다.
   - PR 템플릿을 사용하여 내용을 채웁니다.  
   - **이슈 번호**와 **라벨**을 추가합니다.
   - PR을 작성할 때, **리뷰어**는 자신을 제외한 다른 팀원들을 선택하고, **Assignees**에 자신을 추가합니다.

2. **PR 리뷰 및 머지**  
   리뷰어는 코드 변경 사항을 검토하고, 코드 스타일이나 네이밍 규칙 등을 확인합니다.  
   - 리뷰어 1명 이상의 승인이 있어야만 PR을 `merge`할 수 있습니다.
   - 리뷰어는 `Approve`를 할 때, 코드 품질과 네이밍 컨벤션을 체크합니다.

---

### 6. Git 라벨 & 커밋 타입

| **제목** | **설명** |
| --- | --- |
| **Feat** | New Feature, UI 관련 기능 추가 |
| **Bug** | 버그 수정 |
| **Docs** | 문서 수정 |
| **Asset** | 이미지, 아이콘 등 자산 추가 |
| **Fix** | 파일명 변경 또는 코드 간단한 수정 |
| **Setting** | 프로젝트 설정 변경 |

---

### 7. 브랜치 및 커밋 네이밍 규칙

#### 브랜치 네이밍
- **타입/#이슈번호** 형식으로 브랜치를 생성합니다.  
  예) `feat/#1`, `bug/#2`

#### 커밋 메시지 형식
- **타입/#이슈번호: 커밋메시지** 형식으로 작성합니다.  
  예) `[Feat/#1] MainView 화면 추가`

---

### 8. Issue 및 PR 관리

#### Issue
- 각 이슈는 보통 **뷰 하나** 기준으로 생성됩니다.
- 각 이슈에 대해 **Todo** 항목을 쪼개어 상세히 작성합니다.
- 작업이 완료되면 해당 이슈를 **닫습니다**.

#### Pull Request
- PR 제목은 **이슈 제목과 동일하게** 작성합니다.
- PR을 생성할 때 **라벨**을 이슈와 동일하게 추가합니다.
- PR 작성 시, 변경 사항에 대해 **상세한 설명**을 작성합니다.

---

### 9. 협업 시 참고 사항

1. **팀원 승인**
   - 본인 외의 다른 팀원이 PR을 승인해야 merge가 가능합니다.
   
2. **리뷰어 역할**
   - 리뷰어는 단순히 승인을 하는 것이 아니라, 코드 품질을 확인하고 네이밍 규칙을 지켰는지 등을 체크해야 합니다.

---

이 규칙을 통해 프로젝트의 품질을 유지하고, 원활한 협업을 할 수 있습니다. 각 팀원은 이 규칙을 지켜 작업하고, 문제 발생 시 서로 협력하여 해결합니다.

