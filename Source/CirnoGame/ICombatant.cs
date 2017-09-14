using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public interface ICombatant
    {
        int Team { get; set; }
        float HP { get; set; }
        int PointsForKilling { get; }
        float TargetPriority { get; }

        void onDamaged(IHarmfulEntity source,float amount);
        void onDeath(IHarmfulEntity source);
        void onKill(ICombatant combatant);
    }
}
