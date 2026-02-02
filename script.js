// ナビゲーションのハンバーガーメニュー
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // メニューリンクをクリックしたらメニューを閉じる
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// スクロール時のナビゲーションバーのスタイル変更
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrollTop = document.getElementById('scrollTop');

    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }

    // スクロールトップボタンの表示/非表示
    if (scrollTop) {
        if (window.scrollY > 300) {
            scrollTop.classList.remove('hidden');
        } else {
            scrollTop.classList.add('hidden');
        }
    }
});

// スクロールトップボタン
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 初期状態は非表示
    scrollTopBtn.classList.add('hidden');
}

// スムーズスクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navbarHeight = 80;
            const offsetTop = target.offsetTop - navbarHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // モバイルメニューを閉じる
            const navMenu = document.querySelector('.nav-menu');
            const hamburger = document.querySelector('.hamburger');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        }
    });
});

// スクロールアニメーション（フェードイン）
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// アニメーション対象の要素を監視
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.service-card, .job-card, .stat-card, .contact-form');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// フォーム送信処理
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // ここで実際のフォーム送信処理を実装
        // 例: APIへの送信、メール送信など

        // デモ用のアラート
        alert('お問い合わせありがとうございます。\n担当者より折り返しご連絡いたします。');

        // フォームをリセット
        contactForm.reset();
    });
}

// 数値カウントアップアニメーション（統計セクション用）
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            // 数値のフォーマット処理
            if (target >= 1000000) {
                element.textContent = Math.floor(start / 10000) + '万+';
            } else if (target >= 1000) {
                element.textContent = Math.floor(start) + '+';
            } else {
                element.textContent = Math.floor(start);
            }
            requestAnimationFrame(updateCounter);
        } else {
            if (target >= 1000000) {
                element.textContent = Math.floor(target / 10000) + '万+';
            } else if (target >= 1000) {
                element.textContent = target + '+';
            } else {
                element.textContent = target;
            }
        }
    };

    updateCounter();
};

