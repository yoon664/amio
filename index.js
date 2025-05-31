let scrollStage = 0;
const heroSection = document.getElementById('heroSection');
let isScrolling = false;

// 페이지 로드 시 스크롤 잠금
document.body.classList.add('scroll-locked');

// 스크롤 위치 감지하여 상태 리셋
window.addEventListener('scroll', () => {
    if (window.scrollY === 0 && scrollStage === 3) {
        // 맨 위로 돌아왔을 때 상태 리셋
        scrollStage = 2; // 고양이 포커스 상태로 돌아감
        heroSection.classList.remove('scrollable');
        heroSection.classList.add('cat-focus');
        document.body.classList.add('scroll-locked');
    }
});

// 스크롤 이벤트 처리
window.addEventListener('wheel', (e) => {
    if (isScrolling) return;
    
    // 스크롤 가능한 상태에서는 일반 스크롤 허용
    if (heroSection.classList.contains('scrollable')) {
        return;
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
    heroSection.classList.remove('dog-focus', 'cat-focus', 'scrollable');
    
    switch(scrollStage) {
        case 0: // 초기 상태 (staff 중앙)
            break;
        case 1: // 강아지 포커스
            heroSection.classList.add('dog-focus');
            break;
        case 2: // 고양이 포커스
            heroSection.classList.add('cat-focus');
            break;
        case 3: // 스크롤 가능한 상태로 변경
            heroSection.classList.add('scrollable');
            document.body.classList.remove('scroll-locked'); // 스크롤 잠금 해제
            break;
    }
}

// 키보드 네비게이션
window.addEventListener('keydown', (e) => {
    // 스크롤 가능한 상태에서는 키보드 네비게이션 비활성화
    if (heroSection.classList.contains('scrollable')) {
        return;
    }
    
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