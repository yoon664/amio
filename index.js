// 전역 변수들을 먼저 선언
let scrollStage = 0;
let heroSection;
let isScrolling = false;

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 참조 설정
    heroSection = document.getElementById('heroSection');
    
    // 페이지 로드 시 스크롤 잠금
    // document.body.classList.add('scroll-locked');
    
    // 모든 초기화 함수 실행
    initScrollEvents();
    initSwiperMenus(); // 모든 스와이퍼 초기화
    initIngredientClick();
    
});

// 스크롤 관련 이벤트 초기화 (기존과 동일)
function initScrollEvents() {
    // 스크롤 위치 감지하여 상태 리셋
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0 && scrollStage === 3) {
            // 맨 위로 돌아왔을 때 상태 리셋
            scrollStage = 2; // 고양이 포커스 상태로 돌아감
            heroSection.classList.remove('scrollable');
            heroSection.classList.add('cat-focus');
            // document.body.classList.add('scroll-locked');
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

// =====모든 Swiper 초기화===== //
function initSwiperMenus() {
    // Swiper CSS 동적 로드
    if (!document.querySelector('link[href*="swiper-bundle.min.css"]')) {
        const swiperCSS = document.createElement('link');
        swiperCSS.rel = 'stylesheet';
        swiperCSS.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
        document.head.appendChild(swiperCSS);
    }

    // Swiper JS 동적 로드
    if (!window.Swiper) {
        const swiperJS = document.createElement('script');
        swiperJS.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
        swiperJS.onload = () => {
            initProductSwiper(); // 기존 강아지/고양이 제품 스와이퍼
            initReviewSwiper();   // 새로운 리뷰 카드 스와이퍼
        };
        document.head.appendChild(swiperJS);
    } else {
        initProductSwiper(); // 기존 강아지/고양이 제품 스와이퍼
        initReviewSwiper();   // 새로운 리뷰 카드 스와이퍼
    }
}

// 기존 강아지/고양이 제품 스와이퍼
function initProductSwiper() {
    // 강아지 이미지 Swiper와 정보 Swiper 연동
    const dogImagesSwiper = new Swiper('.dog-images-scroll', {
        slidesPerView: 'auto',
        spaceBetween: 40,
        freeMode: {
            enabled: true,
            sticky: false,
            momentumRatio: 1,
            momentumVelocityRatio: 1,
        },
        grabCursor: true,
        mousewheel: false,
        scrollbar: {
            el: '.dog-images-scroll .swiper-scrollbar',
            draggable: true,
            dragSize: 'auto',
        },
    });

    const dogInfoSwiper = new Swiper('.dog-info-scroll', {
        slidesPerView: 'auto',
        spaceBetween: 40,
        freeMode: {
            enabled: true,
            sticky: false,
            momentumRatio: 1,
            momentumVelocityRatio: 1,
        },
        allowTouchMove: false, // 터치 비활성화 (이미지에만 반응)
        mousewheel: false,
    });

    // 강아지 이미지 ↔ 정보 동기화
    dogImagesSwiper.controller.control = dogInfoSwiper;
    dogInfoSwiper.controller.control = dogImagesSwiper;

    // 고양이 이미지 Swiper와 정보 Swiper 연동
    const catImagesSwiper = new Swiper('.cat-images-scroll', {
        slidesPerView: 'auto',
        spaceBetween: 40,
        freeMode: {
            enabled: true,
            sticky: false,
            momentumRatio: 1,
            momentumVelocityRatio: 1,
        },
        grabCursor: true,
        mousewheel: false,
        scrollbar: {
            el: '.cat-images-scroll .swiper-scrollbar',
            draggable: true,
            dragSize: 'auto',
        },
    });

    const catInfoSwiper = new Swiper('.cat-info-scroll', {
        slidesPerView: 'auto',
        spaceBetween: 40,
        freeMode: {
            enabled: true,
            sticky: false,
            momentumRatio: 1,
            momentumVelocityRatio: 1,
        },
        allowTouchMove: false, // 터치 비활성화 (이미지에만 반응)
        mousewheel: false,
    });

    // 고양이 이미지 ↔ 정보 동기화
    catImagesSwiper.controller.control = catInfoSwiper;
    catInfoSwiper.controller.control = catImagesSwiper;
}

// 리뷰 카드 스와이퍼 (중앙 정렬 + 부드러운 효과)
function initReviewSwiper() {
    // 리뷰 카드 컨테이너가 존재하는지 확인
    const reviewContainer = document.querySelector('.review-card-swiper');
    if (!reviewContainer) {
        console.warn('리뷰 카드 스와이퍼 컨테이너를 찾을 수 없습니다.');
        return;
    }

    // 자동재생 설정 (필요에 따라 변경 가능)
    const autoplayEnabled = true; // false로 변경하면 자동재생 비활성화

    const reviewSwiper = new Swiper('.review-card-swiper', {
        // 기본 설정 (중앙 정렬로 수정)
        slidesPerView: 3, // 한 번에 3개 카드 표시
        spaceBetween: -130, // 음수로 카드들이 겹치도록 설정
        centeredSlides: true, // 중앙 정렬로 변경 (새로고침 시 중앙에 위치)
        initialSlide: 0, // 첫 번째 슬라이드부터 시작 (review1)
        
        // 무한 루프 설정
        loop: true,
        loopedSlides: 5, // 실제 슬라이드 개수
        
        // 터치 설정
        grabCursor: true,
        touchRatio: 1,
        resistance: true,
        resistanceRatio: 0.85,
        
        // 슬라이드 전환 설정 (더 부드럽게)
        slidesPerGroup: 1, // 한 번에 1개씩 이동
        speed: 1000, // 조금 더 느리게 (부드러운 효과)
        
        // 부드러운 전환을 위한 설정
        freeMode: false,
        freeModeSticky: false,
        
        // 자동 재생 (조건부 설정)
        ...(autoplayEnabled && {
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            }
        }),
        
        // 이벤트 콜백
        on: {
            init: function() {
                console.log('리뷰 카드 스와이퍼 초기화됨');
                console.log('초기 순서: review1, review2, review3, review4, review5');
                console.log('중앙 정렬 활성화됨');
            },
            slideChange: function () {
                const currentReview = this.realIndex + 1;
                console.log('현재 리뷰 슬라이드:', currentReview);
            }
        },
    });

    console.log('리뷰 카드 스와이퍼 초기화 완료');
    return reviewSwiper;
}

// 식재료 데이터 (기존과 동일)
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

// 원형 버튼 클릭 이벤트 초기화 (기존과 동일)
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

    console.log('식재료 클릭 이벤트 초기화 완료');
}