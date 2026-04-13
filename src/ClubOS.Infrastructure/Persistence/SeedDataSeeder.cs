using ClubOS.Domain.Entities;
using ClubOS.Domain.Entities.Identity;
using ClubOS.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ClubOS.Infrastructure.Persistence;

public static class SeedDataSeeder
{
    public static async Task SeedAlFaisalyDemoAsync(ApplicationDbContext context, ILogger logger)
    {
        try
        {
            if (await context.Clubs.AnyAsync())
            {
                logger.LogInformation("Database already seeded with demo data.");
                return;
            }

            // 1. Seed Club
            var alfaisaly = Club.Create(
                nameAr: "نادي الفيصلي",
                nameEn: "Al-Faisaly FC",
                location: "Harmah, Saudi Arabia",
                foundedYear: 1374,
                strategyRef: "Strategy2023-2027"
            );
            
            // To ensure ITenantEntity logic works cleanly if Id is not yet generated, we use the instance ID immediately
            var clubId = alfaisaly.Id;
            context.Clubs.Add(alfaisaly);

            // 2. Seed Departments
            var footballOps = Department.Create(clubId, "FOOTBALL_OPS", "Football Operations", "العمليات الكروية");
            var medicalDept = Department.Create(clubId, "MEDICAL", "Medical Department", "القسم الطبي");
            var academyDept = Department.Create(clubId, "ACADEMY", "Youth Academy", "أكاديمية الفئات السنية");
            
            context.Departments.AddRange(footballOps, medicalDept, academyDept);

            // 3. Seed Players (25 Players)
            var players = new List<Player>();
            var random = new Random(1374); // Deterministic seed

            for (int i = 1; i <= 25; i++)
            {
                var pos = (PlayerPosition)random.Next(1, 5);
                var status = random.NextDouble() > 0.85 ? PlayerStatus.Injured : PlayerStatus.Active;
                
                players.Add(Player.Create(
                    clubId: clubId,
                    nameAr: $"لاعب الفيصلي {i}",
                    nameEn: $"Al-Faisaly Player {i}",
                    jersey: i,
                    pos: pos,
                    dob: DateTime.UtcNow.AddYears(-random.Next(18, 35)),
                    nat: "SA",
                    conStart: DateTime.UtcNow.AddYears(-1),
                    conEnd: DateTime.UtcNow.AddYears(random.Next(1, 4)),
                    status: status
                ));
            }
            context.Players.AddRange(players);

            // 4. Seed Staff (10 Staff)
            var staffMembers = new List<Staff>();
            var roles = new[] { "Head Coach", "Assistant Coach", "Physiotherapist", "Team Doctor", "Academy Director" };
            
            for (int i = 1; i <= 10; i++)
            {
                var deptId = i <= 4 ? footballOps.Id : (i <= 7 ? medicalDept.Id : academyDept.Id);
                var role = roles[i % roles.Length];

                staffMembers.Add(Staff.Create(
                    clubId: clubId,
                    deptId: deptId,
                    nameAr: $"موظف {i}",
                    nameEn: $"Staff Member {i}",
                    role: role,
                    hireDate: DateTime.UtcNow.AddYears(-random.Next(1, 5)),
                    qual: "Saudi FA License",
                    contact: $"staff{i}@alfaisaly.mock"
                ));
            }
            context.StaffMembers.AddRange(staffMembers);
            
            // 5. Seed Football Drills
            var drills = new List<FootballDrill>
            {
                FootballDrill.Create(clubId, "Rondo 5v2", "روندو 5 ضد 2", "Technical", "Explosive transition drill", "تدريب الانتقال السريع", "https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
                FootballDrill.Create(clubId, "Harmah Counter Press", "ضغط الفيصلي العكسي", "Tactical", "Strategic pressing in middle third", "الضغط الاستراتيجي في الثلث الأوسط", "https://www.youtube.com/watch?v=example1"),
                FootballDrill.Create(clubId, "Zone Defense Drill", "تدريب دفاع المنطقة", "Tactical", "Positioning for back four", "تمركز خط الدفاع", "https://www.youtube.com/watch?v=example2")
            };
            context.FootballDrills.AddRange(drills);

            // 6. Seed Match Plan
            var matchPlan = MatchPlan.Create(
                clubId, 
                "Al-Batin FC", 
                DateTime.UtcNow.AddDays(3), 
                "4-2-3-1", 
                "Focus on wing play and crossing.", 
                "التركيز على اللعب عبر الأجنحة والعرضيات",
                "[]"
            );
            context.MatchPlans.Add(matchPlan);

            // 7. Seed Medical Data
            var injuryReports = new List<InjuryReport>
            {
                InjuryReport.Create(clubId, players[0].Id, "Hamstring Strain", "تمزق العضلة الخلفية", "Moderate", DateTime.UtcNow.AddDays(-10), DateTime.UtcNow.AddDays(14)),
                InjuryReport.Create(clubId, players[4].Id, "Ankle Sprain", "التواء الكاحل", "Minor", DateTime.UtcNow.AddDays(-3), DateTime.UtcNow.AddDays(5)),
                InjuryReport.Create(clubId, players[12].Id, "Knee Contusion", "كدمة في الركبة", "Moderate", DateTime.UtcNow.AddDays(-20), DateTime.UtcNow.AddDays(-2)),
                InjuryReport.Create(clubId, players[20].Id, "Muscle Fatigue", "إجهاد عضلي", "Minor", DateTime.UtcNow.AddDays(-1), DateTime.UtcNow.AddDays(2)),
                InjuryReport.Create(clubId, players[2].Id, "ACL Tear", "قطع في الرباط الصليبي", "Severe", DateTime.UtcNow.AddMonths(-3), DateTime.UtcNow.AddMonths(6))
            };
            context.InjuryReports.AddRange(injuryReports);

            // 8. Seed Finance Data
            var budgetItems = new List<BudgetItem>
            {
                BudgetItem.Create(clubId, "Player Salaries", "رواتب اللاعبين", 5000000, 4850000, 2026, 1),
                BudgetItem.Create(clubId, "Ops & Logistics", "العمليات واللوجستيات", 1200000, 1350000, 2026, 1),
                BudgetItem.Create(clubId, "Medical Supplies", "المستلزمات الطبية", 300000, 280000, 2026, 1)
            };
            context.BudgetItems.AddRange(budgetItems);

            var sponsorships = new List<SponsorshipContract>
            {
                SponsorshipContract.Create(clubId, "Harmah Energy", 2500000, DateTime.UtcNow.AddMonths(-6), DateTime.UtcNow.AddMonths(18), "300123456700003"),
                SponsorshipContract.Create(clubId, "Saudi Logistics Co", 1200000, DateTime.UtcNow.AddMonths(-2), DateTime.UtcNow.AddMonths(10), "300987654300003")
            };
            context.SponsorshipContracts.AddRange(sponsorships);

            // 9. Seed HR Data
            var staffProfiles = new List<StaffProfile>();
            for (int i = 0; i < staffMembers.Count; i++)
            {
                staffProfiles.Add(StaffProfile.Create(
                    clubId,
                    staffMembers[i].Id,
                    $"10{random.Next(10000000, 99999999)}",
                    DateTime.UtcNow.AddYears(1),
                    $"70{random.Next(10000000, 99999999)}",
                    "Emergency Contact " + i,
                    "+96650000000" + i
                ));
            }
            context.StaffProfiles.AddRange(staffProfiles);

            await context.SaveChangesAsync();
            logger.LogInformation("Successfully seeded Al-Faisaly Multi-Tenant Demo Data.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the Al-Faisaly database.");
            throw;
        }
    }
}
