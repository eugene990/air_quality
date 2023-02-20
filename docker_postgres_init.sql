SELECT 'CREATE DATABASE air_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'air_db')
