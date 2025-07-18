// 전역 변수들을 먼저 선언
let heroSection;

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 참조 설정
    heroSection = document.getElementById('heroSection');
    
    // 히어로 섹션 높이는 그대로 유지 (100vh)
    
    // 모든 초기화 함수 실행
    initScrollEvents();
    initSwiperMenus(); // 모든 스와이퍼 초기화
    initIngredientClick();
});

function initScrollEvents() {
    let isScrollLocked = false;
    let currentStage = 0; // 0: 초기, 1: 강아지, 2: 고양이, 3: 완료
    
    // 애니메이션 완료를 감지하는 함수
    function waitForAnimationComplete() {
        return new Promise(resolve => {
            setTimeout(resolve, 1000);
        });
    }
    
    // 스크롤 잠금/해제 함수
    function setScrollLock(locked) {
        isScrollLocked = locked;
    }
    
    // 다음 단계로 이동하는 함수
    async function goToNextStage() {
        if (isScrollLocked) return;
        
        setScrollLock(true);
        
        if (currentStage === 0) {
            // 초기 → 강아지
            currentStage = 1;
            heroSection.classList.add('dog-focus');
            await waitForAnimationComplete();
        } else if (currentStage === 1) {
            // 강아지 → 고양이
            currentStage = 2;
            heroSection.classList.remove('dog-focus');
            heroSection.classList.add('cat-focus');
            await waitForAnimationComplete();
        } else if (currentStage === 2) {
            // 고양이 → 다음 섹션으로 스크롤
            currentStage = 3;
            setScrollLock(false); // 잠금만 해제하고 자연스러운 스크롤 허용
            return;
        }
        
        setScrollLock(false);
    }
    
    // 이전 단계로 이동하는 함수
    async function goToPrevStage() {
        if (isScrollLocked) return;
        
        // 이미 다음 섹션에 있으면 히어로 섹션으로 돌아가기
        if (currentStage === 3) {
            currentStage = 2;
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            setTimeout(() => {
                heroSection.classList.add('cat-focus');
            }, 300);
            return;
        }
        
        setScrollLock(true);
        
        if (currentStage === 2) {
            // 고양이 → 강아지
            currentStage = 1;
            heroSection.classList.remove('cat-focus');
            heroSection.classList.add('dog-focus');
            await waitForAnimationComplete();
        } else if (currentStage === 1) {
            // 강아지 → 초기
            currentStage = 0;
            heroSection.classList.remove('dog-focus');
            await waitForAnimationComplete();
        } else if (currentStage === 0) {
            // 이미 맨 위
            setScrollLock(false);
            return;
        }
        
        setScrollLock(false);
    }
    
    window.addEventListener('wheel', (e) => {
        // 히어로 섹션에서만 특별 처리
        if (window.scrollY < window.innerHeight * 1.1) {
            // currentStage가 3(완료)이면 정상 스크롤 허용
            if (currentStage === 3) {
                return; // preventDefault 하지 않음 - 정상 스크롤 허용
            }
            
            if (!isScrollLocked) {
                e.preventDefault();
                
                if (e.deltaY > 0) {
                    goToNextStage();
                } else {
                    goToPrevStage();
                }
            } else {
                e.preventDefault();
            }
        }
    }, { passive: false });
    
    // 키보드 이벤트
    window.addEventListener('keydown', (e) => {
        if (window.scrollY < window.innerHeight * 1.1) {
            if (e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                goToNextStage();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                goToPrevStage();
            }
        }
    });
    
    // 스크롤 이벤트 - 상태 감지
    window.addEventListener('scroll', () => {
        if (window.scrollY >= window.innerHeight * 1.1) {
            // 다음 섹션에 있음
            if (currentStage !== 3) {
                currentStage = 3;
            }
            setScrollLock(false);
            if (heroSection) {
                heroSection.classList.remove('dog-focus', 'cat-focus');
            }
        } else {
            // 히어로 섹션에 있음
            if (currentStage === 3) {
                currentStage = 2; // 다시 고양이 상태로
                heroSection.classList.add('cat-focus');
            }
        }
    });
}

// function updateScrollStage(scrollY, windowHeight) {
//     // heroSection이 존재하지 않으면 return
//     if (!heroSection) return;
    
//     // 모든 포커스 클래스 제거
//     heroSection.classList.remove('dog-focus', 'cat-focus');
    
//     // 구간을 더 길게 확장 (기존의 2배)
//     if (scrollY < windowHeight * 0.1) {
//         // 초기 상태 (0vh ~ 60vh)
//     } else if (scrollY < windowHeight * 0.5) {
//         // 강아지 포커스 상태 (60vh ~ 130vh)
//         heroSection.classList.add('dog-focus');
//     } else if (scrollY < windowHeight * 2.0) {
//         // 고양이 포커스 상태 (130vh ~ 200vh)
//         heroSection.classList.add('cat-focus');
//     }
// }

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


function initReviewSwiper() {
    // 원형 카드 배치 초기화
    initCircularReviewCards();
}

