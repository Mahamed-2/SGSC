using Bogus;
using ClubOS.Domain.Entities;
using ClubOS.Domain.Enums;
using ClubOS.Domain.Entities.Identity;

namespace ClubOS.Infrastructure.Persistence;

/**
 * AlFaisalyDemoGenerator — Realistic mock data engine for Saudi First Division showcasing.
 * Uses deterministic seeding to ensure Al-Faisaly FC demos are consistent and high-fidelity.
 */
public static class AlFaisalyDemoGenerator
{
    private static readonly string[] SaudiFirstNames = { "Ibrahim", "Mohammed", "Abdullah", "Sultan", "Faisal", "Yousef", "Saleh", "Ziyad", "Hassan", "Fahad" };
    private static readonly string[] SaudiLastNames = { "Al-Zahrani", "Al-Shahrani", "Al-Dawsari", "Al-Otaibi", "Al-Qahtani", "Al-Sudairy", "Al-Faisaly", "Al-Anzi" };
    
    public static (Club Club, List<Department> Depts, List<Player> Players, List<Staff> Staff) GenerateBase(Guid tenantId)
    {
        var faker = new Faker("ar");
        Randomizer.Seed = new Random(1374); // Strategic Al-Faisaly Founding Year

        // 1. Club Al-Faisaly
        var club = Club.Create(
            nameAr: "نادي الفيصلي",
            nameEn: "Al-Faisaly FC",
            location: "Harmah, Riyadh Region",
            foundedYear: 1374,
            strategyRef: "Strategy-2023-2027-V1"
        );

        // 2. 6 Core Departments
        string[] deptCodes = { "FOOTBALL", "MEDICAL", "FINANCE", "HR", "SCOUTING", "MEDIA" };
        string[] deptEn = { "Football Ops", "Medical", "Finance", "Human Resources", "Scouting", "Media & PR" };
        string[] deptAr = { "عمليات كرة القدم", "القسم الطبي", "المالية", "الموارد البشرية", "الكشافة", "الإعلام" };

        var depts = new List<Department>();
        for (int i = 0; i < deptCodes.Length; i++)
        {
            depts.Add(Department.Create(tenantId, deptCodes[i], deptEn[i], deptAr[i]));
        }

        // 3. 25 Players (Saudi + International)
        var players = new List<Player>();
        var playerFaker = new Faker<Player>()
            .CustomInstantiator(f => Player.Create(
                clubId: tenantId,
                nameAr: f.PickRandom(SaudiFirstNames) + " " + f.PickRandom(SaudiLastNames),
                nameEn: f.Name.FirstName() + " " + f.Name.LastName(),
                jersey: f.Random.Number(1, 99),
                pos: f.PickRandom<PlayerPosition>(),
                dob: f.Date.Between(DateTime.UtcNow.AddYears(-35), DateTime.UtcNow.AddYears(-18)),
                nat: f.Random.WeightedRandom(new[] { "SA", "BR", "EG", "MA" }, new[] { 0.7f, 0.1f, 0.1f, 0.1f }),
                conStart: f.Date.Past(2),
                conEnd: f.Date.Future(2),
                status: f.Random.WeightedRandom(new[] { PlayerStatus.Active, PlayerStatus.Injured }, new[] { 0.9f, 0.1f })
            ));

        players.AddRange(playerFaker.Generate(25));

        // 4. 15 Staff with Saudi Qualifications
        var staff = new List<Staff>();
        var staffFaker = new Faker<Staff>()
            .CustomInstantiator(f => Staff.Create(
                clubId: tenantId,
                deptId: f.PickRandom(depts).Id,
                nameAr: f.PickRandom(SaudiFirstNames) + " " + f.PickRandom(SaudiLastNames),
                nameEn: f.Name.FirstName() + " " + f.Name.LastName(),
                role: f.PickRandom("Head Coach", "Scout", "Physio", "Admin", "Video Analyst"),
                hireDate: f.Date.Past(3),
                qual: f.PickRandom("Saudi Pro License", "FIFA Diploma", "MSc Sports Medicine"),
                contact: f.Internet.Email()
            ));

        staff.AddRange(staffFaker.Generate(15));

        return (club, depts, players, staff);
    }
}
