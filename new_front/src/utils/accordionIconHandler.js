export function AccordionIconRotation(contentId, buttonSelector) {
    const accordionContent = document.getElementById(contentId);
    const button = document.querySelector(buttonSelector);
  
    if (!accordionContent || !button) return;
  
    const icon = button.querySelector('.fa-chevron-down');
    if (!icon) return;
  
    // 초기 상태 설정
    if (button.getAttribute('aria-expanded') === 'true') {
      icon.classList.add('rotated');
    }
  
    // Bootstrap의 collapse 이벤트를 이용한 상태 변경
    accordionContent.addEventListener('shown.bs.collapse', () => {
      icon.classList.add('rotated');
    });
  
    accordionContent.addEventListener('hidden.bs.collapse', () => {
      icon.classList.remove('rotated');
    });
  }
  

// export function AccordionIconRotation(accordionContentId, buttonSelector) {
//     const accordionContent = document.getElementById(accordionContentId);
//     const button = document.querySelector(buttonSelector);
//     if (!accordionContent || !button) return;
  
//     const icon = button.querySelector('.fa-chevron-down');
//     if (!icon) return;
  
//     accordionContent.addEventListener('shown.bs.collapse', () => {
//       icon.classList.add('rotated');
//     });
  
//     accordionContent.addEventListener('hidden.bs.collapse', () => {
//       icon.classList.remove('rotated');
//     });
// }
  