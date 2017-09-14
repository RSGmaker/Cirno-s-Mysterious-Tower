using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class ControllableEntity : Entity
    {
        public bool[] Controller;
        public bool[] LController;
        public ControllableEntity(Game game) : base(game)
        {
            Controller = new bool[7];
            LController = new bool[Controller.Length];
        }
        /// <summary>
        /// returns true if the button was just pressed.
        /// </summary>
        /// <param name="button"></param>
        /// <returns></returns>
        public bool Pressed(int button)
        {
            return (Controller[button] != LController[button] && Controller[button]);
        }
        /// <summary>
        /// returns true if just released.
        /// </summary>
        /// <param name="button"></param>
        /// <returns></returns>
        public bool Released(int button)
        {
            return (Controller[button] != LController[button] && !Controller[button]);
        }
    }
}
