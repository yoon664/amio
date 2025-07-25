// 전역 변수들을 먼저 선언
let heroSection;

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 참조 설정
    heroSection = document.getElementById('heroSection');
    
    // 히어로 섹션 높이를 250vh로 설정 (여유 있는 애니메이션)
    if (heroSection) {
        heroSection.style.minHeight = '250vh';
        // 초기 요소들이 첫 화면(100vh)에 제대로 배치되도록 설정
        heroSection.style.position = 'relative';
    }
    
    // 모든 초기화 함수 실행
    initScrollEvents();
    initSwiperMenus(); // 모든 스와이퍼 초기화
    initIngredientClick();
});

function initScrollEvents() {
    // 스크롤 기반 애니메이션 함수
    function updateScrollAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // 첫 화면(100vh)까지는 애니메이션 적용하지 않음
        // 100vh ~ 250vh 구간에서 애니메이션 (총 150vh 구간)
        const animationStart = windowHeight * 0; // 바로 시작
        const animationRange = windowHeight * 2.2; // 220vh까지 애니메이션
        
        // 스크롤 진행도 계산 (0 ~ 1)
        const scrollProgress = Math.max(0, Math.min((scrollY - animationStart) / animationRange, 1));
        
        // main-table도 스크롤에 따라 이동
        updateMainTable(scrollProgress);
        
        // 각 단계별 진행도 계산
        // 0 ~ 0.33: 초기 → 강아지 포커스
        // 0.33 ~ 0.66: 강아지 → 고양이 포커스  
        // 0.66 ~ 1: 고양이 → 다음 섹션
        
        const dogProgress = Math.max(0, Math.min((scrollProgress - 0) / 0.33, 1));
        const catProgress = Math.max(0, Math.min((scrollProgress - 0.33) / 0.33, 1));
        const exitProgress = Math.max(0, Math.min((scrollProgress - 0.66) / 0.34, 1));
        
        updateMainTable(scrollProgress);
        updateDogFocus(dogProgress);
        updateCatFocus(catProgress, dogProgress);
        updateExitTransition(exitProgress);
    }
    
    // main-table 스크롤 따라 이동
    function updateMainTable(progress) {
        const mainTable = document.querySelector('.main-table');
        if (!mainTable) return;
        
        // 스크롤에 따라 테이블이 자연스럽게 아래로 이동 (더 부드럽게)
        const translateY = progress * 30; // 30vh만큼 아래로 이동
        mainTable.style.transform = `translateY(${translateY}vh)`;
        
        // 투명도는 거의 변하지 않게
        const opacity = 1 - (progress * 0.1); // 10%만 투명해짐
        mainTable.style.opacity = Math.max(0.9, opacity);
    }
    
    // 강아지 포커스 애니메이션
    function updateDogFocus(progress) {
        const dogArea = document.querySelector('.dog-area');
        const character = document.querySelector('.character');
        const catTower = document.querySelector('.cat-tower');
        const logo = document.querySelector('.logo');
        const subtitle = document.querySelector('.subtitle-img');
        const speechBubble = document.querySelector('.speech-bubble-container');
        const dogFocusImage = document.querySelector('.dog-focus-image');
        
        if (!dogArea || !character || !catTower) return;
        
        // progress가 0이면 애니메이션 적용하지 않음
        if (progress === 0) return;
        
        // 강아지가 앞으로 나오면서 커지는 애니메이션
        const dogScale = 1 + (progress * 0.5); // 1.0 → 1.5
        const dogTranslateX = progress * -150; // 0% → -150%
        const dogTranslateY = progress * 10; // 0% → 10%
        
        dogArea.style.transform = `scale(${dogScale}) translateX(${dogTranslateX}%) translateY(${dogTranslateY}%)`;
        dogArea.style.zIndex = progress > 0.1 ? 30 : '';
        
        // 캐릭터가 뒤로 물러나면서 투명해짐
        const characterScale = 1 + (progress * 0.8); // 1.0 → 1.8
        const characterTranslateX = progress * -100; // 0% → -100%
        const characterOpacity = 1 - progress; // 1 → 0
        
        character.style.transform = `scale(${characterScale}) translateX(${characterTranslateX}%)`;
        character.style.opacity = characterOpacity;
        
        // 고양이 타워도 살짝 뒤로
        const catTowerScale = 1 + (progress * 0.8);
        const catTowerTranslateX = progress * -115;
        const catTowerOpacity = 1 - (progress * 0.3); // 1 → 0.7
        
        catTower.style.transform = `scale(${catTowerScale}) translateX(${catTowerTranslateX}%)`;
        catTower.style.opacity = catTowerOpacity;
        
        // 로고와 서브타이틀 투명해짐
        const logoOpacity = 1 - (progress * 0.7); // 1 → 0.3
        if (logo) logo.style.opacity = logoOpacity;
        if (subtitle) subtitle.style.opacity = logoOpacity;
        
        // 말풍선 사라짐
        if (speechBubble) {
            speechBubble.style.opacity = 1 - progress;
            speechBubble.style.pointerEvents = progress > 0.5 ? 'none' : '';
        }
        
        // 강아지 포커스 이미지 나타남
        if (dogFocusImage) {
            const imageOpacity = Math.max(0, (progress - 0.3) / 0.7); // 30% 지점부터 나타남
            const imageTranslateY = (1 - imageOpacity) * 30;
            
            dogFocusImage.style.opacity = imageOpacity;
            dogFocusImage.style.transform = `translate(-50%, -50%) translateY(${imageTranslateY}px) scale(1)`;
        }
    }
    
    // 고양이 포커스 애니메이션
    function updateCatFocus(catProgress, dogProgress) {
        const dogArea = document.querySelector('.dog-area');
        const character = document.querySelector('.character');
        const catTower = document.querySelector('.cat-tower');
        const dogFocusImage = document.querySelector('.dog-focus-image');
        const catFocusImage = document.querySelector('.cat-focus-image');
        
        if (!dogArea || !catTower) return;
        
        // 강아지가 완전히 뒤로 사라짐
        if (catProgress > 0) {
            const dogExitScale = 1.5 + (catProgress * 0.3); // 1.5 → 1.8
            const dogExitTranslateX = -150 + (catProgress * 250); // -150% → 100%
            const dogExitOpacity = 1 - catProgress; // 1 → 0
            
            dogArea.style.transform = `scale(${dogExitScale}) translateX(${dogExitTranslateX}%) translateY(10%)`;
            dogArea.style.opacity = dogExitOpacity;
        }
        
        // 고양이 타워가 앞으로 나옴
        const catScale = (1 + dogProgress * 0.8) + (catProgress * 1.0); // 현재 스케일 + 추가 확대
        const catTranslateX = (-115 + dogProgress * 115) + (catProgress * 101); // -115% → -14%
        const catTranslateY = catProgress * 60; // 0% → 60%
        const catOpacity = Math.min(1, (1 - dogProgress * 0.3) + (catProgress * 0.3)); // 0.7 → 1.0
        
        catTower.style.transform = `scale(${catScale}) translateX(${catTranslateX}%) translateY(${catTranslateY}%)`;
        catTower.style.opacity = catOpacity;
        catTower.style.zIndex = catProgress > 0.1 ? 20 : 'auto';
        
        // 강아지 포커스 이미지 사라짐
        if (dogFocusImage && catProgress > 0) {
            const dogImageOpacity = 1 - catProgress;
            dogFocusImage.style.opacity = dogImageOpacity;
        }
        
        // 고양이 포커스 이미지 나타남
        if (catFocusImage && catProgress > 0) {
            const catImageOpacity = Math.max(0, (catProgress - 0.3) / 0.7);
            const catImageTranslateY = (1 - catImageOpacity) * 30;
            
            catFocusImage.style.opacity = catImageOpacity;
            catFocusImage.style.transform = `translate(-50%, -50%) translateY(${catImageTranslateY}px) scale(1)`;
        }
    }
    
    // 마지막 단계 - 다음 섹션으로의 전환
    function updateExitTransition(exitProgress) {
        const catTower = document.querySelector('.cat-tower');
        const catFocusImage = document.querySelector('.cat-focus-image');
        const logo = document.querySelector('.logo');
        const subtitle = document.querySelector('.subtitle-img');
        
        if (exitProgress > 0) {
            // 모든 요소들이 서서히 사라짐
            const fadeOpacity = 1 - exitProgress;
            
            if (catTower) {
                catTower.style.opacity = Math.max(0, fadeOpacity);
                // 살짝 축소되면서 사라짐
                const currentScale = parseFloat(catTower.style.transform.match(/scale\(([^)]+)\)/)?.[1] || 1.8);
                const exitScale = currentScale - (exitProgress * 0.3);
                const currentTransform = catTower.style.transform || '';
                catTower.style.transform = currentTransform.replace(/scale\([^)]+\)/, `scale(${exitScale})`);
            }
            
            if (catFocusImage) {
                catFocusImage.style.opacity = Math.max(0, fadeOpacity);
            }
            
            if (logo) {
                logo.style.opacity = Math.max(0.3, fadeOpacity);
            }
            
            if (subtitle) {
                subtitle.style.opacity = Math.max(0.3, fadeOpacity);
            }
        }
    }
    
    // 스크롤 이벤트 리스너 - 성능 최적화
    let ticking = false;
    
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollAnimations();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // 초기 상태 설정
    updateScrollAnimations();
}

// ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss

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
    // 강아지 통합 제품 스와이퍼 (이미지 + 정보 결합)
    const dogProductsSwiper = new Swiper('.dog-products-scroll', {
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
            el: '.dog-products-scroll .swiper-scrollbar',
            draggable: true,
            dragSize: 'auto',
        },
    });

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
            card.classList.remove('visible', 'center-card');
            
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

    // 이벤트 리스너 등록
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 페이지 로드시 카드 생성
    createCards();

    console.log('원형 리뷰 카드 초기화 완료');
}