-- Apply once to an existing database created before pages.image_url was added.
-- Safe to rerun against the same database.
SET @page_image_exists = (SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'pages' AND column_name = 'image_url');
SET @page_image_sql = IF(@page_image_exists = 0, 'ALTER TABLE pages ADD COLUMN image_url VARCHAR(2048) NULL AFTER body', 'SELECT 1');
PREPARE page_image_stmt FROM @page_image_sql;
EXECUTE page_image_stmt;
DEALLOCATE PREPARE page_image_stmt;
