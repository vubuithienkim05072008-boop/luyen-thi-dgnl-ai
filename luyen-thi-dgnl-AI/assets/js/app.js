// DỮ LIỆU MẪU - Sau này sẽ thay bằng dữ liệu thật từ Airtable
const sampleData = {
    exams: {
        'VSAT': [
            {
                id: 1,
                name: 'Phần Tư duy định lượng',
                description: '20 câu hỏi về Toán học',
                time: 30, // 30 phút
                questions: []
            },
            {
                id: 2,
                name: 'Phần Tư duy ngôn ngữ',
                description: '20 câu hỏi về Tiếng Việt',
                time: 30,
                questions: []
            },
            {
                id: 3,
                name: 'Phần Tư duy logic',
                description: '10 câu hỏi về Logic',
                time: 15,
                questions: []
            }
        ],
        'V-ACT': [
            {
                id: 4,
                name: 'Phần Tư duy logic',
                description: '20 câu hỏi về Logic',
                time: 30,
                questions: []
            },
            {
                id: 5,
                name: 'Phần Toán học',
                description: '20 câu hỏi về Toán',
                time: 30,
                questions: []
            },
            {
                id: 6,
                name: 'Phần Khoa học tự nhiên',
                description: '20 câu hỏi về KHTN',
                time: 30,
                questions: []
            }
        ]
    }
};

// HÀM TẠO CÂU HỎI MẪU
function generateSampleQuestions(count, type) {
    const questions = [];
    
    for (let i = 1; i <= count; i++) {
        // Xác định loại câu hỏi (1: ABCD, 2: Đúng/Sai, 3: Điền đáp số)
        let questionType;
        if (type === 'VSAT') {
            if (i <= 7) questionType = 1;
            else if (i <= 14) questionType = 2;
            else questionType = 3;
        } else {
            if (i <= 10) questionType = 1;
            else if (i <= 15) questionType = 2;
            else questionType = 3;
        }

        // Tạo câu hỏi
        const question = {
            id: i,
            content: `Đây là nội dung câu hỏi số ${i} của đề thi ${type}. Câu hỏi này kiểm tra kiến thức về...`,
            image: i % 4 === 0 ? `https://picsum.photos/400/200?random=${i}` : null, // Một số câu có ảnh
            type: questionType,
            correctAnswer: '',
            explanation: `Đây là lời giải chi tiết cho câu hỏi số ${i}. Bước 1: ... Bước 2: ... Kết luận: ...`
        };

        // Tạo đáp án tùy theo loại câu hỏi
        if (questionType === 1) {
            // Trắc nghiệm ABCD
            question.options = [
                'A. Đáp án A',
                'B. Đáp án B', 
                'C. Đáp án C',
                'D. Đáp án D'
            ];
            question.correctAnswer = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
        } else if (questionType === 2) {
            // Đúng/Sai
            question.options = ['Đúng', 'Sai'];
            question.correctAnswer = ['Đúng', 'Sai'][Math.floor(Math.random() * 2)];
        } else {
            // Điền đáp số
            question.correctAnswer = (Math.floor(Math.random() * 100) + 1).toString();
        }

        questions.push(question);
    }
    return questions;
}

// HÀM KHỞI TẠO DỮ LIỆU MẪU
function initializeSampleData() {
    for (const examType in sampleData.exams) {
        sampleData.exams[examType].forEach(exam => {
            exam.questions = generateSampleQuestions(20, examType);
        });
    }
    console.log('Dữ liệu mẫu đã được khởi tạo!');
}

// HÀM LẤY THAM SỐ TỪ URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// HÀM ĐỊNH DẠNG THỜI GIAN
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// KHỞI CHẠY KHI TRANG WEB ĐƯỢC TẢI
window.onload = function() {
    initializeSampleData();
    console.log('Ứng dụng đã sẵn sàng!');
};