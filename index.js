
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
        
        // 스크롤 진행도 계산 (0-1) - test2와 동일
        const scrollProgress = Math.max(0, Math.min((scrollY - animationStart) / animationRange, 1));
        
        // 스크롤 정보 출력 (너무 많이 출력되지 않도록 10% 단위로만)
        if (Math.floor(scrollProgress * 10) !== Math.floor((scrollProgress - 0.001) * 10)) {
            console.log(`스크롤 진행도: ${Math.floor(scrollProgress * 100)}%`);
        }
        
        // test2와 동일한 단계 설정
        const redStart = 0;     
        const redDuration = 0.3; 
        const blueStart = 0.3; 
        const blueDuration = 0.3; 
        const greenStart = 0.6; 
        const greenDuration = 0.3; 

        // test2와 동일한 진행도 계산
        const redProgress = Math.max(0, Math.min((scrollProgress - redStart) / redDuration, 1));
        const blueProgress = Math.max(0, Math.min((scrollProgress - blueStart) / blueDuration, 1));
        const greenProgress = Math.max(0, Math.min((scrollProgress - greenStart) / greenDuration, 1));
        
        // 수정된 함수 호출 - greenProgress 매개변수 추가
        updateRedBox(redProgress);
        updateBlueBox(blueProgress, redProgress, greenProgress); // greenProgress 추가
        updateGreenBox(greenProgress, blueProgress, redProgress);
        updateCenterLogo(scrollProgress);
        updateFocusImages(redProgress, blueProgress, greenProgress);
    });
}

// 직원
function updateRedBox(progress) {
    const redBox = document.querySelector('.character-box');
    const speechBubble = document.querySelector('.speech-bubble-container');
    
    if (!redBox) {
        console.warn('character-box를 찾을 수 없음');
        return;
    }
    
    if (progress > 0) {
        const redScale = 1 + (progress * 1.5);     
        const redTranslateX = progress * -50;        
        const redTranslateY = progress * -30;        
        const redOpacity = 1 - progress;    
        
        const transform = `translateX(-50%) scale(${redScale}) translateX(${redTranslateX}%) translateY(${redTranslateY}%)`;
        
        // 디버깅
        if (progress > 0 && progress < 0.1) {
            console.log('Red Box 애니메이션 시작:', {
                progress: progress.toFixed(2),
                scale: redScale.toFixed(2),
                translateX: redTranslateX.toFixed(1),
                translateY: redTranslateY.toFixed(1),
                opacity: redOpacity.toFixed(2)
            });
        }
        
        redBox.style.transform = transform;
        redBox.style.opacity = redOpacity;
        redBox.style.zIndex = progress > 0.1 ? 200 : 100;
        
        // 말풍선 숨김
        if (speechBubble) {
            speechBubble.style.opacity = 1 - progress;
            speechBubble.style.pointerEvents = progress > 0.3 ? 'none' : '';
        }
    } else {
        redBox.style.transform = 'translateX(-50%)';
        redBox.style.opacity = 1;
        redBox.style.zIndex = 100;
        
        if (speechBubble) {
            speechBubble.style.opacity = 1;
            speechBubble.style.pointerEvents = '';
        }
    }
}

