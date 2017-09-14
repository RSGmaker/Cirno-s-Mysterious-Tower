using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge.Html5;

namespace CirnoGame
{
    interface ILightProducer
    {
        void DrawLight(CanvasRenderingContext2D g);
    }
}
