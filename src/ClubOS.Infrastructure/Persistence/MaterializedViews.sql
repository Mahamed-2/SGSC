-- ── CLUBOS MATERIALIZED VIEWS ─────────────────────────────────────────
-- Optimized for Al-Faisaly performance dashboards (Nightly Refresh)

-- 1. Football Operations Aggegates
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_football_performance_agg AS
SELECT 
    "ClubId",
    "DepartmentId",
    COUNT(*) AS "TotalSessions",
    AVG("DurationMinutes") AS "AvgDuration",
    MAX("DateTimeAST") AS "LastSessionDate"
FROM "TrainingSessions"
WHERE "IsDeleted" = FALSE
GROUP BY "ClubId", "DepartmentId";

-- 2. Player Performance Trends (Telemetry Data)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_player_metric_trends AS
SELECT
    "ClubId",
    "PlayerId",
    "MetricType",
    DATE_TRUNC('day', "RecordedAtAST") AS "MetricDate",
    AVG("Value") AS "DailyAvg",
    COUNT(*) AS "SampleCount"
FROM "PerformanceMetrics"
WHERE "IsDeleted" = FALSE
GROUP BY "ClubId", "PlayerId", "MetricType", DATE_TRUNC('day', "RecordedAtAST");

-- 3. Financial Snapshot (Simulated based on KpiRecords)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_finance_health AS
SELECT
    "TenantId" AS "ClubId",
    AVG("Value") FILTER (WHERE "Type" = 10) AS "AvgBudgetUtilization", -- BudgetUtilization Enum index
    SUM("Value") FILTER (WHERE "Type" = 20) AS "TotalRevenue"          // RevenueMonthly Enum index
FROM "KpiRecords"
GROUP BY "TenantId";

-- REFRESH COMMANDS (Called via Hangfire Nightly)
-- REFRESH MATERIALIZED VIEW mv_football_performance_agg;
-- REFRESH MATERIALIZED VIEW mv_player_metric_trends;
-- REFRESH MATERIALIZED VIEW mv_finance_health;
