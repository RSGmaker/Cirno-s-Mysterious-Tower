using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Renderer
    {
        public HTMLElement view;
        public Renderer(int width = 800, int height = 600, int backgroundColor = 0x1099bb)
        {
            /*var width = 800;
            var height = 600;
            var backgroundColor = 0x1099bb;*/
            view = Script.Write<dynamic>("new PIXI.Application(width, height, {backgroundColor : backgroundColor})");
        }
    }
}
