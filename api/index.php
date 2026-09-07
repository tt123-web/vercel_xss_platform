<?php
date_default_timezone_set('Asia/Shanghai');
error_reporting(0);

$route = isset($_GET['route']) ? trim((string) $_GET['route'], '/') : 'index.php';
$route = rawurldecode($route);

if (strncmp($route, 'api/', 4) === 0) {
    $_GET['a'] = substr($route, 4) ?: 'index';
    require __DIR__ . '/collector.php';
    exit;
}

$script = basename($route);
if ($script === '' || $script === 'api') {
    $script = 'index.php';
}

$appRoot = dirname(__DIR__);
chdir($appRoot);
$target = $appRoot . '/' . $script;
if (!preg_match('/^[a-zA-Z0-9_.-]+\\.php$/', $script) || !is_file($target)) {
    http_response_code(404);
    exit('Not Found');
}

require $target;
