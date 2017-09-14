using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class AnimationLoader
    {
        protected Dictionary<string, List<HTMLImageElement>> _data;
        protected static AnimationLoader __this;
        public static AnimationLoader _this
        {
            get
            {
                if (__this == null)
                {
                    __this = new AnimationLoader();
                    throw new Exception("Animation loader not initiated.");
                }
                return __this;
            }
        }
        public JSONArchive Archive;
        public static void Init(JSONArchive Archive)
        {
            __this = new AnimationLoader();
            __this.Archive = Archive;
        }

        public AnimationLoader()
        {
            _data = new Dictionary<string, List<HTMLImageElement>>();
        }
        public static List<HTMLImageElement> Get(string ani)
        {
            return _this.GetAnimation(ani);
        }
        public List<HTMLImageElement> GetAnimation(string ani)
        {
            if (_data.ContainsKey(ani))
            {
                return _data[ani];
            }
            var A = new List<HTMLImageElement>();
            var I = Archive.GetImage(ani + ".png");
            if (I != null)
            {
                A.Add(I);
            }
            else
            {
                var j = 0;
                var Sani = ani + "_";
                while (true)
                {
                    I = Archive.GetImage(Sani + (j++) + ".png");
                    if (I == null)
                        break;
                    else
                        A.Add(I);
                }
                /*do
                {
                    I = Archive.GetImage(ani + "_" + j + ".png");
                    if (I != null)
                    {
                        A.Add(I);
                    }
                } while (I != null);*/
            }
            _data[ani] = A;
            return A;
        }
    }
}
