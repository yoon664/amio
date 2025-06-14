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


// 대표메뉴 가로 스크롤 기능
function initHorizontalScroll() {
    const dogScrollContainer = document.querySelector('.dog-menu-scroll');
    const catScrollContainer = document.querySelector('.cat-menu-scroll');
    
    function handleWheelScroll(e, container) {
        // 컨테이너 위에 마우스가 있을 때만 작동
        if (container.matches(':hover')) {
            e.preventDefault();
            
            // 휠 델타 값에 따라 스크롤 속도 조정
            const scrollAmount = e.deltaY * 0.8;
            container.scrollLeft += scrollAmount;
        }
    }
    
    // 강아지 메뉴 스크롤 이벤트
    if (dogScrollContainer) {
        dogScrollContainer.addEventListener('wheel', (e) => {
            handleWheelScroll(e, dogScrollContainer);
        }, { passive: false });
    }
    
    // 고양이 메뉴 스크롤 이벤트
    if (catScrollContainer) {
        catScrollContainer.addEventListener('wheel', (e) => {
            handleWheelScroll(e, catScrollContainer);
        }, { passive: false });
    }
}

// 터치 스크롤 지원 (모바일)
function initTouchScroll() {
    const scrollContainers = document.querySelectorAll('.dog-menu-scroll, .cat-menu-scroll');
    
    scrollContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.style.cursor = 'grabbing';
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
        
        // 초기 커서 설정
        container.style.cursor = 'grab';
    });
}

// 스크롤 위치 표시 (선택사항)
function addScrollIndicator() {
    const scrollContainers = document.querySelectorAll('.dog-menu-scroll, .cat-menu-scroll');
    
    scrollContainers.forEach(container => {
        container.addEventListener('scroll', () => {
            const scrollPercentage = (container.scrollLeft / (container.scrollWidth - container.clientWidth)) * 100;
            
        
        });
    });
}

// 페이지 로드 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    initHorizontalScroll();
    initTouchScroll();
    addScrollIndicator();
});

// 기존 스크롤 이벤트와 충돌하지 않도록 수정
window.addEventListener('wheel', (e) => {
    // 메뉴 스크롤 영역에서는 기존 스크롤 로직을 건너뛰기
    const dogMenu = document.querySelector('.dog-menu-scroll');
    const catMenu = document.querySelector('.cat-menu-scroll');
    
    if ((dogMenu && dogMenu.matches(':hover')) || (catMenu && catMenu.matches(':hover'))) {
        return; // 가로 스크롤 처리로 위임
    }
    
    // 기존 스크롤 로직 실행
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