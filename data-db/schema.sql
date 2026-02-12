-- MySQL Database Schema for Todo App
-- Run this script to set up the database

CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Users table (stores encrypted credentials)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_encrypted VARCHAR(1000) NOT NULL,
  iv VARCHAR(200) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(500) NOT NULL,
  time VARCHAR(255) NOT NULL,
  task_id VARCHAR(50) NOT NULL UNIQUE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Completed tasks table (or use is_completed flag above)
CREATE TABLE IF NOT EXISTS completed_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(500) NOT NULL,
  time VARCHAR(255) NOT NULL,
  task_id VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_user_tasks ON tasks(user_id);
CREATE INDEX idx_user_completed ON completed_tasks(user_id);
