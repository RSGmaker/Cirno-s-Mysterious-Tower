using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class Rectangle
    {
        public float x = 0;
        public float y = 0;
        public float width = 0;
        public float height = 0;

        public float left
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
        public float top
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
        public float right
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
        public float bottom
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
        public float[] points
        {
            get
            {
                float[] ret = new float[8];
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
        public Vector2 Center
        {
            get
            {
                return new Vector2(left + (width / 2), top + (height / 2));
            }
        }
        public void CopyFrom(Rectangle R)
        {
            x = R.x;
            y = R.y;
            width = R.width;
            height = R.height;
        }
        public void GetCenter(Vector2 OUT)
        {
            OUT.X = left + (width / 2);
            OUT.Y = top + (height / 2);
        }
        public Vector2 Min
        {
            get
            {
                return new Vector2(x, y);
            }
            set
            {
                if (value == null)
                    return;
                x = value.X;
                y = value.Y;
            }
        }
        public Vector2 Max
        {
            get
            {
                return new Vector2(right, bottom);
            }
            set
            {
                if (value == null)
                    return;
                right = value.X;
                bottom = value.Y;
            }
        }
        public bool containsPoint(float x, float y)
        {
            if (x >= this.x && y >= this.y && x <= right && y <= bottom)
            {
                return true;
            }
            return false;
        }
        public bool containsPoint(Vector2 point)
        {
            if (point.X >= this.x && point.Y >= this.y && point.X <= right && point.Y <= bottom)
            {
                return true;
            }
            return false;
        }
        public bool intersects(Rectangle R)
        {
            float[] p = R.points;
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
        public bool isTouching(Rectangle R)
        {
            if (R == null)
            {
                return false;
            }
            float[] p = R.points;
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
            /*if (R.left < left && R.right > right)
            {
                if ((top<=R.top && bottom<=R.top) || (top <= R.bottom && bottom <= R.bottom))
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
        public Rectangle(float x = 0, float y = 0, float width = 0, float height = 0)
        {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        public void Set(float x = 0, float y = 0, float width = 0, float height = 0)
        {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        public static Rectangle operator +(Rectangle A, Vector2 B)
        {
            return new Rectangle(A.x + B.X, A.y + B.Y, A.width, A.height);
        }
        public static Rectangle operator -(Rectangle A, Vector2 B)
        {
            return new Rectangle(A.x - B.X, A.y - B.Y, A.width, A.height);
        }
    }
}
