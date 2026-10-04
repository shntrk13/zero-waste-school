const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-active');
    navLinks.classList.toggle('active');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-active');
        navLinks.classList.remove('active');
    });
});

// Simple animation on scroll for info sections
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

/* Game Logic */
const gameContainer = document.getElementById('game-container');
if (gameContainer) {
    const startScreen = document.getElementById('start-screen');
    const questionScreen = document.getElementById('question-screen');
    const resultScreen = document.getElementById('result-screen');
    const startBtn = document.getElementById('start-game-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const progressFill = document.getElementById('progress-fill');
    const dots = document.querySelectorAll('.step-dot');

    let currentQuestion = null;

    const questionTree = {
        text: "Elinizdeki atık sert mi?",
        options: [
            {
                text: "EVET (SERT)",
                icon: "🧱",
                next: {
                    text: "Sence kırılabilir ve saydam mı, bükülebilir ve opak mı?",
                    options: [
                        {
                            text: "KIRILABİLİR VE SAYDAM",
                            icon: "🍷",
                            result: { name: "CAM KUTUSU", message: "Harika! Camlar sonsuz kez geri dönüştürülebilir." }
                        },
                        {
                            text: "BÜKÜLEBİLİR VE OPAK",
                            icon: "🥫",
                            result: { name: "METAL KUTUSU", message: "Süper! Metalleri geri dönüştürerek enerji tasarrufu sağladın." }
                        }
                    ]
                }
            },
            {
                text: "HAYIR (SERT DEĞİL)",
                icon: "🍃",
                next: {
                    text: "Peki bu atık kolayca yırtılabilir mi?",
                    options: [
                        {
                            text: "EVET (YIRTILABİLİR)",
                            icon: "📄",
                            result: { name: "KAĞIT KUTUSU", message: "Muhteşem! Kağıtları geri dönüştürerek ağaçları kurtardın." }
                        },
                        {
                            text: "HAYIR (YIRTILAMAZ)",
                            icon: "🥤",
                            result: { name: "PLASTİK KUTUSU", message: "Yuppi! Plastikler geri dönüşerek yeni eşyalara dönüşür." }
                        }
                    ]
                }
            }
        ]
    };

    function updateProgress(step) {
        // Since the tree is 2 levels deep + results, we can treat it as 2 steps
        const totalStepsCount = 2;
        const percent = (step / totalStepsCount) * 100;
        progressFill.style.width = `${percent}%`;

        dots.forEach((dot, index) => {
            if (index < step) {
                dot.classList.add('completed');
                dot.classList.remove('active');
            } else if (index === step) {
                dot.classList.add('active');
                dot.classList.remove('completed');
            } else {
                dot.classList.remove('active', 'completed');
            }
        });
    }

    function showScreen(screenId) {
        startScreen.classList.remove('active');
        questionScreen.classList.remove('active');
        resultScreen.classList.remove('active');
        document.getElementById(screenId).classList.add('active');
    }

    function loadQuestion(node, step) {
        if (!node) return;

        currentQuestion = node;
        updateProgress(step);

        questionText.textContent = node.text;
        optionsContainer.innerHTML = '';

        node.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerHTML = `
                <span class="option-icon">${opt.icon}</span>
                <span class="option-text">${opt.text}</span>
            `;
            btn.onclick = () => {
                if (opt.result) {
                    showResult(opt.result);
                } else if (opt.next) {
                    loadQuestion(opt.next, step + 1);
                }
            };
            optionsContainer.appendChild(btn);
        });
    }

    function showResult(result) {
        updateProgress(2); // Final step
        showScreen('result-screen');
        document.getElementById('result-bin-name').textContent = result.name;
        document.getElementById('result-message').textContent = result.message;

        // Update bin image based on name (optional, but keep consistent)
        const binImg = document.getElementById('result-bin-img');
        if (result.name.includes("CAM")) binImg.src = "assets/bins.png"; // Use generic for now or specific if available
    }

    if (startBtn) {
        startBtn.onclick = () => {
            showScreen('question-screen');
            loadQuestion(questionTree, 0);
        };
    }

    if (playAgainBtn) {
        playAgainBtn.onclick = () => {
            updateProgress(0);
            showScreen('start-screen');
        };
    }
}
