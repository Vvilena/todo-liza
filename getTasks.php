<?php
header('Content-Type: application/json');

$filename = "tasks.txt";

// Если файл не существует, возвращаем пустой массив
if (!file_exists($filename)) {
    echo json_encode([]);
    exit;
}

// Читаем содержимое файла
$content = file_get_contents($filename);

// Если файл пустой, возвращаем пустой массив
if (empty(trim($content))) {
    echo json_encode([]);
    exit;
}

// Декодируем JSON
$tasks_list = json_decode($content, true);

// Если декодирование не удалось, возвращаем пустой массив
if ($tasks_list === null) {
    echo json_encode([]);
    exit;
}

echo json_encode($tasks_list);
?>