// 강아지
function updateBlueBox(blueProgress, redProgress, greenProgress) {
    const blueBox = document.querySelector('.dog-box');
    
    if (!blueBox) return;
    
    const blueBaseTranslateX = redProgress * -20;   
    const blueBaseScale = 0.8 + (redProgress * 0);
    const blueBaseTranslateY = redProgress * -10;       
    

    if (greenProgress > 0.7) { 
        const fadeProgress = (greenProgress - 0.7) / 0.3; // 0.7~1.0을 0~1로 변환
        blueBox.style.opacity = 1 - fadeProgress; // 천천히 사라짐
        blueBox.style.left = '50%';
        return;
    }
    
    if (blueProgress > 0) {
        const blueScale = blueBaseScale + (blueProgress * 1);    
        const blueTranslateX = blueBaseTranslateX + (blueProgress * -10);      
        const blueTranslateY = blueBaseTranslateY + (blueProgress * -1);      
        
        // 강아지 위치 이동: 80% → 50% (적당히 중앙으로)
        const dogPositionX = 80 - (blueProgress * 30); // 80% → 50%로 이동 (30% 감소)
        
        blueBox.style.left = `${dogPositionX}%`;
        blueBox.style.transform = `translateX(-50%) scale(${blueScale}) translateX(${blueTranslateX}%) translateY(${blueTranslateY}%)`;
        blueBox.style.opacity = 1; // 사라지지 않고 유지
        blueBox.style.zIndex = (redProgress > 0.1 || blueProgress > 0.1) ? 200 : 95;
    } else if (redProgress > 0) {
        blueBox.style.left = '80%'; // 기본 위치 유지
        blueBox.style.transform = `translateX(-50%) scale(${blueBaseScale}) translateX(${blueBaseTranslateX}%) translateY(${blueBaseTranslateY}%)`;
        blueBox.style.opacity = 1;
        blueBox.style.zIndex = redProgress > 0.1 ? 200 : 95;
    } else {
        blueBox.style.left = '80%'; // 기본 위치로 복원
        blueBox.style.transform = 'translateX(-50%)';
        blueBox.style.opacity = 1;
        blueBox.style.zIndex = 95;
    }
}

// 고양이
function updateGreenBox(greenProgress, blueProgress, redProgress) {
    const greenBox = document.querySelector('.cat-box');
    
    if (!greenBox) return;
    
    // 이전 애니메이션들의 영향
    const greenBaseTranslateX = redProgress * -15;  
    const greenBaseScale = 1 + (redProgress * 0); 
    const greenBaseTranslateY = redProgress * -8;   
    
    // 강아지 애니메이션 중일 때 고양이를 화면 밖으로 이동
    if (blueProgress > 0 && greenProgress === 0) {
        const catPositionX = 20 - (blueProgress * 40); // 20% → -20% (화면 밖)
        
        greenBox.style.left = `${catPositionX}%`;
        greenBox.style.transform = `translateX(-50%) scale(${greenBaseScale}) translateX(${greenBaseTranslateX}%) translateY(${greenBaseTranslateY}%)`;
        greenBox.style.opacity = 1;
        greenBox.style.zIndex = 90;
    }

    else if (greenProgress > 0.6) { 
        const appearProgress = (greenProgress - 0.6) / 0.4; // 0.6~1.0을 0~1로 변환
        
        const greenScale = 1; 
        const greenTranslateX = 0; 
        const greenTranslateY = appearProgress * 15; 
        
        // 고양이가 점진적으로 나타남
        const catPositionX = 20 + (appearProgress * 0); // 기본 위치에서 나타남
        
        greenBox.style.left = `${catPositionX}%`;
        greenBox.style.transform = `translateX(-50%) scale(${greenScale}) translateX(${greenTranslateX}%) translateY(${greenTranslateY}%)`;
        greenBox.style.opacity = appearProgress; // 점진적으로 나타남
        greenBox.style.zIndex = 200;
    }

    else if (greenProgress > 0 && greenProgress <= 0.6) {
        // 화면 밖에서 대기 (보이지 않음)
        greenBox.style.left = '-50%'; // 화면 밖
        greenBox.style.opacity = 0;
        greenBox.style.zIndex = 90;
    }
    // red 애니메이션만 진행 중일 때
    else if (redProgress > 0) {
        greenBox.style.left = '20%'; // 기본 위치 유지
        greenBox.style.transform = `translateX(-50%) scale(${greenBaseScale}) translateX(${greenBaseTranslateX}%) translateY(${greenBaseTranslateY}%)`;
        greenBox.style.opacity = 1;
        greenBox.style.zIndex = redProgress > 0.1 ? 200 : 90;
    } 
    // 초기 상태
    else {
        greenBox.style.left = '20%'; // 기본 위치
        greenBox.style.transform = 'translateX(-50%)';
        greenBox.style.opacity = 1;
        greenBox.style.zIndex = 90;
    }
}

