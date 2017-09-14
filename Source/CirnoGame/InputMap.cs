using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class InputMap
    {
        public int map = -1;
        public int antimap = -1;
        public string name = "";
        public bool axis = false;
        //public InputController controller;
        public string controllerID = "";
        public InputMap()
        {
            axis = false;
        }
        public InputMap(int map, int antimap = -1, bool axis = false)
        {
            this.map = map;
            this.antimap = antimap;
            this.axis = axis;
        }
    }
}
