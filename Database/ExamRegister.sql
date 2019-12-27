-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 27, 2019 at 05:48 PM
-- Server version: 5.7.28-0ubuntu0.18.04.4
-- PHP Version: 7.2.24-0ubuntu0.18.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ExamRegister`
--

-- --------------------------------------------------------

--
-- Table structure for table `Admin`
--

CREATE TABLE `Admin` (
  `adminID` int(20) NOT NULL,
  `name` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `vnumail` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `Admin`
--

INSERT INTO `Admin` (`adminID`, `name`, `vnumail`) VALUES
(10, 'Trần Hoàng Minh', '16020055@vnu.edu.vn');

-- --------------------------------------------------------

--
-- Table structure for table `Exam`
--

CREATE TABLE `Exam` (
  `examID` int(20) NOT NULL,
  `name` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ExamSchedule_Room`
--

CREATE TABLE `ExamSchedule_Room` (
  `esID` int(20) NOT NULL,
  `roomID` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Exam_Schedule`
--

CREATE TABLE `Exam_Schedule` (
  `examID` int(20) NOT NULL,
  `numberSeatsLeft` int(10) NOT NULL,
  `esID` int(20) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `seatsEachRoomLeft` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `Exam_Schedule`
--

INSERT INTO `Exam_Schedule` (`examID`, `numberSeatsLeft`, `esID`, `startTime`, `endTime`, `seatsEachRoomLeft`) VALUES
(1, 120, 1, '2019-12-18 06:29:13', '2019-12-18 08:00:00', '{\"309-GĐ2\": 30}');

-- --------------------------------------------------------

--
-- Table structure for table `Room`
--

CREATE TABLE `Room` (
  `roomID` int(20) NOT NULL,
  `name` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `numberSeats` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `Room`
--

INSERT INTO `Room` (`roomID`, `name`, `numberSeats`) VALUES
(1, '303-G3', 40);

-- --------------------------------------------------------

--
-- Table structure for table `Students`
--

CREATE TABLE `Students` (
  `studentID` int(20) NOT NULL,
  `code` int(20) NOT NULL,
  `name` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `vnumail` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `dateOfBirth` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `gender` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `Students`
--

INSERT INTO `Students` (`studentID`, `code`, `name`, `vnumail`, `dateOfBirth`, `gender`) VALUES
(1, 16020055, 'Trần Hoàng Minh', '16020055@vnu.edu.vn', '', ''),
(2, 16020033, 'Nguyễn văn', '16020055@vnu.edu.vn', '', ''),
(17, 16020059, 'Trần Hoàng Minh', '16020055@vnu.edu.vn', '22-04-1998', 'male');

-- --------------------------------------------------------

--
-- Table structure for table `Student_ExamSchedule`
--

CREATE TABLE `Student_ExamSchedule` (
  `studentID` int(20) NOT NULL,
  `esID` int(20) NOT NULL,
  `roomID` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Student_Subject`
--

CREATE TABLE `Student_Subject` (
  `studentCode` int(20) NOT NULL,
  `subjectCode` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `can_join_exam` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `Student_Subject`
--

INSERT INTO `Student_Subject` (`studentCode`, `subjectCode`, `can_join_exam`) VALUES
(16020055, 'INT2203 4', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Subjects`
--

CREATE TABLE `Subjects` (
  `subjectID` int(20) NOT NULL,
  `name` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `code` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `lecturer` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `credíts` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `Subjects`
--

INSERT INTO `Subjects` (`subjectID`, `name`, `code`, `lecturer`, `credíts`) VALUES
(1, 'Phát triển ứng dụng web', 'INT3306 10', 'Lê Đình Thanh', 3),
(2, 'Cấu trúc dữ liệu và giải thuật', 'INT2203 4', 'Trần Bảo Sơn', 3);

-- --------------------------------------------------------

--
-- Table structure for table `Subject_ExamSchedule`
--

CREATE TABLE `Subject_ExamSchedule` (
  `subjectID` int(20) NOT NULL,
  `esID` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `Subject_ExamSchedule`
--

INSERT INTO `Subject_ExamSchedule` (`subjectID`, `esID`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `userID` int(20) NOT NULL,
  `userName` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `passWord` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL,
  `role` varchar(30) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`userID`, `userName`, `passWord`, `role`) VALUES
(1, '16020055', 'lovemeo34', '0'),
(2, '16020033', 'lovemeo34', '0'),
(3, '16020013', 'lovemeo34', '0'),
(5, '16020044', 'lovemeo34', '0'),
(6, '16020088', 'lovemeo34', '0'),
(7, '16020099', 'lovemeo34', '0'),
(8, '16020056', 'lovemeo34', '0'),
(9, '16020057', 'lovemeo34', '0'),
(10, 'admin', '1', '1'),
(11, '16020060', 'lovemeo34', '0'),
(12, '16020061', 'lovemeo34', '0'),
(13, '16020062', 'lovemeo34', '0'),
(14, '160200672', 'lovemeo34', '0'),
(15, '1602006172', 'lovemeo34', '0'),
(16, '1602008172', 'lovemeo34', '0'),
(17, '165656', 'lovemeo34', '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Admin`
--
ALTER TABLE `Admin`
  ADD PRIMARY KEY (`adminID`);

--
-- Indexes for table `Exam`
--
ALTER TABLE `Exam`
  ADD PRIMARY KEY (`examID`);

--
-- Indexes for table `ExamSchedule_Room`
--
ALTER TABLE `ExamSchedule_Room`
  ADD KEY `esID` (`esID`),
  ADD KEY `roomID` (`roomID`);

--
-- Indexes for table `Exam_Schedule`
--
ALTER TABLE `Exam_Schedule`
  ADD PRIMARY KEY (`esID`);

--
-- Indexes for table `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`roomID`);

--
-- Indexes for table `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`studentID`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `Student_ExamSchedule`
--
ALTER TABLE `Student_ExamSchedule`
  ADD KEY `studentID` (`studentID`),
  ADD KEY `studentID_2` (`studentID`),
  ADD KEY `esID` (`esID`),
  ADD KEY `roomID` (`roomID`);

--
-- Indexes for table `Student_Subject`
--
ALTER TABLE `Student_Subject`
  ADD KEY `studentID` (`studentCode`),
  ADD KEY `subjectID` (`subjectCode`);

--
-- Indexes for table `Subjects`
--
ALTER TABLE `Subjects`
  ADD PRIMARY KEY (`subjectID`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `Subject_ExamSchedule`
--
ALTER TABLE `Subject_ExamSchedule`
  ADD KEY `subjectID` (`subjectID`),
  ADD KEY `esID` (`esID`),
  ADD KEY `subjectID_2` (`subjectID`),
  ADD KEY `esID_2` (`esID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Admin`
--
ALTER TABLE `Admin`
  MODIFY `adminID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `Exam`
--
ALTER TABLE `Exam`
  MODIFY `examID` int(20) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `Exam_Schedule`
--
ALTER TABLE `Exam_Schedule`
  MODIFY `esID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `Room`
--
ALTER TABLE `Room`
  MODIFY `roomID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `Students`
--
ALTER TABLE `Students`
  MODIFY `studentID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- AUTO_INCREMENT for table `Subjects`
--
ALTER TABLE `Subjects`
  MODIFY `subjectID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `userID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Admin`
--
ALTER TABLE `Admin`
  ADD CONSTRAINT `Admin_ibfk_1` FOREIGN KEY (`adminID`) REFERENCES `Users` (`userID`);

--
-- Constraints for table `ExamSchedule_Room`
--
ALTER TABLE `ExamSchedule_Room`
  ADD CONSTRAINT `ExamSchedule_Room_ibfk_1` FOREIGN KEY (`esID`) REFERENCES `Exam_Schedule` (`esID`),
  ADD CONSTRAINT `ExamSchedule_Room_ibfk_2` FOREIGN KEY (`roomID`) REFERENCES `Room` (`roomID`);

--
-- Constraints for table `Students`
--
ALTER TABLE `Students`
  ADD CONSTRAINT `Students_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `Users` (`userID`);

--
-- Constraints for table `Student_ExamSchedule`
--
ALTER TABLE `Student_ExamSchedule`
  ADD CONSTRAINT `Student_ExamSchedule_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `Students` (`studentID`),
  ADD CONSTRAINT `Student_ExamSchedule_ibfk_2` FOREIGN KEY (`esID`) REFERENCES `Exam_Schedule` (`esID`),
  ADD CONSTRAINT `Student_ExamSchedule_ibfk_3` FOREIGN KEY (`roomID`) REFERENCES `Room` (`roomID`);

--
-- Constraints for table `Student_Subject`
--
ALTER TABLE `Student_Subject`
  ADD CONSTRAINT `Student_Subject_ibfk_2` FOREIGN KEY (`subjectCode`) REFERENCES `Subjects` (`code`),
  ADD CONSTRAINT `Student_Subject_ibfk_3` FOREIGN KEY (`studentCode`) REFERENCES `Students` (`code`);

--
-- Constraints for table `Subject_ExamSchedule`
--
ALTER TABLE `Subject_ExamSchedule`
  ADD CONSTRAINT `Subject_ExamSchedule_ibfk_1` FOREIGN KEY (`subjectID`) REFERENCES `Subjects` (`subjectID`),
  ADD CONSTRAINT `Subject_ExamSchedule_ibfk_2` FOREIGN KEY (`esID`) REFERENCES `Exam_Schedule` (`esID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
