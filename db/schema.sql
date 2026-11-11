-- Sai Bhavani application schema. Run against an existing MySQL database.
-- CREATE TABLE IF NOT EXISTS makes initial installation safe to repeat; use
-- migrations for changes to a database that has already been installed.

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff') NOT NULL DEFAULT 'staff',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The ID is a SHA-256 hash of the random token held in the browser cookie.
CREATE TABLE IF NOT EXISTS sessions (
    id CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY sessions_user_id_index (user_id),
    KEY sessions_expires_at_index (expires_at),
    CONSTRAINT sessions_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    email VARCHAR(191) NOT NULL,
    attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    KEY login_attempts_email_attempted_at_index (email, attempted_at),
    KEY login_attempts_attempted_at_index (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS offerings (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(191) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NULL,
    description LONGTEXT NULL,
    destination VARCHAR(255) NULL,
    image_url VARCHAR(2048) NULL,
    inclusions TEXT NULL,
    exclusions TEXT NULL,
    price_text VARCHAR(255) NULL,
    seo_title VARCHAR(255) NULL,
    seo_description TEXT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY offerings_slug_unique (slug),
    KEY offerings_published_type_index (published, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS itinerary_days (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    offering_id BIGINT UNSIGNED NOT NULL,
    day_number INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY itinerary_days_offering_day_unique (offering_id, day_number),
    CONSTRAINT itinerary_days_offering_id_foreign FOREIGN KEY (offering_id) REFERENCES offerings (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiries (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    offering_id BIGINT UNSIGNED NULL,
    offering_title VARCHAR(255) NULL,
    service_type VARCHAR(120) NOT NULL DEFAULT '',
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(191) NULL,
    origin VARCHAR(255) NULL,
    destination VARCHAR(255) NULL,
    travel_date DATE NULL,
    travellers INT UNSIGNED NULL,
    message TEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY enquiries_offering_id_index (offering_id),
    KEY enquiries_status_created_at_index (status, created_at),
    KEY enquiries_created_at_index (created_at),
    CONSTRAINT enquiries_offering_id_foreign FOREIGN KEY (offering_id) REFERENCES offerings (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiry_notes (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    enquiry_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY enquiry_notes_enquiry_created_index (enquiry_id, created_at),
    KEY enquiry_notes_user_id_index (user_id),
    CONSTRAINT enquiry_notes_enquiry_id_foreign FOREIGN KEY (enquiry_id) REFERENCES enquiries (id) ON DELETE CASCADE,
    CONSTRAINT enquiry_notes_user_id_foreign FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(191) NOT NULL,
    value LONGTEXT NULL,
    PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pages (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body LONGTEXT NULL,
    image_url VARCHAR(2048) NULL,
    seo_title VARCHAR(255) NULL,
    seo_description TEXT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    UNIQUE KEY pages_slug_unique (slug),
    KEY pages_published_index (published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS gallery (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(2048) NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY gallery_published_sort_index (published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    author VARCHAR(255) NOT NULL,
    quote TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    KEY testimonials_published_sort_index (published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rate_limits (
    bucket VARCHAR(191) NOT NULL,
    window_start DATETIME NOT NULL,
    `count` INT UNSIGNED NOT NULL,
    PRIMARY KEY (bucket),
    KEY rate_limits_window_start_index (window_start)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
