using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class RectangleI
    {
        public int x = 0;
        public int y = 0;
        public int width = 0;
        public int height = 0;


        public int left
        {
            get
            {
                return x;
            }
            set
            {
                x = value;
            }
        }
        public int top
        {
            get
            {
                return y;
            }
            set
            {
                y = value;
            }
        }
        public int right
        {
            get
            {
                return x + width;
            }
            set
            {
                width = value - x;
            }
        }
        public int bottom
        {
            get
            {
                return y + height;
            }
            set
            {
                height = value - y;
            }
        }
        public int[] points
        {
            get
            {
                int[] ret = new int[8];
                int i = 0;
                ret[i++] = x;
                ret[i++] = y;

                ret[i++] = right;
                ret[i++] = y;

                ret[i++] = right;
                ret[i++] = bottom;

                ret[i++] = x;
                ret[i++] = bottom;

                return ret;
            }
        }
        public Point Center
        {
            get
            {
                return new Point(left + (width / 2), top + (height / 2));
            }
        }
        public Point Min
        {
            get
            {
                return new Point(x, y);
            }
            set
            {
                if (value == null)
                    return;
                x = value.X;
                y = value.Y;
            }
        }
        public Point Max
        {
            get
            {
                return new Point(right, bottom);
            }
            set
            {
                if (value == null)
                    return;
                right = value.X;
                bottom = value.Y;
            }
        }
        public bool containsPoint(int x, int y)
        {
            if (x >= this.x && y >= this.y && x <= right && y <= bottom)
            {
                return true;
            }
            return false;
        }
        public bool containsPoint(Point point)
        {
            if (point.X >= this.x && point.Y >= this.y && point.X <= right && point.Y <= bottom)
            {
                return true;
            }
            return false;
        }
        public bool intersects(RectangleI R)
        {
            int[] p = R.points;
            bool contain = false;
            bool outside = false;
            int i = 0;
            while (i < p.Length)
            {
                if (containsPoint(p[i++], p[i++]))
                {
                    contain = true;
                }
                else
                {
                    outside = true;
                }
            }
            if (contain && outside)
            {
                return true;
            }
            if (R.left < left && R.right > right)
            {
                //if ((top <= R.top && bottom <= R.top) || (top <= R.bottom && bottom <= R.bottom))
                if ((top <= R.top && bottom >= R.top) || (top <= R.bottom && bottom >= R.bottom))
                {
                    return true;
                }
            }
            if (R.top < top && R.bottom > bottom)
            {
                if ((left <= R.left && right >= R.left) || (left <= R.right && right >= R.right))
                {
                    return true;
                }
            }
            /*if (R.left < left && R.right > right)
            {
                if ((top <= R.top && bottom <= R.top) || (top <= R.bottom && bottom <= R.bottom))
                {
                    return true;
                }
            }
            if (R.top < top && R.bottom > bottom)
            {
                if ((left <= R.left && right <= R.left) || (left <= R.right && right <= R.right))
                {
                    return true;
                }
            }*/
            return false;
        }
        public bool isTouching(RectangleI R)
        {
            if (R == null)
            {
                return false;
            }
            int[] p = R.points;
            int i = 0;
            while (i < p.Length)
            {
                if (containsPoint(p[i++], p[i++]))
                {
                    return true;
                }
            }
            if (intersects(R))
            {
                return true;
            }
            return false;
        }
        public RectangleI(int x = 0, int y = 0, int width = 0, int height = 0)
        {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        public static RectangleI operator +(RectangleI A, Point B)
        {
            return new RectangleI(A.x + B.X, A.y + B.Y, A.width, A.height);
        }
        public static RectangleI operator -(RectangleI A, Point B)
        {
            return new RectangleI(A.x - B.X, A.y - B.Y, A.width, A.height);
        }
    }
}
