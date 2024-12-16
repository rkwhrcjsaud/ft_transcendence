// 문자가 알파벳일때만 필터링해서 roboto mono로 강제 지정

document.addEventListener("DOMContentLoaded", () => {
  // 모든 텍스트 노드를 검색
  function applyFontStyle(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // 텍스트에서 알파벳이 포함되어 있는지 확인
      const parent = node.parentElement;
      if (/[a-zA-Z]/.test(node.nodeValue)) {
        parent.classList.add("font-roboto"); // 영어 폰트 적용, global.css에서 정의
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // 자식 노드 재귀적으로 탐색
      node.childNodes.forEach(applyFontStyle);
    }
  }

  // Body의 모든 자식 노드에 폰트 스타일 적용 (네비게이션바 포함)
  applyFontStyle(document.body);
});
