using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class JSONArchive
    {
        //use Folder2JSON to create the archive.

        //public string Archive;
        public Dictionary<string, string> Data = new Dictionary<string, string>();
        public Dictionary<string, HTMLImageElement> Images = new Dictionary<string, HTMLImageElement>();
        public JSONArchive(string Archive)
        {
            //this.Archive = Archive;
            string[][] D = Script.Write<dynamic>("JSON.parse(Archive)");
            var i = 0;
            var ln = D.Length;
            while (i < ln)
            {
                var A = D[i++];
                Data[A[0].ToLower()] = A[1];
            }
        }
        public static void Open(string ArchiveFile, Action<JSONArchive> action)
        {
            XMLHttpRequest XHR = new XMLHttpRequest();
            //XHR.ResponseType = XMLHttpRequestResponseType.Blob;
            XHR.OnLoad = Evt =>
            {
                action(new JSONArchive(XHR.ResponseText));
            };
            XHR.Open("GET", ArchiveFile, false);
            XHR.Send();
            //if (XHR.Status)

        }
        public void PreloadImages(Action action, int delay = 100)
        {
            var K = System.Linq.Enumerable.ToArray<string>(Data.Keys);
            var i = 0;
            while (i < Data.Count)
            {
                var A = K[i];
                GetImage(A);
                i++;
            }
            Global.SetTimeout((global::System.Action)action, delay);
        }
        public string GetData(string file)
        {
            var f = file.ToLower();
            if (Data.ContainsKey(f))
            {
                return Data[f];
            }
            return null;
        }
        public HTMLImageElement GetImage(string file)
        {
            var f = file.ToLower();
            if (Images.ContainsKey(f))
            {
                return Images[f];
            }
            var D = GetData(f);
            if (D == null)
            {
                return null;
            }
            var ret = new HTMLImageElement();
            ret.OnLoad = E =>
            {
                Helper.Log("loaded " + f + " from JSON!");
            };
            ret.Src = "data:image/png;base64," + D;
            Images[f] = ret;
            return ret;
        }
    }
}
