const STORAGE_KEY = 'offer-road-data';

let records = [];
let settings = {
    defaultPosition: ''
};
let editingId = null;
let deletingId = null;

const statusMap = {
    '未投递': 'unapplied',
    '已投递': 'applied',
    '笔试中': 'testing',
    '面试中': 'interviewing',
    '挂了': 'rejected',
    '等offer': 'waiting',
    '收到offer': 'offer'
};

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    loadSettings();
    renderRecords();
    updateStats();
    setupEventListeners();
});

function loadData() {
    records = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function loadSettings() {
    settings = JSON.parse(localStorage.getItem('offer-road-settings') || '{"defaultPosition":""}');
}

function saveSettings() {
    localStorage.setItem('offer-road-settings', JSON.stringify(settings));
}

function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', openAddModal);
    document.getElementById('settingsBtn').addEventListener('click', openSettingsModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('recordForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('settingsClose').addEventListener('click', closeSettingsModal);
    document.getElementById('settingsCancel').addEventListener('click', closeSettingsModal);
    document.getElementById('settingsForm').addEventListener('submit', handleSettingsSubmit);
    document.getElementById('statusFilter').addEventListener('change', renderRecords);
    document.getElementById('searchInput').addEventListener('input', renderRecords);
    document.getElementById('confirmClose').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmCancel').addEventListener('click', closeConfirmModal);
    document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
    document.getElementById('exportBtn').addEventListener('click', openExportModal);
    document.getElementById('exportClose').addEventListener('click', closeExportModal);
    document.getElementById('exportCancel').addEventListener('click', closeExportModal);
    document.getElementById('exportConfirm').addEventListener('click', handleExport);

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.record-actions')) {
            document.querySelectorAll('.record-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        }
    });
}

function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = '新增投递记录';
    document.getElementById('company').value = '';
    document.getElementById('position').value = settings.defaultPosition;
    document.getElementById('city').value = '';
    document.getElementById('link').value = '';
    document.getElementById('status').value = '已投递';
    const now = new Date();
    document.getElementById('remark').value = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}投递`;
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('company').focus();
}

function openEditModal(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;

    editingId = id;
    document.getElementById('modalTitle').textContent = '编辑投递记录';
    document.getElementById('company').value = record.company;
    document.getElementById('position').value = record.position;
    document.getElementById('city').value = record.city;
    document.getElementById('link').value = record.link || '';
    document.getElementById('status').value = record.status;
    document.getElementById('remark').value = record.remark || '';
    document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
}

function openSettingsModal() {
    document.getElementById('defaultPosition').value = settings.defaultPosition;
    document.getElementById('settingsModal').classList.remove('hidden');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.add('hidden');
}

function handleFormSubmit(e) {
    e.preventDefault();

    const record = {
        id: editingId || Date.now().toString(),
        company: document.getElementById('company').value,
        position: document.getElementById('position').value,
        city: document.getElementById('city').value,
        link: document.getElementById('link').value,
        status: document.getElementById('status').value,
        remark: document.getElementById('remark').value,
        createdAt: editingId ? records.find(r => r.id === editingId).createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (editingId) {
        const index = records.findIndex(r => r.id === editingId);
        if (index !== -1) {
            records[index] = record;
        }
    } else {
        records.unshift(record);
    }

    saveData();
    renderRecords();
    updateStats();
    closeModal();
}

function handleSettingsSubmit(e) {
    e.preventDefault();
    settings.defaultPosition = document.getElementById('defaultPosition').value;
    saveSettings();
    closeSettingsModal();
}

function renderRecords() {
    const list = document.getElementById('recordsList');
    const filter = document.getElementById('statusFilter').value;
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();

    let filteredRecords = filter === 'all' 
        ? records 
        : records.filter(r => r.status === filter);

    if (searchTerm) {
        filteredRecords = filteredRecords.filter(r => 
            r.company.toLowerCase().includes(searchTerm) ||
            (r.city && r.city.toLowerCase().includes(searchTerm))
        );
    }

    if (filteredRecords.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                </svg>
                <p>暂无投递记录</p>
                <p class="empty-hint">点击右上角「新增投递」开始记录</p>
            </div>
        `;
        return;
    }

    list.innerHTML = filteredRecords.map(record => {
        const statusClass = statusMap[record.status] || 'unapplied';
        const linkHtml = record.link ? `
            <a href="${record.link}" target="_blank" class="record-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                查看链接
            </a>
        ` : '';

        return `
            <div class="record-card status-${statusClass}" data-id="${record.id}">
                <div class="record-header">
                    <div class="record-info">
                        <div class="record-company">${escapeHtml(record.company)}</div>
                        <div class="record-position">${escapeHtml(record.position) || '未填写'}</div>
                    </div>
                    <div class="record-right">
                        <span class="record-status">${record.status}</span>
                        <div class="record-actions">
                            <button class="record-action-btn edit-btn" onclick="openEditModal('${record.id}')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                                </svg>
                                编辑
                            </button>
                            <button class="record-action-btn delete-btn" onclick="openDeleteConfirm('${record.id}')">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                                删除
                            </button>
                        </div>
                    </div>
                </div>
                <div class="record-meta">
                    <span class="record-meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                        </svg>
                        ${escapeHtml(record.city) || '未填写'}
                    </span>
                </div>
                ${linkHtml}
                ${record.remark ? `<div class="record-remark">${escapeHtml(record.remark)}</div>` : ''}
            </div>
        `;
    }).join('');
}

