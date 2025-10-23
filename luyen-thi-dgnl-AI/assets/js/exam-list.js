// HÀM CHÍNH - CHẠY KHI TRANG ĐƯỢC TẢI
window.onload = function() {
    // Khởi tạo dữ liệu mẫu
    initializeSampleData();
    
    // Lấy tham số từ URL (xem người dùng chọn VSAT hay V-ACT)
    const params = getUrlParams();
    const examType = params.type || 'VSAT';
    
    // Hiển thị tiêu đề
    document.getElementById('exam-type-title').textContent = `Kỳ thi ${examType} - Danh sách đề thi`;
    
    // Hiển thị danh sách đề thi
    displayExamList(examType);
};

// HÀM HIỂN THỊ DANH SÁCH ĐỀ THI
function displayExamList(examType) {
    const examList = document.getElementById('exam-list');
    
    // Xóa nội dung "đang tải"
    examList.innerHTML = '';
    
    // Lấy danh sách đề thi từ dữ liệu mẫu
    const exams = sampleData.exams[examType];
    
    // Nếu không có đề thi nào
    if (!exams || exams.length === 0) {
        examList.innerHTML = `
            <div class="col-span-3 text-center py-8">
                <i class="fas fa-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
                <p>Chưa có đề thi nào cho kỳ thi này.</p>
            </div>
        `;
        return;
    }
    
    // Tạo thẻ HTML cho từng đề thi
    exams.forEach(exam => {
        const examCard = document.createElement('div');
        examCard.className = 'bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300';
        
        examCard.innerHTML = `
            <div class="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <i class="fas fa-file-alt text-blue-500 text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-gray-800 text-center mb-2">${exam.name}</h3>
            <p class="text-gray-600 text-center mb-4">${exam.description}</p>
            <div class="flex justify-between text-sm text-gray-500 mb-4">
                <span><i class="far fa-clock mr-1"></i> ${exam.time} phút</span>
                <span><i class="far fa-question-circle mr-1"></i> ${exam.questions.length} câu</span>
            </div>
            <a href="quiz.html?exam=${exam.id}" class="block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 w-full text-center">
                Bắt đầu làm bài
            </a>
        `;
        
        examList.appendChild(examCard);
    });
}