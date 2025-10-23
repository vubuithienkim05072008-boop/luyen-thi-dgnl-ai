// HÀM CHÍNH - CHẠY KHI TRANG ĐƯỢC TẢI
window.onload = function() {
    // Lấy kết quả từ localStorage
    const quizResult = JSON.parse(localStorage.getItem('quizResult'));
    
    // Nếu không có kết quả, quay lại trang danh sách đề thi
    if (!quizResult) {
        alert('Không tìm thấy kết quả bài thi!');
        window.location.href = 'exam-list.html';
        return;
    }
    
    // Hiển thị kết quả
    displayResults(quizResult);
    
    // Tạo nhận xét AI và lộ trình học tập
    generateAIFeedback(quizResult.correctCount, quizResult.score, quizResult.questions.length);
};

// HÀM HIỂN THỊ KẾT QUẢ
function displayResults(quizResult) {
    const totalQuestions = quizResult.questions.length;
    const correctCount = quizResult.correctCount;
    const incorrectCount = totalQuestions - correctCount;
    const score = quizResult.score;
    
    // Cập nhật thông tin tổng quan
    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('correct-answers').textContent = correctCount;
    document.getElementById('incorrect-answers').textContent = incorrectCount;
    document.getElementById('score').textContent = score;
    
    // Hiển thị biểu đồ
    displayResultChart(correctCount, incorrectCount);
    
    // Hiển thị chi tiết từng câu hỏi
    displayQuestionDetails(quizResult.questions, quizResult.userAnswers);
}

// HÀM HIỂN THỊ BIỂU ĐỒ KẾT QUẢ
function displayResultChart(correctCount, incorrectCount) {
    const ctx = document.getElementById('result-chart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Câu đúng', 'Câu sai'],
            datasets: [{
                data: [correctCount, incorrectCount],
                backgroundColor: ['#10B981', '#EF4444'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// HÀM HIỂN THỊ CHI TIẾT TỪNG CÂU HỎI
function displayQuestionDetails(questions, userAnswers) {
    const container = document.getElementById('question-details');
    container.innerHTML = '';
    
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        const questionDetail = document.createElement('div');
        questionDetail.className = `mb-6 p-4 rounded-lg border ${isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`;
        
        let answerStatus = '';
        if (isCorrect) {
            answerStatus = '<span class="text-green-600 font-medium"><i class="fas fa-check mr-1"></i> Đúng</span>';
        } else {
            answerStatus = `<span class="text-red-600 font-medium"><i class="fas fa-times mr-1"></i> Sai</span> (Đáp án đúng: ${question.correctAnswer})`;
        }
        
        questionDetail.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-800">Câu ${index + 1}</h3>
                ${answerStatus}
            </div>
            <p class="text-gray-700 mb-2">${question.content}</p>
            ${question.image ? `<img src="${question.image}" alt="Hình minh họa" class="mb-2 rounded-lg max-w-full" style="max-height: 200px;">` : ''}
            <p class="text-gray-700"><strong>Đáp án của bạn:</strong> ${userAnswer || 'Chưa trả lời'}</p>
            <div class="mt-2 p-3 bg-blue-50 rounded-lg">
                <p class="text-gray-700"><strong>Lời giải chi tiết:</strong> ${question.explanation}</p>
            </div>
        `;
        
        container.appendChild(questionDetail);
    });
}

// HÀM TẠO NHẬN XÉT AI VÀ LỘ TRÌNH HỌC TẬP
function generateAIFeedback(correctCount, score, totalQuestions) {
    const percentage = (correctCount / totalQuestions * 100).toFixed(1);
    
    let feedback = '';
    let learningPath = '';
    
    // PHÂN LOẠI KẾT QUẢ VÀ ĐƯA RA NHẬN XÉT PHÙ HỢP
    if (percentage >= 80) {
        feedback = `
            <p class="mb-3">🎉 <strong>Chúc mừng!</strong> Bạn đã hoàn thành bài thi với kết quả <span class="text-green-600 font-bold">xuất sắc</span>. Với ${correctCount}/${totalQuestions} câu trả lời đúng (${percentage}%), bạn đã chứng tỏ nắm vững kiến thức cần thiết.</p>
            <p class="mb-3">💪 <strong>Điểm mạnh:</strong> Khả năng phân tích và xử lý thông tin nhanh chóng. Hãy tiếp tục duy trì phong độ này!</p>
        `;
        learningPath = `
            <p class="mb-3"><strong>Để tiếp tục cải thiện:</strong></p>
            <ul class="list-disc pl-5 space-y-1">
                <li>📈 Luyện tập các dạng bài nâng cao để tăng tốc độ làm bài</li>
                <li>🎯 Thử sức với các đề thi có độ khó cao hơn</li>
                <li>🔍 Ôn tập lại các câu sai để tránh lặp lại sai lầm</li>
            </ul>
        `;
    } else if (percentage >= 60) {
        feedback = `
            <p class="mb-3">👍 <strong>Khá tốt!</strong> Bạn đã hoàn thành bài thi với kết quả <span class="text-blue-600 font-bold">khá</span>. Với ${correctCount}/${totalQuestions} câu trả lời đúng (${percentage}%), bạn đã nắm được phần lớn kiến thức cơ bản.</p>
            <p class="mb-3">💡 <strong>Gợi ý:</strong> Tập trung vào các dạng bài mà bạn thường xuyên mắc lỗi để cải thiện điểm số.</p>
        `;
        learningPath = `
            <p class="mb-3"><strong>Lộ trình học tập đề xuất:</strong></p>
            <ul class="list-disc pl-5 space-y-1">
                <li>📚 Ôn tập kỹ các chủ đề mà bạn đã làm sai</li>
                <li>🔄 Luyện tập thêm các dạng bài tương tự</li>
                <li>⏱️ Phân bổ thời gian hợp lý hơn khi làm bài</li>
            </ul>
        `;
    } else {
        feedback = `
            <p class="mb-3">📝 <strong>Cần cải thiện:</strong> Kết quả bài thi của bạn còn <span class="text-orange-600 font-bold">nhiều điểm cần cải thiện</span>. Với ${correctCount}/${totalQuestions} câu trả lời đúng (${percentage}%), bạn cần ôn tập lại các kiến thức cơ bản.</p>
            <p class="mb-3">🌟 <strong>Đừng nản lòng!</strong> Đây là cơ hội để bạn nhận ra các điểm yếu và tập trung khắc phục chúng.</p>
        `;
        learningPath = `
            <p class="mb-3"><strong>Lộ trình học tập đề xuất:</strong></p>
            <ul class="list-disc pl-5 space-y-1">
                <li>🔰 Ôn tập lại toàn bộ kiến thức cơ bản</li>
                <li>🔄 Làm các bài tập đơn giản trước để xây dựng nền tảng</li>
                <li>📖 Thực hành thường xuyên với các đề thi mẫu</li>
                <li>🎓 Tìm hiểu các phương pháp làm bài hiệu quả</li>
            </ul>
        `;
    }
    
    document.getElementById('ai-feedback').innerHTML = feedback;
    document.getElementById('learning-path').innerHTML = learningPath;
}