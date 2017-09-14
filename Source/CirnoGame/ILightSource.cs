using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    interface ILightSource
    {
        float maxLightRadius { get; }
        bool lightFlicker { get; }
        Vector2 lightPosition { get; }
    }
}
