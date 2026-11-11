-- Run periodically with a restricted database maintenance account.
-- This cleans authentication/rate-limit operational data, not customer enquiries.
DELETE FROM sessions WHERE expires_at < UTC_TIMESTAMP();
DELETE FROM rate_limits WHERE window_start < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 1 DAY);
DELETE FROM login_attempts WHERE attempted_at < DATE_SUB(UTC_TIMESTAMP(), INTERVAL 30 DAY);
