// Firebase 配置
const firebaseConfig = {
    apiKey: "AIzaSyDginTNLoB-OlOdf9dunTqo5mz6KqfZO4U",
    authDomain: "personality-test-881fc.firebaseapp.com",
    projectId: "personality-test-881fc",
    storageBucket: "personality-test-881fc.firebasestorage.app",
    messagingSenderId: "154865544029",
    appId: "1:154865544029:web:3ea6a3156b23c2b96716b4",
    measurementId: "G-YK6ERECFJD"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 问题数据
const questions = [
    { id: 1, text: "你做事是一个值得信赖的人吗?", category: "owl" },
    { id: 2, text: "你个性温和吗?", category: "koala" },
    { id: 3, text: "你有活力吗?", category: "peacock" },
    { id: 4, text: "你善解人意吗?", category: "chameleon" },
    { id: 5, text: "你独立吗?", category: "tiger" },
    { id: 6, text: "你受人爱戴吗?", category: "peacock" },
    { id: 7, text: "做事认真且正直吗?", category: "owl" },
    { id: 8, text: "你富有同情心吗?", category: "koala" },
    { id: 9, text: "你有说服力吗?", category: "chameleon" },
    { id: 10, text: "你大胆吗?", category: "tiger" },
    { id: 11, text: "你精确吗?", category: "owl" },
    { id: 12, text: "你适应能力强吗?", category: "chameleon" },
    { id: 13, text: "你组织能力好吗?", category: "peacock" },
    { id: 14, text: "你是否积极主动?", category: "tiger" },
    { id: 15, text: "你害羞吗?", category: "koala" },
    { id: 16, text: "你强势吗?", category: "owl" },
    { id: 17, text: "你镇定吗?", category: "koala" },
    { id: 18, text: "你勇于学习吗?", category: "tiger" },
    { id: 19, text: "你反应快吗?", category: "chameleon" },
    { id: 20, text: "你外向吗?", category: "peacock" },
    { id: 21, text: "你注意细节吗?", category: "owl" },
    { id: 22, text: "你爱说话吗?", category: "peacock" },
    { id: 23, text: "你的协调能力好吗?", category: "chameleon" },
    { id: 24, text: "你勤劳吗?", category: "tiger" },
    { id: 25, text: "你慷慨吗?", category: "koala" },
    { id: 26, text: "你小心翼翼吗?", category: "owl" },
    { id: 27, text: "你令人愉快吗?", category: "chameleon" },
    { id: 28, text: "你传统吗?", category: "koala" },
    { id: 29, text: "你亲切吗?", category: "peacock" },
    { id: 30, text: "你工作足够有效率吗?", category: "tiger" }
];

// 初始化问卷
function initQuestionnaire() {
    const questionsContainer = document.getElementById('questions');
    
    questions.forEach(question => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        questionDiv.innerHTML = `
            <p class="text-lg font-medium">${question.id}. ${question.text}</p>
            <div class="options">
                <label class="option-label">
                    <input type="radio" name="q${question.id}" value="5" required>
                    非常同意
                </label>
                <label class="option-label">
                    <input type="radio" name="q${question.id}" value="4">
                    比较同意
                </label>
                <label class="option-label">
                    <input type="radio" name="q${question.id}" value="3">
                    一般
                </label>
                <label class="option-label">
                    <input type="radio" name="q${question.id}" value="2">
                    有一点同意
                </label>
                <label class="option-label">
                    <input type="radio" name="q${question.id}" value="1">
                    不同意
                </label>
            </div>
        `;
        questionsContainer.appendChild(questionDiv);
    });
}

// 计算得分
function calculateScores() {
    const scores = {
        tiger: 0,
        peacock: 0,
        koala: 0,
        owl: 0,
        chameleon: 0
    };

    questions.forEach(question => {
        const selectedOption = document.querySelector(`input[name="q${question.id}"]:checked`);
        if (selectedOption) {
            scores[question.category] += parseInt(selectedOption.value);
        }
    });

    return scores;
}

// 保存结果到 Firebase
async function saveResults(scores) {
    const userName = document.getElementById('userName').value.trim();
    const result = {
        userName: userName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        scores: scores
    };

    try {
        await db.collection('results').add(result);
        return true;
    } catch (error) {
        console.error("Error saving results: ", error);
        return false;
    }
}

// 表单提交处理
document.getElementById('questionnaireForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value.trim();
    if (!userName) {
        alert('请输入您的姓名！');
        return;
    }
    
    const scores = calculateScores();
    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '提交中...';
    
    if (await saveResults(scores)) {
        // 显示感谢信息
        document.getElementById('questionnaireForm').style.display = 'none';
        document.getElementById('thankYou').classList.remove('hidden');
        // 滚动到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        alert('提交失败，请稍后重试！');
        submitButton.disabled = false;
        submitButton.textContent = '提交问卷';
    }
});

// 初始化问卷
initQuestionnaire();
