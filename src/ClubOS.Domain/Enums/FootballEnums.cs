namespace ClubOS.Domain.Enums;

public enum PlayerPosition
{
    Goalkeeper = 1,
    Defender = 2,
    Midfielder = 3,
    Forward = 4
}

public enum PlayerStatus
{
    Active = 1,
    Injured = 2,
    LoanedOut = 3,
    Suspended = 4,
    Transferred = 5
}

public enum MetricType
{
    DistanceCovered = 1,
    SprintSpeed = 2,
    HeartRate = 3,
    TacticalCompliance = 4,
    PassAccuracy = 5,
    FatigueIndex = 6
}
