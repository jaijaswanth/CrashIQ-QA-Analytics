export const SQL_SCHEMA = `-- CrashLens Database Schema Definition
-- Platform: MySQL / SQLite Compatible

CREATE TABLE Devices (
    device_id VARCHAR(50) PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    ram VARCHAR(20) NOT NULL,
    processor VARCHAR(100) NOT NULL,
    android_version VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Users (
    user_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    device_id VARCHAR(50),
    country VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    experience_level VARCHAR(30) DEFAULT 'Intermediate',
    FOREIGN KEY (device_id) REFERENCES Devices(device_id) ON DELETE SET NULL
);

CREATE TABLE Application (
    app_id VARCHAR(50) PRIMARY KEY,
    app_name VARCHAR(100) NOT NULL,
    version VARCHAR(30) NOT NULL,
    release_date DATE NOT NULL,
    platform VARCHAR(30) DEFAULT 'Android',
    status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE CrashLogs (
    crash_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    app_id VARCHAR(50) NOT NULL,
    crash_time TIMESTAMP NOT NULL,
    exception_type VARCHAR(150) NOT NULL,
    stack_trace TEXT NOT NULL,
    module_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    status VARCHAR(20) DEFAULT 'New',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (app_id) REFERENCES Application(app_id) ON DELETE CASCADE
);

CREATE TABLE TestCases (
    testcase_id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(30) NOT NULL,
    module VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    expected TEXT NOT NULL,
    actual TEXT,
    status VARCHAR(20) DEFAULT 'Pending',
    tester VARCHAR(100) NOT NULL,
    execution_time_ms INT DEFAULT 0
);

CREATE TABLE BugReports (
    bug_id VARCHAR(50) PRIMARY KEY,
    crash_id VARCHAR(50) NOT NULL,
    priority VARCHAR(30) NOT NULL,
    assigned_to VARCHAR(100) NOT NULL,
    bug_status VARCHAR(30) DEFAULT 'Open',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fixed_date TIMESTAMP NULL,
    FOREIGN KEY (crash_id) REFERENCES CrashLogs(crash_id) ON DELETE CASCADE
);

CREATE TABLE Performance (
    performance_id VARCHAR(50) PRIMARY KEY,
    app_id VARCHAR(50) NOT NULL,
    cpu_usage DECIMAL(5,2) NOT NULL,
    memory_usage DECIMAL(8,2) NOT NULL,
    battery_usage DECIMAL(5,2) NOT NULL,
    fps INT NOT NULL,
    response_time INT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES Application(app_id) ON DELETE CASCADE
);

-- CREATE VIEW: Critical Crashes View
CREATE VIEW CriticalCrashView AS
SELECT 
    c.crash_id,
    c.crash_time,
    c.exception_type,
    c.module_name,
    a.app_name,
    a.version AS app_version,
    d.brand,
    d.model AS device_model,
    d.android_version,
    u.name AS user_name,
    u.country
FROM CrashLogs c
JOIN Application a ON c.app_id = a.app_id
JOIN Users u ON c.user_id = u.user_id
JOIN Devices d ON u.device_id = d.device_id
WHERE c.severity = 'Critical';
`;

