let currentDay = 1;
const totalDays = 7;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
let timerInterval; // 用來存放每秒執行的計時器

const dayPrompts = {
    1: "感恩今天幫你最多的物品！",
    2: "感恩今天遇到的一位陌生人！",
    3: "感恩今天聽到/遇到/發生的一件事！",
    4: "感恩今天在工作/學習中的收穫！",
    5: "感恩一位朋友！",
    6: "感恩一位家人！",
    7: "感恩自己！"
};

window.onload = function() {
    renderPuzzle();
    selectDay(1);
    startCountdown();
};

function selectDay(day) {
    currentDay = day;
    document.getElementById('currentDayTitle').innerText = `正在完成：本週第 ${day} 篇感恩日記`;
    const promptText = dayPrompts[day] || "回想今日值得感恩的人事物！";
    document.getElementById('promptDisplay').innerText = `提示：${promptText}`;

    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    document.getElementById('journalInput').value = savedData[day] || "";
    
    updateTimerDisplay(); 
}

// 計時器
function startCountdown() {
    if (timerInterval) clearInterval(timerInterval); // 確保不會重複啟動
    timerInterval = setInterval(updateTimerDisplay, 1000);
}

// 更新按鈕與倒數文字
function updateTimerDisplay() {
    const lastSavedTime = localStorage.getItem('lastSavedTime');
    const saveBtn = document.getElementById('saveBtn');
    const timerMsg = document.getElementById('timerMessage');
    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};

    // 情況 A：如果這一天已經寫過了，不鎖定（允許修改內容）
    if (savedData[currentDay]) {
        saveBtn.disabled = false;
        saveBtn.style.backgroundColor = "#B1B479";
        saveBtn.innerText = "更新日記內容";
        timerMsg.innerText = "✨ 今日任務已達成！";
        timerMsg.style.color = "#4CAF50"; 
        return;
    }

    // 情況 B：檢查是否在 24 小時冷卻期內
    if (lastSavedTime) {
        const now = Date.now();
        const timeElapsed = now - parseInt(lastSavedTime);

        if (timeElapsed < TWENTY_FOUR_HOURS) {
            const timeLeft = TWENTY_FOUR_HOURS - timeElapsed;
            
            // 計算時、分、秒
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            saveBtn.disabled = true;
            saveBtn.style.backgroundColor = "#ccc";
            saveBtn.innerText = "冷卻中...";
            timerMsg.innerText = `⏳ 距離下一片拼圖還需：${hours}時 ${minutes}分 ${seconds}秒`;
            timerMsg.style.color = "#e74c3c";
            return;
        }
    }
    
    // 情況 C：可以撰寫新拼圖
    saveBtn.disabled = false;
    saveBtn.style.backgroundColor = "#B1B479";
    saveBtn.innerText = "儲存並領取拼圖";
    timerMsg.innerText = "☀️ 現在可以領取新拼圖囉！";
    timerMsg.style.color = "#888";
}

function saveEntry() {
    const text = document.getElementById('journalInput').value.trim();
    if (!text) {
        alert("請寫下一些感恩的話吧！");
        return;
    }

    let savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    
    // 如果是新解鎖的一天，才紀錄/更新最後儲存時間
    if (!savedData[currentDay]) {
        localStorage.setItem('lastSavedTime', Date.now());
    }

    savedData[currentDay] = text;
    localStorage.setItem('gratitudeJournal', JSON.stringify(savedData));

    alert(`第 ${currentDay} 天的拼圖已解鎖！`);
    renderPuzzle();
    updateTimerDisplay(); // 儲存後立刻更新狀態
}

function renderPuzzle() {
    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    let completedCount = 0;
    const board = document.getElementById('puzzleBoard');

    for (let i = 1; i <= totalDays; i++) {
        const piece = document.getElementById(`piece-${i}`);
        if (savedData[i]) {
            piece.classList.add('unlocked');
            completedCount++;
        } else {
            piece.classList.remove('unlocked');
        }
    }

    const piece8 = document.getElementById('piece-8');
    if (savedData[7]) {
        if (piece8) piece8.classList.add('unlocked');
        board.classList.add('completed'); 
        document.getElementById('quoteDisplay').style.display = "block";
    } else {
        if (piece8) piece8.classList.remove('unlocked');
        board.classList.remove('completed'); 
        document.getElementById('quoteDisplay').style.display = "none";
    }
}

function resetJournal() {
    if (confirm("準備好進行下週的感恩練習了嗎？")) {
        clearInterval(timerInterval); 
        localStorage.removeItem('gratitudeJournal');
        localStorage.removeItem('lastSavedTime');
        location.reload(); 
    }
}
//開發者模式
let clickCount = 0;
let lastClickTime = 0;

// 監聽
const originalOnload = window.onload;
window.onload = function() {
    if (originalOnload) originalOnload(); // 執行原本的載入邏輯
    
    const trigger = document.getElementById('secretTrigger');
    if (trigger) {
        trigger.addEventListener('click', () => {
            const currentTime = Date.now();
            if (currentTime - lastClickTime > 1000) {
                clickCount = 0;
            }
            
            clickCount++;
            lastClickTime = currentTime;

            if (clickCount === 7) {
                activateDevMode();
                clickCount = 0; // 重置計數
            }
        });
    }
};

// 開發者模式的核心函式
function activateDevMode() {
    console.log("🛠️ 開發者模式已啟動：解鎖所有拼圖");

    let debugData = {};
    for (let i = 1; i <= 7; i++) {
        debugData[i] = "這是開發者模式生成的測試感恩內容！✨";
    }

    // 2. 存入 localStorage
    localStorage.setItem('gratitudeJournal', JSON.stringify(debugData));
    
    // 3. 移除時間限制 (設為很久以前的時間)
    localStorage.setItem('lastSavedTime', Date.now() - TWENTY_FOUR_HOURS);

    // 4. 立即重新渲染畫面
    renderPuzzle();
    updateTimerDisplay();
    
    // 5. 觸發慶祝特效！
    if (typeof fireworkCelebration === "function") {
        fireworkCelebration();
    }

    alert("🛠️ 開發者模式：已完成所有天數並解鎖拼圖！");
}