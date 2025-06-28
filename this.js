// 전역 변수들을 먼저 선언
let scrollStage = 0;
let heroSection;
let isScrolling = false;

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 참조 설정
    heroSection = document.getElementById('heroSection');
    
    // 페이지 로드 시 스크롤 잠금
    document.body.classList.add('scroll-locked');
    
    // 모든 초기화 함수 실행
    initScrollEvents();
    initSynchronizedScroll();
    initHorizontalWheelScroll();
    initDragScroll();
    initIngredientClick();
});

// 스크롤 관련 이벤트 초기화
function initScrollEvents() {
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

    // 키보드 네비게이션
    window.addEventListener('keydown', (e) => {
        // 스크롤 가능한 상태에서는 키보드 네비게이션 비활성화
        if (heroSection.classList.contains('scrollable')) {
            return;
        }
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (scrollStage < 2) {
                scrollStage++;
                updateStage();
            } else if (scrollStage === 2) {
                // 고양이 상태에서 한 번 더 누르면 일반 스크롤로 전환
                document.body.classList.remove('scroll-locked');
                heroSection.classList.add('scrollable');
                scrollStage = 3; // 상태 업데이트
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            if (scrollStage > 0) {
                scrollStage--;
                updateStage();
            }
        }
    });

    // 메인 휠 이벤트 처리
    window.addEventListener('wheel', (e) => {
        // heroSection이 존재하지 않으면 return
        if (!heroSection) return;
        
        // 메뉴 스크롤 영역에서는 기존 스크롤 로직을 건너뛰기
        const dogImages = document.querySelector('.dog-images-scroll');
        const catImages = document.querySelector('.cat-images-scroll');
        
        if ((dogImages && dogImages.matches(':hover')) || (catImages && catImages.matches(':hover'))) {
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
            if (scrollStage < 2) {
                scrollStage++;
                updateStage();
            } else if (scrollStage === 2) {
                // 고양이 상태에서 한 번 더 스크롤하면 일반 스크롤로 전환
                document.body.classList.remove('scroll-locked');
                heroSection.classList.add('scrollable');
                scrollStage = 3; // 상태 업데이트
                isScrolling = false; // 즉시 해제
                return; // 일반 스크롤 허용
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
}

function updateStage() {
    // heroSection이 존재하지 않으면 return
    if (!heroSection) return;
    
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

// =====대표메뉴 가로스크롤===== //
// 동기화 스크롤 기능
function initSynchronizedScroll() {
    const dogImagesScroll = document.querySelector('.dog-images-scroll');
    const dogInfoScroll = document.querySelector('.dog-info-scroll');
    const catImagesScroll = document.querySelector('.cat-images-scroll');
    const catInfoScroll = document.querySelector('.cat-info-scroll');
    
    // 강아지 메뉴 동기화
    if (dogImagesScroll && dogInfoScroll) {
        dogImagesScroll.addEventListener('scroll', () => {
            dogInfoScroll.scrollLeft = dogImagesScroll.scrollLeft;
        });
    }
    
    // 고양이 메뉴 동기화
    if (catImagesScroll && catInfoScroll) {
        catImagesScroll.addEventListener('scroll', () => {
            catInfoScroll.scrollLeft = catImagesScroll.scrollLeft;
        });
    }
}

// 마우스 휠로 가로 스크롤 기능
function initHorizontalWheelScroll() {
    const scrollContainers = document.querySelectorAll('.dog-images-scroll, .cat-images-scroll');
    
    scrollContainers.forEach(container => {
        container.addEventListener('wheel', (e) => {
            // 컨테이너 위에 마우스가 있을 때만 작동
            if (container.matches(':hover')) {
                e.preventDefault();
                
                // 휠 델타 값에 따라 스크롤 속도 조정
                const scrollAmount = e.deltaY * 0.8;
                container.scrollLeft += scrollAmount;
            }
        }, { passive: false });
    });
}

// 터치 및 드래그 스크롤 지원
function initDragScroll() {
    const scrollContainers = document.querySelectorAll('.dog-images-scroll, .cat-images-scroll');
    
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

// 식재료 데이터
const ingredientData = {
    chicken: {
        image: 'img/닭고기.png',
        text: '바르게 기른 동물복지 생닭고기를<br>사용하고 반려동물 첨가물 원칙을<br>지켜 올바 식단을 만듭니다.'
    },
    salmon: {
        image: 'img/생연어.png',
        text: '자연담은 힘찬 연어 노르웨이산<br>연어로 싱싱함이 더해 옳바른<br>식단을 만드는데 주된 재료입니다.'
    },
    tea: {
        image: 'img/차전자피.png',
        text: '수의사가 제안하는 기능별<br>건강케어에 들어가는 차전자피<br>반려동물들의 변비를 치료합니다.'
    },
    egg: {
        image: 'img/달걀.png',
        text: '동물복지 농장에서 바르게 자란<br>닭들이 낳은 달걀을 사용해<br>자연담은 식단을 만듭니다.'
    },
    turkey: {
        image: 'img/칠면조.png',
        text: '바르게 기른 칠면조 고기를<br>사용하고 반려동물 첨가물<br>원칙을 지켜 식단을 만듭니다.'
    },
    salad: {
        image: 'img/야채.png',
        text: '내과 전문 수의사가 바르게<br>키운 채소들을 사용해 레시피를<br>설계하여 건강담은 식단을 만듭니다.'
    }
};

// 원형 버튼 클릭 이벤트 초기화
function initIngredientClick() {
    const circleButtons = document.querySelectorAll('.circle-button');
    const ingredientImg = document.getElementById('ingredient-image');
    const ingredientContainer = document.querySelector('.click-recommend-img');
    const bubbleText = document.querySelector('.bubble-text');

    // 요소들이 존재하는지 확인
    if (!circleButtons.length || !ingredientImg || !ingredientContainer || !bubbleText) {
        console.warn('일부 식재료 클릭 요소들을 찾을 수 없습니다.');
        return;
    }

    circleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ingredient = this.getAttribute('data-ingredient');
            const data = ingredientData[ingredient];

            if (data) {
                // 모든 버튼에서 active 클래스 제거
                circleButtons.forEach(btn => btn.classList.remove('active'));
                
                // 클릭된 버튼에 active 클래스 추가
                this.classList.add('active');

                // 이미지 변경
                ingredientImg.src = data.image;
                ingredientImg.alt = ingredient;

                // 이미지 컨테이너 표시
                ingredientContainer.classList.add('show');

                // 말풍선 텍스트 변경
                bubbleText.innerHTML = data.text;
            }
        });
    });
}