export const SQL_SAMPLE_DATA = `-- Sample Data Population Script for CrashLens

INSERT INTO Devices VALUES
('DEV-101', 'Google', 'Pixel 8 Pro', '12 GB', 'Tensor G3', 'Android 14', NOW()),
('DEV-102', 'Samsung', 'Galaxy S24 Ultra', '12 GB', 'Snapdragon 8 Gen 3', 'Android 14', NOW()),
('DEV-103', 'Samsung', 'Galaxy A54', '6 GB', 'Exynos 1380', 'Android 13', NOW()),
('DEV-104', 'Xiaomi', 'Redmi Note 12', '4 GB', 'Snapdragon 685', 'Android 12', NOW()),
('DEV-105', 'OnePlus', 'OnePlus 12', '16 GB', 'Snapdragon 8 Gen 3', 'Android 14', NOW());

INSERT INTO Users VALUES
('USR-801', 'Alex Rivera', 'alex.r@qa.crashlens.io', 'DEV-103', 'United States', 'Seattle', 'Power User'),
('USR-802', 'Priya Sharma', 'priya.s@dev.crashlens.io', 'DEV-104', 'India', 'Bengaluru', 'Intermediate'),
('USR-803', 'Marcus Chen', 'marcus.c@tester.io', 'DEV-101', 'Canada', 'Toronto', 'Power User'),
('USR-804', 'Elena Rostova', 'elena.r@sql.crashlens.io', 'DEV-105', 'Germany', 'Berlin', 'Intermediate');

INSERT INTO Application VALUES
('APP-01', 'CrashLens Mobile', '2.4.1', '2026-06-15', 'Android', 'Active'),
('APP-02', 'PayQuick Wallet', '1.9.0', '2026-07-01', 'Android', 'Active');

INSERT INTO CrashLogs VALUES
('CRASH-9001', 'USR-801', 'APP-01', NOW(), 'java.lang.NullPointerException', 'at com.crashlens.network.ApiClient.attachHeaders(ApiClient.java:142)', 'Login Module', 'Critical', 'New'),
('CRASH-9002', 'USR-802', 'APP-02', NOW(), 'java.lang.OutOfMemoryError', 'at android.graphics.Bitmap.nativeCreate(Native Method)', 'Payment Checkout', 'Critical', 'Investigating'),
('CRASH-9003', 'USR-803', 'APP-01', NOW(), 'android.database.sqlite.SQLiteConstraintException', 'at com.crashlens.db.DatabaseHelper.insertCrashRecord', 'Sync Engine', 'High', 'New');
`;

export const SQL_PROCEDURES = `-- Stored Procedure: Generate Daily Crash Aggregation Report

DELIMITER //

CREATE PROCEDURE GenerateDailyCrashReport()
BEGIN
    SELECT 
        DATE(crash_time) AS crash_date,
        COUNT(*) AS total_crashes,
        SUM(CASE WHEN severity = 'Critical' THEN 1 ELSE 0 END) AS critical_crashes,
        SUM(CASE WHEN severity = 'High' THEN 1 ELSE 0 END) AS high_crashes,
        COUNT(DISTINCT user_id) AS impacted_users,
        COUNT(DISTINCT app_id) AS impacted_apps
    FROM CrashLogs
    GROUP BY DATE(crash_time)
    ORDER BY crash_date DESC;
END //

DELIMITER ;
`;

export const SQL_TRIGGERS = `-- Trigger: Automatically Create Bug Report upon Critical Crash Insertion

DELIMITER //

CREATE TRIGGER auto_create_bug_on_critical_crash
AFTER INSERT ON CrashLogs
FOR EACH ROW
BEGIN
    IF NEW.severity = 'Critical' THEN
        INSERT INTO BugReports (bug_id, crash_id, priority, assigned_to, bug_status, created_date)
        VALUES (
            CONCAT('BUG-AUTO-', FLOOR(RAND() * 90000 + 10000)),
            NEW.crash_id,
            'P0 - Immediate',
            'Auto-Assigned QA Lead',
            'Open',
            NOW()
        );
    END IF;
END //

DELIMITER ;
`;

export const SQL_VALIDATION = `-- SQL Validation & Testing Queries

-- 1. Check Duplicate Crash IDs
SELECT crash_id, COUNT(*) 
FROM CrashLogs 
GROUP BY crash_id 
HAVING COUNT(*) > 1;

-- 2. Verify Foreign Key Integrity between Users & Devices
SELECT u.user_id, u.name, u.device_id
FROM Users u
LEFT JOIN Devices d ON u.device_id = d.device_id
WHERE d.device_id IS NULL;

-- 3. Top 5 Devices with Most Crashes using Window Function RANK()
SELECT 
    d.brand,
    d.model,
    COUNT(c.crash_id) AS total_crashes,
    RANK() OVER (ORDER BY COUNT(c.crash_id) DESC) as crash_rank
FROM Devices d
JOIN Users u ON d.device_id = u.device_id
JOIN CrashLogs c ON u.user_id = c.user_id
GROUP BY d.device_id, d.brand, d.model;

-- 4. Unassigned Critical Bug Reports Validation
SELECT b.bug_id, b.crash_id, c.exception_type, c.module_name
FROM BugReports b
JOIN CrashLogs c ON b.crash_id = c.crash_id
WHERE b.priority = 'P0 - Immediate' AND b.bug_status = 'Open';
`;
