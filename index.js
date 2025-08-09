
let heroSection;

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM 로드 완료');
    
    // DOM 요소 참조 설정
    heroSection = document.getElementById('heroSection');
    
    if (heroSection) {
        console.log('히어로 섹션 찾음');
    } else {
        console.error('히어로 섹션을 찾을 수 없음');
    }
    
    // 필수 박스 요소들 확인
    const characterBox = document.querySelector('.character-box');
    const dogBox = document.querySelector('.dog-box');
    const catBox = document.querySelector('.cat-box');
    
    console.log('박스 요소 확인:');
    console.log('- 직원 박스:', characterBox ? '찾음' : '없음');
    console.log('- 강아지 박스:', dogBox ? '찾음' : '없음');
    console.log('- 고양이 박스:', catBox ? '찾음' : '없음');
    
    initScrollEvents();
    initSwiperMenus();
    initIngredientClick();
});

function initScrollEvents() {
    console.log('스크롤 이벤트 초기화');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        const animationStart = windowHeight * 0.1; 
        const animationRange = windowHeight * 2.0; 
        
  
        const scrollProgress = Math.max(0, Math.min((scrollY - animationStart) / animationRange, 1));
        

        const firstPhaseProgress = Math.max(0, Math.min(scrollProgress / 0.5, 1));
        
        const staffProgress = Math.max(0, Math.min(scrollProgress / 0.3, 1));
        
        const catExitProgress = Math.max(0, Math.min(scrollProgress / 0.3, 1));
        
        const dogFirstProgress = Math.max(0, Math.min(scrollProgress / 0.4, 1));

        const secondPhaseStart = 0.5;
        const secondPhaseProgress = Math.max(0, Math.min((scrollProgress - secondPhaseStart) / 0.5, 1));
        
        const catEnterStart = 0.6;
        const catEnterDuration = 0.4; // 0.5~0.9
        const catEnterProgress = Math.max(0, Math.min((scrollProgress - catEnterStart) / catEnterDuration, 1));
        
        const dogExitStart = 0.5;
        const dogExitDuration = 0.3; // 0.5~0.8
        const dogExitProgress = Math.max(0, Math.min((scrollProgress - dogExitStart) / dogExitDuration, 1));
        
        updateStaff(staffProgress);
        updateDog(dogFirstProgress, dogExitProgress);
        updateCat(catExitProgress, catEnterProgress, scrollProgress);
        updateCenterLogo(scrollProgress);
        updateFocusImages(staffProgress, dogFirstProgress, dogExitProgress, catExitProgress, catEnterProgress);
    });
}


function updateStaff(progress) {
    const staffBox = document.querySelector('.character-box');
    const speechBubble = document.querySelector('.speech-bubble-container');
    
    if (!staffBox) {
        console.warn('character-box를 찾을 수 없음');
        return;
    }
    
    if (progress > 0) {
        const staffScale = 1 + (progress * 0.2);   
        const staffTranslateX = progress * -100;     
        const staffOpacity = 1 - progress;        
        
        const transform = `translateX(-50%) scale(${staffScale}) translateX(${staffTranslateX}%)`;
        
        staffBox.style.transform = transform;
        staffBox.style.opacity = staffOpacity;
        staffBox.style.zIndex = progress > 0.1 ? 200 : 100;
        

        if (speechBubble) {
            speechBubble.style.opacity = 1 - progress;
            speechBubble.style.pointerEvents = progress > 0.3 ? 'none' : '';
        }
    } else {
        staffBox.style.transform = 'translateX(-50%)';
        staffBox.style.opacity = 1;
        staffBox.style.zIndex = 100;
        
        if (speechBubble) {
            speechBubble.style.opacity = 1;
            speechBubble.style.pointerEvents = '';
        }
    }
}

function updateDog(firstProgress, exitProgress) {
    const dogBox = document.querySelector('.dog-box');
    
    if (!dogBox) return;
    
    if (exitProgress > 0) {
        const dogScale = 1.2 + (exitProgress * 0.1);     
        const dogTranslateX = exitProgress * 100;        
        const dogOpacity = 1 - exitProgress;             
        
        const transform = `translateX(-50%) scale(${dogScale}) translateX(${dogTranslateX}%)`;
        
        dogBox.style.left = '30%'; 
        dogBox.style.transform = transform;
        dogBox.style.opacity = dogOpacity;
        dogBox.style.zIndex = 200;
    }

    else if (firstProgress > 0) {
        const dogScale = 1 + (firstProgress * 0.2);  
                 const dogPositionX = 80 - (firstProgress * 50); 
        
        const transform = `translateX(-50%) scale(${dogScale})`;
        
        dogBox.style.left = `${dogPositionX}%`;
        dogBox.style.transform = transform;
        dogBox.style.opacity = 1;
        dogBox.style.zIndex = 200;
    }
    // 초기 상태
    else {
        dogBox.style.left = '80%';
        dogBox.style.transform = 'translateX(-50%)';
        dogBox.style.opacity = 1;
        dogBox.style.zIndex = 95;
    }
}


