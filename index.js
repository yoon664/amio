
let heroSection;

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    // DOM 요소 참조 설정
    heroSection = document.getElementById('heroSection');

    if (heroSection) {
        heroSection.style.minHeight = '200vh';
        heroSection.style.position = 'relative';
        
        const mainContent = heroSection.querySelector('.main-content');
        const mainTable = heroSection.querySelector('.main-table');
        const hangingLights = heroSection.querySelector('.hanging-lights');
        const plants = heroSection.querySelector('.plants');
        const navContainer = heroSection.querySelector('.nav-container');
        
        // 요소 100vh에 고정
        if (mainContent) {
            mainContent.style.position = 'absolute';
            mainContent.style.height = '100vh';
        }
        if (mainTable) {
            mainTable.style.position = 'absolute';
        }
        if (hangingLights) {
            hangingLights.style.position = 'absolute';
            hangingLights.style.height = '100vh';
        }
        if (plants) {
            plants.style.position = 'absolute';
            plants.style.height = '100vh';
        }
        if (navContainer) {
            navContainer.style.position = 'absolute';
        }
    }
    
    initScrollEvents();
    initSwiperMenus();
    initIngredientClick();
});

function initScrollEvents() {
    // 스크롤 기반 애니메이션 함수
    function updateScrollAnimations() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        

        const animationStart = windowHeight * 0.2; // 50vh부터
        const animationRange = windowHeight * 1.4; // 140vh 구간으로 애니메이션
        
        // 50vh 이전에는 완전히 기존 배치 유지
        if (scrollY < animationStart) {
            resetToInitialState();
            return;
        }
        
        // 스크롤 진행도 계산 (0 ~ 1)
        const scrollProgress = Math.max(0, Math.min((scrollY - animationStart) / animationRange, 1));
        

        const dogStart = 0;      // 강아지 시작점 (0%)
        const dogDuration = 0.5; // 강아지 애니메이션 길이 (50%)
        const catStart = 0.4;    // 고양이 시작점 (40%) - 강아지와 약간 겹침
        const catDuration = 0.6; // 고양이 애니메이션 길이 (60%)
        
        const dogProgress = Math.max(0, Math.min((scrollProgress - dogStart) / dogDuration, 1));
        const catProgress = Math.max(0, Math.min((scrollProgress - catStart) / catDuration, 1));
        
        updateMainTable(scrollProgress);
        updateDogFocus(dogProgress);
        updateCatFocus(catProgress, dogProgress);
    }
    
    // 모든 요소를 완전히 초기 상태로 리셋
    function resetToInitialState() {
        const dogArea = document.querySelector('.dog-area');
        const character = document.querySelector('.character');
        const catTower = document.querySelector('.cat-tower');
        const logo = document.querySelector('.logo');
        const subtitle = document.querySelector('.subtitle-img');
        const speechBubble = document.querySelector('.speech-bubble-container');
        const dogFocusImage = document.querySelector('.dog-focus-image');
        const catFocusImage = document.querySelector('.cat-focus-image');
        const mainTable = document.querySelector('.main-table');
        
        // 모든 인라인 스타일 제거하여 CSS 기본값으로 완전 복원
        if (dogArea) {
            dogArea.style.transform = '';
            dogArea.style.zIndex = '';
            dogArea.style.opacity = '';
        }
        if (character) {
            character.style.transform = '';
            character.style.opacity = '';
        }
        if (catTower) {
            catTower.style.transform = '';
            catTower.style.opacity = '';
            catTower.style.zIndex = '';
        }
        if (logo) logo.style.opacity = '';
        if (subtitle) subtitle.style.opacity = '';
        if (speechBubble) {
            speechBubble.style.opacity = '';
            speechBubble.style.pointerEvents = '';
        }
        if (dogFocusImage) {
            dogFocusImage.style.opacity = '0';
            dogFocusImage.style.transform = '';
        }
        if (catFocusImage) {
            catFocusImage.style.opacity = '0';
            catFocusImage.style.transform = '';
        }
        if (mainTable) {
            mainTable.style.transform = '';
        }
    }
    
    // main-table 스크롤 따라 이동 (opacity는 건들지 않음)
    function updateMainTable(progress) {
        const mainTable = document.querySelector('.main-table');
        if (!mainTable) return;
        
        // 스크롤에 따라 테이블이 자연스럽게 아래로 이동
        const translateY = progress * 30; // 30vh만큼 아래로 이동
        const translateX = -50; // 중앙 정렬 유지
        mainTable.style.transform = `translateX(${translateX}%) translateY(${translateY}vh)`;
    }
    
    // 강아지 포커스 애니메이션 - 강아지 이미지 + dogidcard 이미지
    function updateDogFocus(progress) {
        const dogArea = document.querySelector('.dog-area');
        const character = document.querySelector('.character');
        const catTower = document.querySelector('.cat-tower');
        const logo = document.querySelector('.logo');
        const subtitle = document.querySelector('.subtitle-img');
        const speechBubble = document.querySelector('.speech-bubble-container');
        const dogFocusImage = document.querySelector('.dog-focus-image');
        
        if (!dogArea || !character || !catTower) return;
        if (progress === 0) return;
        
        const dogScale = 1 + (progress * 0.8);      // 1.0 → 1.8로 확대
        const dogTranslateX = progress * -80;       // 중앙쪽으로 이동
        const dogTranslateY = progress * -20;       // 위로 살짝 이동
        
        dogArea.style.transform = `scale(${dogScale}) translateX(${dogTranslateX}%) translateY(${dogTranslateY}%)`;
        dogArea.style.zIndex = progress > 0.1 ? 30 : '';
        
        const characterScale = 1 + (progress * 0.5);
        const characterTranslateX = progress * -120;
        const characterOpacity = 1 - (progress * 0.8);
        
        character.style.transform = `scale(${characterScale}) translateX(${characterTranslateX}%)`;
        character.style.opacity = characterOpacity;
        
        const catTowerOpacity = 1 - (progress * 0.5);
        catTower.style.opacity = catTowerOpacity;

        const logoOpacity = 1 - (progress * 0.8);
        if (logo) logo.style.opacity = logoOpacity;
        if (subtitle) subtitle.style.opacity = logoOpacity;
        
        if (speechBubble) {
            speechBubble.style.opacity = 1 - progress;
            speechBubble.style.pointerEvents = progress > 0.3 ? 'none' : '';
        }
        
        if (dogFocusImage) {
            const imageOpacity = Math.max(0, (progress - 0.4) / 0.6); // 40% 지점부터 나타남
            const imageScale = 0.8 + (imageOpacity * 0.2); // 0.8 → 1.0으로 확대
            
            dogFocusImage.style.opacity = imageOpacity;
            dogFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
        }
    }
    

    function updateCatFocus(catProgress, dogProgress) {
        const dogArea = document.querySelector('.dog-area');
        const catTower = document.querySelector('.cat-tower');
        const dogFocusImage = document.querySelector('.dog-focus-image');
        const catFocusImage = document.querySelector('.cat-focus-image');
        
        if (!dogArea || !catTower) return;
        
        // 강아지 완전히 사라지기 (앞으로 나오면서 opacity 0)
        if (catProgress > 0) {
            const dogExitScale = 1.8 + (catProgress * 0.5);  // 더 크게 확대되면서
            const dogExitTranslateX = -80 + (catProgress * -50); // 더 앞으로 나오면서
            const dogExitOpacity = 1 - (catProgress * 1.2);  // 빠르게 투명해짐
            
            dogArea.style.transform = `scale(${dogExitScale}) translateX(${dogExitTranslateX}%) translateY(-20%)`;
            dogArea.style.opacity = Math.max(0, dogExitOpacity);
        }
        
        // 고양이 중앙으로
        const catBaseScale = 1 - (dogProgress * 0.5); // 강아지 단계에서 줄어들었던 것을 고려
        const catScale = catBaseScale + (catProgress * 1.3); // 1.0 → 1.8로 확대
        const catTranslateX = catProgress * 30;  // 중앙쪽으로 이동
        const catTranslateY = catProgress * -10; // 위로 살짝 이동
        const catOpacity = (1 - dogProgress * 0.5) + (catProgress * 0.5); // 투명도 복원
        
        catTower.style.transform = `scale(${catScale}) translateX(${catTranslateX}%) translateY(${catTranslateY}%)`;
        catTower.style.opacity = Math.min(1, catOpacity);
        catTower.style.zIndex = catProgress > 0.1 ? 30 : '';
        
        //강아지 ID카드 이미지 사라짐
        if (dogFocusImage && catProgress > 0) {
            const dogImageOpacity = 1 - (catProgress * 1.5); // 빠르게 사라짐
            dogFocusImage.style.opacity = Math.max(0, dogImageOpacity);
        }
        
        // 🖼️ 고양이 ID카드 이미지 나타남
        if (catFocusImage && catProgress > 0) {
            const catImageOpacity = Math.max(0, (catProgress - 0.3) / 0.7); // 30% 지점부터 나타남
            const catImageScale = 0.8 + (catImageOpacity * 0.2); // 0.8 → 1.0으로 확대
            
            catFocusImage.style.opacity = catImageOpacity;
            catFocusImage.style.transform = `translate(-50%, -50%) scale(${catImageScale})`;
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

// 수정된 강아지/고양이 제품 스와이퍼
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

    // 고양이 통합 제품 스와이퍼 (이미지 + 정보 결합) - 새로 추가
    const catProductsSwiper = new Swiper('.cat-products-scroll', {
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
            el: '.cat-products-scroll .swiper-scrollbar',
            draggable: true,
            dragSize: 'auto',
        },
    });

    console.log('Product Swiper 초기화 완료');
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