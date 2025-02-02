<?php
global $wpdb;
$table_name = $wpdb->prefix . 'jungle_statistics_user_cache';
//检查数据表是否已经存在
if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
    // 创建数据表
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                ip_address VARCHAR(45) NOT NULL,
                browser VARCHAR(100) NOT NULL,
                device VARCHAR(100) NOT NULL,
                countryCode VARCHAR(100) NOT NULL,
                country VARCHAR(100) NOT NULL,
                state_province VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                cache_ip TEXT NOT NULL,
                u_id INT NULL,
                first_stored_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY id (id)
            ) $charset_collate;";

    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