// 포커스 이미지들 처리 - 타이밍 조절
function updateFocusImages(redProgress, blueProgress, greenProgress) {
    const characterFocusImage = document.querySelector('.character-focus-image');
    const dogFocusImage = document.querySelector('.dog-focus-image');
    const catFocusImage = document.querySelector('.cat-focus-image');
    
    // 직원 포커스 이미지
    if (characterFocusImage && redProgress > 0) {
        const imageOpacity = Math.max(0, (redProgress - 0.4) / 0.6);
        const imageScale = 0.8 + (imageOpacity * 0.2);
        
        characterFocusImage.style.opacity = imageOpacity;
        characterFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
    }
    

    if (dogFocusImage) {
        if (blueProgress > 0 && greenProgress <= 0.5) {
            const imageOpacity = Math.max(0, (blueProgress - 0.4) / 0.6);
            const imageScale = 0.8 + (imageOpacity * 0.2);
            
            dogFocusImage.style.opacity = imageOpacity;
            dogFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
        } else if (greenProgress > 0.5) {
            // greenProgress 50% 이후에 사라짐
            const fadeProgress = (greenProgress - 0.5) / 0.5;
            const imageOpacity = 1 - (fadeProgress * 2);
            dogFocusImage.style.opacity = Math.max(0, imageOpacity);
        } else {
            dogFocusImage.style.opacity = 0;
        }
    }
    
    if (catFocusImage) {
        if (greenProgress > 0.5) {
            const appearProgress = (greenProgress - 0.5) / 0.5;
            const imageOpacity = Math.max(0, (appearProgress - 0.3) / 0.7);
            const imageScale = 0.8 + (imageOpacity * 0.2);
            
            catFocusImage.style.opacity = imageOpacity;
            catFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
        } else {
            catFocusImage.style.opacity = 0;
        }
    }
}

// 중앙 로고 페이드 아웃 - 완전히 투명하게 수정
function updateCenterLogo(scrollProgress) {
    const logo = document.querySelector('.logo');
    const subtitle = document.querySelector('.subtitle-img');
    
    const logoOpacity = 1 - (scrollProgress * 1.5); // 더 빠르게 사라지도록
    
    if (logo) logo.style.opacity = Math.max(0, logoOpacity); // 완전 투명 가능
    if (subtitle) subtitle.style.opacity = Math.max(0, logoOpacity); // 완전 투명 가능
}

// 포커스 이미지들 처리
function updateFocusImages(redProgress, blueProgress, greenProgress) {
    const characterFocusImage = document.querySelector('.character-focus-image');
    const dogFocusImage = document.querySelector('.dog-focus-image');
    const catFocusImage = document.querySelector('.cat-focus-image');
    
    // 직원 포커스 이미지
    if (characterFocusImage && redProgress > 0) {
        const imageOpacity = Math.max(0, (redProgress - 0.4) / 0.6); // 40% 지점부터 나타남
        const imageScale = 0.8 + (imageOpacity * 0.2); // 0.8 → 1.0으로 확대
        
        characterFocusImage.style.opacity = imageOpacity;
        characterFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
    }
    
    // 강아지 포커스 이미지 - 고양이 단계에서 사라지도록 수정
    if (dogFocusImage) {
        if (blueProgress > 0 && greenProgress === 0) {
            const imageOpacity = Math.max(0, (blueProgress - 0.4) / 0.6);
            const imageScale = 0.8 + (imageOpacity * 0.2);
            
            dogFocusImage.style.opacity = imageOpacity;
            dogFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
        } else if (greenProgress > 0) {
            // 고양이 단계에서 강아지 이미지 사라짐
            const imageOpacity = 1 - (greenProgress * 2); // 더 빠르게 사라짐
            dogFocusImage.style.opacity = Math.max(0, imageOpacity);
        } else {
            dogFocusImage.style.opacity = 0;
        }
    }
    
    // 고양이 포커스 이미지
    if (catFocusImage && greenProgress > 0) {
        const imageOpacity = Math.max(0, (greenProgress - 0.3) / 0.7); // 30% 지점부터 나타남
        const imageScale = 0.8 + (imageOpacity * 0.2);
        
        catFocusImage.style.opacity = imageOpacity;
        catFocusImage.style.transform = `translate(-50%, -50%) scale(${imageScale})`;
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