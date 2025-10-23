// BIẾN TOÀN CỤC - Lưu trữ thông tin bài thi đang làm
let currentExam = null;          // Đề thi hiện tại
let currentQuestions = [];       // Danh sách câu hỏi
let userAnswers = [];           // Câu trả lời của người dùng
let currentQuestionIndex = 0;   // Câu hỏi hiện tại đang xem
let timeLeft = 0;               // Thời gian còn lại (giây)
let timerInterval = null;       // Biến lưu đồng hồ

// HÀM CHÍNH - CHẠY KHI TRANG ĐƯỢC TẢI
window.onload = function() {
    // Khởi tạo dữ liệu mẫu
    initializeSampleData();
    
    // Lấy tham số từ URL (xem đề thi nào được chọn)
    const params = getUrlParams();
    const examId = parseInt(params.exam) || 1;
    
    // Tìm đề thi theo ID
    for (const examType in sampleData.exams) {
        currentExam = sampleData.exams[examType].find(exam => exam.id === examId);
        if (currentExam) break;
    }
    
    // Nếu không tìm thấy đề thi, quay lại trang danh sách
    if (!currentExam) {
        alert('Không tìm thấy đề thi!');
        window.location.href = 'exam-list.html';
        return;
    }
    
    // KHỞI TẠO DỮ LIỆU CHO BÀI LÀM
    currentQuestions = [...currentExam.questions]; // Copy danh sách câu hỏi
    userAnswers = new Array(currentQuestions.length).fill(null); // Mảng câu trả lời, ban đầu là null
    currentQuestionIndex = 0; // Bắt đầu từ câu hỏi đầu tiên
    timeLeft = currentExam.time * 60; // Chuyển đổi phút sang giây
    
    // HIỂN THỊ THÔNG TIN ĐỀ THI
    document.getElementById('quiz-title').textContent = currentExam.name;
    
    // BẮT ĐẦU ĐỒNG HỒ ĐẾM NGƯỢC
    startTimer();
    
    // HIỂN THỊ GIAO DIỆN
    displayQuestionNavigation();
    displayCurrentQuestion();
    updateNavigationButtons();
    
    // THÊM SỰ KIỆN CHO CÁC NÚT
    document.getElementById('prev-btn').addEventListener('click', previousQuestion);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('submit-btn').addEventListener('click', submitQuiz);
};

