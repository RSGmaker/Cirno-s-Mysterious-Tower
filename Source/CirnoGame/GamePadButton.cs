using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class GamePadButton
    {
        public bool tapped;
        public bool pressed;
        public double value;
        public GamePadButton(dynamic button)
        {
            pressed = button.pressed;
            value = button.value;
            tapped = false;
        }
    }
}