function updateCat(exitProgress, enterProgress, overallScrollProgress) {
    const catBox = document.querySelector('.cat-box');
    
    if (!catBox) return;
    
    
    if (enterProgress > 0) {
        const catScale = 1;
        
        const catPositionX = 120 - (enterProgress * 100); 
        
        const transform = `translateX(-50%) scale(${catScale})`;
        
        catBox.style.transform = transform;
        catBox.style.opacity = Math.min(enterProgress * 2, 1); 
        catBox.style.zIndex = 200;
        
        if (enterProgress > 0 && enterProgress < 0.1) {
            console.log('고양이 등장 시작 (수정됨):', {
                enterProgress: enterProgress.toFixed(2),
                positionX: catPositionX.toFixed(1),
                scale: catScale.toFixed(2),
                opacity: (Math.min(enterProgress * 2, 1)).toFixed(2)
            });
        }
    }

    else if (exitProgress > 0) {
        const catTranslateX = exitProgress * -100;       
        const catOpacity = 1 - exitProgress;             
        
        const transform = `translateX(-50%) translateX(${catTranslateX}%)`;
        
        catBox.style.left = '20%'; 
        catBox.style.transform = transform;
        catBox.style.opacity = catOpacity;
        catBox.style.zIndex = 200;
    }
 
    else {
        if (overallScrollProgress < 0.3) {
          
            catBox.style.left = '20%';
            catBox.style.transform = 'translateX(-50%)';
            catBox.style.opacity = 1;
            catBox.style.zIndex = 90;
        }  else {
            catBox.style.left = '20%'; 
            catBox.style.transform = 'translateX(-50%)';
            catBox.style.opacity = 0;
            catBox.style.zIndex = 90;
          
        }
    }
}



// 중앙 로고 페이드 아웃 - 완전히 투명하게 수정
function updateCenterLogo(scrollProgress) {
    const logo = document.querySelector('.logo');
    const subtitle = document.querySelector('.subtitle-img');
    
    const logoOpacity = 1 - (scrollProgress * 3.5); // 더 빠르게 사라지도록
    
    if (logo) logo.style.opacity = Math.max(0, logoOpacity);
    if (subtitle) subtitle.style.opacity = Math.max(0, logoOpacity);
}

// 포커스 이미지들 처리
function updateFocusImages(staffProgress, dogFirstProgress, dogExitProgress, catExitProgress, catEnterProgress) {
    const characterFocusImage = document.querySelector('.character-focus-image');
    const dogFocusImage = document.querySelector('.dog-focus-image');
    const catFocusImage = document.querySelector('.cat-focus-image');
    
    
    // 강아지 포커스 이미지
    if (dogFocusImage) {
        // 강아지 사라지는 단계
        if (dogExitProgress > 0) {
            const imageOpacity = 1 - (dogExitProgress * 2); // 강아지와 함께 사라짐
            dogFocusImage.style.opacity = Math.max(0, imageOpacity);
        }
        // 강아지 첫 번째 단계
        else if (dogFirstProgress > 0) {
            const imageOpacity = Math.max(0, (dogFirstProgress - 0.2) / 0.8); // 20% 지점부터 나타남
            const imageScale = 0.8 + (imageOpacity * 0.2);
            
            dogFocusImage.style.opacity = imageOpacity;
            dogFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
        } else {
            dogFocusImage.style.opacity = 0;
        }
    }
    
    // 고양이 포커스 이미지
    if (catFocusImage) {
        // 고양이 등장 단계
        if (catEnterProgress > 0 && dogExitProgress >= 0.5) {
            const imageOpacity = Math.max(0, (catEnterProgress - 0.1) / 0.5);
            const imageScale = 1;
            
            catFocusImage.style.opacity = imageOpacity;
            catFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
        } else {
            catFocusImage.style.opacity = 0;
        }
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