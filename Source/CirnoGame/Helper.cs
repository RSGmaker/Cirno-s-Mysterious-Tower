using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Helper
    {
        public static string GetRandomString()
        {
            //return (Math.Random() * new Date().GetTime()).ToString(36).Replace("/\\./ g, '-'",null);
            //return (Math.Random() * new Date().GetTime()).ToString(36).Replace(new Bridge.Text.RegularExpressions.Regex("", null);
            //return Script.Write<string>("(Math.random() * new Date().getTime()).toString(36).replace(/\\./ g, '-')");
            return Script.Write<string>("(Math.random() * new Date().getTime()).toString(36)");
        }
        protected static Dictionary<string, object> _namespaces = new Dictionary<string, object>();
        public static Type GetType(string FullName)
        {
            string name = FullName;
            if (name == "" || name == null || !name.Contains("."))
                return null;
            string[] s = name.Split(".");
            //string nm = GetType().FullName.Split(".")[0];
            int i = 1;
            /*if (s[0] != nm)
                return null;*/

            //dynamic obj = Script.Write<object>(nm);

            //Get namespace
            dynamic obj;
            if (_namespaces.ContainsKey(s[0]))
                obj = _namespaces[s[0]];
            else
            {
                obj = Global.Eval<object>(s[0]);
                _namespaces[s[0]] = obj;
            }

            while (i < s.Length)
            {
                //Parse through object hierarchy.
                if (!Script.Write<bool>("obj"))
                    return null;
                obj = obj[s[i]];
                i++;
            }
            return obj;
        }
        public static void AddMultiple<T>(T[] array, T item, int number)
        {
            while (number > 0)
            {
                CirnoGame.HelperExtensions.Push<T>(array, item);
                number--;
            }
        }
        public static string Repeat(string s, int number)
        {
            if (number < 1)
            {
                return "";
            }
            string ret = s;
            int i = number - 1;
            while (i > 0)
            {
                ret = ret + s;
                i--;
            }
            return ret;
        }
        public static HTMLCanvasElement CloneCanvas(HTMLCanvasElement C)
        {
            HTMLCanvasElement ret = new HTMLCanvasElement();
            ret.Width = C.Width;
            ret.Height = C.Height;
            CanvasRenderingContext2D g = ret.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
            g.DrawImage(C, 0f, 0f);
            return ret;
        }
        public static CanvasRenderingContext2D GetContext(HTMLCanvasElement C)
        {
            return C.GetContext(CanvasTypes.CanvasContext2DType.CanvasRenderingContext2D);
        }
        public static dynamic GetField(dynamic target, string fieldName)
        {
            dynamic O = target;
            //if (O[fieldName])
            if (Has(O, fieldName))
            {
                return O[fieldName];
            }
            if (O["get" + fieldName])
            {
                return O["get" + fieldName]();
            }
            string s = "";
            try
            {
                s = "Helper get field: Field \"" + fieldName + "\" was not in " + target.GetType().FullName + ".";
            }
            catch
            {
                s = "Helper get field: Field \"" + fieldName + "\" was not in " + target + ".";
            }

            //Console.WriteLine(s);
            Log(s);
            return null;
        }
        protected static bool Has(dynamic target, string fieldName)
        {
            /*if (O[fieldName] || ((string)O) == "false")
            {
                return true;
            }*/
            return Script.Write<bool>("typeof target[fieldName] != 'undefined'");
        }
        public static void ReloadPage()
        {
            Window.Location.Href = Window.Location.Href;
        }
        public static void SetField(dynamic target, string fieldName, dynamic data)
        {
            dynamic O = target;
            //if (O[fieldName])
            if (Has(O, fieldName))
            {
                O[fieldName] = data;
                return;
            }
            if (O["set" + fieldName])
            {
                O["set" + fieldName](data);
                return;
            }
            string s = "";
            try
            {
                s = "Helper set field: Field \"" + fieldName + "\" was not in " + target.GetType().FullName + ".";
            }
            catch
            {
                s = "Helper set field: Field \"" + fieldName + "\" was not in " + target + ".";
            }
            //Console.WriteLine(s);
            Log(s);
        }
        [Template("console.log({message})")]
        public static void Log(string message)
        {
            bool b = Script.Write<bool>("console.log(message)");
        }
        public static void CopyFields(dynamic source, dynamic target, string[] Fields = null)
        {
            if (Fields == null)
            {
                Fields = Object.Keys(source);
            }
            int i = 0;
            while (i < Fields.Length)
            {
                string f = Fields[i];
                SetField(target, f, GetField(source, f));
                i++;
            }
        }
        public static string KeyCodeToString(int keycode)
        {
            string[] codenames = new string[] { "", // [0]
  "", // [1]
  "", // [2]
  "CANCEL", // [3]
  "", // [4]
  "", // [5]
  "HELP", // [6]
  "", // [7]
  "BACK_SPACE", // [8]
  "TAB", // [9]
  "", // [10]
  "", // [11]
  "CLEAR", // [12]
  "ENTER", // [13]
  "ENTER_SPECIAL", // [14]
  "", // [15]
  "SHIFT", // [16]
  "CONTROL", // [17]
  "ALT", // [18]
  "PAUSE", // [19]
  "CAPS_LOCK", // [20]
  "KANA", // [21]
  "EISU", // [22]
  "JUNJA", // [23]
  "FINAL", // [24]
  "HANJA", // [25]
  "", // [26]
  "ESCAPE", // [27]
  "CONVERT", // [28]
  "NONCONVERT", // [29]
  "ACCEPT", // [30]
  "MODECHANGE", // [31]
  "SPACE", // [32]
  "PAGE_UP", // [33]
  "PAGE_DOWN", // [34]
  "END", // [35]
  "HOME", // [36]
  "LEFT", // [37]
  "UP", // [38]
  "RIGHT", // [39]
  "DOWN", // [40]
  "SELECT", // [41]
  "PRINT", // [42]
  "EXECUTE", // [43]
  "PRINTSCREEN", // [44]
  "INSERT", // [45]
  "DELETE", // [46]
  "", // [47]
  "0", // [48]
  "1", // [49]
  "2", // [50]
  "3", // [51]
  "4", // [52]
  "5", // [53]
  "6", // [54]
  "7", // [55]
  "8", // [56]
  "9", // [57]
  "COLON", // [58]
  "SEMICOLON", // [59]
  "LESS_THAN", // [60]
  "EQUALS", // [61]
  "GREATER_THAN", // [62]
  "QUESTION_MARK", // [63]
  "AT", // [64]
  "A", // [65]
  "B", // [66]
  "C", // [67]
  "D", // [68]
  "E", // [69]
  "F", // [70]
  "G", // [71]
  "H", // [72]
  "I", // [73]
  "J", // [74]
  "K", // [75]
  "L", // [76]
  "M", // [77]
  "N", // [78]
  "O", // [79]
  "P", // [80]
  "Q", // [81]
  "R", // [82]
  "S", // [83]
  "T", // [84]
  "U", // [85]
  "V", // [86]
  "W", // [87]
  "X", // [88]
  "Y", // [89]
  "Z", // [90]
  "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
  "", // [92]
  "CONTEXT_MENU", // [93]
  "", // [94]
  "SLEEP", // [95]
  "NUMPAD0", // [96]
  "NUMPAD1", // [97]
  "NUMPAD2", // [98]
  "NUMPAD3", // [99]
  "NUMPAD4", // [100]
  "NUMPAD5", // [101]
  "NUMPAD6", // [102]
  "NUMPAD7", // [103]
  "NUMPAD8", // [104]
  "NUMPAD9", // [105]
  "MULTIPLY", // [106]
  "ADD", // [107]
  "SEPARATOR", // [108]
  "SUBTRACT", // [109]
  "DECIMAL", // [110]
  "DIVIDE", // [111]
  "F1", // [112]
  "F2", // [113]
  "F3", // [114]
  "F4", // [115]
  "F5", // [116]
  "F6", // [117]
  "F7", // [118]
  "F8", // [119]
  "F9", // [120]
  "F10", // [121]
  "F11", // [122]
  "F12", // [123]
  "F13", // [124]
  "F14", // [125]
  "F15", // [126]
  "F16", // [127]
  "F17", // [128]
  "F18", // [129]
  "F19", // [130]
  "F20", // [131]
  "F21", // [132]
  "F22", // [133]
  "F23", // [134]
  "F24", // [135]
  "", // [136]
  "", // [137]
  "", // [138]
  "", // [139]
  "", // [140]
  "", // [141]
  "", // [142]
  "", // [143]
  "NUM_LOCK", // [144]
  "SCROLL_LOCK", // [145]
  "WIN_OEM_FJ_JISHO", // [146]
  "WIN_OEM_FJ_MASSHOU", // [147]
  "WIN_OEM_FJ_TOUROKU", // [148]
  "WIN_OEM_FJ_LOYA", // [149]
  "WIN_OEM_FJ_ROYA", // [150]
  "", // [151]
  "", // [152]
  "", // [153]
  "", // [154]
  "", // [155]
  "", // [156]
  "", // [157]
  "", // [158]
  "", // [159]
  "CIRCUMFLEX", // [160]
  "EXCLAMATION", // [161]
  "DOUBLE_QUOTE", // [162]
  "HASH", // [163]
  "DOLLAR", // [164]
  "PERCENT", // [165]
  "AMPERSAND", // [166]
  "UNDERSCORE", // [167]
  "OPEN_PAREN", // [168]
  "CLOSE_PAREN", // [169]
  "ASTERISK", // [170]
  "PLUS", // [171]
  "PIPE", // [172]
  "HYPHEN_MINUS", // [173]
  "OPEN_CURLY_BRACKET", // [174]
  "CLOSE_CURLY_BRACKET", // [175]
  "TILDE", // [176]
  "", // [177]
  "", // [178]
  "", // [179]
  "", // [180]
  "VOLUME_MUTE", // [181]
  "VOLUME_DOWN", // [182]
  "VOLUME_UP", // [183]
  "", // [184]
  "", // [185]
  "SEMICOLON", // [186]
  "EQUALS", // [187]
  "COMMA", // [188]
  "MINUS", // [189]
  "PERIOD", // [190]
  "SLASH", // [191]
  "BACK_QUOTE", // [192]
  "", // [193]
  "", // [194]
  "", // [195]
  "", // [196]
  "", // [197]
  "", // [198]
  "", // [199]
  "", // [200]
  "", // [201]
  "", // [202]
  "", // [203]
  "", // [204]
  "", // [205]
  "", // [206]
  "", // [207]
  "", // [208]
  "", // [209]
  "", // [210]
  "", // [211]
  "", // [212]
  "", // [213]
  "", // [214]
  "", // [215]
  "", // [216]
  "", // [217]
  "", // [218]
  "OPEN_BRACKET", // [219]
  "BACK_SLASH", // [220]
  "CLOSE_BRACKET", // [221]
  "QUOTE", // [222]
  "", // [223]
  "META", // [224]
  "ALTGR", // [225]
  "", // [226]
  "WIN_ICO_HELP", // [227]
  "WIN_ICO_00", // [228]
  "", // [229]
  "WIN_ICO_CLEAR", // [230]
  "", // [231]
  "", // [232]
  "WIN_OEM_RESET", // [233]
  "WIN_OEM_JUMP", // [234]
  "WIN_OEM_PA1", // [235]
  "WIN_OEM_PA2", // [236]
  "WIN_OEM_PA3", // [237]
  "WIN_OEM_WSCTRL", // [238]
  "WIN_OEM_CUSEL", // [239]
  "WIN_OEM_ATTN", // [240]
  "WIN_OEM_FINISH", // [241]
  "WIN_OEM_COPY", // [242]
  "WIN_OEM_AUTO", // [243]
  "WIN_OEM_ENLW", // [244]
  "WIN_OEM_BACKTAB", // [245]
  "ATTN", // [246]
  "CRSEL", // [247]
  "EXSEL", // [248]
  "EREOF", // [249]
  "PLAY", // [250]
  "ZOOM", // [251]
  "", // [252]
  "PA1", // [253]
  "WIN_OEM_CLEAR", // [254]
  "" // [255]
            };
            if (keycode >= 0 && keycode < codenames.Length)
            {
                return codenames[keycode];
            }
            var kc = keycode;
            return Script.Write<string>("String.FromCharCode(kc)");
        }
        public static dynamic MakeShallowCopy(dynamic source, string[] fieldNames = null)
        {
            dynamic target = new object();
            string[] Fields = fieldNames;
            if (Fields == null)
            {
                Fields = Object.Keys(source);
            }
            int i = 0;
            while (i < Fields.Length)
            {
                string f = Fields[i];
                target[f] = GetField(source, f);
                i++;
            }
            return target;
        }
    }
}