// 원형 리뷰 카드 배치 함수
function initCircularReviewCards() {
    let cardImages = [];
    let isDragging = false;
    let startAngle = 0;
    let currentRotation = 0;
    let lastMouseAngle = 0;
    const cardCount = 16;
    const visibleCardCount = 5;

    // 카드 이미지 배열 설정
    function loadCardImage() {
        cardImages = [
            'img/1.png',
            'img/2.png', 
            'img/3.png',
            'img/4.png',
            'img/5.png'
        ];
    }

    // 마우스 위치를 각도로 변환
    function getAngleFromMouse(clientX, clientY) {
        const container = document.querySelector('.circular-cards-container');
        if (!container) return 0;
        
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        
        return Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    }

    // 보이는 카드 업데이트
    function updateVisibleCards() {
        const cards = document.querySelectorAll('.review-card');
        const centerIndex = Math.round(-currentRotation / (360 / cardCount)) % cardCount;
        const normalizedCenterIndex = centerIndex < 0 ? centerIndex + cardCount : centerIndex;
        
        cards.forEach((card, index) => {
            card.classList.remove('visible');
            
            // 중앙을 기준으로 앞뒤 2개씩, 총 5개 카드가 보이도록
            const distanceFromCenter = Math.min(
                Math.abs(index - normalizedCenterIndex),
                cardCount - Math.abs(index - normalizedCenterIndex)
            );
            
            if (distanceFromCenter <= 2) {
                card.classList.add('visible');

                if (distanceFromCenter === 0) {
                card.classList.add('center-card');
                }
            }
        });
    }

    // 카드 생성 및 배치
    function createCards() {
        loadCardImage();
        
        const container = document.getElementById('reviewCardContainer');
        if (!container) return;

        const centerX = 600;
        const centerY = 600;
        const radius = 620;

        for (let i = 0; i < cardCount; i++) {
            const card = document.createElement('div');
            card.className = 'review-card';
            
            // 각도 계산 (12시 방향부터 시작)
            const angle = (360 / cardCount) * i - 90;
            const radian = (angle * Math.PI) / 180;
            
            const x = centerX + Math.cos(radian) * radius;
            const y = centerY + Math.sin(radian) * radius;
            
            card.style.left = (x - 125) + 'px';
            card.style.top = (y - 162.5) + 'px';
            
            // 카드가 중앙을 향하도록 회전
            const rotationAngle = angle + 90;
            card.style.transform = `rotate(${rotationAngle}deg)`;
            
            // 5개 이미지를 순환해서 사용
            const imageIndex = i % 5;
            const cardImageSrc = cardImages[imageIndex];
            
            card.innerHTML = `
                <img src="${cardImageSrc}" alt="고객 리뷰${i + 1}" onerror="this.style.display='none'">
            `;
            
            // 카드 클릭 이벤트
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log(`리뷰 카드 ${i + 1} 클릭됨`);
            });
            
            container.appendChild(card);
            
            setTimeout(() => {
                card.classList.add('dealing');
            }, i * 100);
        }

        // currentRotation = -(360 / cardCount);
        
        // 초기 보이는 카드 설정
        setTimeout(() => {
            updateVisibleCards();
        }, cardCount * 100 + 1000);
    }

    // 드래그 이벤트
    function handleMouseDown(e) {
        const container = document.querySelector('.circular-cards-container');
        if (!container || !container.contains(e.target)) return;
        
        isDragging = true;
        startAngle = getAngleFromMouse(e.clientX, e.clientY);
        lastMouseAngle = startAngle;
        const hint = document.querySelector('.drag-hint');
        if (hint) hint.style.display = 'none';
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        
        const mouseAngle = getAngleFromMouse(e.clientX, e.clientY);
        let deltaAngle = mouseAngle - lastMouseAngle;
        
        // 각도 차이가 180도보다 크면 반대 방향으로 계산
        if (deltaAngle > 180) deltaAngle -= 360;
        if (deltaAngle < -180) deltaAngle += 360;
        
        currentRotation += deltaAngle;
        lastMouseAngle = mouseAngle;
        
        const container = document.getElementById('reviewCardContainer');
        if (container) {
            container.style.transform = `rotate(${currentRotation}deg)`;
        }
        
        updateVisibleCards();
    }

    function handleMouseUp() {
        isDragging = false;
        
        // 스냅 기능: 가장 가까운 카드 위치로 맞춤
        const snapAngle = 360 / cardCount;
        const snappedRotation = Math.round(currentRotation / snapAngle) * snapAngle;
        currentRotation = snappedRotation;
        
        const container = document.getElementById('reviewCardContainer');
        if (container) {
            container.style.transform = `rotate(${currentRotation}deg)`;
        }
        
        updateVisibleCards();
    }

    // 이벤트 리스너 등록 (마우스 드래그만)
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 페이지 로드시 카드 생성
    createCards();

    console.log('원형 리뷰 카드 초기화 완료');
}