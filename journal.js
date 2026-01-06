let currentDay = 1;
const totalDays = 7;

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
};

function selectDay(day) {
    currentDay = day;
    document.getElementById('currentDayTitle').innerText = `正在完成：本週第 ${day} 篇感恩日記`;
    
    const promptText = dayPrompts[day] || "回想今日值得感恩的人事物！";
    document.getElementById('promptDisplay').innerText = `第${day}天：${promptText}`;

    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    document.getElementById('journalInput').value = savedData[day] || "";
}

function saveEntry() {
    const text = document.getElementById('journalInput').value.trim();
    if (!text) {
        alert("請寫下一些感恩的話吧！");
        return;
    }

    let savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    savedData[currentDay] = text;
    localStorage.setItem('gratitudeJournal', JSON.stringify(savedData));

    alert(`第 ${currentDay} 天的拼圖已解鎖！`);
    renderPuzzle();
}

function renderPuzzle() {
    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    let completedCount = 0;

    for (let i = 1; i <= totalDays; i++) {
        const piece = document.getElementById(`piece-${i}`);
        if (savedData[i]) {
            piece.classList.add('unlocked');
            completedCount++;
        } else {
            piece.classList.remove('unlocked');
        }
    }

    // 當 7 天都完成時顯示名言
    if (completedCount === totalDays) {
        document.getElementById('quoteDisplay').style.display = "block";
    }
}

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000; // 24小時的毫秒數

window.onload = function() {
    renderPuzzle();
    selectDay(1);
    checkTimer(); // 檢查是否可以撰寫
};

function selectDay(day) {
    currentDay = day;
    document.getElementById('currentDayTitle').innerText = `正在完成：本週第 ${day} 篇感恩日記`;
    const promptText = dayPrompts[day] || "回想今日值得感恩的人事物！";
    document.getElementById('promptDisplay').innerText = `提示：${promptText}`;

    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    document.getElementById('journalInput').value = savedData[day] || "";
}

// 核心功能：檢查時間限制
function checkTimer() {
    const lastSavedTime = localStorage.getItem('lastSavedTime');
    const saveBtn = document.getElementById('saveBtn');
    const timerMsg = document.getElementById('timerMessage');

    if (lastSavedTime) {
        const now = Date.now();
        const timeElapsed = now - parseInt(lastSavedTime);

        if (timeElapsed < TWENTY_FOUR_HOURS) {
            const timeLeft = TWENTY_FOUR_HOURS - timeElapsed;
            const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
            const minsLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            saveBtn.disabled = true;
            saveBtn.style.backgroundColor = "#ccc";
            timerMsg.innerText = `休息一下，還需等待 ${hoursLeft} 小時 ${minsLeft} 分鐘才能寫下一篇。`;
            return false;
        }
    }
    saveBtn.disabled = false;
    saveBtn.style.backgroundColor = "#B1B479";
    timerMsg.innerText = "";
    return true;
}

function saveEntry() {
    if (!checkTimer()) return; 

    const text = document.getElementById('journalInput').value.trim();
    if (!text) {
        alert("請寫下一些感恩的話吧！");
        return;
    }

    let savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    
    if (!savedData[currentDay]) {
        localStorage.setItem('lastSavedTime', Date.now());
    }

    savedData[currentDay] = text;
    localStorage.setItem('gratitudeJournal', JSON.stringify(savedData));

    alert(`第 ${currentDay} 天的拼圖已解鎖！`);
    renderPuzzle();
    checkTimer(); 
}

function renderPuzzle() {
    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    let completedCount = 0;

    for (let i = 1; i <= totalDays; i++) {
        const piece = document.getElementById(`piece-${i}`);
        if (savedData[i]) {
            piece.classList.add('unlocked');
            completedCount++;
        } else {
            piece.classList.remove('unlocked');
        }
    }

    if (completedCount === totalDays) {
        document.getElementById('quoteDisplay').style.display = "block";
    }
}

function resetJournal() {
    if (confirm("準備好進行下週的感恩練習了嗎？")) {
        localStorage.removeItem('gratitudeJournal');
        localStorage.removeItem('lastSavedTime');
        location.reload(); 
    }
}