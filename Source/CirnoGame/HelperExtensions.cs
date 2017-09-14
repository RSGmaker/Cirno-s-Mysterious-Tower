using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge.Html5;
using Bridge;

namespace CirnoGame
{
    public static class HelperExtensions
    {
        public static T Pick<T>(this IEnumerable<T> list, Random RND = null)
        {
            if (RND == null)
            {
                RND = new Random();
            }
            List<T> L = new List<T>();
            foreach (var item in list)
            {
                L.Add(item);
            }
            return L[RND.Next(L.Count)];
        }
        public static void ForEach<T>(this IEnumerable<T> list, Action<T> action)
        {
            foreach (var item in list)
            {
                action(item);
            }
        }
        public static void ForEach<T>(this IEnumerable<T> list, string methodName)
        {
            foreach (var item in list)
            {
                Action A = item[methodName].As<Action>();
                A();
            }
        }
        public static void AddIfNew<T>(this List<T> list, T item)
        {
            int i = 0;
            var ln = list.Count;
            object A = item;
            while (i < ln)
            {
                object B = list[i];
                if (Script.Write<bool>("A == B"))
                {
                    return;
                }
                i++;
            }
            list.Add(item);
            /*if (!list.Contains(item))
            {
                list.Add(item);
            }*/
        }
        //public static void RemoveAll<T>(this IEnumerable<T> list, Action<T> action)
        public static void RemoveAll<T>(this List<T> list, Func<T, bool> predicate)
        {

            //foreach (var item in list)
            int i = 0;
            while (i < list.Count)
            {
                var item = list[i];
                //action(item);
                if (predicate(item))
                {
                    //list.rem
                    list.Remove(item);
                    i--;
                }
                i++;
            }
        }

        [Template("{*list}.push({*val})")]
        public static void Push<T>(this T[] list, T val)
        {
            Script.Write("list.push(val)");
        }

        public static void PushIfNew<T>(this T[] list, T val)
        {
            if (!ContainsB<T>(list, val))
            {
                Push<T>(list, val);
            }
        }

        public static void PushRange<T>(this T[] list, params T[] val)
        {
            var i = 0;
            while (i < val.Length)
            {
                Push<T>(list, val[i]);
                i++;
            }
        }

        [Template("{*list}.pop()")]
        public static T Pop<T>(this T[] list)
        {
            return Script.Write<T>("list.pop()");
        }

        public static void Clear<T>(this T[] list)
        {
            int i = list.Length;
            while (i-- > 0)
                list.Pop();
        }

        public static void ReplaceAll<T>(this T[] list, T[] Source, T[] Destination)
        {
            int i = -1;
            i = IndexOf<T>(list, Source, i + 1, 3);
            var ln = Source.Length;
            while (i >= 0)
            {
                var j = 0;

                while (j < ln)
                {
                    list[i + j] = Destination[j];
                    j++;
                }
                i = IndexOf<T>(list, Source, i + 1, 3);
            }
        }
        public static T[] WhereB<T>(this T[] list, Func<T, bool> predicate)
        {
            object[] ret = new object[0];
            int i = 0;
            int ln = list.Length;
            while (i < ln)
            {
                var item = list[i];
                if (predicate(item))
                {
                    CirnoGame.HelperExtensions.Push<object>(ret, item);
                }
                i++;
            }

            return ret.As<T[]>();
        }

        public static bool ContainsB<T>(this List<T> list, object Value)
        {
            T[] L = list["items"].As<T[]>();
            return ContainsB<T>(L, Value);
        }

        public static bool ContainsB<T>(this T[] list, object Value)
        {
            int i = 0;
            int ln = list.Length;
            while (i < ln)
            {
                object O = list[i];
                if (Script.Write<bool>("O == Value"))
                {
                    return true;
                }
                i++;
            }
            return false;
        }

        public static int IndexOf<T>(this T[] list, T[] Value, int index = 0, int structureSize = 1)
        {
            int i = index;
            var ln = list.Length;
            var vln = Value.Length;
            object O = Value[0];
            object A;
            object B;
            while (i < ln && i >= 0)
            {
                /*var c = i+1;
                i = -1;
                B = Value[0];
                while (c < list.Length && i==-1)
                {
                    A = list[c];
                    if (A == B)
                    {
                        i = c;
                    }
                    c++;
                }
                if (i == -1)
                {
                    return -1;
                }*/
                i = list.IndexOf(O.As<string>(), i + 1);
                while (i >= 0 && i % structureSize > 0)
                {
                    i = list.IndexOf(O.As<string>(), i + 1);
                }
                if (i == -1)
                {
                    return -1;
                }
                var k = 1;
                var l = i + 1;

                if (i < ln && i >= 0)
                {
                    bool ok = true;
                    while (ok && k < vln)
                    {
                        A = list[l];
                        B = Value[k];
                        if (A != B)
                        {
                            ok = false;
                        }
                        k++;
                        l++;
                    }
                    if (ok)
                    {
                        return i;
                    }
                }
            }
            return -1;
        }
        public static bool Identical<T>(this T[] list, T[] list2)
        {
            if (list == list2)
            {
                return true;
            }
            if (list == null || list2 == null)
            {
                return false;
            }
            var ln = list.Length;
            if (ln == list2.Length)
            {
                int i = 0;

                while (i < ln)
                {
                    object A = list[i];
                    object B = list2[i];
                    if (A != B)
                    {
                        return false;
                    }
                    i++;
                }
                return true;
            }
            return false;
        }
        public static void ReverseOrderWithStructure<T>(this T[] list, int size)
        {
            //T[] ret = new T[0];
            List<T> ret = new List<T>();
            int i = 0;
            int ln = list.Length;
            while (i < ln)
            {
                int j = 0;
                while (j < size)
                {
                    //ret.Push(list[j]);
                    ret.Insert(0, list[(size - 1) - j]);
                    j++;
                }
                i += size;
            }
        }
        public static void Clear(this CanvasRenderingContext2D G)
        {
            var C = G.Canvas;
            G.ClearRect(0, 0, C.Width, C.Height);
        }
        /// <summary>
        /// not yet tested with deep inheritence...
        /// </summary>
        /// <param name="T"></param>
        /// <param name="instance"></param>
        /// <returns></returns>
        public static bool IsInstanceOfTypeFast(this Type T, object instance)
        {
            var C = instance.As<dynamic>().ctor;
            object[] A = T["$$inheritors"].As<dynamic>();//list of all types that inherit from this type
            return (C == T || (A != null && A.IndexOf(C) >= 0));
        }

    }
}
