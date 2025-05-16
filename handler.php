<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "SCHOOL_DB";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['rollNo'])) {
    $rollNo = $_GET['rollNo'];
    $stmt = $conn->prepare("SELECT * FROM STUDENT_TABLE WHERE RollNo = ?");
    $stmt->bind_param("i", $rollNo);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $row['exists'] = true;
        echo json_encode($row);
    } else {
        echo json_encode(['exists' => false]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $action = $data['action'];
    $rollNo = $data['rollNo'];
    $fullName = $data['FullName'];
    $class = $data['Class'];
    $birthDate = $data['BirthDate'];
    $address = $data['Address'];
    $enrollDate = $data['EnrollmentDate'];

    if ($action === "save") {
        $stmt = $conn->prepare("INSERT INTO STUDENT_TABLE VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssss", $rollNo, $fullName, $class, $birthDate, $address, $enrollDate);
        if ($stmt->execute()) {
            echo "Data saved successfully.";
        } else {
            echo "Error saving data.";
        }
    } elseif ($action === "update") {
        $stmt = $conn->prepare("UPDATE STUDENT_TABLE SET FullName=?, Class=?, BirthDate=?, Address=?, EnrollmentDate=? WHERE RollNo=?");
        $stmt->bind_param("sssssi", $fullName, $class, $birthDate, $address, $enrollDate, $rollNo);
        if ($stmt->execute()) {
            echo "Data updated successfully.";
        } else {
            echo "Error updating data.";
        }
    }
}
?>