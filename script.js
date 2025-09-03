// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeModal();
    initializeFormValidation();
    initializeSmoothScrolling();
});

// Animation System
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;
                
                setTimeout(() => {
                    element.classList.add('visible');
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe all animation elements
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Hero section - show immediately
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        heroTitle.classList.add('visible');
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }
    if (heroSubtitle) {
        heroSubtitle.classList.add('visible');
        heroSubtitle.style.opacity = '1';
        heroSubtitle.style.transform = 'translateY(0)';
    }
    if (heroButtons) {
        heroButtons.classList.add('visible');
        heroButtons.style.opacity = '1';
        heroButtons.style.transform = 'translateY(0)';
    }
}

// Scroll Effects
function initializeScrollEffects() {
    let ticking = false;

    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect for hero section
        const hero = document.querySelector('.hero-section');
        if (hero && scrolled < window.innerHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Modal Functionality
function initializeModal() {
    const modal = document.getElementById('consultationModal');
    const closeBtn = document.querySelector('.modal-close');

    // Close modal when clicking close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeConsultation);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeConsultation();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeConsultation();
        }
    });
}

// Modal Functions
function openConsultation() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus on first input
        setTimeout(() => {
            const firstInput = modal.querySelector('input[type="text"]');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

function closeConsultation() {
    const modal = document.getElementById('consultationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Reset form
        const form = document.getElementById('consultationForm');
        if (form) {
            form.reset();
            clearErrorMessages();
        }
    }
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('consultationForm');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Clear previous error state
    field.classList.remove('error', 'success');
    
    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = '이름을 입력해주세요.';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = '이름은 2글자 이상 입력해주세요.';
                isValid = false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^(01[016789])-?([0-9]{3,4})-?([0-9]{4})$/;
            if (!value) {
                errorMessage = '연락처를 입력해주세요.';
                isValid = false;
            } else if (!phoneRegex.test(value.replace(/-/g, ''))) {
                errorMessage = '올바른 휴대폰 번호를 입력해주세요.';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorMessage = '이메일을 입력해주세요.';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = '올바른 이메일 주소를 입력해주세요.';
                isValid = false;
            }
            break;
            
        case 'privacy':
            if (!field.checked) {
                errorMessage = '개인정보 수집 및 이용에 동의해주세요.';
                isValid = false;
            }
            break;
    }

    // Update field state and error message
    const errorElement = document.getElementById(fieldName + 'Error');
    if (errorElement) {
        errorElement.textContent = errorMessage;
    }

    if (isValid) {
        field.classList.add('success');
    } else {
        field.classList.add('error');
    }

    return isValid;
}

function validateForm() {
    const form = document.getElementById('consultationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isFormValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });

    const inputElements = document.querySelectorAll('.error, .success');
    inputElements.forEach(element => {
        element.classList.remove('error', 'success');
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return false;
    }

    const form = document.getElementById('consultationForm');
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = '전송 중...';
    submitButton.classList.add('loading');

    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const company = formData.get('company') || '입력하지 않음';
    const message = formData.get('message') || '상담 내용 없음';

    // Create email content
    const emailSubject = '포미서비스 무료 상담 신청';
    const emailBody = `
안녕하세요, 포미서비스 무료 상담 신청이 접수되었습니다.

■ 신청자 정보
- 이름: ${name}
- 연락처: ${phone}
- 이메일: ${email}
- 회사명: ${company}

■ 상담 내용
${message}

■ 신청 일시
${new Date().toLocaleString('ko-KR')}

빠른 시일 내에 연락드리겠습니다.

감사합니다.
포미서비스 팀
    `;

    // Create mailto link
    const mailtoLink = `mailto:soma@kcc.co.kr?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Simulate processing time then send email
    setTimeout(() => {
        try {
            // Open email client
            window.location.href = mailtoLink;
            
            // Success state
            submitButton.textContent = '메일 전송됨!';
            submitButton.style.backgroundColor = '#28a745';
            
            // Show success message
            showNotification('상담 신청이 완료되었습니다. 메일 클라이언트에서 전송을 확인해주세요.', 'success');
            
            // Close modal after delay
            setTimeout(() => {
                closeConsultation();
                
                // Reset button state
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    submitButton.style.backgroundColor = '';
                    submitButton.classList.remove('loading');
                }, 1000);
            }, 2000);
            
        } catch (error) {
            // Error handling
            submitButton.textContent = '전송 실패';
            submitButton.style.backgroundColor = '#dc3545';
            submitButton.disabled = false;
            
            showNotification('메일 전송에 실패했습니다. 직접 soma@kcc.co.kr로 연락주세요.', 'error');
            
            // Reset button state after delay
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.style.backgroundColor = '';
                submitButton.classList.remove('loading');
            }, 3000);
        }
    }, 1500);

    return false;
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    // Add click handlers for internal links
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[href^="#"]');
        if (target && target.getAttribute('href') !== '#') {
            e.preventDefault();
            const targetId = target.getAttribute('href').substring(1);
            scrollToSection(targetId);
        }
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-size: 0.95rem;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => removeNotification(notification));

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, 5000);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Phone number formatting
function formatPhoneNumber(input) {
    // Remove all non-digit characters
    const cleaned = input.value.replace(/\D/g, '');
    
    // Format as XXX-XXXX-XXXX
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
        input.value = `${match[1]}-${match[2]}-${match[3]}`;
    }
}

// Add phone formatting to phone input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    }
});

// Performance monitoring
if ('performance' in window && 'measure' in performance) {
    window.addEventListener('load', function() {
        performance.mark('page-loaded');
        
        // Log performance metrics
        const perfData = performance.timing;
        const loadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        if (loadTime > 3000) {
            console.warn('Page load time is high:', loadTime + 'ms');
        }
    });
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    
    // Show user-friendly error message for critical errors
    if (e.error && e.error.message && e.error.message.includes('fetch')) {
        showNotification('네트워크 연결을 확인해주세요.', 'error');
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateField,
        validateForm,
        formatPhoneNumber,
        scrollToSection
    };
}
