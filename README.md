# Offer之路

一个简洁的求职投递记录管理工具，帮助你高效追踪求职进度。

## 界面
<img width="2549" height="1242" alt="image" src="https://github.com/user-attachments/assets/5cd740e9-2ee8-4086-8b23-9bcdbc6a4355" />
<img width="2549" height="1242" alt="image" src="https://github.com/user-attachments/assets/7f02387c-1e60-443e-af73-574851845c2c" />
<img width="2560" height="1304" alt="image" src="https://github.com/user-attachments/assets/d377bd3d-0c1d-4ac0-9c43-57749048fe42" />


## 功能特性

### 投递记录管理
- **新增记录**：填写公司名、岗位、城市、投递链接、状态和备注
- **编辑记录**：随时修改已有的投递信息
- **删除记录**：移除不需要的记录（带确认提示）
- **状态筛选**：按状态快速筛选查看投递记录

### 状态管理
支持7种投递状态，不同状态显示不同颜色标识：
- 🔘 未投递
- 🔵 已投递
- 🟡 笔试中
- 🟣 面试中
- 🔴 挂了
- 🩵 等offer
- 🟢 收到offer

### 设置功能
- 设置默认岗位名称，新增记录时自动填充

### 统计面板
实时显示投递数据概览：
- 总投递数
- 待投递数
- 面试中数
- 已Offer数

### 导出报告
支持导出为 TXT 或 Markdown 格式的投递报告：
- 包含统计概览
- 按状态分类的详细记录
- 自动下载到浏览器

## 快速开始

### 方式：手动打开
在浏览器中直接打开 `index.html` 文件即可使用。

## 文件结构

```
OFFER之路/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # 核心逻辑
└── README.md           # 项目说明
```

## 数据存储

- 投递记录保存在 localStorage的offer-road-data中
- 设置信息保存在 localStorage的offer-road-settings中
- 数据自动保存，无需手动操作

## 技术栈

- **前端**：HTML5 + CSS3 + JavaScript ES6+
- **样式**：深色工业风设计
- **图标**：Lucide Icons（SVG）
- **字体**：Inter（Google Fonts）
- **数据**：本地 JSON 文件存储

## 使用说明

1. 点击「新增投递」按钮添加记录
2. 填写公司名、岗位、城市等信息
3. 选择当前投递状态
4. 备注会自动填充日期格式（如：2026-7-22投递）
5. 点击「编辑」修改记录，点击「删除」移除记录
6. 使用状态筛选快速定位特定记录
7. 点击「导出报告」生成投递总结

## 响应式设计

支持桌面端和移动端访问，布局自动适配屏幕尺寸。
