// script.js

let currentDay = 1;
const totalDays = 7;
const quote = "Gratitude turns what we have into enough.";
const quoteWords = ["Gratitude", "turns", "what", "we", "have", "into", "enough."];

// 初始化
window.onload = function() {
    renderPuzzle();
    selectDay(1);
};

// 切換天數
function selectDay(day) {
    currentDay = day;
    document.getElementById('currentDayTitle').innerText = `正在撰寫：第 ${day} 天`;
    
    // 從本地儲存讀取舊內容
    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    document.getElementById('journalInput').value = savedData[day] || "";
}

// 1. 定義提示清單 (Day 1 對應索引 0，所以我們前面放一個空字串或從 1 開始抓)
const dayPrompts = {
    1: "感恩今天幫你最多的物品！",
    2: "感恩今天遇到的一位陌生人！",
    3: "感恩今天聽到/遇到/發生的一件事！",
    4: "感恩今天在工作/學習中的收穫！",
    5: "感恩一位朋友！",
    6: "感恩一位家人！",
    7: "感恩自己！"
};

function selectDay(day) {
    // 更新當前天數變數
    currentDay = day;
    
    // 更新標題
    document.getElementById('currentDayTitle').innerText = `正在完成：本週第 ${day} 篇感恩日記`;
    
    // --- 根據天數顯示提示 ---
    const promptText = dayPrompts[day] || "回想今日值得感恩的人事物！";
    document.getElementById('promptDisplay').innerText = `第${day}天：${promptText}`;
    // ----------------------------------

    // 從本地儲存讀取舊內容
    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    document.getElementById('journalInput').value = savedData[day] || "";
}

// 儲存內容並更新拼圖
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

// 渲染拼圖板
function renderPuzzle() {
    const board = document.getElementById('puzzleBoard');
    board.innerHTML = "";
    const savedData = JSON.parse(localStorage.getItem('gratitudeJournal')) || {};
    let completedCount = 0;

    for (let i = 1; i <= totalDays; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        
        if (savedData[i]) {
            piece.classList.add('unlocked');
            piece.innerText = quoteWords[i-1]; // 顯示名言的一部分
            completedCount++;
        } else {
            piece.innerText = "?";
        }
        board.appendChild(piece);
    }

    // 如果 7 天都完成了，顯示完整名言
    if (completedCount === totalDays) {
        document.getElementById('quoteDisplay').style.display = "block";
    }
}