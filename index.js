
let scrollStage = 0;
const heroSection = document.getElementById('heroSection');
let isScrolling = false;

// 스크롤 이벤트 처리
window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // 다음 섹션에 도달했는지 확인
    if (scrollPosition >= windowHeight * 2.5) {
        return; // 다음 섹션에서는 스크롤 효과 비활성화
    }
    
    e.preventDefault();
    isScrolling = true;
    
    if (e.deltaY > 0) { // 아래로 스크롤
        if (scrollStage < 3) {
            scrollStage++;
            updateStage();
        }
    } else { // 위로 스크롤
        if (scrollStage > 0) {
            scrollStage--;
            updateStage();
        }
    }
    
    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}, { passive: false });

function updateStage() {
    // 모든 포커스 클래스 제거
    heroSection.classList.remove('dog-focus', 'cat-focus');
    
    switch(scrollStage) {
        case 0: // 초기 상태 (staff 중앙)
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            break;
        case 1: // 강아지 포커스
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            heroSection.classList.add('dog-focus');
            break;
        case 2: // 고양이 포커스
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            heroSection.classList.add('cat-focus');
            break;
        case 3: // 다음 섹션으로 이동
            window.scrollTo({
                top: window.innerHeight * 3,
                behavior: 'smooth'
            });
            break;
    }
}

// 키보드 네비게이션
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (scrollStage < 3) {
            scrollStage++;
            updateStage();
        }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        if (scrollStage > 0) {
            scrollStage--;
            updateStage();
        }
    }
});