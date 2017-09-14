using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class InputControllerManager
    {
        public List<InputController> Controllers;
        public static InputControllerManager _this
        {
            get
            {
                if (__this == null)
                {
                    __this = new InputControllerManager();
                }
                return __this;
            }
        }
        public static void Init()
        {
            if (__this == null)
            {
                __this = new InputControllerManager();
            }
        }
        protected static InputControllerManager __this;
        protected InputControllerManager()
        {
            Controllers = new List<InputController>();

            Controllers.Add(new InputController());
            List<GamePad> gamepads = GamePadManager._this.activeGamepads;
            int i = 0;
            while (i < gamepads.Count)
            {
                Controllers.Add(new InputController(gamepads[i].id));
                i++;
            }
        }
    }
}