// 統計セクションが表示されたらカウントアップ
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                let target = 0;

                if (text.includes('万')) {
                    target = parseInt(text.replace('万+', '')) * 10000;
                } else if (text.includes('+')) {
                    target = parseInt(text.replace('+', ''));
                } else {
                    target = parseInt(text);
                }

                if (!isNaN(target) && target > 0) {
                    animateCounter(stat, target);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Aboutセクションのスクロール連動演出
(function () {
    const aboutSection = document.getElementById('aboutScrollSection');
    if (!aboutSection) return;

    // スマホ判定（768px以下）- 動的に判定する関数
    function checkIsMobile() {
        return window.innerWidth <= 768;
    }

    let isActive = false;
    let scrollProgress = 0;
    let lockedScrollPosition = 0;
    const stepStates = {
        1: false, // タイトル表示
        2: false, // 段落表示（複数）
        3: false, // ハイライト①
        4: false, // ウェブクリ思想
        5: false  // ハイライト②
    };
    let currentParagraphIndex = 0;
    const paragraphs = Array.from(aboutSection.querySelectorAll('[data-step="2"]'));
    let highlightIndex = 0;
    let mobileScrollListenerAttached = false;
    let animationComplete = false;

    // スクロール固定（PCのみ）
    function lockScroll() {
        if (isActive || checkIsMobile() || animationComplete) return;
        isActive = true;
        lockedScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        console.log('[About] Locking scroll, position:', lockedScrollPosition);
        document.body.classList.add('scroll-locked');
        document.body.style.top = `-${lockedScrollPosition}px`;
        scrollProgress = 0;
    }

    // スクロール固定解除
    function unlockScroll() {
        if (!isActive) return;
        isActive = false;
        animationComplete = true;

        const savedScrollPosition = lockedScrollPosition;
        console.log('[About] Unlocking scroll, saved position:', savedScrollPosition);

        const htmlElement = document.documentElement;
        const originalScrollBehavior = htmlElement.style.scrollBehavior;
        htmlElement.style.scrollBehavior = 'auto';

        document.body.classList.remove('scroll-locked');
        document.body.style.top = '';

        window.scrollTo(0, savedScrollPosition);

        requestAnimationFrame(() => {
            htmlElement.style.scrollBehavior = originalScrollBehavior || '';
        });
    }

    // ステップ1: タイトル表示
    function showStep1() {
        const title = aboutSection.querySelector('[data-step="1"]');
        if (title && !stepStates[1]) {
            title.classList.add('step-visible');
            stepStates[1] = true;
        }
    }

    // ステップ2: 段落を順次表示
    function showStep2() {
        if (currentParagraphIndex < paragraphs.length) {
            const paragraph = paragraphs[currentParagraphIndex];
            if (paragraph && !paragraph.classList.contains('step-visible')) {
                paragraph.classList.add('step-visible');
                const highlights = paragraph.querySelectorAll('.highlight-text.highlight-target-1');
                highlights.forEach(highlight => {
                    highlight.classList.add('highlight-active');
                });
                currentParagraphIndex++;
                setTimeout(() => {
                    if (currentParagraphIndex < paragraphs.length) {
                        showStep2();
                    } else {
                        stepStates[2] = true;
                    }
                }, 600);
            }
        }
    }

    // ステップ3: ハイライト①
    function showStep3() {
        const highlight1Elements = Array.from(aboutSection.querySelectorAll('.highlight-text.highlight-target-1'));
        highlight1Elements.forEach(highlight => {
            const parent = highlight.closest('[data-step]');
            if (parent && parent.classList.contains('step-visible')) {
                highlight.classList.add('highlight-active');
            }
        });
        stepStates[3] = true;
    }

    // ステップ4: ウェブクリ思想表示
    function showStep4() {
        const step4Elements = aboutSection.querySelectorAll('[data-step="4"]');
        step4Elements.forEach(el => {
            if (!el.classList.contains('step-visible')) {
                el.classList.add('step-visible');
                const highlights = el.querySelectorAll('.highlight-text.highlight-target-2');
                highlights.forEach(highlight => {
                    highlight.classList.add('highlight-active');
                });
            }
        });
        stepStates[4] = true;
    }

    // ステップ5: ハイライト②
    function showStep5() {
        const highlight2Elements = Array.from(aboutSection.querySelectorAll('.highlight-text.highlight-target-2'));
        highlight2Elements.forEach(highlight => {
            const parent = highlight.closest('[data-step]');
            if (parent && parent.classList.contains('step-visible')) {
                highlight.classList.add('highlight-active');
            }
        });
        stepStates[5] = true;
        // すべて完了したらスクロール固定を解除
        setTimeout(() => {
            unlockScroll();
        }, 800);
    }

    // PC用：スクロール進行を管理
    function updateScrollProgress(delta) {
        if (!isActive) return;

        scrollProgress += delta;
        scrollProgress = Math.max(0, Math.min(100, scrollProgress));

        if (scrollProgress >= 5 && !stepStates[1]) {
            showStep1();
        }
        if (scrollProgress >= 20 && !stepStates[2] && stepStates[1]) {
            if (currentParagraphIndex === 0) {
                showStep2();
            }
        }
        if (scrollProgress >= 40 && !stepStates[3] && stepStates[2]) {
            showStep3();
        }
        if (scrollProgress >= 50 && !stepStates[4] && stepStates[3]) {
            showStep4();
        }
        if (scrollProgress >= 65 && !stepStates[5] && stepStates[4]) {
            showStep5();
        }
    }

    // スマホ用：通常のスクロールでアニメーションを実行
    function handleMobileScroll() {
        if (!checkIsMobile()) return;

        const rect = aboutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const sectionTop = rect.top;
        const sectionHeight = rect.height;

        if (sectionTop < windowHeight && sectionTop > -sectionHeight) {
            const scrollRatio = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));
            const progress = scrollRatio * 100;

            if (progress >= 5 && !stepStates[1]) {
                showStep1();
            }
            if (progress >= 20 && !stepStates[2] && stepStates[1]) {
                if (currentParagraphIndex === 0) {
                    showStep2();
                }
            }
            if (progress >= 40 && !stepStates[3] && stepStates[2]) {
                showStep3();
            }
            if (progress >= 50 && !stepStates[4] && stepStates[3]) {
                showStep4();
            }
            if (progress >= 65 && !stepStates[5] && stepStates[4]) {
                showStep5();
            }
        }
    }

    // スマホ用スクロールリスナーを設定
    function attachMobileScrollListener() {
        if (!mobileScrollListenerAttached && checkIsMobile()) {
            window.addEventListener('scroll', handleMobileScroll, { passive: true });
            mobileScrollListenerAttached = true;
            handleMobileScroll();
        }
    }

    // PC用：セクションが画面に入ったらスクロール固定
    const aboutSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (checkIsMobile()) {
                attachMobileScrollListener();
                return;
            }

            // PCでセクションが画面に入ったらスクロール固定
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                if (!isActive && !animationComplete) {
                    lockScroll();
                    setTimeout(() => {
                        showStep1();
                    }, 300);
                }
            }
        });
    }, { threshold: [0.3, 0.5, 0.7], rootMargin: '0px' });

    aboutSectionObserver.observe(aboutSection);

    // PC用：ホイールイベントでアニメーション進行
    window.addEventListener('wheel', (e) => {
        if (checkIsMobile() || !isActive) return;
        e.preventDefault();
        const delta = e.deltaY > 0 ? 3 : -3;
        updateScrollProgress(delta);
    }, { passive: false });

    // PC用：タッチスクロール対応
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        if (checkIsMobile() || !isActive) return;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (checkIsMobile() || !isActive) return;
        e.preventDefault();
        const touchY = e.touches[0].clientY;
        const delta = (touchStartY - touchY) * 0.3;
        updateScrollProgress(delta);
        touchStartY = touchY;
    }, { passive: false });

    // 初期化：スマホの場合はスクロールリスナーを設定
    if (checkIsMobile()) {
        attachMobileScrollListener();
    }
})();
