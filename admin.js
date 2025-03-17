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

// 管理员密码
const ADMIN_PASSWORD = "admin123"; // 请修改为您的密码

// 登录函数
function login() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        document.getElementById('adminContent').classList.remove('hidden');
        loadResults();
    } else {
        alert('密码错误！');
    }
}

// 加载结果数据
async function loadResults() {
    try {
        const snapshot = await db.collection('results').orderBy('timestamp', 'desc').get();
        const results = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            results.push({
                ...data,
                timestamp: data.timestamp?.toDate() || new Date()
            });
        });
        displaySummary(results);
        displayDetailedResults(results);
    } catch (error) {
        console.error("Error loading results: ", error);
        alert('加载数据失败，请刷新页面重试！');
    }
}

// 显示统计概览
function displaySummary(results) {
    const summary = calculateAverageScores(results);
    const summaryDiv = document.getElementById('summary');
    
    const categories = {
        tiger: "老虎",
        peacock: "孔雀",
        koala: "考拉",
        owl: "猫头鹰",
        chameleon: "变色龙"
    };

    summaryDiv.innerHTML = Object.entries(summary)
        .map(([category, avg]) => `
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="font-bold text-gray-700">${categories[category]}</div>
                <div class="text-2xl font-bold text-blue-600">${avg.toFixed(1)}</div>
                <div class="text-sm text-gray-500">平均分</div>
            </div>
        `).join('');
}

// 计算平均分
function calculateAverageScores(results) {
    const totals = {
        tiger: 0,
        peacock: 0,
        koala: 0,
        owl: 0,
        chameleon: 0
    };
    
    results.forEach(result => {
        Object.entries(result.scores).forEach(([category, score]) => {
            totals[category] += score;
        });
    });

    const count = results.length || 1;
    return Object.fromEntries(
        Object.entries(totals).map(([category, total]) => [category, total / count])
    );
}

// 显示详细结果
function displayDetailedResults(results) {
    const tbody = document.getElementById('resultsTable');
    tbody.innerHTML = results.map(result => `
        <tr class="border-b">
            <td class="px-6 py-4 whitespace-nowrap">${result.userName || '匿名'}</td>
            <td class="px-6 py-4 whitespace-nowrap">${result.timestamp.toLocaleString('zh-CN')}</td>
            <td class="px-6 py-4">${result.scores.tiger}</td>
            <td class="px-6 py-4">${result.scores.peacock}</td>
            <td class="px-6 py-4">${result.scores.koala}</td>
            <td class="px-6 py-4">${result.scores.owl}</td>
            <td class="px-6 py-4">${result.scores.chameleon}</td>
        </tr>
    `).join('');
}

// 导出到Excel
function exportToExcel() {
    const tbody = document.getElementById('resultsTable');
    const rows = tbody.getElementsByTagName('tr');
    
    // 准备数据
    const data = Array.from(rows).map(row => {
        const cells = row.getElementsByTagName('td');
        return {
            "姓名": cells[0].textContent,
            "提交时间": cells[1].textContent,
            "老虎分数": cells[2].textContent,
            "孔雀分数": cells[3].textContent,
            "考拉分数": cells[4].textContent,
            "猫头鹰分数": cells[5].textContent,
            "变色龙分数": cells[6].textContent
        };
    });

    // 创建工作表
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "问卷结果");

    // 导出文件
    XLSX.writeFile(wb, "问卷调查结果.xlsx");
}
