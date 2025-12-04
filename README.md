# Front-end
Đây là Repo lưu trữ các file frond end cho hệ thống nghe nhạc theo mood

[![React Native CI - Test, Report & SonarCloud](https://github.com/NukitashiTeam/Front-end/actions/workflows/test.yml/badge.svg)](https://github.com/NukitashiTeam/Front-end/actions/workflows/test.yml)

## 🧪 Testing Guide


This project uses *Jest* and *React Native Testing Library* to test both UI components and application logic.


### 1. Run all tests


npm run test


This command will:


- Execute all test files inside the __tests__/ directory
- Display pass/fail results in the terminal
- Automatically watch file changes in development mode


### 2. Run tests with coverage report


npm run test:coverage


This command will:


- Generate a *coverage report*
- Export results to:


coverage/
└── index.html


You can open coverage/index.html in your browser to view a detailed coverage dashboard (statements, branches, functions, lines).