// HÀM BẮT ĐẦU ĐỒNG HỒ ĐẾM NGƯỢC
function startTimer() {
    // Cập nhật đồng hồ ngay lập tức
    updateTimerDisplay();
    
    // Cập nhật mỗi giây
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        // Nếu hết giờ, tự động nộp bài
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

// HÀM CẬP NHẬT HIỂN THỊ ĐỒNG HỒ
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// HÀM HIỂN THỊ BẢNG ĐIỀU HƯỚNG CÂU HỎI
function displayQuestionNavigation() {
    const navigationContainer = document.getElementById('question-navigation');
    navigationContainer.innerHTML = '';
    
    currentQuestions.forEach((_, index) => {
        const navItem = document.createElement('div');
        
        // Xác định class CSS dựa trên trạng thái câu hỏi
        let cssClass = 'question-nav-item ';
        if (index === currentQuestionIndex) {
            cssClass += 'current'; // Câu hiện tại
        } else if (userAnswers[index] !== null) {
            cssClass += 'answered'; // Đã trả lời
        } else {
            cssClass += 'unanswered'; // Chưa trả lời
        }
        
        navItem.className = cssClass;
        navItem.textContent = index + 1;
        navItem.addEventListener('click', () => goToQuestion(index));
        
        navigationContainer.appendChild(navItem);
    });
}

// HÀM HIỂN THỊ CÂU HỎI HIỆN TẠI
function displayCurrentQuestion() {
    const questionContainer = document.getElementById('question-container');
    const currentQuestion = currentQuestions[currentQuestionIndex];
    
    let optionsHTML = '';
    
    // TÙY THEO LOẠI CÂU HỎI MÀ HIỂN THỊ KHÁC NHAU
    if (currentQuestion.type === 1) {
        // TRẮC NGHIỆM ABCD
        currentQuestion.options.forEach((option) => {
            const isSelected = userAnswers[currentQuestionIndex] === option.charAt(0);
            optionsHTML += `
                <div class="option-item ${isSelected ? 'selected' : ''}" onclick="selectOption('${option.charAt(0)}')">
                    ${option}
                </div>
            `;
        });
    } else if (currentQuestion.type === 2) {
        // ĐÚNG/SAI
        currentQuestion.options.forEach(option => {
            const isSelected = userAnswers[currentQuestionIndex] === option;
            optionsHTML += `
                <div class="option-item ${isSelected ? 'selected' : ''}" onclick="selectOption('${option}')">
                    ${option}
                </div>
            `;
        });
    } else {
        // ĐIỀN ĐÁP SỐ
        const currentAnswer = userAnswers[currentQuestionIndex] || '';
        optionsHTML = `
            <div class="mb-4">
                <label class="block text-gray-700 font-medium mb-2">Nhập đáp án:</label>
                <input type="text" id="answer-input" class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value="${currentAnswer}" oninput="updateTextAnswer(this.value)">
            </div>
        `;
    }
    
    // HIỂN THỊ NỘI DUNG CÂU HỎI
    questionContainer.innerHTML = `
        <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Câu ${currentQuestionIndex + 1}:</h2>
            <p class="text-gray-700 mb-4">${currentQuestion.content}</p>
            ${currentQuestion.image ? `<img src="${currentQuestion.image}" alt="Hình minh họa" class="mb-4 rounded-lg max-w-full">` : ''}
        </div>
        <div>
            ${optionsHTML}
        </div>
    `;
    
    // KIỂM TRA XEM ĐÃ TRẢ LỜI HẾT TẤT CẢ CÂU HỎI CHƯA
    checkAllQuestionsAnswered();
}

// HÀM CHỌN ĐÁP ÁN (CHO CÂU HỎI TRẮC NGHIỆM VÀ ĐÚNG/SAI)
function selectOption(option) {
    userAnswers[currentQuestionIndex] = option;
    displayQuestionNavigation();
    displayCurrentQuestion();
    updateNavigationButtons();
}

// HÀM CẬP NHẬT ĐÁP ÁN (CHO CÂU HỎI ĐIỀN ĐÁP SỐ)
function updateTextAnswer(value) {
    userAnswers[currentQuestionIndex] = value;
    displayQuestionNavigation();
    updateNavigationButtons();
}

// HÀM CẬP NHẬT NÚT ĐIỀU HƯỚNG
function updateNavigationButtons() {
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').disabled = currentQuestionIndex === currentQuestions.length - 1;
}

// HÀM KIỂM TRA XEM ĐÃ TRẢ LỜI HẾT CÂU HỎI CHƯA
function checkAllQuestionsAnswered() {
    const allAnswered = userAnswers.every(answer => answer !== null);
    document.getElementById('submit-btn').classList.toggle('hidden', !allAnswered);
}

// HÀM CHUYỂN ĐẾN CÂU HỎI TRƯỚC
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayCurrentQuestion();
        displayQuestionNavigation();
        updateNavigationButtons();
    }
}

// HÀM CHUYỂN ĐẾN CÂU HỎI TIẾP THEO
function nextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        displayCurrentQuestion();
        displayQuestionNavigation();
        updateNavigationButtons();
    }
}

// HÀM CHUYỂN ĐẾN CÂU HỎI CỤ THỂ
function goToQuestion(index) {
    currentQuestionIndex = index;
    displayCurrentQuestion();
    displayQuestionNavigation();
    updateNavigationButtons();
}

// HÀM NỘP BÀI
function submitQuiz() {
    // DỪNG ĐỒNG HỒ
    clearInterval(timerInterval);
    
    // TÍNH ĐIỂM
    let correctCount = 0;
    currentQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.correctAnswer) {
            correctCount++;
        }
    });
    
    const score = (correctCount * 0.5).toFixed(1);
    
    // LƯU KẾT QUẢ VÀO LOCALSTORAGE ĐỂ TRANG KẾT QUẢ SỬ DỤNG
    localStorage.setItem('quizResult', JSON.stringify({
        exam: currentExam,
        questions: currentQuestions,
        userAnswers: userAnswers,
        correctCount: correctCount,
        score: score
    }));
    
    // CHUYỂN ĐẾN TRANG KẾT QUẢ
    window.location.href = 'result.html';
}