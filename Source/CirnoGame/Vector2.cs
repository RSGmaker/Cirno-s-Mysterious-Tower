using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class Vector2
    {
        public float X;
        public float Y;
        public float Length
        {
            get
            {
                return (float)Math.Sqrt((X * X) + (Y * Y));
            }
        }
        public float Distance(Vector2 P)
        {
            var XX = X - P.X;
            var YY = Y - P.Y;
            return (float)Math.Sqrt((XX * XX) + (YY * YY));
        }
        /// <summary>
        /// Returns a rough estimate of the vector's length.
        /// </summary>
        public float EstimatedLength
        {
            get
            {
                var A = Math.Abs(X);
                var B = Math.Abs(Y);
                if (B > A)
                {
                    var tmp = A;
                    A = B;
                    B = tmp;
                }
                B *= 0.34;
                return (float)(A + B);
                //return (float)(Math.Abs(X) + Math.Abs(Y));
            }
        }
        /// <summary>
        /// Returns a rough estimate of the vector's length.
        /// </summary>
        public float EstimatedDistance(Vector2 P)
        {
            var A = Math.Abs(X - P.X);
            var B = Math.Abs(Y - P.Y);
            if (B > A)
            {
                var tmp = A;
                A = B;
                B = tmp;
            }
            B *= 0.34;
            return (float)(A + B);
            //return (float)(Math.Abs(X) + Math.Abs(Y));
        }
        /// <summary>
        /// Returns the sum of its absolute parts.
        /// </summary>
        public float RoughLength
        {
            get
            {
                return (float)(Math.Abs(X) + Math.Abs(Y));
            }
        }
        public Vector2(float x = 0, float y = 0)
        {
            this.X = x;
            this.Y = y;
        }
        public void Multiply(float f)
        {
            X *= f;
            Y *= f;
        }
        public Vector2 RoughNormalize(float length = 1)
        {
            float D = Length / length;
            return new Vector2(X / D, Y / D);
        }
        public Vector2 Normalize(float length = 1)
        {
            float distance = Math.Sqrt(X * X + Y * Y).As<float>();
            Vector2 V = new Vector2();
            V.X = X / distance;
            V.Y = Y / distance;
            V.X *= length;
            V.Y *= length;
            return V;
        }
        public void SetAsNormalize(float length = 1)
        {
            float distance = Math.Sqrt(X * X + Y * Y).As<float>();
            X = X / distance;
            Y = Y / distance;
            X *= length;
            Y *= length;
        }
        public Vector2 ToCardinal()
        {
            var x = X;
            var y = Y;
            var A = Math.Abs(X);
            var B = Math.Abs(Y);
            if (B > A)
            {
                x = 0;
            }
            else if (A > B)
            {
                y = 0;
            }
            return new Vector2(x, y);
        }
        public bool Equals(Vector2 o)
        {
            Vector2 B = (Vector2)o;
            if (this != B && B == null)
            {
                return false;
            }
            return B.X == X && B.Y == Y;
        }
        public override bool Equals(object o)
        {
            if (o is Vector2)
            {
                Vector2 B = (Vector2)o;
                if (this != B && B == null)
                {
                    return false;
                }
                return B.X == X && B.Y == Y;
            }
            return base.Equals(o);
        }
        public static bool operator ==(Vector2 A, Vector2 B)
        {
            object OA = A;
            object OB = B;
            if ((OA == null || OB == null) && (OA != null || OB != null))
            {
                return false;
            }
            if (OA == null && OB == null)
            {
                return true;
            }
            return A.X == B.X && A.Y == B.Y;
            //return false;
            if (((Object)A) != ((Object)B) && (A == null || B == null))
            {
                return false;
            }
            return (A.X == B.X && A.Y == B.Y);
            return (((Object)A) != ((Object)B)) || (A.X == B.X && A.Y == B.Y);
        }
        public static bool operator !=(Vector2 A, Vector2 B)
        {
            return !(A == B);
            if (((Object)A) != ((Object)B) && (A == null || B == null))
            {
                return true;
            }
            return !(A.X == B.X && A.Y == B.Y);
            return !((((Object)A) != ((Object)B)) || (A.X == B.X && A.Y == B.Y));
        }
        public static Vector2 operator *(Vector2 A, float scale)
        {
            return new Vector2(A.X * scale, A.Y * scale);
        }
        public static Vector2 operator /(Vector2 A, float scale)
        {
            return new Vector2(A.X / scale, A.Y / scale);
        }
        public static Vector2 operator +(Vector2 A, Vector2 B)
        {
            return new Vector2(A.X + B.X, A.Y + B.Y);
        }
        public static Vector2 operator -(Vector2 A, Vector2 B)
        {
            return new Vector2(A.X - B.X, A.Y - B.Y);
        }
        public static Vector2 Empty
        {
            get
            {
                return new Vector2();
            }
        }
        public float ToAngle()
        {
            return MathHelper.WrapRadians(MathHelper.GetAngle(this));
            //return MathHelper.WrapRadians(MathHelper.GetAngle(new Vector2(), this));
        }
        public static Vector2 FromRadian(float radian)
        {
            return MathHelper.RadianToVector(radian);
        }
        public Vector2 Clone()
        {
            return new Vector2(X, Y);
        }
        public void CopyFrom(Vector2 V)
        {
            if (V == null)
                return;
            X = V.X;
            Y = V.Y;
        }
        public Vector2 Rotate(float radian)
        {
            float angle = ToAngle() + radian;
            return FromRadian(angle).Normalize(Length);
        }
        public static Vector2 Add(Vector2 A, Vector2 B)
        {
            return new Vector2(A.X + B.X, A.Y + B.Y);
        }
        public static Vector2 Add(Vector2 A, float X, float Y)
        {
            return new Vector2(A.X + X, A.Y + Y);
        }
        public static Vector2 Subtract(Vector2 A, Vector2 B)
        {
            return new Vector2(A.X - B.X, A.Y - B.Y);
        }
        public static Vector2 Subtract(Vector2 A, float X, float Y)
        {
            return new Vector2(A.X - X, A.Y - Y);
        }
        public void Add(Vector2 V)
        {
            X += V.X;
            Y += V.Y;
        }
        public void Subtract(Vector2 V)
        {
            X -= V.X;
            Y -= V.Y;
        }
    }
}
