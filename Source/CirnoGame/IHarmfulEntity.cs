using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public interface IHarmfulEntity
    {
        bool IsHarmful { get; }
        Entity Attacker { get; }
        /// <summary>
        /// Amount of damage to deal when it collides.
        /// </summary>
        float touchDamage { get; }
        /// <summary>
        /// Fires when this entity touches an entity it can harm.
        /// </summary>
        /// <param name="target"></param>
        /// <returns>Whether or not to apply damage.</returns>
        bool ontouchDamage(ICombatant target);
    }
}