function toggleMenu(menuId) {
    const menu = document.getElementById(menuId);
    document.querySelectorAll('.record-menu').forEach(m => {
        if (m.id !== menuId) m.classList.add('hidden');
    });
    menu.classList.toggle('hidden');
}

function openDeleteConfirm(id) {
    deletingId = id;
    document.getElementById('confirmModal').classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.add('hidden');
    deletingId = null;
}

function openExportModal() {
    document.getElementById('exportModal').classList.remove('hidden');
}

function closeExportModal() {
    document.getElementById('exportModal').classList.add('hidden');
}

function handleExport() {
    const format = document.getElementById('exportFormat').value;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    let content;
    let filename;
    
    if (format === 'md') {
        content = generateMarkdownReport();
        filename = `offer-road-report-${dateStr}.md`;
    } else {
        content = generateTxtReport();
        filename = `offer-road-report-${dateStr}.txt`;
    }
    
    downloadFile(content, filename, format === 'md' ? 'text/markdown' : 'text/plain');
    closeExportModal();
}

function generateMarkdownReport() {
    const now = new Date();
    const statusOrder = ['未投递', '已投递', '笔试中', '面试中', '挂了', '等offer', '收到offer'];
    
    let content = `# Offer之路 - 求职投递报告\n\n`;
    content += `> 生成时间：${now.toLocaleString('zh-CN')}\n`;
    content += `> 总投递数：${records.length}\n\n`;
    
    content += `## 统计概览\n\n`;
    content += `| 状态 | 数量 |\n`;
    content += `|------|------|\n`;
    statusOrder.forEach(status => {
        const count = records.filter(r => r.status === status).length;
        content += `| ${status} | ${count} |\n`;
    });
    content += `\n`;
    
    content += `## 投递详情\n\n`;
    
    statusOrder.forEach(status => {
        const filtered = records.filter(r => r.status === status);
        if (filtered.length === 0) return;
        
        content += `### ${status} (${filtered.length}家)\n\n`;
        
        filtered.forEach((record, index) => {
            content += `${index + 1}. **${record.company}**\n`;
            content += `   - 岗位：${record.position || '未填写'}\n`;
            content += `   - 城市：${record.city || '未填写'}\n`;
            content += `   - 备注：${record.remark || '无'}\n`;
            if (record.link) {
                content += `   - 链接：${record.link}\n`;
            }
            content += `\n`;
        });
    });
    
    return content;
}

function generateTxtReport() {
    const now = new Date();
    const statusOrder = ['未投递', '已投递', '笔试中', '面试中', '挂了', '等offer', '收到offer'];
    
    let content = 'Offer之路 - 求职投递报告\n';
    content += '='.repeat(50) + '\n\n';
    content += `生成时间：${now.toLocaleString('zh-CN')}\n`;
    content += `总投递数：${records.length}\n\n`;
    
    content += '【统计概览】\n';
    content += '-'.repeat(30) + '\n';
    statusOrder.forEach(status => {
        const count = records.filter(r => r.status === status).length;
        content += `${status}：${count}家\n`;
    });
    content += '\n';
    
    content += '【投递详情】\n';
    content += '-'.repeat(30) + '\n\n';
    
    statusOrder.forEach(status => {
        const filtered = records.filter(r => r.status === status);
        if (filtered.length === 0) return;
        
        content += `【${status}】(${filtered.length}家)\n`;
        content += '-'.repeat(20) + '\n';
        
        filtered.forEach((record, index) => {
            content += `${index + 1}. ${record.company}\n`;
            content += `   岗位：${record.position || '未填写'}\n`;
            content += `   城市：${record.city || '未填写'}\n`;
            content += `   备注：${record.remark || '无'}\n`;
            if (record.link) {
                content += `   链接：${record.link}\n`;
            }
            content += '\n';
        });
    });
    
    return content;
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function confirmDelete() {
    if (!deletingId) return;

    records = records.filter(r => r.id !== deletingId);
    saveData();
    renderRecords();
    updateStats();
    closeConfirmModal();
}

function updateStats() {
    document.getElementById('totalCount').textContent = records.length;
    document.getElementById('testingCount').textContent = records.filter(r => r.status === '笔试中').length;
    document.getElementById('interviewCount').textContent = records.filter(r => r.status === '面试中').length;
    document.getElementById('rejectedCount').textContent = records.filter(r => r.status === '挂了').length;
    document.getElementById('waitingCount').textContent = records.filter(r => r.status === '等offer').length;
    document.getElementById('offerCount').textContent = records.filter(r => r.status === '收到offer').length;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.toggleMenu = toggleMenu;
window.openEditModal = openEditModal;
window.openDeleteConfirm = openDeleteConfirm;