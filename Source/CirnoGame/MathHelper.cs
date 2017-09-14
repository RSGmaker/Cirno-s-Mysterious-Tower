using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public static class MathHelper
    {
        public const float PI = 3.14159265359f;
        public const float PI2 = 6.28318530718f;

        public const float PIOver2 = 1.570796326795f;

        public static float DistanceBetweenPoints(Vector2 A, Vector2 B)
        {
            return DistanceBetweenPoints(A.X, A.Y, B.X, B.Y);
        }
        public static float DistanceBetweenPoints(float x1, float y1, float x2, float y2)
        {
            return (float)Math.Sqrt((Math.Pow(x1 - x2, 2) + Math.Pow(y1 - y2, 2)));
        }
        public static float Clamp(float value, float min, float max)
        {
            return (float)Math.Min(max, Math.Max(min, value));
        }
        public static double Clamp(double value, double min = 0, double max = 1)
        {
            return Math.Min(max, Math.Max(min, value));
        }
        public static float Lerp(float value1, float value2, float amount)
        {
            return value1 + ((value2 - value1) * amount);
        }
        public static float DegreesToRadians(float degrees)
        {
            return degrees * 0.01745329251f;
        }
        public static float RadiansToDegrees(float radians)
        {
            return radians * 57.2957795457f;
        }
        public static float GetAngle(Vector2 a, Vector2 b)
        {
            float angle = (float)(Math.Atan2(b.Y - a.Y, b.X - a.X));
            return angle;
        }
        public static float GetAngle(Vector2 a)
        {
            float angle = (float)(Math.Atan2(a.Y, a.X));
            return angle;
        }
        public static float RoughDistanceBetweenPoints(Vector2 a, Vector2 b)
        {
            //return (float)(Math.Abs(a.x - b.x) + Math.Abs(a.y - b.y));
            return (a - b).RoughLength;
        }
        public static float MagnitudeOfRectangle(Rectangle R)
        {
            return R.width + R.height;
        }
        public static float WrapRadians(float radian)
        {
            while (radian < -PI)
            {
                radian += PI2;
            }
            while (radian >= PI)
            {
                radian -= PI2;
            }
            return radian;
            //return radian % PI2;
        }

        public static double incrementTowards(double current, double destination, double speed)
        {
            if (current < destination)
            {
                current += speed;
                if (current > destination)
                {
                    current = destination;
                }
            }
            if (current > destination)
            {
                current -= speed;
                if (current < destination)
                {
                    current = destination;
                }
            }
            return current;
        }

        public static double incrementTowards(double current, double destination, double incspeed, double decspeed)
        {
            if (current < destination)
            {
                current += incspeed;
                if (current > destination)
                {
                    current = destination;
                }
            }
            if (current > destination)
            {
                current -= decspeed;
                if (current < destination)
                {
                    current = destination;
                }
            }
            return current;
        }

        public static Vector2 RadianToVector(float radian)
        {
            return new Vector2((float)Math.Cos(radian), (float)Math.Sin(radian));
        }
        public static double Lerp(double D1, double D2, double lerp)
        {
            lerp = MathHelper.Clamp(lerp);
            return (D1 * (1 - lerp)) + (D2 * lerp);
        }
        public static bool Within(double val, double min, double max)
        {
            return val >= min && val <= max;
        }
        public static double Mean(params double[] val)
        {
            double ret = 0;
            int i = 0;
            while (i < val.Length)
            {
                ret += val[i];
                i++;
            }
            ret /= val.Length;
            return ret;
        }
        public static double Decelerate(double momentum, double deceleration)
        {
            var dir = momentum >= 0;
            momentum = (dir ? momentum : -momentum) - deceleration;
            if (momentum < 0)
                return 0;
            return dir ? momentum : -momentum;
        }
    }
}
