<?php
header('Content-Type: application/json');

// Получаем данные из POST запроса
$input = file_get_contents('php://input');
$tasks = json_decode($input, true);

// Проверяем, что данные получены корректно
if ($tasks === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON data']);
    exit;
}

$filename = "tasks.txt";

// Сохраняем задачи в файл в формате JSON
$result = file_put_contents($filename, json_encode($tasks, JSON_UNESCAPED_UNICODE));

if ($result === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save tasks']);
    exit;
}

echo json_encode(['success' => true]);
?>

